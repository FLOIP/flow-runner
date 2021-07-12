export interface IBlockInteraction<VALUE = unknown> {
    uuid: string;
    block_id: string;
    flow_id: string;
    entry_at: string;
    exit_at?: string;
    has_response: boolean;
    value?: VALUE;
    details: IBlockInteractionDetails;
    selected_exit_id?: string;
    type: string;
    origin_block_interaction_id?: string;
    origin_flow_id?: string;
}
export interface IBlockInteractionDetails {
}
//# sourceMappingURL=IBlockInteraction.d.ts.map