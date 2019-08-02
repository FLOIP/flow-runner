import {PromptExpectationsType} from "../domain/prompt/BasePrompt"
import IContact from "./IContact";
import IFlow from "./IFlow";
import ISession from "./ISession";
import IBlockInteraction from "./IBlockInteraction";
import IPrompt from "./IPrompt";

export type CursorType = [string, IPrompt<PromptExpectationsType> | null]
export type CursorInputRequiredType = [string /*UUID64*/, IPrompt<PromptExpectationsType>]
export type CursorNoInputRequiredType = [string, null]

export type RichCursorType = [IBlockInteraction, IPrompt<PromptExpectationsType> | null]
export type RichCursorInputRequiredType = [IBlockInteraction, IPrompt<PromptExpectationsType>]
export type RichCursorNoInputRequiredType = [IBlockInteraction, null]

export default interface IContext {
  flows: IFlow[]
  firstFlowId: string
  interactions: IBlockInteraction[]
  contact: IContact
  session: ISession
  sessionVars: object
  nestedFlowBlockInteractionStack: string[]
  cursor: CursorType | null
}

export interface IContextWithCursor extends IContext {
  cursor: CursorType
}

export interface IContextInputRequired extends IContext {
  cursor: CursorInputRequiredType
}
