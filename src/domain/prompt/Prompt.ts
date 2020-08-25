import {
  MESSAGE_PROMPT_KEY,
  MessagePrompt,
  NUMERIC_PROMPT_KEY,
  NumericPrompt,
  OPEN_PROMPT_KEY,
  OpenPrompt,
  PromptConstructor,
  SELECT_MANY_PROMPT_KEY,
  SELECT_ONE_PROMPT_KEY,
  SelectManyPrompt,
  SelectOnePrompt,
} from '../..'

/**
 * This is a custom Dynamic Enum for Prompts, that allows adding of custom values at runtime, by calling
 * `Prompt.addCustomPrompt()`.
 */
export class Prompt {
  // TODO: This could be a Map
  private static VALUES: Prompt[] = []

  public static readonly MESSAGE = new Prompt(MessagePrompt, MESSAGE_PROMPT_KEY)
  public static readonly NUMERIC = new Prompt(NumericPrompt, NUMERIC_PROMPT_KEY)
  public static readonly SELECT_ONE = new Prompt(SelectOnePrompt, SELECT_ONE_PROMPT_KEY)
  public static readonly SELECT_MANY = new Prompt(SelectManyPrompt, SELECT_MANY_PROMPT_KEY)
  public static readonly OPEN = new Prompt(OpenPrompt, OPEN_PROMPT_KEY)

  promptConstructor: PromptConstructor<unknown>
  promptKey: string

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private constructor(promptConstructor: PromptConstructor<any>, promptKey: string) {
    this.promptConstructor = promptConstructor
    this.promptKey = promptKey

    if (Prompt.VALUES.find(prompt => prompt.promptKey == promptKey) != null) {
      console.info('Attempted to add duplicate promptKey')
    } else {
      Prompt.VALUES.push(this)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static addCustomPrompt(promptConstructor: PromptConstructor<any>, promptKey: string): void {
    new Prompt(promptConstructor, promptKey)
  }

  /** Remove custom prompts from the Enum Class */
  static reset(): void {
    Prompt.VALUES = [
      Prompt.MESSAGE,
      Prompt.NUMERIC,
      Prompt.SELECT_ONE,
      Prompt.SELECT_MANY,
      Prompt.OPEN,
    ]
  }

  /**
   * Get a prompt, by the key
   * @param promptKey you can pass IPromptConfig.kind
   */
  static valueOf(promptKey: string): Prompt | undefined {
    return Prompt.VALUES.filter(prompt => prompt.promptKey === promptKey)?.[0]
  }

  static values(): Prompt[] {
    return Prompt.VALUES
  }
}
