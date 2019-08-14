import BasePrompt from "./BasePrompt";
import {IBasePromptConfig} from "./IPrompt";
import {IMessagePromptConfig} from "./IMessagePromptConfig";

export default class extends BasePrompt<IMessagePromptConfig & IBasePromptConfig> {
  validate: (val: null) => true
}
