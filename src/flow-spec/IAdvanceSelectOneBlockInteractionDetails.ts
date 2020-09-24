import {IBlockInteractionDetails} from '..'

export interface IAdvancedSelectOneBlockInteractionDetails extends IBlockInteractionDetails {
  choiceRows: string[][]
}
