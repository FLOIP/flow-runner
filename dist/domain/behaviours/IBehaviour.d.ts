import IBlockInteraction from '../../flow-spec/IBlockInteraction';
import IContext from '../../flow-spec/IContext';
import { IFlowNavigator } from '../FlowRunner';
export interface IBehaviourConstructor {
    new (context: IContext, navigator: IFlowNavigator): IBehaviour;
}
export default interface IBehaviour {
    context: IContext;
    navigator: IFlowNavigator;
    postInteractionCreate(interaction: IBlockInteraction, context: IContext): IBlockInteraction;
    postInteractionComplete(interaction: IBlockInteraction, context: IContext): void;
}
//# sourceMappingURL=IBehaviour.d.ts.map