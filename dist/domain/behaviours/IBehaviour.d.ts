import { IBlockInteraction, IContext, IFlowNavigator, IPromptBuilder } from '../..';
export interface IBehaviourConstructor {
    new (context: IContext, navigator: IFlowNavigator, promptBuilder: IPromptBuilder): IBehaviour;
}
export interface IBehaviour {
    context: IContext;
    navigator: IFlowNavigator;
    promptBuilder: IPromptBuilder;
    postInteractionCreate(interaction: IBlockInteraction, context: IContext): IBlockInteraction;
    postInteractionComplete(interaction: IBlockInteraction, context: IContext): void;
}
//# sourceMappingURL=IBehaviour.d.ts.map