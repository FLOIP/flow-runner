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
import ISelectOneResponseBlock from '../src/model/block/ISelectOneResponseBlock'
import IOpenResponseBlock from '../src/model/block/IOpenResponseBlock'
import INumericResponseBlock from '../src/model/block/INumericResponseBlock'
import OpenResponseBlockRunner from '../src/domain/runners/OpenResponseBlockRunner'
import NumericResponseBlockRunner from '../src/domain/runners/NumericResponseBlockRunner'
import SelectOneResponseBlockRunner from '../src/domain/runners/SelectOneResponseBlockRunner'
import SelectManyResponseBlockRunner from '../src/domain/runners/SelectManyResponseBlockRunner'
import CaseBlockRunner from '../src/domain/runners/CaseBlockRunner'
import ICaseBlock from '../src/model/block/ICaseBlock'


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

    describe('case block unable to find cursor', () => {
      it('shouldnt raise an except requiring prompt', () => {
        const context: IContext = require('../__test_fixtures__/fixtures/2019-10-08-case-block-eval-issue.json')
        const runner = new FlowRunner(
          context,
          new BlockRunnerFactoryStore([
            ['MobilePrimitives\\Message', (block, innerContext) => new MessageBlockRunner(block as IMessageBlock, innerContext)],
            ['MobilePrimitives\\OpenResponse', (block, innerContext) => new OpenResponseBlockRunner(block as IOpenResponseBlock, innerContext)],
            ['MobilePrimitives\\NumericResponse', (block, innerContext) => new NumericResponseBlockRunner(block as INumericResponseBlock, innerContext)],
            ['MobilePrimitives\\SelectOneResponse', (block, innerContext) => new SelectOneResponseBlockRunner(block as ISelectOneResponseBlock, innerContext)],
            ['MobilePrimitives\\SelectManyResponse', (block, innerContext) => new SelectManyResponseBlockRunner(block as ISelectOneResponseBlock, innerContext)],
            ['Core\\Case', (block, innerContext) => new CaseBlockRunner(block as ICaseBlock, innerContext)]]))

        expect(FlowRunner.prototype.run.bind(runner)).toThrow('Unable to find default exit on block 95bd9e4a-93cd-46f2-9b43-8ecf940b278e')
      })
    })

    xdescribe('case block always evaluates to false', () => {
      it('shouldnt raise an except requiring prompt', () => {
        const context: IContext = require('../__test_fixtures__/fixtures/2019-10-09-case-block-always-false.json')
        const runner = new FlowRunner(
          context,
          new BlockRunnerFactoryStore([
            ['MobilePrimitives\\Message', (block, innerContext) => new MessageBlockRunner(block as IMessageBlock, innerContext)],
            ['MobilePrimitives\\OpenResponse', (block, innerContext) => new OpenResponseBlockRunner(block as IOpenResponseBlock, innerContext)],
            ['MobilePrimitives\\NumericResponse', (block, innerContext) => new NumericResponseBlockRunner(block as INumericResponseBlock, innerContext)],
            ['MobilePrimitives\\SelectOneResponse', (block, innerContext) => new SelectOneResponseBlockRunner(block as ISelectOneResponseBlock, innerContext)],
            ['MobilePrimitives\\SelectManyResponse', (block, innerContext) => new SelectManyResponseBlockRunner(block as ISelectOneResponseBlock, innerContext)],
            ['Core\\Case', (block, innerContext) => new CaseBlockRunner(block as ICaseBlock, innerContext)]]))

        // todo: update context + finish test once @george has resolved removal of `.value` lookups
        expect(FlowRunner.prototype.run.bind(runner)).not.toThrow()
      })
    })
  })
})
