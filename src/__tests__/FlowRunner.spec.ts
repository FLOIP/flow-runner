import "reflect-metadata";
import {flatMap} from 'lodash'
import IDataset, {createDefaultDataset} from './fixtures/IDataset'
import FlowRunner from '../domain/FlowRunner'
import {createContextDataObjectFor, IResources, IRichCursorInputRequired, SupportedMode} from '../index'
import IContext from '../flow-spec/IContext'
import ValidationException from '../domain/exceptions/ValidationException'
import {deserialize, plainToClass, serialize} from 'class-transformer'
import Context from '../flow-spec/Context'
import IContact from '../flow-spec/IContact'
import SelectOnePrompt from '../domain/prompt/SelectOnePrompt'


describe('FlowRunner', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  describe('serialization', () => {
    it ('should be stringifiable', () => {
      const context = dataset.contexts[2]
      const contextObj = plainToClass(Context, context)
      const serializedContext = serialize(contextObj);
      const deserializedContext = deserialize(Context, serializedContext);

      expect(contextObj).toEqual(deserializedContext)
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

      if (!cursor) {
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

    describe('case block unable to find cursor', () => {
      it('shouldnt raise an exception requiring prompt', async () => {
        const context: IContext = require('./fixtures/2019-10-08-case-block-eval-issue.json')
        const runner = new FlowRunner(context)

        await expect(runner.run()).rejects.toThrow('Unable to find default exit on block 95bd9e4a-93cd-46f2-9b43-8ecf940b278e')
        // expect((await runner.run())![0].blockId).toBe('95bd9e4a-93cd-46f2-9b43-8ecf93fdc8f2')
      })
    })

    xdescribe('case block always evaluates to false', () => {
      it('shouldnt raise an except requiring prompt', async () => {
        const context: IContext = require('./fixtures/2019-10-09-case-block-always-false.json')
        const runner = new FlowRunner(context)

        // todo: update context + finish test once @george has resolved removal of `.value` lookups
        expect(FlowRunner.prototype.run.bind(runner)).not.toThrow()
      })
    })

    describe('VMO-1484-case-branching-improperly', () => {
      it('should hit Cats branch', async() => {
        const {flows}: IContext = require('./fixtures/2019-10-12-VMO-1484-case-branching-improperly.json')
        const resources: IResources = flatMap(flows, 'resources') // our server-side implementation currently returns

        const context = createContextDataObjectFor(
          {id: '1'} as IContact,
          'user-1234',
          'org-1234',
          flows,
          'en_US',
          SupportedMode.OFFLINE,
          resources)

        const runner = new FlowRunner(context)
        let {prompt}: IRichCursorInputRequired = (await runner.run())!
        prompt.value = (prompt as SelectOnePrompt).config.choices[1].key // cats

        prompt = (await runner.run())!.prompt
        expect(prompt.config.prompt).toEqual("95bd9e4a-9300-400a-9f61-8ede034f93d8"); // the next prompt is the cats message
      })

      it('should hit Dogs branch', async () => {
        const {flows}: IContext = require('./fixtures/2019-10-12-VMO-1484-case-branching-improperly.json')
        const resources: IResources = flatMap(flows, 'resources') // our server-side implementation currently returns

        const context = createContextDataObjectFor(
          {id: '1'} as IContact,
          'user-1234',
          'org-1234',
          flows,
          'en_US',
          SupportedMode.OFFLINE,
          resources)

        const runner = new FlowRunner(context)
        let {prompt}: IRichCursorInputRequired = (await runner.run())!
        prompt.value = (prompt as SelectOnePrompt).config.choices[0].key // dogs

        prompt = (await runner.run())!.prompt
        expect(prompt.config.prompt).toEqual("95bd9e4a-9300-400a-9f61-8ede0325225f"); // the next prompt is the dogs message
      })
    })
  })
})