import {read} from 'yaml-import'
import IDataset from "./IDataset";
import FlowRunner, {BlockRunnerFactoryStore} from "../src/domain/FlowRunner";
import MessageBlockRunner from "../src/domain/runners/MessageBlockRunner";


describe('FlowRunner', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = read('__tests__/dataset.yml')
  })

  it('should be available', () => {
    const runner = new FlowRunner(
        dataset.contexts[0],
        new BlockRunnerFactoryStore([
          ['MobilePrimitives\\Message', block => new MessageBlockRunner(block)],
        ]))

    expect(runner).toBeTruthy()
  })
})
