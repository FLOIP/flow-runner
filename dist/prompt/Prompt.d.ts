import { PromptConstructor } from '../index';
export declare class Prompt {
    private static VALUES;
    static readonly MESSAGE: Prompt;
    static readonly NUMERIC: Prompt;
    static readonly SELECT_ONE: Prompt;
    static readonly SELECT_MANY: Prompt;
    static readonly OPEN: Prompt;
    promptConstructor: PromptConstructor<unknown>;
    promptKey: string;
    private constructor();
    static addCustomPrompt(promptConstructor: PromptConstructor<any>, promptKey: string): void;
    static reset(): void;
    static valueOf(promptKey: string): Prompt | undefined;
    static values(): Prompt[];
}
//# sourceMappingURL=Prompt.d.ts.map