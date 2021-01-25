import { PromptValidationException } from './PromptValidationException';
export declare class InvalidChoiceException<ChoiceType> extends PromptValidationException {
    choices?: ChoiceType[] | undefined;
    constructor(message?: string, choices?: ChoiceType[] | undefined);
}
//# sourceMappingURL=InvalidChoiceException.d.ts.map