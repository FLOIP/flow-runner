import IFlow from "../flow-spec/IFlow";
import Mode from "../flow-spec/Mode";
import IBlock from "../flow-spec/IBlock";

export class Flow implements IFlow {
  constructor(
      public blocks: IBlock[],
      public interaction_timeout: number,
      public label: string,
      public languages: string[],
      public last_modified: Date,
      public name: string,
      public platform_metadata: object,
      public supported_modes: Mode[],
      public uuid: string) {
  }
}
