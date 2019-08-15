export default interface IBlockInteraction {
    uuid: string;
    blockId: string;
    flowId: string;
    entryAt: Date;
    exitAt?: Date;
    hasResponse: boolean;
    value?: string | number;
    details: IBlockInteractionDetails;
    type: null;
    originBlockInteractionId?: string;
    originFlowId?: string;
}
export interface IBlockInteractionDetails {
    selectedExitId: string | null;
}
//# sourceMappingURL=IBlockInteraction.d.ts.map