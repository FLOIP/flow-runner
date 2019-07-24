import IBlockExit from "../flow-spec/IBlockExit";

export default class BlockExit implements IBlockExit {
  constructor(
      public config: object,
      public destination_block: string,
      public label: string,
      public semantic_label: string,
      public tag: string,
      public test: string,
      public uuid: string) {}
}
