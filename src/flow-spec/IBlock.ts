import IBlockExit, {IBlockExitTestRequired} from './IBlockExit'
import {extend, get, has, find, startsWith} from 'lodash'
import ValidationException from '../domain/exceptions/ValidationException'
import IContext, {
  TCursor,
  findInteractionWith,
  getActiveFlowFrom
} from './IContext'
import {EvaluatorFactory} from 'floip-expression-evaluator-ts'
import IFlow, {findBlockWith} from './IFlow'

export interface IBlock {
  uuid: string
  name: string
  label?: string
  semanticLabel?: string
  type: string
  config: object
  exits: IBlockExit[]
}

export default IBlock

export interface IBlockWithTestExits extends IBlock {
  exits: IBlockExitTestRequired[]
}


export function findBlockExitWith(uuid: string, block: IBlock): IBlockExit {
  const exit = find(block.exits, {uuid})
  if (exit == null) {
    throw new ValidationException('Unable to find exit on block')
  }

  return exit
}

export function findFirstTruthyEvaluatingBlockExitOn(block: IBlockWithTestExits, context: IContext): IBlockExitTestRequired | undefined {
  const {exits} = block
  if (exits.length === 0) {
    throw new ValidationException(`Unable to find exits on block ${block.uuid}`)
  }

  const evalContext = createEvalContextFrom(context)
  return find<IBlockExitTestRequired>(exits, ({test, default: isDefault = false}) =>
    !isDefault && evaluateToBool(String(test), evalContext))
}

export function findDefaultBlockExitOn(block: IBlock): IBlockExit {
  const exit = find(block.exits, {default: true})
  if (exit == null) {
    throw new ValidationException(`Unable to find default exit on block ${block.uuid}`)
  }

  return exit
}

export interface IEvalContextBlock {
  __value__: any
  time: string
  __interactionId: string
  value: any
  text: string
}

export type TEvalContextBlockMap = {[k: string]: IEvalContextBlock}
export function generateCachedProxyForBlockName(target: object, ctx: IContext): TEvalContextBlockMap {
  // create a proxy that traps get() and attempts a lookup of blocks by name
  return new Proxy(target, {
    get(target, prop, _receiver) {
      if (prop in target) {
        // @ts-ignore
        return Reflect.get(...arguments)
      }

      // fetch our basic representation of a block stored on the context
      const evalBlock = get(ctx, `sessionVars.blockInteractionsByBlockName.${prop.toString()}`)
      if (evalBlock == null) {
        return
      }

      // extend our basic block repr with the value from block interaction
      // block interactions are logically immutable, but we yank this later to
      //   (a) mitigate storing `.value`s redundantly
      //   (b) allow post-processing using behaviours
      // if we did want to cache the value as well, we'd need to
      //   (a) implement the value portion in runOneBlock() rather than navigateTo() and
      //   (b) remove the two lines below to simply return `evalBlock` ref
      const {value} = findInteractionWith(evalBlock.__interactionId, ctx)
      return extend({value, __value__: value}, evalBlock)
    },

    has(target, prop) {
      return prop in target
        || has(ctx, `sessionVars.blockInteractionsByBlockName.${prop.toString()}`)
    }
  }) as TEvalContextBlockMap
}

// todo: push eval stuff into `Expression.evaluate()` abstraction for evalContext + result handling 👇
export function createEvalContextFrom(context: IContext) {
  const {contact, cursor, mode, languageId: language} = context
  let flow: IFlow | undefined
  let block: IBlock | undefined
  let prompt: TCursor[1]

  if (cursor != null) { // because evalContext.block references the current block we're working on
    flow = getActiveFlowFrom(context)
    block = findBlockWith(
      findInteractionWith(cursor[0], context).blockId,
      flow)
    prompt = cursor[1]
  }

  return {
    contact,
    channel: {mode},
    flow: generateCachedProxyForBlockName({
      ...flow,
      language, // todo: why isn't this languageId?
    }, context),
    block: {
      ...block, // todo: should this differ from our IEvalContextBlock lookups on flow?
      value: prompt != null
        ? prompt.value
        : undefined,
    },
  }
}

function evaluateToBool(expr: string, ctx: object): boolean {
  return JSON.parse(evaluateToString(expr, ctx).toLowerCase())
}

export function evaluateToString(expr: string, ctx: object): string {
  return EvaluatorFactory.create()
    .evaluate(wrapInExprSyntaxWhenAbsent(expr), ctx)
}

export function wrapInExprSyntaxWhenAbsent(expr: string): string {
  return startsWith(expr, '@(')
    ? expr
    : `@(${expr})`
}
