import MessagePrompt from '../../src/domain/prompt/MessagePrompt'
import {
  IBasePromptConfig,
  IContextInputRequired,
  IMessagePromptConfig,
  IPromptConfig, RichCursorInputRequiredType,
} from '../../src'
import IDataset, {createDefaultDataset} from '../../__test_fixtures__/fixtures/IDataset'
import FlowRunner from '../../src/domain/FlowRunner'

describe('BasePrompt', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  describe('default state', () => {
    describe('error', () => {
      it('should default its error state to empty to simply UI rendering', () => {
        let config: IPromptConfig<any> & IBasePromptConfig = dataset._prompts[0]
        const
          ctx = dataset.contexts[1] as IContextInputRequired,
          runner = new FlowRunner(ctx),
          prompt = new MessagePrompt(
            config as IMessagePromptConfig & IBasePromptConfig,
            'abc-123',
            runner)

        expect(prompt.error).toBeNull()
      })
    })
  })

  describe('fulfill', () => {
    it('should set provided value onto itself', () => {
      let config: IPromptConfig<any> & IBasePromptConfig = dataset._prompts[0]
      const
        ctx = dataset.contexts[1] as IContextInputRequired,
        runner = new FlowRunner(ctx),
        prompt = new MessagePrompt(
          config as IMessagePromptConfig & IBasePromptConfig,
          'abc-123',
          runner)

      jest.spyOn(runner, 'run')
        .mockImplementation(() => undefined)

      delete config.value
      prompt.fulfill(null)
      expect(config.value).toBeNull()
    })

    it('should return result of calling run on its runner', () => {
      let config: IPromptConfig<any> & IBasePromptConfig = dataset._prompts[0]
      const
        ctx = dataset.contexts[1] as IContextInputRequired,
        runner = new FlowRunner(ctx),
        prompt = new MessagePrompt(
          config as IMessagePromptConfig & IBasePromptConfig,
          'abc-123',
          runner),
        richCursor = runner.hydrateRichCursorFrom(ctx) as RichCursorInputRequiredType

      jest.spyOn(runner, 'run')
        .mockImplementation(() => richCursor)

      const cursor = prompt.fulfill(null)
      expect(cursor).toBe(richCursor)
    })
  })
})
