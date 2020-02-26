import {cloneDeep, set} from 'lodash'
import {
  findFirstTruthyEvaluatingBlockExitOn,
  generateCachedProxyForBlockName,
  IBlockExitTestRequired,
  IBlockWithTestExits,
  IEvalContextBlock,
  wrapInExprSyntaxWhenAbsent,
} from '../../src'
import IContext from '../../src/flow-spec/IContext'
import IDataset, {createDefaultDataset} from '../../__test_fixtures__/fixtures/IDataset'
import createFormattedDate from '../../src/domain/DateFormat'


describe('IBlock', () => {
  let dataset: IDataset
  let target: IEvalContextBlock

  beforeEach(() => {
    dataset = createDefaultDataset()
    target = {
      __interactionId: 'abc-123',
      __value__: 'my first value',
      time: createFormattedDate(),
      value: 'my first value',
      text: 'my text'
    }
  })

  describe('findFirstTruthyEvaluatingBlockExitOn', () => {
    it('should return first truthy exit', async () => {
      const exit = findFirstTruthyEvaluatingBlockExitOn({exits: [
          {test: '@(true = false)'},
          {test: '@(true = false)'},
          {test: '@(true = true)'},
          {test: '@(true = false)'},
          {test: '@(true = false)'},
        ] as IBlockExitTestRequired[]
      } as IBlockWithTestExits, {} as IContext)

      expect(exit).toEqual({test: '@(true = true)'})
    })

    it('should not return first _non-default_ truthy exit', async () => {
      const exit = findFirstTruthyEvaluatingBlockExitOn({exits: [
          {test: '@(true = false)'},
          {test: '@(true = false)'},
          {test: '@(true = true)', default: true},
          {test: '@(true = true)'},
          {test: '@(true = false)'},
          {test: '@(true = false)'},
        ] as IBlockExitTestRequired[]
      } as IBlockWithTestExits, {} as IContext)

      expect(exit).toEqual({test: '@(true = true)'})
    })
  })

  describe('generateCachedProxyForBlockName', () => {
    it('should return an object resembling the one provided', async () => {
      const proxy = generateCachedProxyForBlockName(target, {} as IContext)
      expect(proxy).toEqual(target)
    })

    describe('proxy', () => {
      it('should pass through props that already existed on target', async () => {
        const sampleTarget = {name: 'Bert', age: '40-something'}
        const proxy = generateCachedProxyForBlockName(sampleTarget, {} as IContext)

        expect(proxy.name).toEqual(sampleTarget.name)
        expect(proxy.age).toEqual(sampleTarget.age)
      })

      it('should return undefined when unable to find property on target', async () => {
        const sampleTarget = {name: 'Bert', age: '40-something'}
        const proxy = generateCachedProxyForBlockName(sampleTarget, {} as IContext)
        // @ts-ignore
        expect(proxy.unknown).toBeUndefined()
      })

      it('should perform search over interactions for block whose name matches prop name when prop absent from target', async () => {
        // *intx/Message->Message/09894745-38ba-456f-aab4-720b7d09d5b3
        // &flowId/(Message|Message|Message)/711b1ff7-d16f-4ed9-8524-054afa4049a5
        // *blockId/Message->(Message)/5e5d397a-a606-49e0-9a4d-8553a1af52aa

        const ctx = dataset.contexts[1]
        const name = '1570221906056_83'
        set(ctx.sessionVars, `blockInteractionsByBlockName.${name}`, {
            __interactionId: '09894745-38ba-456f-aab4-720b7d09d5b3',
            time: '2023-10-10T23:23:23.023Z',
            text: 'some text',
        })

        const proxy = generateCachedProxyForBlockName({}, ctx) as {'1570221906056_83': IEvalContextBlock}
        const blockForEvalContext = proxy['1570221906056_83']

        expect(blockForEvalContext.__interactionId).toEqual('09894745-38ba-456f-aab4-720b7d09d5b3')
        expect(blockForEvalContext.__value__).toEqual('Test value')
        expect(blockForEvalContext.time).toEqual("2023-10-10T23:23:23.023Z")
      })

      // this will do a lookup on context of `sessionVars.blockInteractionsByBlockName.${prop.toString()}`
      // so, setup has a few steps:
      // - we need our pseudo eval-context block to exist at `sessionVars.blockInteractionsByBlockName.1570221906056_83`
      // - we need our block interactions to match up with the __interactionId on ^^^
      // - we need two interactions with this same interaction id (this would never happen
      //   but this is the simplest method of verifying search starting point

      // todo: merge module declaration of `sessionVars` to have `blockInteractionsByBlockName: {[k: string]: IEvalContextBlock}`
      it('should perform search over interactions from right-to-left to provide most recent interaction value', async () => {
        const ctx = dataset.contexts[1]
        const expectedInteractionId = ctx.interactions[0].uuid
        // move cursor to first interaction, since this is the one under test
        // ctx.cursor![0] = expectedInteractionId
        // duplicate interaction to verify ltr/rtl hunt.
        ctx.interactions = [
          Object.assign(cloneDeep(ctx.interactions[0]), {value: 'Incorrect value'}),
          ctx.interactions[0],
        ]

        set(ctx, 'sessionVars.blockInteractionsByBlockName.1570221906056_83', {__interactionId: expectedInteractionId})

        const proxy = generateCachedProxyForBlockName({}, ctx) as {'1570221906056_83': IEvalContextBlock}
        const blockForEvalContext = proxy['1570221906056_83']

        expect(blockForEvalContext).toBeTruthy()
        expect(blockForEvalContext.__interactionId).toEqual('09894745-38ba-456f-aab4-720b7d09d5b3')
        expect(blockForEvalContext.__value__).toEqual('Test value')
      })

      it('should return latest value from interactions upon each invocation', async () => { // aka do this once, then modify context, and do it again
        const ctx = dataset.contexts[1]
        const expectedInteractionId = ctx.interactions[0].uuid

        set(ctx, 'sessionVars.blockInteractionsByBlockName.1570221906056_83', {__interactionId: expectedInteractionId})

        const proxy = generateCachedProxyForBlockName({}, ctx) as {'1570221906056_83': IEvalContextBlock}

        let blockForEvalContext = proxy['1570221906056_83']
        expect(blockForEvalContext).toBeTruthy()

        ctx.interactions[0].value = 'Changed value'

        blockForEvalContext = proxy['1570221906056_83']
        expect(blockForEvalContext.__value__).toEqual('Changed value')
      })
    })
  })

  describe('evaluateToBool()', () => {
    describe('wrapInExprSyntaxWhenAbsent', () => {
      it('should add expression wrapper when @() absent', async () => {
        expect(wrapInExprSyntaxWhenAbsent('true = true')).toBe('@(true = true)')
      })

      it('should leave as is when @() present', async () => {
        expect(wrapInExprSyntaxWhenAbsent('@(true = true)')).toBe('@(true = true)')
      })
    })
  })
})
