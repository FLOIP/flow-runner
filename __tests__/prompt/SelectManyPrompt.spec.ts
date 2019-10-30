import SelectManyPrompt, {
  INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK,
  INVALID_AT_LEAST_ONE_SELECTION_REQUIRED,
} from '../../src/domain/prompt/SelectManyPrompt'
import {IContextInputRequired} from '../../src/flow-spec/IContext'
import {IBasePromptConfig, IPromptConfig} from '../../src/domain/prompt/IPrompt'
import {BlockRunnerFactoryStore, IChoice} from '../../src'
import {ISelectManyPromptConfig} from '../../src/domain/prompt/ISelectManyPromptConfig'
import IDataset, {createDefaultDataset} from '../../__test_fixtures__/fixtures/IDataset'
import FlowRunner from '../../src/domain/FlowRunner'
import InvalidChoiceException from '../../src/domain/exceptions/InvalidChoiceException'
import ValidationException from '../../src/domain/exceptions/ValidationException'


describe('SelectManyPrompt', () => {

  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  describe('validate', () => {
    let prompt: SelectManyPrompt
    beforeEach(() => {
      const config: IPromptConfig<any> & IBasePromptConfig = dataset._prompts[1]
      const ctx = dataset.contexts[1] as IContextInputRequired
      const runner = new FlowRunner(ctx, new BlockRunnerFactoryStore)

      prompt = new SelectManyPrompt(
        config as ISelectManyPromptConfig & IBasePromptConfig,
        'intx-123',
        runner)
    })

    describe('when a response isRequired', () => {
      it('should raise when some selections are invalid', () => {
        const selections = ['choice-A', 'choice-B', 'key-not-in-prompt-config', 'choice-C']

        verifyValidationThrows(prompt.validate.bind(prompt, selections),
          InvalidChoiceException,
          INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK,
          ['key-not-in-prompt-config'])
      })

      it('should raise when all selections are invalid', () => {
        const selections = ['key-not-in-prompt-config-A', 'key-not-in-prompt-config-B', 'key-not-in-prompt-config-C', 'key-not-in-prompt-config-D']

        verifyValidationThrows(prompt.validate.bind(prompt, selections),
          InvalidChoiceException,
          INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK,
          selections)
      })

      it('should raise when no selections are provided', () => {
        const selections: IChoice['key'][] = []
        verifyValidationThrows(prompt.validate.bind(prompt, selections),
          ValidationException,
          INVALID_AT_LEAST_ONE_SELECTION_REQUIRED)
      })
    })

    it('should return true when all selections are valid', () => {
      const selections = ['choice-A', 'choice-D']
      expect(prompt.validate(selections)).toBe(true)
    })

    it('should raise when some selections are invalid when isRequired is false', () => {
      prompt.config.isResponseRequired = false

      const selections = ['choice-A', 'choice-B', 'key-not-in-prompt-config', 'choice-C']
      expect(prompt.validate(selections)).toBe(true)
    })
  })
})

const verifyValidationThrows = /*<E extends Error>*/(invoker: Function, ErrorType: Function, msg: string, choices?: IChoice['key'][]) => {
  try {
    invoker()
    expect(true).toBeFalsy() // shouldn't never get here
  } catch (e) {
    expect(e).toBeInstanceOf(ErrorType)
    expect(e.message).toEqual(msg)
    expect(e.choices).toEqual(choices)
  }
}