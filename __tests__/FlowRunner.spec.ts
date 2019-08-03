import {read} from 'yaml-import'
import IDataset from "./IDataset";
import FlowRunner from "../src/domain/FlowRunner";
import IBlockRunner from "../src/domain/runners/IBlockRunner";
import IBlock from "../src/flow-spec/IBlock";
import MessageBlockRunner from "../src/domain/runners/MessageBlockRunner";


describe('FlowRunner', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = read('__tests__/dataset.yml')
  })

  it('should be available', () => {
    const runner = new FlowRunner(
        dataset.contexts[0],
        new Map<string, {(block: IBlock): IBlockRunner}>([
          ['MobilePrimitives\\Message', block => new MessageBlockRunner(block)],
        ]))

    expect(runner).toBeTruthy()
  })
})
