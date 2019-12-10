import {cloneDeep} from 'lodash'
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


describe('IBlock', () => {
  let dataset: IDataset
  let target: IEvalContextBlock

  beforeEach(() => {
    dataset = createDefaultDataset()
    target = {
      __interactionId: 'abc-123',
      __value__: 'my first value',
      time: (new Date).toISOString().replace('T', ' '),
      value: 'my first value',
      text: 'my text'
    }
  })

  describe('findFirstTruthyEvaluatingBlockExitOn', () => {
    it('should return first truthy exit', () => {
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

    it('should not return first _non-default_ truthy exit', () => {
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
    it('should return an object resembling the one provided', () => {
      const proxy = generateCachedProxyForBlockName(target, {} as IContext)
      expect(proxy).toEqual(target)
    })

    describe('proxy', () => {
      it('should pass through props that already existed on target', () => {
        const proxy = generateCachedProxyForBlockName(target, {} as IContext) as IEvalContextBlock

        expect(proxy.__interactionId).toEqual(target.__interactionId)
        expect(proxy.__value__).toEqual(target.__value__)
        expect(proxy.time).toEqual(target.time)
      })

      it('should return undefined when unable to find property on target', () => {
        const proxy = generateCachedProxyForBlockName(target, {} as IContext) as IEvalContextBlock
        // @ts-ignore
        expect(proxy.unknown).toBeUndefined()
      })

      it('should perform search over interactions for block whose name matches prop name when prop absent from target', () => {
        // *intx/Message->Message/09894745-38ba-456f-aab4-720b7d09d5b3
        // &flowId/(Message|Message|Message)/711b1ff7-d16f-4ed9-8524-054afa4049a5
        // *blockId/Message->(Message)/5e5d397a-a606-49e0-9a4d-8553a1af52aa

        const ctx = dataset.contexts[1]
        const proxy = generateCachedProxyForBlockName({}, ctx) as {'1570221906056_83': IEvalContextBlock}
        const blockForEvalContext = proxy['1570221906056_83']

        expect(blockForEvalContext.__interactionId).toEqual('09894745-38ba-456f-aab4-720b7d09d5b3')
        expect(blockForEvalContext.__value__).toEqual('Test value')
        expect(blockForEvalContext.time).toEqual("2023-10-10T23:23:23.023Z")
      })

      it('should perform search over interactions from right-to-left to provide most recent interaction value', () => {
        const ctx = dataset.contexts[1]
        // move cursor to first interaction, since this is the one under test
        ctx.cursor![0] = ctx.interactions[0].uuid
        // duplicate interaction to verify ltr/rtl hunt.
        ctx.interactions = [
          Object.assign(cloneDeep(ctx.interactions[0]), {value: 'Incorrect value'}),
          ctx.interactions[0],
        ]

        const proxy = generateCachedProxyForBlockName({}, ctx) as {'1570221906056_83': IEvalContextBlock}
        const blockForEvalContext = proxy['1570221906056_83']

        expect(blockForEvalContext.__interactionId).toEqual('09894745-38ba-456f-aab4-720b7d09d5b3')
        expect(blockForEvalContext.__value__).toEqual('Test value')
        expect(blockForEvalContext.time).toEqual("2023-10-10T23:23:23.023Z")
      })

      it('should return value from cache when present', () => { // aka do this once, then modify context, and do it again
        const ctx = dataset.contexts[1]
        const proxy = generateCachedProxyForBlockName({}, ctx) as {'1570221906056_83': IEvalContextBlock}

        let blockForEvalContext = proxy['1570221906056_83']
        expect(blockForEvalContext).toBeTruthy()

        ctx.interactions = []

        blockForEvalContext = proxy['1570221906056_83']
        expect(blockForEvalContext.__interactionId).toEqual('09894745-38ba-456f-aab4-720b7d09d5b3')
        expect(blockForEvalContext.__value__).toEqual('Test value')
        expect(blockForEvalContext.time).toEqual("2023-10-10T23:23:23.023Z")
      })
    })
  })

  describe('evaluateToBool()', () => {
    describe('wrapInExprSyntaxWhenAbsent', () => {
      it('should add expression wrapper when @() absent', () => {
        expect(wrapInExprSyntaxWhenAbsent('true = true')).toBe('@(true = true)')
      })

      it('should leave as is when @() present', () => {
        expect(wrapInExprSyntaxWhenAbsent('@(true = true)')).toBe('@(true = true)')
      })
    })
  })
})
