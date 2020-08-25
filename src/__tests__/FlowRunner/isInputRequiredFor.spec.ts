import {FlowRunner, IBlockInteraction, IContext, ICursor, INumericPromptConfig, NUMERIC_PROMPT_KEY, NumericPrompt} from '../..'

describe('FlowRunner/isInputRequiredFor', () => {
  let runner: FlowRunner

  beforeEach(() => {
    runner = new FlowRunner({} as IContext)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return false when cursor absent', async () => {
    expect(runner.isInputRequiredFor({} as IContext)).toBeFalsy()
  })

  it('should return false when prompt absent', async () => {
    expect(runner.isInputRequiredFor({cursor: {interactionId: 'intx-123', promptConfig: undefined}} as IContext)).toBeFalsy()
  })

  it("should return true when prompt config's value is undefined", async () => {
    const promptConfig = {kind: NUMERIC_PROMPT_KEY, value: undefined} // invalid prompt value
    expect(runner.isInputRequiredFor({cursor: {interactionId: 'intx-123', promptConfig}} as IContext)).toBeTruthy()
  })

  it('should return false when prompt validation succeeds', async () => {
    const promptConfig = {kind: NUMERIC_PROMPT_KEY, value: 12} // valid numeric prompt value

    jest.spyOn(runner, 'hydrateRichCursorFrom').mockImplementation(() => ({
      interaction: {uuid: 'intx-123'} as IBlockInteraction,
      prompt: createNumericPromptFor(promptConfig, runner),
    })) // assertion consumes this prompt instance

    expect(runner.isInputRequiredFor({cursor: {interactionId: 'intx-123', promptConfig}} as IContext)).toBeFalsy()
  })

  it('should return true when prompt validation raises', async () => {
    const promptConfig = {kind: NUMERIC_PROMPT_KEY, value: 12, max: 5} as INumericPromptConfig // invalid numeric prompt value

    jest.spyOn(runner, 'hydrateRichCursorFrom').mockImplementation(() => ({
      interaction: {uuid: 'intx-123'} as IBlockInteraction,
      prompt: createNumericPromptFor(promptConfig, runner),
    })) // assertion consumes this prompt instance

    expect(runner.isInputRequiredFor({cursor: {interactionId: 'intx-123', promptConfig} as ICursor} as IContext)).toBeTruthy()
  })
})

const createNumericPromptFor = (promptConfig: object, runner: FlowRunner) =>
  new NumericPrompt(promptConfig as INumericPromptConfig, 'intx-1234', runner)
