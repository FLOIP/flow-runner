import IBlockExit, {IBlockExitTestRequired} from './IBlockExit'
import {find, findLast} from 'lodash'
import ValidationException from '../domain/exceptions/ValidationException'
import IContext, {CursorType, findFlowWith, findInteractionWith, getActiveFlowFrom} from './IContext'
import {EvaluatorFactory} from 'floip-expression-evaluator-ts'
import IFlow, {findBlockWith} from './IFlow'

export default interface IBlock {
  uuid: string
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
    time: intx.entryAt,
  }
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
export function createEvalContextFrom(context: IContext) {
  const {contact, cursor, mode, languageId: language} = context
  let flow: IFlow | undefined
  let block: IBlock | undefined
  let prompt: CursorType[1]

  if (cursor != null) {
    flow = getActiveFlowFrom(context)
    block = findBlockWith(findInteractionWith(cursor[0], context).blockId, flow)
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
      ...block,
      value: prompt != null
        ? prompt.value
        : undefined,
    },
  }
}

function evaluateToBool(expr: string, ctx: object): boolean {
  const result = EvaluatorFactory.create()
    .evaluate(expr, ctx)

  const lowered = result.toLocaleLowerCase()
  const parsed = JSON.parse(lowered)
  return parsed
  // return JSON.parse(result.toLowerCase())
}
