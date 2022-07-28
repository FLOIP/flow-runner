import { Choice, IPromptConfig } from '../..';
export interface ISelectManyPromptConfig extends IPromptConfig<Choice['prompt'][] | null> {
    kind: string;
    choices: Choice[];
}
//# sourceMappingURL=ISelectManyPromptConfig.d.ts.map