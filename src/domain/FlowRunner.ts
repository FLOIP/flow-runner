import {find, first, findLast, includes, trimEnd, last, lowerFirst} from 'lodash'
import IBlock, {findBlockExitWith} from '../flow-spec/IBlock'
import * as contextService from '../flow-spec/IContext'
import IContext, {
  convertDateToString,
  CursorType, IContextService,
  IContextWithCursor,
  RichCursorInputRequiredType,
  RichCursorType,
} from '../flow-spec/IContext'
import IBlockRunner from './runners/IBlockRunner'
import IBlockInteraction from '../flow-spec/IBlockInteraction'
import IBlockExit from '../flow-spec/IBlockExit'
import IFlowRunner, {IBlockRunnerFactoryStore} from './IFlowRunner'
import IIdGenerator from './IIdGenerator'
import IdGeneratorUuidV4 from './IdGeneratorUuidV4'
import ValidationException from './exceptions/ValidationException'
import IPrompt, {IBasePromptConfig, IPromptConfig, KnownPrompts} from './prompt/IPrompt'
import MessagePrompt from './prompt/MessagePrompt'
import DeliveryStatus from '../flow-spec/DeliveryStatus'
import NumericPrompt from './prompt/NumericPrompt'
import OpenPrompt from './prompt/OpenPrompt'
import SelectOnePrompt from './prompt/SelectOnePrompt'
import SelectManyPrompt from './prompt/SelectManyPrompt'
import IBehaviour, {IBehaviourConstructor} from './behaviours/IBehaviour'
// import BacktrackingBehaviour from './behaviours/BacktrackingBehaviour/BacktrackingBehaviour'
import BasicBacktrackingBehaviour from './behaviours/BacktrackingBehaviour/BasicBacktrackingBehaviour'
import MessageBlockRunner from './runners/MessageBlockRunner'
import IMessageBlock from '../model/block/IMessageBlock'
import OpenResponseBlockRunner from './runners/OpenResponseBlockRunner'
import IOpenResponseBlock from '../model/block/IOpenResponseBlock'
import NumericResponseBlockRunner from './runners/NumericResponseBlockRunner'
import INumericResponseBlock from '../model/block/INumericResponseBlock'
import SelectOneResponseBlockRunner from './runners/SelectOneResponseBlockRunner'
import ISelectOneResponseBlock from '../model/block/ISelectOneResponseBlock'
import SelectManyResponseBlockRunner from './runners/SelectManyResponseBlockRunner'
import CaseBlockRunner from './runners/CaseBlockRunner'
import ICaseBlock from '../model/block/ICaseBlock'



export class BlockRunnerFactoryStore
  extends Map<string, { (block: IBlock, ctx: IContext): IBlockRunner }>
  implements IBlockRunnerFactoryStore {
}

export interface IFlowNavigator {
  navigateTo(block: IBlock, ctx: IContext): RichCursorType
}

export interface IPromptBuilder {
  buildPromptFor(block: IBlock, interaction: IBlockInteraction):
    IPrompt<IPromptConfig<any> & IBasePromptConfig> | undefined
}

const DEFAULT_BEHAVIOUR_TYPES: IBehaviourConstructor[] = [
  BasicBacktrackingBehaviour,
  // BacktrackingBehaviour,
]

export const NON_INTERACTIVE_BLOCK_TYPES = [
  'Core\\Case',
  'Core\\RunFlowBlock',
]

export function createDefaultBlockRunnerStore(): IBlockRunnerFactoryStore {
  return new BlockRunnerFactoryStore([
    ['MobilePrimitives\\Message', (block, innerContext) => new MessageBlockRunner(block as IMessageBlock, innerContext)],
    ['MobilePrimitives\\OpenResponse', (block, innerContext) => new OpenResponseBlockRunner(block as IOpenResponseBlock, innerContext)],
    ['MobilePrimitives\\NumericResponse', (block, innerContext) => new NumericResponseBlockRunner(block as INumericResponseBlock, innerContext)],
    ['MobilePrimitives\\SelectOneResponse', (block, innerContext) => new SelectOneResponseBlockRunner(block as ISelectOneResponseBlock, innerContext)],
    ['MobilePrimitives\\SelectManyResponse', (block, innerContext) => new SelectManyResponseBlockRunner(block as ISelectOneResponseBlock, innerContext)],
    ['Core\\Case', (block, innerContext) => new CaseBlockRunner(block as ICaseBlock, innerContext)]])
}

export default class FlowRunner implements IFlowRunner, IFlowNavigator, IPromptBuilder {
  constructor(
    public context: IContext,
    public runnerFactoryStore: IBlockRunnerFactoryStore = createDefaultBlockRunnerStore(),
    protected idGenerator: IIdGenerator = new IdGeneratorUuidV4,
    public behaviours: { [key: string]: IBehaviour } = {},
    public _contextService: IContextService = contextService
  ) {
    this.initializeBehaviours(DEFAULT_BEHAVIOUR_TYPES)
  }

  /**
   * Take list of constructors and initialize them like: ```
   * runner.initializeBehaviours([MyFirstBehaviour, MySecondBehaviour])
   * runner.behaviours.myFirst instanceof MyFirstBehaviour
   * runner.behaviours.mySecond instanceof MySecondBehaviour
   * ``` */
  initializeBehaviours(behaviourConstructors: IBehaviourConstructor[]) {
    behaviourConstructors.forEach(b =>
      this.behaviours[lowerFirst(trimEnd(b.name, 'Behaviour|Behavior'))]
        = new b(this.context, this, this))
  }

  /**
   * We want to call start when we don't have a prompt needing work to be done. */
  initialize(): RichCursorType | undefined {
    const ctx = this.context
    const block = this.findNextBlockOnActiveFlowFor(ctx)

    if (block == null) {
      throw new ValidationException('Unable to initialize flow without blocks.')
    }

    ctx.deliveryStatus = DeliveryStatus.IN_PROGRESS
    ctx.entryAt = convertDateToString(new Date)

    return this.navigateTo(block, this.context) // kick-start by navigating to first block
  }

  isInitialized(ctx: IContext): boolean {
    // const {cursor, entryAt, exitAt} = ctx
    // return cursor && entryAt && !exitAt

    return ctx.cursor != null
  }

  isFirst(): boolean {
    const {cursor, interactions} = this.context

    if (!this.isInitialized(this.context)) {
      return true
    }

    const firstInteractiveIntx = find(interactions, ({type}) =>
      !includes(NON_INTERACTIVE_BLOCK_TYPES, type))

    if (firstInteractiveIntx == null) {
      return true
    }

    return firstInteractiveIntx.uuid === cursor![0]
  }

  isLast(): boolean {
    const {cursor, interactions} = this.context

    if (!this.isInitialized(this.context)) {
      return true
    }

    return last(interactions)!.uuid === cursor![0]
  }

  /**
   * We want to call resume when we have a prompt needing work to be wrapped up on it.
   *
   * I'm wondering if these need to be treated differently. The concern is that resume _assumes_ a particular state;
   * eg. cursor with a prompt requiring input
   *
   * The issue is that we may, in fact, end up needing to resume from a state where a particular block
   *    got itself into an invalid state and _crashed_, in which case, we'd still want the ability to pick up
   *    where we'd left off. */
  run(): RichCursorInputRequiredType | undefined {
    const {context: ctx} = this
    if (!this.isInitialized(ctx)) {
      /* const richCursor = */
      this.initialize()
    }

    return this.runUntilInputRequiredFrom(ctx as IContextWithCursor)
  }

  isInputRequiredFor(ctx: IContext): boolean /* : ctx is RichCursorInputRequiredType*/ {
    return ctx.cursor != null
      && ctx.cursor[1] != null
      && ctx.cursor[1].value === undefined
  }

  runUntilInputRequiredFrom(ctx: IContextWithCursor): RichCursorInputRequiredType | undefined {
    /* todo: convert cursor to an object instead of tuple; since we don't have named tuples, a dictionary
        would be more intuitive */
    let richCursor: RichCursorType = this.hydrateRichCursorFrom(ctx)
    let block: IBlock | undefined = this._contextService.findBlockOnActiveFlowWith(richCursor[0].blockId, ctx)

    do {
      if (this.isInputRequiredFor(ctx)) {
        console.info('Attempted to resume when prompt is not yet fulfilled; resurfacing same prompt instance.')
        return richCursor as RichCursorInputRequiredType
      }

      this.runActiveBlockOn(richCursor, block)

      block = this.findNextBlockOnActiveFlowFor(ctx)

      if (block == null) {
        block = this.stepOut(ctx)

        // todo: ensure that exitat is set to _after_ our last nested flow interaction
        //       what happens with nested flow ending in MCQ -- shouldn't selectedExitId be set ?
        //       null selectedExitId should actually have a selectedExitId that points to an exit that has a null destination block
      }

      if (block == null) {
        continue // bail-- we're done.
      }

      if (block.type === 'Core\\RunFlowBlock') {
        richCursor = this.navigateTo(block, ctx)
        block = this.stepInto(block, ctx)
      }

      if (block == null) {
        continue // bail-- we done.
      }

      richCursor = this.navigateTo(block, ctx)

    } while (block != null)

    this.complete(ctx)
    return
  }

  // exitEarlyThrough(block: IBlock) {
    // todo: generate link from current interaction to exit block (flow.exitBlockId)
    // todo: raise if flow.exitBlockId not defined
    // todo: set delivery status on context as INCOMPLETE
  // }

  complete(ctx: IContext): void {
    // todo: set exitAt on context
    // todo: set delivery status on context as COMPLETE

    // todo: should set selected exit ID on last interaction as well, with destination of null

    (last(ctx.interactions) as IBlockInteraction).exitAt = convertDateToString(new Date)
    delete ctx.cursor
    ctx.deliveryStatus = DeliveryStatus.FINISHED_COMPLETE
    ctx.exitAt = convertDateToString(new Date)
  }

  dehydrateCursor(richCursor: RichCursorType): CursorType {
    return [richCursor[0].uuid, richCursor[1] != null ? richCursor[1].config : undefined]
  }

  hydrateRichCursorFrom(ctx: IContextWithCursor): RichCursorType {
    const {cursor} = ctx
    const interaction = this._contextService.findInteractionWith(cursor[0], ctx)
    return [interaction, this.createPromptFrom(cursor[1], interaction)]
  }

  initializeOneBlock(
    block: IBlock,
    flowId: string,
    originFlowId?: string,
    originBlockInteractionId?: string,
  ): RichCursorType {
    let interaction = this.createBlockInteractionFor(block, flowId, originFlowId, originBlockInteractionId)

    Object.values(this.behaviours)
      .forEach(b => interaction = b.postInteractionCreate(interaction, this.context))

    return [interaction, this.buildPromptFor(block, interaction)]
  }

  runActiveBlockOn(richCursor: RichCursorType, block: IBlock): IBlockExit {
    // todo: write test to guard against already isSubmitted at this point

    if (richCursor[1] != null) {
      richCursor[0].value = richCursor[1].value
      richCursor[0].hasResponse = true
    }

    const exit = this.createBlockRunnerFor(block, this.context)
      .run(richCursor)

    richCursor[0].selectedExitId = exit.uuid

    if (richCursor[1] != null) {
      richCursor[1].config.isSubmitted = true
    }

    Object.values(this.behaviours)
      .forEach(b => b.postInteractionComplete(richCursor[0], this.context))

    return exit
  }

  createBlockRunnerFor(block: IBlock, ctx: IContext): IBlockRunner {
    const factory = this.runnerFactoryStore.get(block.type)
    if (factory == null) { // todo: need to pass as no-op for beta
      throw new ValidationException(`Unable to find factory for block type: ${block.type}`)
    }

    return factory(block, ctx)
  }

  navigateTo(block: IBlock, ctx: IContext, navigatedAt: Date = new Date): RichCursorType {
    const {interactions, nestedFlowBlockInteractionIdStack} = ctx
    const flowId = this._contextService.getActiveFlowIdFrom(ctx)
    const originInteractionId = last(nestedFlowBlockInteractionIdStack)
    const originInteraction = originInteractionId != null
      ? this._contextService.findInteractionWith(originInteractionId, ctx)
      : null

    const richCursor = this.initializeOneBlock(
      block,
      flowId,
      originInteraction == null ? undefined : originInteraction.flowId,
      originInteractionId)

    const lastInteraction = last(interactions)
    if (lastInteraction != null) {
      lastInteraction.exitAt = convertDateToString(navigatedAt)
    }

    interactions.push(richCursor[0])
    ctx.cursor = this.dehydrateCursor(richCursor)

    return richCursor
  }

  /**
   * Stepping into is the act of moving into a child flow.
   * However, we can't move into a child flow without a cursor indicating we've moved.
   * `stepInto()` needs to be the thing that discovers ya from xa (via first on flow in flows list)
   * Then generating a cursor that indicates where we are.
   * ?? -> xa ->>> ya -> yb ->>> xb
   *
   * todo: would it be possible for stepping into and out of be handled by the RunFlow itself?
   *       Eg. these are esentially RunFlowRunner's .start() + .resume() equivalents */
  stepInto(runFlowBlock: IBlock, ctx: IContext): IBlock | undefined {
    if (runFlowBlock.type !== 'Core\\RunFlow') {
      throw new ValidationException('Unable to step into a non-Core\\RunFlow block type')
    }

    const runFlowInteraction = last(ctx.interactions)
    if (runFlowInteraction == null) {
      throw new ValidationException('Unable to step into Core\\RunFlow that hasn\'t yet been started')
    }

    if (runFlowBlock.uuid !== runFlowInteraction.blockId) {
      throw new ValidationException('Unable to step into Core\\RunFlow block that doesn\'t match last interaction')
    }

    ctx.nestedFlowBlockInteractionIdStack.push(runFlowInteraction.uuid)

    const firstNestedBlock = first(this._contextService.getActiveFlowFrom(ctx).blocks) // todo: use IFlow.firstBlockId
    if (firstNestedBlock == null) {
      return undefined
    }

    return firstNestedBlock
  }

  /**
   * Stepping out is the act of moving back into parent flow.
   * However, we can't move up into parent flow without a cursor indicating we've moved.
   * `stepOut()` needs to be the things that discovers xb from xa (via nfbistack)
   * Then generating a cursor that indicates where we are.
   * ?? -> xa ->>> ya -> yb ->>> xb
   *
   * @note Does this push cursor into an out-of-sync state?
   *       Not when stepping out, because when stepping out, we're connecting previous RunFlow output
   *       to next block; when stepping IN, we need an explicit navigation to inject RunFlow in between
   *       the two Flows. */
  stepOut(ctx: IContext): IBlock | undefined {
    const {nestedFlowBlockInteractionIdStack} = ctx
    const {_contextService: contextService} = this

    if (nestedFlowBlockInteractionIdStack.length === 0) {
      return
    }

    // pop last nested flow interaction id (aka unnest)
    const lastRunFlowIntxId = nestedFlowBlockInteractionIdStack.pop() as string
    // update last nested flow interaction
    const lastRunFlowIntx = contextService.findInteractionWith(lastRunFlowIntxId, ctx)
    // find- + return- destination block from first exit on runflowblock (on interaction 👆)
    const lastRunFlowBlock = contextService.findBlockOnActiveFlowWith(lastRunFlowIntx.blockId, ctx)
    const {uuid: lastRunFlowBlockFirstExitId, destinationBlock: destinationBlockId} = first(lastRunFlowBlock.exits) as IBlockExit

    lastRunFlowIntx.selectedExitId = lastRunFlowBlockFirstExitId

    if (destinationBlockId == null) {
      return
    }

    return contextService.findBlockOnActiveFlowWith(destinationBlockId, ctx)
  }

  findInteractionForActiveNestedFlow({nestedFlowBlockInteractionIdStack, interactions}: IContext): IBlockInteraction {
    if (nestedFlowBlockInteractionIdStack.length === 0) {
      throw new ValidationException('Unable to find interaction for nested flow when not nested')
    }

    const intx = findLast(interactions, {uuid: last(nestedFlowBlockInteractionIdStack)})
    if (intx == null) {
      throw new ValidationException('Unable to find interaction for deepest flow nesting')
    }

    return intx
  }

  findNextBlockOnActiveFlowFor(ctx: IContext): IBlock | undefined {
    // cursor: RichCursorType | null, flow: IFlow): IBlock | null {
    const flow = this._contextService.getActiveFlowFrom(ctx)
    const {cursor} = ctx

    if (cursor == null) {
      return first(flow.blocks) // todo: use IFlow.firstBlockId
    }

    const interaction = this._contextService.findInteractionWith(cursor[0], ctx)
    return this.findNextBlockFrom(interaction, ctx)
  }

  findNextBlockFrom(interaction: IBlockInteraction, ctx: IContext): IBlock | undefined {
    if (interaction.selectedExitId == null) {
      // todo: maybe tighter check on this, like: prompt.isFulfilled() === false || !called block.run()
      throw new ValidationException(
        'Unable to navigate past incomplete interaction; did you forget to call runner.run()?')
    }

    const block = this._contextService.findBlockOnActiveFlowWith(interaction.blockId, ctx)
    const {destinationBlock} = findBlockExitWith(interaction.selectedExitId, block)
    const {blocks} = this._contextService.getActiveFlowFrom(ctx)

    return find(blocks, {uuid: destinationBlock})
  }

  private createBlockInteractionFor(
    {uuid: blockId, type}: IBlock,
    flowId: string,
    originFlowId: string | undefined,
    originBlockInteractionId: string | undefined): IBlockInteraction {

    return {
      uuid: this.idGenerator.generate(),
      blockId,
      flowId,
      entryAt: convertDateToString(new Date),
      exitAt: undefined,
      hasResponse: false,
      value: undefined,
      selectedExitId: null,
      details: {},
      type,

      // Nested flows:
      originFlowId,
      originBlockInteractionId,
    }
  }

  buildPromptFor(block: IBlock, interaction: IBlockInteraction):
    IPrompt<IPromptConfig<any> & IBasePromptConfig> | undefined {

    const runner = this.createBlockRunnerFor(block, this.context)
    const promptConfig = runner.initialize(interaction)
    return this.createPromptFrom(promptConfig, interaction)
  }

  private createPromptFrom(config?: IPromptConfig<any>, interaction?: IBlockInteraction):
    IPrompt<IPromptConfig<any> & IBasePromptConfig> | undefined {

    if (config == null || interaction == null) {
      return
    }

    // todo: flesh this out as an extensibile store that can be DI'd like runners
    const kindConstructor = {
      [KnownPrompts.Message]: MessagePrompt,
      [KnownPrompts.Numeric]: NumericPrompt,
      [KnownPrompts.Open]: OpenPrompt,
      [KnownPrompts.SelectOne]: SelectOnePrompt,
      [KnownPrompts.SelectMany]: SelectManyPrompt,
    }[config.kind]

    // @ts-ignore
    return new kindConstructor(config, interaction.uuid, this)
  }
}
