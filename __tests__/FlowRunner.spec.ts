import {read} from 'yaml-import'
import IDataset from "./IDataset";
import FlowRunner from "../src/domain/FlowRunner";
import IBlockRunner from "../src/domain/runners/IBlockRunner";
import IBlock from "../src/flow-spec/IBlock";
import MessageBlockRunner from "../src/domain/runners/MessageBlockRunner";
import IBlockInteraction from "../src/flow-spec/IBlockInteraction";
import IPrompt from "../src/flow-spec/IPrompt";
import {PromptExpectationsType} from "../src/domain/prompt/BasePrompt";
import IBlockExit from "../src/flow-spec/IBlockExit";
import NumericPrompt from "../src/domain/prompt/NumericPrompt";



describe('FlowRunner', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = read('__tests__/dataset.yml')
  })

  describe('broad stroke', () => {
    it('should be available', () => {
      const runner = new FlowRunner(
          dataset.contexts[0],
          new Map<string, {(block: IBlock): IBlockRunner}>([
              ['MobilePrimitives\\Message', block => new MessageBlockRunner(block)],
          ]))

      expect(runner).toBeTruthy()
    })
  })

  describe('startOneBlock', () => {
    it.skip('should ... ')
  })
})

class NumericPromptAndChooseFirstExitBlockRunner implements IBlockRunner {
  constructor(public block: IBlock) {}

  start(interaction: IBlockInteraction): IPrompt<PromptExpectationsType> | null {
    interaction.entryAt = new Date

    return new NumericPrompt( // todo: needs interface for validation rules
        this.block.uuid,
        interaction.uuid,
        null)
  }

  resume(cursor: [IBlockInteraction, (IPrompt<PromptExpectationsType> | null)]): IBlockExit {
    cursor[0].hasResponse = true
    return this.block.exits[0]
  }
}
