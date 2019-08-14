import {KnownPrompts} from "./IPrompt";
import {IPromptConfig} from "./IPrompt";

export interface ISelectOnePromptConfig extends IPromptConfig<string | null> {
  kind: KnownPrompts.SelectOne
  choices: string[]
}
