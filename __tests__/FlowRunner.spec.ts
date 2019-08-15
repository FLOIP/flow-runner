import {read} from 'yaml-import'
import IDataset from './fixtures/IDataset'
import FlowRunner, {BlockRunnerFactoryStore} from '../src/domain/FlowRunner'
import MessageBlockRunner from '../src/domain/runners/MessageBlockRunner'
import IMessageBlockConfig from '../src/model/block/IMessageBlockConfig'
import IBlock from '../src/flow-spec/IBlock'


describe('FlowRunner', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = read('__tests__/fixtures/dataset.yml')
  })

  it('should be available', () => {
    const runner = new FlowRunner(
      dataset.contexts[0],
      new BlockRunnerFactoryStore([
        // todo: how do we get proper typing here without needing to cast?
        ['MobilePrimitives\\Message', block => new MessageBlockRunner(block as (IBlock & { config: IMessageBlockConfig }))],
      ]))

    expect(runner).toBeTruthy()
  })
})
