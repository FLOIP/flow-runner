import { IBlockConfig } from '../..';
declare type Uuid = string;
export interface ISelectOneResponseBlockConfig extends IBlockConfig {
    prompt?: Uuid;
    question_prompt?: Uuid;
    choices: Choice[];
    ivr?: IvrConfig;
}
export interface Choice {
    name: string;
    ivr_test?: IvrTest;
    text_tests?: TextTest[];
    prompt: Uuid;
}
interface IvrTest {
    test_expression: string;
}
interface TextTest {
    language?: string;
    test_expression: string;
}
interface IvrConfig {
    digit_prompts?: Uuid[];
    randomize_choice_order?: boolean;
}
export {};
//# sourceMappingURL=ISelectOneResponseBlockConfig.d.ts.map