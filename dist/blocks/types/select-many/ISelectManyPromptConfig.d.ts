import { IChoice, IPromptConfig } from '../../../index';
export interface ISelectManyPromptConfig extends IPromptConfig<IChoice['key'][] | null> {
    kind: string;
    choices: IChoice[];
}
//# sourceMappingURL=ISelectManyPromptConfig.d.ts.map