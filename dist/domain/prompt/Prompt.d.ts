import { IPromptConfig, PromptConstructor } from '../..';
export declare class Prompt {
    private static VALUES;
    static readonly MESSAGE: Prompt;
    static readonly NUMERIC: Prompt;
    static readonly SELECT_ONE: Prompt;
    static readonly SELECT_MANY: Prompt;
    static readonly OPEN: Prompt;
    promptConstructor: PromptConstructor<IPromptConfig>;
    promptKey: string;
    private constructor();
    static addCustomPrompt<T extends IPromptConfig>(promptConstructor: PromptConstructor<T>, promptKey: string): void;
    static reset(): void;
    static valueOf(promptKey: string): Prompt | undefined;
    static values(): Prompt[];
}
//# sourceMappingURL=Prompt.d.ts.map