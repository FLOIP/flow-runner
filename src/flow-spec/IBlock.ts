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
  IBlockConfig,
  IBlockExit,
  IContact,
  IContext,
  ICursor,
  IFlow,
  SetContactProperty,
  ValidationException,
} from '..'
import {cloneDeep, extend, find, get, has, startsWith} from 'lodash'
import {EvaluatorFactory} from '@floip/expression-evaluator'
import {createFormattedDate} from '../domain/DateFormat'

/**
 * Coordinates indicating location of this block on the Flow Builder's canvas
 */
export interface IBlockUIMetadataCanvasCoordinates {
  x: number
  y: number
}

/**
 * A set of key-value records describing information about how blocks are displayed on a UI/flowchart editor
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IBlockUIMetadata extends Record<string, any> {
  canvas_coordinates?: IBlockUIMetadataCanvasCoordinates
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IBlockVendorMetadata extends Record<string, any> {
  floip: IBlockVendorMetadataFloip
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IBlockVendorMetadataFloip extends Record<string, any> {
  ui_metadata: IFloipUIMetadata
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IFloipUIMetadata extends Record<string, any> {
  branching_type: string
  /**
   * There is a scenario we want to update the block.name when the block.label is changed, in that case we will use this field
   */
  should_auto_update_name?: boolean
}

/**
 * Block Structure: https://floip.gitbook.io/flow-specification/flows#blocks
 */
export interface IBlock<BLOCK_CONFIG = IBlockConfig> {
  /**
   * A globally unique identifier for this Block.  (See UUID Format: https://floip.gitbook.io/flow-specification/flows#uuid-format)
   *
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   */
  uuid: string

  /**
   * A human-readable "variable name" for this block.
   * This must be restricted to word characters so that it can be used as a variable name in expressions.
   * When blocks write results output, they write to a variable corresponding the name of the block.
   *
   * @pattern ^[a-zA-Z_]\w+$
   */
  name: string

  /**
   * A human-readable free-form description for this Block.
   */
  label?: string

  /**
   * A user-controlled field that can be used to code the meaning of the data collected by this block in a standard taxonomy or
   * coding system, * e.g.: a FHIR ValueSet, an industry-specific coding system like SNOMED CT,
   * or an organization's internal taxonomy service. (e.g. "SNOMEDCT::Gender finding")
   */
  semantic_label?: string

  /**
   * an arbitrary list of strings for categorization of the block's content, meaning, etc.
   * This has a similar purpose to semantic_label, but the assumption is that many related blocks
   * might have the same tags.
   */
  tags?: Array<string>

  /**
   * A set of key-value elements that is not controlled by the Specification,
   * but could be relevant to a specific vendor/platform/implementation.
   */
  vendor_metadata?: IBlockVendorMetadata

  /**
   * A set of key-value records describing information about how blocks are displayed on a UI/flowchart editor
   */
  ui_metadata?: IBlockUIMetadata

  /**
   * A specific string designating the type or "subclass" of this Block.
   * This must be one of the Block type names within the specification, such as Core.RunFlow or MobilePrimitives.Message.
   */
  type: string

  /**
   * Additional parameters that are specific to the type of the block. Details are provided within the Block documentation.
   */
  config: BLOCK_CONFIG

  /**
   * a list of all the exits for the block.
   * Exits must contain the required keys below, and can contain additional keys based on the Block type
   */
  exits: IBlockExit[]
}

export function findBlockExitWith(uuid: string, block: IBlock): IBlockExit {
  const exit = find(block.exits, {uuid})
  if (exit == null) {
    throw new ValidationException('Unable to find exit on block')
  }

  return exit
}

/**
 * @param block
 * @param context
 * @deprecated Use firstTrueOrNullBlockExitOrThrow or firstTrueBlockExitOrNull
 */
export function findFirstTruthyEvaluatingBlockExitOn(block: IBlock, context: IContext): IBlockExit | undefined {
  const {exits} = block
  if (exits.length === 0) {
    throw new ValidationException(`Unable to find exits on block ${block.uuid}`)
  }

  const evalContext = createEvalContextFrom(context)
  return find<IBlockExit>(exits, ({test, default: isDefault = false}) => !isDefault && evaluateToBool(String(test), evalContext))
}

export function firstTrueBlockExitOrNull(block: IBlock, context: IContext): IBlockExit | undefined {
  try {
    return firstTrueOrNullBlockExitOrThrow(block, context)
  } catch (e) {
    return undefined
  }
}

export function firstTrueOrNullBlockExitOrThrow(block: IBlock, context: IContext): IBlockExit {
  const blockExit = _firstBlockExit(context, block)
  if (blockExit == null) {
    throw new ValidationException(`All block exits evaluated to false. Block: ${block.uuid}`)
  }
  return blockExit
}

function _firstBlockExit(context: IContext, block: IBlock): IBlockExit | undefined {
  try {
    const evalContext = createEvalContextFrom(context)
    return (
      find<IBlockExit>(block.exits, blockExit => evaluateToBool(String(blockExit.test), evalContext)) ?? findDefaultBlockExitOnOrNull(block)
    )
  } catch (e) {
    console.error(e)
    return findDefaultBlockExitOnOrNull(block)
  }
}

export function findDefaultBlockExitOnOrNull(block: IBlock): IBlockExit | undefined {
  try {
    return findDefaultBlockExitOrThrow(block)
  } catch (e) {
    return undefined
  }
}

export function findDefaultBlockExitOrThrow(block: IBlock): IBlockExit {
  /* We have to test against null, as some default exits are being sent with a value of null
      (MessageBlock, SetGroupMembershipBlock, CaseBlock)*/
  const exit = find(block.exits, blockExit => blockExit.default || blockExit.test == null)

  if (exit == null) {
    throw new ValidationException(`Unable to find default exit on block ${block.uuid}`)
  }

  return exit
}

export function isLastBlock({exits}: IBlock): boolean {
  return exits.every(e => e.destination_block == null)
}

export interface IEvalContextBlock {
  __value__: unknown
  time: string
  __interactionId: string
  value: unknown
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const evalBlock = get(ctx, `session_vars.block_interactions_by_block_name.${prop.toString()}`) as any
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
      return prop in target || has(ctx, `session_vars.block_interactions_by_block_name.${prop.toString()}`)
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

  const today = new Date()
  const tomorrow = new Date()
  const yesterday = new Date()

  tomorrow.setDate(today.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  yesterday.setDate(today.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  return {
    contact: createEvalContactFrom(contact),
    channel: {mode},
    flow: generateCachedProxyForBlockName(
      {
        ...flow,
        // todo: why isn't this languageId?
        language,
      },
      context
    ),
    block: {
      // todo: should this differ from our IEvalContextBlock lookups on flow?
      ...block,
      value: prompt != null ? prompt.value : undefined,
    },
    date: {
      today: createFormattedDate(today),
      tomorrow: createFormattedDate(tomorrow),
      yesterday: createFormattedDate(yesterday),
      __value__: createFormattedDate(today),
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
 * Set properties on the contact contained in the flow context.
 */
export function setContactProperty(block: IBlock, context: IContext): void {
  block.config.set_contact_property?.forEach(setContactProperty => setSingleContactProperty(setContactProperty, context))
}

function setSingleContactProperty(property: SetContactProperty, context: IContext): void {
  const value = EvaluatorFactory.create().evaluate(property.property_value, createEvalContextFrom(context))
  context.contact.setProperty(property.property_key, value)
}

export interface IBlockService {
  findBlockExitWith(uuid: string, block: IBlock): IBlockExit

  /**
   * @deprecated Use firstTrueOrNullBlockExitOrThrow or firstTrueBlockExitOrNull
   */
  findFirstTruthyEvaluatingBlockExitOn(block: IBlock, context: IContext): IBlockExit | undefined

  firstTrueBlockExitOrNull(block: IBlock, context: IContext): IBlockExit | undefined
  firstTrueBlockExitOrThrow(block: IBlock, context: IContext): IBlockExit
  findDefaultBlockExitOrNull(block: IBlock): IBlockExit | undefined
  findDefaultBlockExitOrThrow(block: IBlock): IBlockExit
  findDefaultBlockExitOn(block: IBlock): IBlockExit

  isLastBlock(block: IBlock): boolean

  generateCachedProxyForBlockName(target: object, ctx: IContext): object

  createEvalContextFrom(context: IContext): object

  evaluateToBool(expr: string, ctx: object): boolean

  setContactProperty<BLOCK_CONFIG extends IBlockConfig>(block: IBlock<BLOCK_CONFIG>, context: IContext): void
}
