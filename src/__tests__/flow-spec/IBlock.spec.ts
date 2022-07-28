import {cloneDeep, set} from 'lodash'
import {
  createFormattedDate,
  findFirstTruthyEvaluatingBlockExitOn,
  generateCachedProxyForBlockName,
  IBlockConfig,
  IBlockExit,
  IContact,
  IContext,
  IEvalContextBlock,
  wrapInExprSyntaxWhenAbsent,
} from '../..'
import {createDefaultDataset, IDataset} from '../fixtures/IDataset'
import {createEvalContactFrom, IBlock, setContactProperty} from '../../flow-spec/IBlock'
import Contact from '../../flow-spec/Contact'
import IContactProperty from '../../flow-spec/IContactProperty'
import {IContactGroup} from '../../flow-spec/IContactGroup'

describe('IBlock', () => {
  let dataset: IDataset
  let target: IEvalContextBlock
  let dummyContext: IContext

  beforeEach(() => {
    dataset = createDefaultDataset()
    target = {
      __interactionId: 'abc-123',
      __value__: 'my first value',
      time: createFormattedDate(),
      value: 'my first value',
      text: 'my text',
    }
    dummyContext = {contact: {} as IContact} as IContext
  })

  // TODO: Remove, as this is deprecated
  describe('findFirstTruthyEvaluatingBlockExitOn', () => {
    it('should return first truthy exit', async () => {
      const exit = findFirstTruthyEvaluatingBlockExitOn(
        {
          exits: [
            {test: '@(true = false)'},
            {test: '@(true = false)'},
            {test: '@(true = true)'},
            {test: '@(true = false)'},
            {test: '@(true = false)'},
          ] as IBlockExit[],
        } as IBlock,
        dummyContext
      )

      expect(exit).toEqual({test: '@(true = true)'})
    })

    it('should not return first _non-default_ truthy exit', async () => {
      const exit = findFirstTruthyEvaluatingBlockExitOn(
        {
          exits: [
            {test: '@(true = false)'},
            {test: '@(true = false)'},
            {test: '@(true = true)', default: true},
            {test: '@(true = true)'},
            {test: '@(true = false)'},
            {test: '@(true = false)'},
          ] as IBlockExit[],
        } as IBlock,
        dummyContext
      )

      expect(exit).toEqual({test: '@(true = true)'})
    })
  })

  // TODO: Add tests for firstTrueBlockExitOrNull
  // TODO: Add tests for firstTrueOrNullBlockExitOrThrow
  // TODO: Add tests for findDefaultBlockExitOrNull
  // TODO: Add tests for findDefaultBlockExitOrThrow
  // TODO: Add tests for findDefaultBlockExitOn

  describe('generateCachedProxyForBlockName', () => {
    it('should return an object resembling the one provided', async () => {
      const proxy = generateCachedProxyForBlockName(target, dummyContext)
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
        expect(proxy.unknown).toBeUndefined()
      })

      it('should perform search over interactions for block whose name matches prop name when prop absent from target', async () => {
        // *intx/Message->Message/09894745-38ba-456f-aab4-720b7d09d5b3
        // &flowId/(Message|Message|Message)/711b1ff7-d16f-4ed9-8524-054afa4049a5
        // *block_id/Message->(Message)/5e5d397a-a606-49e0-9a4d-8553a1af52aa

        const ctx = dataset.contexts[1]
        const name = '1570221906056_83'
        set(ctx.session_vars, `block_interactions_by_block_name.${name}`, {
          __interactionId: '09894745-38ba-456f-aab4-720b7d09d5b3',
          time: '2023-10-10T23:23:23.023Z',
          text: 'some text',
        })

        const proxy = generateCachedProxyForBlockName({}, ctx) as {'1570221906056_83': IEvalContextBlock}
        const blockForEvalContext = proxy['1570221906056_83']

        expect(blockForEvalContext.__interactionId).toEqual('09894745-38ba-456f-aab4-720b7d09d5b3')
        expect(blockForEvalContext.__value__).toEqual('Test value')
        expect(blockForEvalContext.time).toEqual('2023-10-10T23:23:23.023Z')
      })

      // this will do a lookup on context of `session_vars.block_interactions_by_block_name.${prop.toString()}`
      // so, setup has a few steps:
      // - we need our pseudo eval-context block to exist at `session_vars.block_interactions_by_block_name.1570221906056_83`
      // - we need our block interactions to match up with the __interactionId on ^^^
      // - we need two interactions with this same interaction id (this would never happen
      //   but this is the simplest method of verifying search starting point

      // todo: merge module declaration of `session_vars` to have `block_interactions_by_block_name: {[k: string]: IEvalContextBlock}`
      it('should perform search over interactions from right-to-left to provide most recent interaction value', async () => {
        const ctx = dataset.contexts[1]
        const expectedInteractionId = ctx.interactions[0].uuid
        // move cursor to first interaction, since this is the one under test
        // ctx.cursor![0] = expectedInteractionId
        // duplicate interaction to verify ltr/rtl hunt.
        ctx.interactions = [Object.assign(cloneDeep(ctx.interactions[0]), {value: 'Incorrect value'}), ctx.interactions[0]]

        set(ctx, 'session_vars.block_interactions_by_block_name.1570221906056_83', {__interactionId: expectedInteractionId})

        const proxy = generateCachedProxyForBlockName({}, ctx) as {'1570221906056_83': IEvalContextBlock}
        const blockForEvalContext = proxy['1570221906056_83']

        expect(blockForEvalContext).toBeTruthy()
        expect(blockForEvalContext.__interactionId).toEqual('09894745-38ba-456f-aab4-720b7d09d5b3')
        expect(blockForEvalContext.__value__).toEqual('Test value')
      })

      it('should return latest value from interactions upon each invocation', async () => {
        // aka do this once, then modify context, and do it again
        const ctx = dataset.contexts[1]
        const expectedInteractionId = ctx.interactions[0].uuid

        set(ctx, 'session_vars.block_interactions_by_block_name.1570221906056_83', {__interactionId: expectedInteractionId})

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

  describe('setContactProperty()', () => {
    it('should set contact property', () => {
      dataset = createDefaultDataset()
      const context = Object.assign({}, cloneDeep(dataset.contexts[1]))
      context.contact = new Contact()
      const block = {
        uuid: 'block-123',
        type: 'test',
        name: 'test',
        exits: [],
        ui_metadata: {
          canvas_coordinates: {x: 10, y: 10},
          should_auto_update_name: true,
        },
        config: {
          set_contact_property: [
            {
              property_key: 'foo',
              property_value: 'bar with spaces',
            },
          ],
        } as IBlockConfig,
      } as IBlock
      setContactProperty(block, context)
      const property = context.contact.getProperty('foo')
      expect(typeof property).toBe('object')
      expect((property as IContactProperty).__value__).toBe('bar with spaces')
    })
  })

  describe('createEvalContactFrom', () => {
    it('should clone the passed contact, deleting marked groups', () => {
      const groupToDelete = {
        group_key: 'two',
        __value__: 'two',
        updated_at: '0000-00-00',
        deleted_at: '2020-01-01',
      } as IContactGroup

      const contact = new Contact()
      contact.groups = [
        {
          group_key: 'one',
          __value__: 'one',
          updated_at: '0000-00-00',
          deleted_at: undefined,
        } as IContactGroup,
        groupToDelete,
        {
          group_key: 'three',
          __value__: 'three',
          updated_at: '0000-00-00',
          deleted_at: undefined,
        } as IContactGroup,
      ]

      const evalContact = createEvalContactFrom(contact)

      expect(contact.groups).toContain(groupToDelete)
      expect(evalContact.groups).not.toContain(groupToDelete)
    })
  })
})
