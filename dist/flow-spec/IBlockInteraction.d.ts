export default interface IBlockInteraction {
    uuid: string;
    blockId: string;
    flowId: string;
    entryAt: string;
    exitAt?: string;
    hasResponse: boolean;
    value?: string | number;
    details: IBlockInteractionDetails;
    selectedExitId: string | null;
    type: string;
    originBlockInteractionId?: string;
    originFlowId?: string;
}
export interface IBlockInteractionDetails {
}
//# sourceMappingURL=IBlockInteraction.d.ts.map