export default interface IBlockInteraction {
    uuid: string;
    blockId: string;
    flowId: string;
    entryAt: string;
    exitAt?: string;
    hasResponse: boolean;
    value?: string | number;
    selectedExitId: string | null;
    details: IBlockInteractionDetails;
    type: string;
    originBlockInteractionId?: string;
    originFlowId?: string;
}
export interface IBlockInteractionDetails {
}
//# sourceMappingURL=IBlockInteraction.d.ts.map