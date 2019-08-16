import {read} from 'yaml-import'
import IDataset from './fixtures/IDataset'
import FlowRunner, {BlockRunnerFactoryStore} from '../src/domain/FlowRunner'
import MessageBlockRunner from '../src/domain/runners/MessageBlockRunner'
import IMessageBlock from '../src/model/block/IMessageBlock'
import {RichCursorInputRequiredType} from '../src'
import IContext from '../src/flow-spec/IContext'
import ValidationException from '../src/domain/exceptions/ValidationException'


describe('FlowRunner', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = read('__tests__/fixtures/dataset.yml')
  })

  describe('sanity', () => {
    it('should be available', () => {
      const runner = new FlowRunner(
        dataset.contexts[0],
        new BlockRunnerFactoryStore([
          // todo: how do we get proper typing here without needing to cast?
          ['MobilePrimitives\\Message', block => new MessageBlockRunner(block as IMessageBlock)],
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
          ['MobilePrimitives\\Message', block => new MessageBlockRunner(block as IMessageBlock)],
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
