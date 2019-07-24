import Runner from '../src/domain/FlowRunner'
import TypedDatasetBuilder from "./TypedDatasetBuilder";
import {RunnerDatasetType, RunnerDatasetIndexesType} from "./DatasetBuilder";
import IContext from "../src/flow-spec/IContext";
import IBlock from "../src/flow-spec/IBlock";


// todo: verify how we're going to marshall UUIDs between BE + FE

// - enter
// - next
// - next-self
// - choice
// - step-into
// - step-out
// - exit

/*

- (#) numeric
- (w) open
- (+) run
- (*) select
- (}) exit
- (@) message

> - create interaction; can't move forward until interaction is fulfilled
  - run a block to fulfill interaction and set up context for to fetch next block
  - resume a block to

@(Welcome!) → *(How old are you?) (< 15) → @(Too yung) → }
                                  (> 15) → @(I'm surprised) → w(How's it feel?) → }
                                  (= 15) → @(OMG) → +                                                                             #(How old do you feel?) → @(Thanks!) → }
                                                    ↓                                                                             ↑       ↑
                                                    *(What's it like?) (In a sentence?) → w(Describe what being 15 is like) → @ → }       ↑
                                                                       (On a scale?) → #(One a scale of 1-15, how would you say it is?) → }


              @
              |
              *
             /|\
            @ @ @
            | | |
            < w >>>>> *
              | |     |\
              < |     w #
                |     | /
                |     @
                |     |
                # <<<<<
                |
                @
                |
                <




    a:M -> b:R -> a1:M -> b::R.exit::M
*/

describe('Runner', () => {
  let dataset: RunnerDatasetType & RunnerDatasetIndexesType

  beforeEach(() => {
    console.log('before eaching')
    dataset = TypedDatasetBuilder()

    // todo: run dataset through jsonschema validator before running tests
    // console.log(JSON.stringify(dataset.contexts[1], null, 2))
    // console.log(JSON.stringify(dataset, null, 2))
  })

  describe('construct', () => {
    it('should exist', () => {
      const r = new Runner(dataset.contexts[0] as IContext)
      expect(r).toBeTruthy()
    })
  })

  // describe('startOneBlock(block)', () => {
  // it('should return null when unable to find another block', () => {
  //   const
  //       r = new Runner(dataset.contexts[0]),
  //       prompt = r.start()
  //
  //   expect(prompt).toBe(null)
  // })

  // it('should return prompt from block runner when  block runner requires channel communication')
  // it('should update context\'s cursor with next block interaction')
  // it('should update context\'s cursor with next prompt when provided')
  // it('should clear context\'s cursor when finished executing flow')
  // })


  // describe('findAndNavigateToNextBlockOn(ctx)', () => {


  // it('should return first block on first flow when cursor absent')
  // it('should return null when at end of everything')
  // it('should return first block on connected flow when RunAFlow block') // <-- nope; this is in caller
  // it('should return block following instigating RunAFlow block from parent flow when no exits found')
  // it('should ')
  // })



  // describe('findAndNavigateToNextBlockOn(flow, cursor)', () => {
  // })

  describe('findNextBlockOnActiveFlowFor(ctx)', () => {
    describe('when cursor absent', () => {
      it('should return first block on first flow', () => {
        const
            ctx = dataset.contexts[1] as IContext,
            r = new Runner(ctx),
            block = r.findNextBlockOnActiveFlowFor(ctx)

        expect(ctx.cursor).toBe(null)
        expect(block && block.uuid).toBe('cb1b04a3-6447-4e33-a449-a6e3107e7531')
      })
    })

    describe('when cursor present', () => {
      describe('when on main stack', () => {
        it('should return null when block has no exits attached', () => {
          console.log(JSON.stringify(dataset.contexts[2] as IContext, null, 2))

          const
              ctx = dataset.contexts[2] as IContext,
              r = new Runner(ctx),
              block = r.findNextBlockOnActiveFlowFor(ctx)

          expect(ctx.cursor).toEqual(['1c7317fc-b644-4da4-b1ff-1807ce55c17e', null])
          expect(ctx.flows[0].blocks[1].exits).toEqual([dataset.exitsByUuid['b9485293-90a6-456e-9291-81de5e3a4a89']])
          expect(block).toBe(null)
        })

        it('should return block attached to exit chosen on cursor [interaction] when exits present', () => {
          // todo: making an assumption about where selectedExitId is stored here intx.details.selectedExitId

          const
              ctx = dataset.contexts[3] as IContext,
              r = new Runner(ctx),
              block = r.findNextBlockOnActiveFlowFor(ctx)

          expect(ctx.cursor).toEqual(['a2f4c21e-bd03-4aa9-a4bd-2f2d4bb7874e', null])
          expect(ctx.flows[0].blocks[1].exits.length).toBe(1)
          expect(block && block.uuid).toBe('164f04f7-3daf-420b-9a5b-0d3b16144ec5')
        })
      })
    })
  })

  describe('stepInto(runTreeBlock, ctx)', () => {
    describe('when not run a flow block', () => {
      it('should should do nothing', () => {
        const
            ctx = dataset.contexts[3] as IContext,
            r = new Runner(ctx),
            block = dataset.blocks[0] as IBlock

        expect(block.type).not.toEqual('Core\\RunFlow')
        expect(ctx.session.originFlowId).not.toEqual('Core\\RunFlow')
        expect(ctx.session.originBlockInteractionId).not.toEqual('Core\\RunFlow')

        r.stepInto(block, ctx)

        expect(block.type).not.toEqual('Core\\RunFlow')
        // todo: are these supposed to always be set?
        expect(ctx.session.originFlowId).not.toEqual('Core\\RunFlow')
        expect(ctx.session.originBlockInteractionId).not.toEqual('Core\\RunFlow')
      })
    })

    describe('when on run a flow block', () => {
      it('should push last block interaction onto stack', () => {
        const
            ctx = dataset.contexts[3] as IContext,
            r = new Runner(ctx)

        r.stepInto(block, ctx)
      })

      it('should update session origin block interaction id', () => {

      })

      it('should update session origin flow id', () => {

      })
    })
  })

  // describe('stepInto(runTreeBlock)', () => {
  //
  // })

  // describe('start', () => { // todo: can we deprecate start() in favor of next()-ing any context?
  // it('should return a prompt for next block when the next block requires channel communication', () => {
  //   const r = new Runner(dataset.contexts[1])
  //   // todo: figure out a nice pattern for hydrating UUIDs
  //   const expectedPrompt = new NumericPrompt('cb1b04a3-6447-4e33-a449-a6e3107e7531', '1c7317fc-b644-4da4-b1ff-1807ce55c17e', null)
  //
  //   jest.spyOn(r, 'navigateToNextBlockOn') // todo: this should be on block.start()
  //       .mockReturnValue(expectedPrompt)
  //
  //   const prompt = r.start()
  //   expect(prompt).toBe(expectedPrompt)
  // })
  // })
})