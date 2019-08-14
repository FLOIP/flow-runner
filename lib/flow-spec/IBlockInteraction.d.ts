export default interface IBlockInteraction {
    uuid: string;
    blockId: string;
    flowId: string;
    entryAt: Date;
    exitAt: Date | null;
    hasResponse: boolean;
    value: string | number | null;
    details: IBlockInteractionDetails;
    type: null;
    originBlockInteractionId: string | null;
    originFlowId: string | null;
}
export interface IBlockInteractionDetails {
    selectedExitId: string | null;
}
//# sourceMappingURL=IBlockInteraction.d.ts.map