export default interface IBlockInteraction {
    uuid: string;
    blockId: string;
    flowId: string;
    entryAt: string;
    exitAt?: string;
    hasResponse: boolean;
    value?: string | number;
    details: IBlockInteractionDetails;
    type: string;
    originBlockInteractionId?: string;
    originFlowId?: string;
}
export interface IBlockInteractionDetails {
    selectedExitId: string | null;
}
//# sourceMappingURL=IBlockInteraction.d.ts.map