import {last} from 'lodash'
import IFlow from '../../../src/flow-spec/IFlow'
import FlowRunner from '../../../src/domain/FlowRunner'
import {SupportedMode, createContextDataObjectFor, RichCursorInputRequiredType, findInteractionWith} from '../../../src'
import IContact from '../../../src/flow-spec/IContact'
import SelectOnePrompt from '../../../src/domain/prompt/SelectOnePrompt'
import {IBackTrackingBehaviour} from '../../../src/domain/behaviours/BacktrackingBehaviour/BacktrackingBehaviour'


describe.skip('FlowRunner integration', () => {
  let flow: IFlow

  beforeEach(() => {
    flow = require('../../../__test_fixtures__/fixtures/2019-10-10-shortcut-flow.json')
  })

  it('should work when simple + single backtrack', () => {
    const context = createContextDataObjectFor(
      {id: '1'} as IContact, 'user-1234', [flow], 'en_US', SupportedMode.OFFLINE)

    const runner = new FlowRunner(context)
    let [, prompt]: RichCursorInputRequiredType = runner.run()!
    prompt.value = (prompt as SelectOnePrompt).config.choices[0].key // yes, more children

    prompt = runner.run()![1]
    prompt.value = 17 // age

    prompt = runner.run()![1]
    prompt.value = (prompt as SelectOnePrompt).config.choices[0].key // yes, enjoy reading

    prompt = runner.run()![1]
    prompt.value = 12 // books per year

    prompt = runner.run()![1]
    prompt.value = 'Ella' // name

    prompt = runner.run()![1]
    prompt.value = (prompt as SelectOnePrompt).config.choices[1].key // no, end of children

    const backtracking: IBackTrackingBehaviour = runner.behaviours.backtracking as IBackTrackingBehaviour
    prompt = backtracking.peek(5)

    // todo: assert that prompt is genned from specified interaction
    // const interactionIdPreviouslyAtIndex5 = prompt.interactionId
    const interactionPreviouslyAtPeek5 = findInteractionWith(prompt.interactionId, context)
    expect(prompt.interactionId).toBe(context.interactions.slice(-6, -5)[0].uuid) // assert we're in a known state: (++peeked * -1)

    prompt = backtracking.jumpTo( // commit to change
      findInteractionWith(prompt.interactionId, context),
      context)![1]!


    // todo: should peek1 really be peek0?
    // todo: assert that prompt is new and fresh interaction state at this point
    const interactionAtPeek1 = findInteractionWith(prompt.interactionId, context)
    expect(interactionAtPeek1).toEqual(last(context.interactions)) // assert change
    expect(interactionAtPeek1).not.toEqual(interactionPreviouslyAtPeek5) // assert difference
    expect(prompt.value).toEqual(interactionPreviouslyAtPeek5.value) // assert difference

    prompt = prompt.fulfill(17)![1] // todo: I think we're wiping our ghost at this point; need to look into our sync() bhaviour at this point :)
    expect(prompt.value).toEqual(12)



  })
})