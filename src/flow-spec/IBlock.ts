/**
 * Flow Interoperability Project (flowinterop.org)
 * Flow Runner
 * Copyright (c) 2019, 2020 Viamo Inc.
 * Authored by: Brett Zabos (brett.zabos@viamo.io)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/

import {
  findBlockWith,
  findInteractionWith,
  getActiveFlowFrom,
  IBlockExit,
  IBlockExitTestRequired,
  IContext,
  ICursor,
  IFlow,
  ValidationException,
  isSetContactPropertyConfig,
  SetContactProperty,
  isSetContactProperty,
  IContact,
} from '..'
import {cloneDeep, extend, find, get, has, startsWith} from 'lodash'
import {EvaluatorFactory} from '@floip/expression-evaluator'

export interface IBlock {
  uuid: string
  name: string
  label?: string
  semantic_label?: string
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
  return find<IBlockExitTestRequired>(
    exits,
    ({test, default: isDefault = false}) => !isDefault && evaluateToBool(String(test), evalContext)
  )
}

export function findDefaultBlockExitOn(block: IBlock): IBlockExit {
  const exit = find(block.exits, {default: true})
  if (exit == null) {
    throw new ValidationException(`Unable to find default exit on block ${block.uuid}`)
  }

  return exit
}

export function isLastBlock({exits}: IBlock): boolean {
  return exits.every(e => e.destination_block == null)
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
        // todo: why are we using ...arguments here?
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
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
      return prop in target || has(ctx, `sessionVars.blockInteractionsByBlockName.${prop.toString()}`)
    },
  }) as TEvalContextBlockMap
}

// todo: push eval stuff into `Expression.evaluate()` abstraction for evalContext + result handling 👇
export function createEvalContextFrom(context: IContext): object {
  const {contact, cursor, mode, language_id: language} = context
  let flow: IFlow | undefined
  let block: IBlock | undefined
  let prompt: ICursor['promptConfig']

  if (cursor != null) {
    // because evalContext.block references the current block we're working on
    flow = getActiveFlowFrom(context)
    block = findBlockWith(findInteractionWith(cursor.interactionId, context).block_id, flow)
    prompt = cursor.promptConfig
  }

  return {
    contact: createEvalContactFrom(contact),
    channel: {mode},
    flow: generateCachedProxyForBlockName(
      {
        ...flow,
        language, // todo: why isn't this languageId?
      },
      context
    ),
    block: {
      ...block, // todo: should this differ from our IEvalContextBlock lookups on flow?
      value: prompt != null ? prompt.value : undefined,
    },
  }
}

/**
 * Create a contact for use in evaluation context.
 * This creates a copy of the passed contact and removes, from the contacts list
 * of groups, any groups that have been marked as deleted.
 * @param contact
 */
export function createEvalContactFrom(contact: IContact): IContact {
  const evalContact = cloneDeep(contact)
  evalContact.groups = evalContact.groups?.filter(group => group.deleted_at === null) ?? []

  return evalContact
}

export function evaluateToBool(expr: string, ctx: object): boolean {
  return JSON.parse(evaluateToString(expr, ctx).toLowerCase())
}

export function evaluateToString(expr: string, ctx: object): string {
  return EvaluatorFactory.create().evaluate(wrapInExprSyntaxWhenAbsent(expr), ctx)
}

export function wrapInExprSyntaxWhenAbsent(expr: string): string {
  return startsWith(expr, '@(') ? expr : `@(${expr})`
}

/**
 * Set a property on the contact contained in the flow context.
 */
export function setContactProperty(block: IBlock, context: IContext): void {
  if (isSetContactPropertyConfig(block.config)) {
    const setContactProperty = block.config.set_contact_property

    if (Array.isArray(setContactProperty)) {
      setContactProperty.forEach(property => setSingleContactProperty(property, context))
    } else if (isSetContactProperty(setContactProperty)) {
      setSingleContactProperty(setContactProperty, context)
    }
  }
}

function setSingleContactProperty(property: SetContactProperty, context: IContext): void {
  const value = evaluateToString(property.property_value, createEvalContextFrom(context))
  context.contact.setProperty(property.property_key, value)
}

export interface IBlockService {
  findBlockExitWith(uuid: string, block: IBlock): IBlockExit

  findFirstTruthyEvaluatingBlockExitOn(block: IBlockWithTestExits, context: IContext): IBlockExitTestRequired | undefined

  findDefaultBlockExitOn(block: IBlock): IBlockExit

  isLastBlock(block: IBlock): boolean

  findAndGenerateExpressionBlockFor(blockName: IBlock['name'], ctx: IContext): IEvalContextBlock | undefined

  generateCachedProxyForBlockName(target: object, ctx: IContext): object

  createEvalContextFrom(context: IContext): object

  evaluateToBool(expr: string, ctx: object): boolean
}
