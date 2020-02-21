import {FlowRunner, IBasePromptConfig, INumericPromptConfig, KnownPrompts, ICursor} from '../../src'
import IContext from '../../src/flow-spec/IContext'
import IBlockInteraction from '../../src/flow-spec/IBlockInteraction'
import NumericPrompt from '../../src/domain/prompt/NumericPrompt'

describe('FlowRunner/isInputRequiredFor', () => {
  let runner: FlowRunner

  beforeEach(() => {
    runner = new FlowRunner({} as IContext)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return false when cursor absent', () => {
    expect(runner.isInputRequiredFor({} as IContext)).toBeFalsy()
  })

  it('should return false when prompt absent', () => {
    expect(runner.isInputRequiredFor({cursor: {interactionId: 'intx-123', promptConfig: undefined}} as IContext)).toBeFalsy()
  })

  it('should return true when prompt config\'s value is undefined', () => {
    const promptConfig = {kind: KnownPrompts.Numeric, value: undefined} // invalid prompt value
    expect(runner.isInputRequiredFor({cursor: {interactionId: 'intx-123', promptConfig}} as IContext)).toBeTruthy()
  })

  it('should return false when prompt validation succeeds', () => {
    const promptConfig = {kind: KnownPrompts.Numeric, value: 12} // valid numeric prompt value

    jest.spyOn(runner, 'hydrateRichCursorFrom')
      .mockImplementation(() => ({
        interaction: {uuid: 'intx-123'} as IBlockInteraction,
        prompt: createNumericPromptFor(promptConfig, runner)})) // assertion consumes this prompt instance

    expect(runner.isInputRequiredFor({cursor: {interactionId: 'intx-123', promptConfig}} as IContext)).toBeFalsy()
  })

  it('should return true when prompt validation raises', () => {
    const promptConfig = {kind: KnownPrompts.Numeric, value: 12, max: 5} as INumericPromptConfig & IBasePromptConfig // invalid numeric prompt value

    jest.spyOn(runner, 'hydrateRichCursorFrom')
      .mockImplementation(() => ({
        interaction: {uuid: 'intx-123'} as IBlockInteraction,
        prompt: createNumericPromptFor(promptConfig, runner)})) // assertion consumes this prompt instance

    expect(runner.isInputRequiredFor({cursor: {interactionId: 'intx-123', promptConfig} as ICursor} as IContext)).toBeTruthy()
  })

})

const createNumericPromptFor = (promptConfig: object, runner: FlowRunner) =>
  new NumericPrompt(promptConfig as INumericPromptConfig & IBasePromptConfig, 'intx-1234', runner)