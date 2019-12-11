import {startsWith} from 'lodash'
import IBlockExit, {IBlockExitTestRequired} from './IBlockExit'
import {find, findLast} from 'lodash'
import ValidationException from '../domain/exceptions/ValidationException'
import IContext, {
  CursorType,
  findBlockOnActiveFlowWith,
  findFlowWith,
  findInteractionWith,
  getActiveFlowFrom
} from './IContext'
import {EvaluatorFactory} from 'floip-expression-evaluator-ts'
import IFlow, {findBlockWith} from './IFlow'
import ResourceResolver from '../domain/ResourceResolver'
import IMessageBlockConfig from "../model/block/IMessageBlockConfig";

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
  value: any
  text: string
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

  const {prompt} = findBlockOnActiveFlowWith(intx.blockId, ctx).config as IMessageBlockConfig
  const resource = new ResourceResolver(ctx).resolve(prompt)

  return {
    __interactionId: intx.uuid,
    __value__: intx.value,
    value: intx.value,
    time: intx.entryAt,
    text: resource.hasText() ? resource.getText() : ''
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
    },

    has(target, prop) {
      if (prop in target) {
        return true
      }

      if (prop in expressionBlocksByName) {
        return true
      }

      expressionBlocksByName[prop.toString()] =
        findAndGenerateExpressionBlockFor(prop.toString(), ctx)

      return prop in expressionBlocksByName
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
      ...block,
      value: prompt != null
        ? prompt.value
        : undefined,
    },
  }
}

function evaluateToBool(expr: string, ctx: object): boolean {
  const result = EvaluatorFactory.create()
    .evaluate(wrapInExprSyntaxWhenAbsent(expr), ctx)

  return JSON.parse(result.toLowerCase())
}

export function wrapInExprSyntaxWhenAbsent(expr: string): string {
  return startsWith(expr, '@(')
    ? expr
    : `@(${expr})`
}
