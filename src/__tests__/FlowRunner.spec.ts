import 'reflect-metadata'
import {every, noop} from 'lodash'
import {createDefaultDataset, IDataset} from './fixtures/IDataset'
import {deserialize, plainToClass, serialize} from 'class-transformer'

import {
  Context,
  createContextDataObjectFor,
  DeliveryStatus,
  FlowRunner,
  IContact,
  IContext,
  IGroup,
  IRichCursorInputRequired,
  SelectOnePrompt,
  SupportedMode,
  ValidationException,
} from '..'

describe('FlowRunner', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  describe('serialization', () => {
    it('should be stringifiable', () => {
      const context = dataset.contexts[2]
      const contextObj = plainToClass(Context, context)
      const serializedContext = serialize(contextObj)
      const deserializedContext = deserialize(Context, serializedContext)

      expect(contextObj).toEqual(deserializedContext)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(contextObj.getResource).toBeInstanceOf(Function)
    })
  })

  describe('sanity', () => {
    it('should be available', async () => {
      const runner = new FlowRunner(dataset.contexts[0])
      expect(runner).toBeTruthy()
    })

    it('should run!', async () => {
      const ctx: IContext = {
        ...dataset.contexts[1],
        // gut running history
        interactions: [],
        cursor: undefined,
      }

      const runner = new FlowRunner(ctx)

      // block1
      let cursor: IRichCursorInputRequired | void = await runner.run()

      if (cursor == null) {
        throw new ValidationException('Omg, no cursor?')
      }

      expect(cursor).toBeTruthy()
      expect(cursor.interaction).toBeTruthy()
      expect(cursor.prompt).toBeTruthy()

      cursor.prompt.value = null

      // block2
      cursor = await runner.run()

      if (!cursor) {
        throw new ValidationException('Omg, no cursor?')
      }

      expect(cursor).toBeTruthy()
      expect(cursor.interaction).toBeTruthy()
      expect(cursor.prompt).toBeTruthy()

      cursor.prompt.value = null

      // block3
      cursor = await runner.run()

      if (!cursor) {
        throw new ValidationException('Omg, no cursor?')
      }

      expect(cursor).toBeTruthy()
      expect(cursor.interaction).toBeTruthy()
      expect(cursor.prompt).toBeTruthy()

      cursor.prompt.value = null

      // done?
      expect(await runner.run()).toBeFalsy()
    })

    describe.skip('case block always evaluates to false', () => {
      it('shouldnt raise an except requiring prompt', async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const context: IContext = require('./fixtures/2019-10-09-case-block-always-false.json')
        const runner = new FlowRunner(context)

        // todo: update context + finish test once @george has resolved removal of `.value` lookups
        expect(FlowRunner.prototype.run.bind(runner)).not.toThrow()
      })
    })

    describe('VMO-1484-case-branching-improperly', () => {
      it('should hit Cats branch', async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const {flows}: IContext = require('./fixtures/2019-10-12-VMO-1484-case-branching-improperly.json')

        const context = await createContextDataObjectFor(
          {id: '1'} as IContact,
          [{group_key: 'mygroup', label: 'mygroup', __value__: 'mygroup'} as IGroup],
          'user-1234',
          'org-1234',
          flows,
          'en_US',
          SupportedMode.OFFLINE
        )

        const runner = new FlowRunner(context)
        let {prompt}: IRichCursorInputRequired = (await runner.run())!
        // cats
        prompt.value = (prompt as SelectOnePrompt).config.choices[1].prompt

        prompt = (await runner.run())!.prompt
        // the next prompt is the cats message
        expect(prompt.config.prompt).toEqual('95bd9e4a-9300-400a-9f61-8ede034f93d8')
      })

      it('should hit Dogs branch', async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const {flows}: IContext = require('./fixtures/2019-10-12-VMO-1484-case-branching-improperly.json')

        const context = await createContextDataObjectFor(
          {id: '1'} as IContact,
          [{group_key: 'mygroup', label: 'mygroup', __value__: 'mygroup'} as IGroup],
          'user-1234',
          'org-1234',
          flows,
          'en_US',
          SupportedMode.OFFLINE
        )

        const runner = new FlowRunner(context)
        let {prompt}: IRichCursorInputRequired = (await runner.run())!

        // dogs
        prompt.value = (prompt as SelectOnePrompt).config.choices[0].prompt
        prompt = (await runner.run())!.prompt

        // the next prompt is the dogs message
        expect(prompt.config.prompt).toEqual('95bd9e4a-9300-400a-9f61-8ede0325225f')
      })
    })

    describe('nested flow', () => {
      it('should run', async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const {flows}: IContext = require('./fixtures/2020-04-14-run-flow-unable-to-find-flow.json')

        const context = await createContextDataObjectFor(
          {id: '1'} as IContact,
          [{group_key: 'mygroup', label: 'mygroup', __value__: 'mygroup'} as IGroup],
          'user-1234',
          'org-1234',
          flows,
          'en_US',
          SupportedMode.OFFLINE
        )

        const runner = new FlowRunner(context)

        let {prompt}: IRichCursorInputRequired = (await runner.run())!
        expect(prompt).toBeTruthy()

        prompt.value = null
        prompt = (await runner.run())!.prompt
        expect(prompt).toBeTruthy()

        prompt.value = null
        prompt = (await runner.run())!.prompt
        expect(prompt).toBeTruthy()

        prompt.value = null
        prompt = (await runner.run())!.prompt
        expect(prompt).toBeTruthy()

        prompt.value = null
        prompt = (await runner.run())!.prompt
        expect(prompt).toBeTruthy()

        prompt.value = null
        prompt = (await runner.run())!.prompt
        expect(prompt).toBeTruthy()

        prompt.value = null
        expect(await runner.run()!).toBeUndefined()
      })

      it('should handle stepping out multiple times', async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const context: IContext = require('./fixtures/2020-04-23-run-flow-unable-to-step-out-doubly-nested.context.json')
        const runner = new FlowRunner(context)

        // todo: we need to remove this once we create a behaviour for expressions
        runner.cacheInteractionByBlockName = noop

        let {prompt}: IRichCursorInputRequired = (await runner.run())!
        expect(prompt).toBeTruthy()

        // selects Run Tree B [Message, SelectOne, RunFlow(5b8c87d6-de90-4bc4-8668-4f0400002a2d)]
        prompt.value = 'Run Tree B'
        prompt = (await runner.run())!.prompt
        expect(prompt).toBeTruthy()

        // message
        prompt.value = null
        prompt = (await runner.run())!.prompt
        expect(prompt).toBeTruthy()

        // select two, next block is RunFlow regardless of choice
        prompt.value = 'Two'
        prompt = (await runner.run())!.prompt
        expect(prompt).toBeTruthy()

        prompt.value = null
        prompt = (await runner.run())!.prompt
        expect(prompt).toBeTruthy()

        prompt.value = 50
        const cursor = await runner.run()
        expect(cursor).toBeUndefined()
        expect(context.delivery_status).toBe(DeliveryStatus.FINISHED_COMPLETE)
        expect(context.exit_at).toBeTruthy()

        expect(every(context.interactions, i => i.exit_at)).toBeTruthy()
      })
    })
  })
})
