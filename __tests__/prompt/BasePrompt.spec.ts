import MessagePrompt from '../../src/domain/prompt/MessagePrompt'
import {
  IBasePromptConfig,
  IContextInputRequired,
  IMessagePromptConfig,
  IPromptConfig, IRichCursorInputRequired,
} from '../../src'
import IDataset, {createDefaultDataset} from '../../__test_fixtures__/fixtures/IDataset'
import FlowRunner from '../../src/domain/FlowRunner'

describe('BasePrompt', () => {
  let dataset: IDataset

  beforeEach(() => {
    dataset = createDefaultDataset()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('default state', () => {
    describe('error', () => {
      it('should default its error state to empty to simply UI rendering', async () => {
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
    it('should set provided value onto itself', async () => {
      let config: IPromptConfig<any> & IBasePromptConfig = dataset._prompts[0]
      const
        ctx = dataset.contexts[1] as IContextInputRequired,
        runner = new FlowRunner(ctx),
        prompt = new MessagePrompt(
          config as IMessagePromptConfig & IBasePromptConfig,
          'abc-123',
          runner)

      jest.spyOn(runner, 'run')
        .mockImplementation(async () => undefined)

      delete config.value
      await prompt.fulfill(null)
      expect(config.value).toBeNull()
    })

    it('should return result of calling run on its runner', async () => {
      let config: IPromptConfig<any> & IBasePromptConfig = dataset._prompts[0]
      const
        ctx = dataset.contexts[1] as IContextInputRequired,
        runner = new FlowRunner(ctx),
        prompt = new MessagePrompt(
          config as IMessagePromptConfig & IBasePromptConfig,
          'abc-123',
          runner),
        richCursor = runner.hydrateRichCursorFrom(ctx) as IRichCursorInputRequired

      jest.spyOn(runner, 'run')
        .mockImplementation(async () => richCursor)

      const cursor = await prompt.fulfill(null)
      expect(cursor).toBe(richCursor)
    })
  })
})
