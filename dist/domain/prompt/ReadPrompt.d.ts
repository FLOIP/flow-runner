/// <reference types="node" />
import BasePrompt from './BasePrompt';
import { IBasePromptConfig } from './IPrompt';
import { IReadPromptConfig } from './IReadPromptConfig';
import IFlowRunner from '../IFlowRunner';
export interface IConsolePrompt {
    read(): void;
}
export declare class ReadPrompt extends BasePrompt<IReadPromptConfig & IBasePromptConfig> implements IConsolePrompt {
    config: IReadPromptConfig & IBasePromptConfig;
    interactionId: string;
    runner: IFlowRunner;
    console: Console;
    constructor(config: IReadPromptConfig & IBasePromptConfig, interactionId: string, runner: IFlowRunner, console?: Console);
    read(): void;
    validate(readValues: IReadPromptConfig['value']): boolean;
}
export default ReadPrompt;
//# sourceMappingURL=ReadPrompt.d.ts.map