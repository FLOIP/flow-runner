import {last} from 'lodash'
import IFlow from '../../../flow-spec/IFlow'
import FlowRunner from '../../../domain/FlowRunner'
import {SupportedMode, createContextDataObjectFor, IRichCursorInputRequired, findInteractionWith} from '../../../index'
import IContact from '../../../flow-spec/IContact'
import SelectOnePrompt from '../../../domain/prompt/SelectOnePrompt'
import {IBackTrackingBehaviour} from '../../../domain/behaviours/BacktrackingBehaviour/BacktrackingBehaviour'


describe.skip('FlowRunner integration', () => {
  let flow: IFlow

  beforeEach(() => {
    flow = require('../../fixtures/2019-10-10-shortcut-flow.json')
  })

  it('should work when simple + single backtrack', async () => {
    const context = createContextDataObjectFor(
      {id: '1'} as IContact, 'user-1234', 'org-1234', [flow], 'en_US', SupportedMode.OFFLINE)

    const runner = new FlowRunner(context)
    let {prompt}: IRichCursorInputRequired = (await runner.run())!
    prompt.value = (prompt as SelectOnePrompt).config.choices[0].key // yes, more children

    prompt = (await runner.run())!.prompt
    prompt.value = 17 // age

    prompt = (await runner.run())!.prompt
    prompt.value = (prompt as SelectOnePrompt).config.choices[0].key // yes, enjoy reading

    prompt = (await runner.run())!.prompt
    prompt.value = 12 // books per year

    prompt = (await runner.run())!.prompt
    prompt.value = 'Ella' // name

    prompt = (await runner.run())!.prompt
    prompt.value = (prompt as SelectOnePrompt).config.choices[1].key // no, end of children

    const backtracking: IBackTrackingBehaviour = runner.behaviours.backtracking as IBackTrackingBehaviour
    prompt = await backtracking.peek(5)

    // todo: assert that prompt is genned from specified interaction
    // const interactionIdPreviouslyAtIndex5 = prompt.interactionId
    const interactionPreviouslyAtPeek5 = findInteractionWith(prompt.interactionId, context)
    expect(prompt.interactionId).toBe(context.interactions.slice(-6, -5)[0].uuid) // assert we're in a known state: (++peeked * -1)

    prompt = (await backtracking.jumpTo( // commit to change
      findInteractionWith(prompt.interactionId, context),
      context))!.prompt!


    // todo: should peek1 really be peek0?
    // todo: assert that prompt is new and fresh interaction state at this point
    const interactionAtPeek1 = findInteractionWith(prompt.interactionId, context)
    expect(interactionAtPeek1).toEqual(last(context.interactions)) // assert change
    expect(interactionAtPeek1).not.toEqual(interactionPreviouslyAtPeek5) // assert difference
    expect(prompt.value).toEqual(interactionPreviouslyAtPeek5.value) // assert difference

    prompt = (await prompt.fulfill(17))!.prompt // todo: I think we're wiping our ghost at this point; need to look into our sync() bhaviour at this point :)
    expect(prompt.value).toEqual(12)



  })
})
