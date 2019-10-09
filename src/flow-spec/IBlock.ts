import IBlockExit, {IBlockExitTestRequired} from './IBlockExit'
import {find, findLast} from 'lodash'
import ValidationException from '../domain/exceptions/ValidationException'
import IContext, {findFlowWith, getActiveFlowFrom} from './IContext'
import {EvaluatorFactory} from 'floip-expression-evaluator-ts'
import {findBlockWith} from './IFlow'

export default interface IBlock {
  uuid: string // UUID32
  name: string
  label?: string
  semanticLabel?: string
  type: string
  config: object
  exits: IBlockExit[]
}

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

  const {cursor} = context
  if (cursor == null || cursor[0] == null) {
    throw new ValidationException(`Unable to find cursor on context ${context.id}`)
  }

  const evalContext = createEvalContextFrom(context, block)
  return find<IBlockExitTestRequired>(exits, ({test}) => evaluateToBool(String(test), evalContext))
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
}

export function findAndGenerateExpressionBlockFor(blockName: IBlock['name'], ctx: IContext): IEvalContextBlock | undefined {
  const intx = findLast(ctx.interactions, ({blockId, flowId}) => {
    const {name} = findBlockWith(
      blockId,
      findFlowWith(flowId, ctx))

    return name === blockName
  })

  if (intx == null) {
    return
  }

  return {
    __interactionId: intx.uuid,
    __value__: intx.value,
    time: intx.entryAt}
}

export function generateCachedProxyForBlockName(target: object, ctx: IContext) {
  // create a cache of `{[block.name]: {...}}` for subsequent lookups
  const expressionBlocksByName: {[k: string]: IEvalContextBlock | undefined} = {}

  // create a proxy that traps get() and attempts a lookup of blocks by name
  return new Proxy(target, {
    get(target, prop, _receiver) {
      if (prop in target) {
        // @ts-ignore
        return Reflect.get(...arguments)
      }

      if (prop in expressionBlocksByName) {
        return expressionBlocksByName[prop.toString()]
      }

      return expressionBlocksByName[prop.toString()] =
        findAndGenerateExpressionBlockFor(prop.toString(), ctx)
    }
  })
}

// todo: push eval stuff into `Expression.evaluate()` abstraction for evalContext + result handling 👇
function createEvalContextFrom(context: IContext, block: IBlock) {
  const {contact, cursor, mode, languageId: language} = context
  const prompt = cursor != null
    ? cursor[1]
    : undefined

  return {
    contact,
    channel: {mode},
    flow: generateCachedProxyForBlockName({
      ...getActiveFlowFrom(context),
      language, // todo: why isn't this languageId?
    }, context),
    block: {
      ...block,
      value: prompt != null
        ? prompt.value
        : undefined,
    },
  }
}

function evaluateToBool(expr: string, ctx: object) {
  const evaluator = EvaluatorFactory.create()
  const result = evaluator.evaluate(expr, ctx)

  return JSON.parse(result.toLocaleLowerCase())
}
