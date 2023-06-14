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
import { IBlockConfig, IBlockExit, IContact, IContext } from '..';
/**
 * Coordinates indicating location of this block on the Flow Builder's canvas
 */
export interface IBlockUIMetadataCanvasCoordinates {
    x: number;
    y: number;
}
/**
 * A set of key-value records describing information about how blocks are displayed on a UI/flowchart editor
 */
export interface IBlockUIMetadata extends Record<string, any> {
    canvas_coordinates?: IBlockUIMetadataCanvasCoordinates;
}
export interface IBlockVendorMetadata extends Record<string, any> {
    floip: IBlockVendorMetadataFloip;
}
export interface IBlockVendorMetadataFloip extends Record<string, any> {
    ui_metadata: IFloipUIMetadata;
}
export interface IFloipUIMetadata extends Record<string, any> {
    branching_type: string;
    /**
     * There is a scenario we want to update the block.name when the block.label is changed, in that case we will use this field
     */
    should_auto_update_name?: boolean;
    is_block_name_editable?: boolean;
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
    uuid: string;
    /**
     * A human-readable "variable name" for this block.
     * This must be restricted to word characters so that it can be used as a variable name in expressions.
     * We allow underscores. We restrict the name to start with an alphabet character.
     * When blocks write results output, they write to a variable corresponding the name of the block.
     *
     * @pattern ^[a-zA-Z][\w_]*$
     */
    name: string;
    /**
     * A human-readable free-form description for this Block.
     */
    label?: string;
    /**
     * A user-controlled field that can be used to code the meaning of the data collected by this block in a standard taxonomy or
     * coding system, * e.g.: a FHIR ValueSet, an industry-specific coding system like SNOMED CT,
     * or an organization's internal taxonomy service. (e.g. "SNOMEDCT::Gender finding")
     */
    semantic_label?: string;
    /**
     * an arbitrary list of strings for categorization of the block's content, meaning, etc.
     * This has a similar purpose to semantic_label, but the assumption is that many related blocks
     * might have the same tags.
     */
    tags?: Array<string>;
    /**
     * A set of key-value elements that is not controlled by the Specification,
     * but could be relevant to a specific vendor/platform/implementation.
     */
    vendor_metadata?: IBlockVendorMetadata;
    /**
     * A set of key-value records describing information about how blocks are displayed on a UI/flowchart editor
     */
    ui_metadata?: IBlockUIMetadata;
    /**
     * A specific string designating the type or "subclass" of this Block.
     * This must be one of the Block type names within the specification, such as Core.RunFlow or MobilePrimitives.Message.
     */
    type: string;
    /**
     * Additional parameters that are specific to the type of the block. Details are provided within the Block documentation.
     */
    config: BLOCK_CONFIG;
    /**
     * a list of all the exits for the block.
     * Exits must contain the required keys below, and can contain additional keys based on the Block type
     */
    exits: IBlockExit[];
}
export declare function findBlockExitWith(uuid: string, block: IBlock): IBlockExit;
/**
 * @param block
 * @param context
 * @deprecated Use firstTrueOrNullBlockExitOrThrow or firstTrueBlockExitOrNull
 */
export declare function findFirstTruthyEvaluatingBlockExitOn(block: IBlock, context: IContext): IBlockExit | undefined;
export declare function firstTrueBlockExitOrNull(block: IBlock, context: IContext): IBlockExit | undefined;
export declare function firstTrueOrNullBlockExitOrThrow(block: IBlock, context: IContext): IBlockExit;
export declare function findDefaultBlockExitOnOrNull(block: IBlock): IBlockExit | undefined;
export declare function findDefaultBlockExitOrThrow(block: IBlock): IBlockExit;
export declare function isLastBlock({ exits }: IBlock): boolean;
export interface IEvalContextBlock {
    __value__: unknown;
    time: string;
    __interactionId: string;
    value: unknown;
    text: string;
}
export type TEvalContextBlockMap = {
    [k: string]: IEvalContextBlock;
};
export declare function generateCachedProxyForBlockName(target: object, ctx: IContext): TEvalContextBlockMap;
export declare function createEvalContextFrom(context: IContext): object;
/**
 * Create a contact for use in evaluation context.
 * This creates a copy of the passed contact and removes, from the contacts list
 * of groups, any groups that have been marked as deleted.
 * @param contact
 */
export declare function createEvalContactFrom(contact: IContact): IContact;
export declare function evaluateToBool(expr: string, ctx: object): boolean;
export declare function evaluateToString(expr: string, ctx: object): string;
export declare function wrapInExprSyntaxWhenAbsent(expr: string): string;
/**
 * Set properties on the contact contained in the flow context.
 */
export declare function setContactProperty(block: IBlock, context: IContext): void;
export interface IBlockService {
    findBlockExitWith(uuid: string, block: IBlock): IBlockExit;
    /**
     * @deprecated Use firstTrueOrNullBlockExitOrThrow or firstTrueBlockExitOrNull
     */
    findFirstTruthyEvaluatingBlockExitOn(block: IBlock, context: IContext): IBlockExit | undefined;
    firstTrueBlockExitOrNull(block: IBlock, context: IContext): IBlockExit | undefined;
    firstTrueBlockExitOrThrow(block: IBlock, context: IContext): IBlockExit;
    findDefaultBlockExitOrNull(block: IBlock): IBlockExit | undefined;
    findDefaultBlockExitOrThrow(block: IBlock): IBlockExit;
    findDefaultBlockExitOn(block: IBlock): IBlockExit;
    isLastBlock(block: IBlock): boolean;
    generateCachedProxyForBlockName(target: object, ctx: IContext): object;
    createEvalContextFrom(context: IContext): object;
    evaluateToBool(expr: string, ctx: object): boolean;
    setContactProperty<BLOCK_CONFIG extends IBlockConfig>(block: IBlock<BLOCK_CONFIG>, context: IContext): void;
}
//# sourceMappingURL=IBlock.d.ts.map