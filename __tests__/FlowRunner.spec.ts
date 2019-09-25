import "reflect-metadata";
import IDataset, {createDefaultDataset} from '../__test_fixtures__/fixtures/IDataset'
import FlowRunner, {BlockRunnerFactoryStore} from '../src/domain/FlowRunner'
import MessageBlockRunner from '../src/domain/runners/MessageBlockRunner'
import IMessageBlock from '../src/model/block/IMessageBlock'
import {RichCursorInputRequiredType} from '../src'
import IContext from '../src/flow-spec/IContext'
import ValidationException from '../src/domain/exceptions/ValidationException'
import {deserialize, plainToClass, serialize} from 'class-transformer'
import Context from '../src/flow-spec/Context'


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
    it('should be available', () => {
      const runner = new FlowRunner(
        dataset.contexts[0],
        new BlockRunnerFactoryStore([
          // todo: how do we get proper typing here without needing to cast?
          ['MobilePrimitives\\Message', (block, ctx) => new MessageBlockRunner(block as IMessageBlock, ctx)],
        ]))

      expect(runner).toBeTruthy()
    })

    it('should run!', () => {
      const ctx: IContext = {
        ...dataset.contexts[1],
        // gut running history
        interactions: [],
        cursor: undefined,
      }

      const runner = new FlowRunner(
        ctx,
        new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', (block, ctx) => new MessageBlockRunner(block as IMessageBlock, ctx)],
        ]))

      // block1
      let cursor: RichCursorInputRequiredType | void = runner.run()

      if (!cursor) {
        throw new ValidationException('Omg, no cursor?')
      }

      expect(cursor).toBeTruthy()
      expect(cursor[0]).toBeTruthy()
      expect(cursor[1]).toBeTruthy()

      cursor[1].value = null

      // block2
      cursor = runner.run()

      if (!cursor) {
        throw new ValidationException('Omg, no cursor?')
      }

      expect(cursor).toBeTruthy()
      expect(cursor[0]).toBeTruthy()
      expect(cursor[1]).toBeTruthy()

      cursor[1].value = null

      // block3
      cursor = runner.run()

      if (!cursor) {
        throw new ValidationException('Omg, no cursor?')
      }

      expect(cursor).toBeTruthy()
      expect(cursor[0]).toBeTruthy()
      expect(cursor[1]).toBeTruthy()

      cursor[1].value = null

      // done?
      cursor = runner.run()
      expect(cursor).toBeFalsy()
    })
  })
})
