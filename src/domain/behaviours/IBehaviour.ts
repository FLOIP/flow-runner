import IBlockInteraction from '../../flow-spec/IBlockInteraction'
import IContext from '../../flow-spec/IContext'


export default interface IBehaviour {
  postInteractionCreate(interaction: IBlockInteraction, context: IContext): void
  postInteractionComplete(interaction: IBlockInteraction, context: IContext): void
}
