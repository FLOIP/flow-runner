import IPrompt, { IBasePromptConfig, IPromptConfig } from "./IPrompt";
import PromptValidationException from "../exceptions/PromptValidationException";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import IBlock from "../../flow-spec/IBlock";
export default abstract class<PromptConfigType extends IPromptConfig<PromptConfigType['value']> & IBasePromptConfig> implements IPrompt<PromptConfigType> {
    block: IBlock;
    interaction: IBlockInteraction;
    config: PromptConfigType & IBasePromptConfig;
    error: PromptValidationException | null;
    isValid: boolean;
    constructor(block: IBlock, interaction: IBlockInteraction, config: PromptConfigType & IBasePromptConfig);
    value: PromptConfigType['value'];
    abstract validate(val: PromptConfigType['value']): boolean;
}
//# sourceMappingURL=BasePrompt.d.ts.map