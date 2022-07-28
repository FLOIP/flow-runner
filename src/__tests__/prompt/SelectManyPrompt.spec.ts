import {
  FlowRunner,
  Choice,
  IContextInputRequired,
  INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK,
  INVALID_AT_LEAST_ONE_SELECTION_REQUIRED,
  InvalidChoiceException,
  IPromptConfig,
  ISelectManyPromptConfig,
  SelectManyPrompt,
  ValidationException,
} from '../..'
import {createDefaultDataset, IDataset} from '../fixtures/IDataset'
import {get} from 'lodash'

describe('SelectManyPrompt', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  describe('validate', () => {
    let prompt: SelectManyPrompt
    beforeEach(() => {
      const config: IPromptConfig = dataset._prompts[1]
      const ctx = dataset.contexts[1] as IContextInputRequired
      const runner = new FlowRunner(ctx)

      prompt = new SelectManyPrompt(config as ISelectManyPromptConfig, 'intx-123', runner)
    })

    describe('when a response isRequired', () => {
      it('should raise when some selections are invalid', async () => {
        const selections = ['choice-A', 'choice-B', 'key-not-in-prompt-config', 'choice-C']

        verifyValidationThrows(
          prompt.validate.bind(prompt, selections),
          InvalidChoiceException,
          INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK,
          ['key-not-in-prompt-config']
        )
      })

      it('should raise when all selections are invalid', async () => {
        const selections = [
          'key-not-in-prompt-config-A',
          'key-not-in-prompt-config-B',
          'key-not-in-prompt-config-C',
          'key-not-in-prompt-config-D',
        ]

        verifyValidationThrows(
          prompt.validate.bind(prompt, selections),
          InvalidChoiceException,
          INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK,
          selections
        )
      })

      it('should raise when no selections are provided', async () => {
        const selections: Choice['prompt'][] = []
        verifyValidationThrows(prompt.validate.bind(prompt, selections), ValidationException, INVALID_AT_LEAST_ONE_SELECTION_REQUIRED)
      })
    })

    it('should return true when all selections are valid', async () => {
      const selections = ['choice-A', 'choice-D']
      expect(prompt.validate(selections)).toBe(true)
    })

    it('should raise when some selections are invalid when isRequired is false', async () => {
      prompt.config.isResponseRequired = false

      const selections = ['choice-A', 'choice-B', 'key-not-in-prompt-config', 'choice-C']
      expect(prompt.validate(selections)).toBe(true)
    })
  })
})

function verifyValidationThrows(invoker: Function, ErrorType: Function, msg: string, choices?: Choice['prompt'][]): void {
  try {
    invoker()

    // TODO: Consider using https://jestjs.io/docs/en/expect#tothrowerror
    // shouldn't never get here
    expect(true).toBeFalsy()
  } catch (e) {
    expect(e).toBeInstanceOf(ErrorType)
    expect((e as Error).message).toEqual(msg)
    expect(get(e, 'choices')).toEqual(choices)
  }
}
