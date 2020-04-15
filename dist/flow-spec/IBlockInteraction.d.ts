export interface IBlockInteraction {
    uuid: string;
    blockId: string;
    flowId: string;
    entryAt: string;
    exitAt?: string;
    hasResponse: boolean;
    value?: string | number | object;
    details: IBlockInteractionDetails;
    selectedExitId?: string;
    type: string;
    originBlockInteractionId?: string;
    originFlowId?: string;
}
export default IBlockInteraction;
export interface IBlockInteractionDetails {
}
//# sourceMappingURL=IBlockInteraction.d.ts.map