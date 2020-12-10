/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {last} from 'lodash'
import {
  createContextDataObjectFor,
  findInteractionWith,
  FlowRunner,
  IBackTrackingBehaviour,
  IContact,
  IFlow,
  IRichCursorInputRequired,
  SelectOnePrompt,
  SupportedMode,
} from '../../..'

describe.skip('FlowRunner integration', () => {
  let flow: IFlow

  beforeEach(() => {
    flow = require('../../fixtures/2019-10-10-shortcut-flow.json')
  })

  it('should work when simple + single backtrack', async () => {
    const context = createContextDataObjectFor({id: '1'} as IContact, [], 'user-1234', 'org-1234', [flow], 'en_US', SupportedMode.OFFLINE)

    const runner = new FlowRunner(context)
    let {prompt}: IRichCursorInputRequired = (await runner.run())!

    // yes, more children
    prompt.value = (prompt as SelectOnePrompt).config.choices[0].key
    prompt = (await runner.run())!.prompt

    // age
    prompt.value = 17
    prompt = (await runner.run())!.prompt

    // yes, enjoy reading
    prompt.value = (prompt as SelectOnePrompt).config.choices[0].key
    prompt = (await runner.run())!.prompt

    // books per year
    prompt.value = 12
    prompt = (await runner.run())!.prompt

    // name
    prompt.value = 'Ella'
    prompt = (await runner.run())!.prompt

    // no, end of children
    prompt.value = (prompt as SelectOnePrompt).config.choices[1].key
    const backtracking: IBackTrackingBehaviour = runner.behaviours.backtracking as IBackTrackingBehaviour
    prompt = await backtracking.peek(5)

    // todo: assert that prompt is genned from specified interaction
    // const interactionIdPreviouslyAtIndex5 = prompt.interactionId
    const interactionPreviouslyAtPeek5 = findInteractionWith(prompt.interactionId, context)

    // assert we're in a known state: (++peeked * -1)
    expect(prompt.interactionId).toBe(context.interactions.slice(-6, -5)[0].uuid)

    // commit to change
    prompt = (await backtracking.jumpTo(findInteractionWith(prompt.interactionId, context), context))!.prompt!

    // todo: should peek1 really be peek0?
    // todo: assert that prompt is new and fresh interaction state at this point
    const interactionAtPeek1 = findInteractionWith(prompt.interactionId, context)

    // assert change
    expect(interactionAtPeek1).toEqual(last(context.interactions))

    // assert difference
    expect(interactionAtPeek1).not.toEqual(interactionPreviouslyAtPeek5)

    // assert difference
    expect(prompt.value).toEqual(interactionPreviouslyAtPeek5.value)

    // todo: I think we're wiping our ghost at this point; need to look into our sync() behaviour at this point :)
    prompt = (await prompt.fulfill(17))!.prompt
    expect(prompt.value).toEqual(12)
  })
})
