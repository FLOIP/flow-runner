import { IPromptConfig, PromptConstructor } from '../..';
/**
 * This is a custom Dynamic Enum for Prompts, that allows adding of custom values at runtime, by calling
 * `Prompt.addCustomPrompt()`.
 */
export declare class Prompt {
    private static VALUES;
    static readonly MESSAGE: Prompt;
    static readonly NUMERIC: Prompt;
    static readonly SELECT_ONE: Prompt;
    static readonly SELECT_MANY: Prompt;
    static readonly OPEN: Prompt;
    promptConstructor: PromptConstructor<IPromptConfig>;
    promptKey: string;
    /**
     * Construct a prompt, and supply the Prompt constructor for easy instantiation.
     *
     * We do not want the library user of FlowRunner to call this, so FlowRunner should add all custom Prompts via a
     * builder pattern.
     *
     * @param promptConstructor The constructor for the Prompt instance.
     * @param promptKey The key for the given prompt
     * @private
     */
    private constructor();
    static addCustomPrompt<T extends IPromptConfig>(promptConstructor: PromptConstructor<T>, promptKey: string): void;
    /** Remove custom prompts from the Enum Class */
    static reset(): void;
    /**
     * Get a prompt, by the key
     * @param promptKey you can pass IPromptConfig.kind
     */
    static valueOf(promptKey: string): Prompt | undefined;
    static values(): Prompt[];
}
//# sourceMappingURL=Prompt.d.ts.map