import { IBlockExit, IBlockRunner, IContext, IRichCursor, ISetGroupMembershipBlock } from '../..';
/**
 * Adds or removes a group from the contact.
 */
export declare class SetGroupMembershipBlockRunner implements IBlockRunner {
    block: ISetGroupMembershipBlock;
    context: IContext;
    constructor(block: ISetGroupMembershipBlock, context: IContext);
    initialize(): Promise<undefined>;
    run(_cursor: IRichCursor): Promise<IBlockExit>;
}
//# sourceMappingURL=SetGroupMembershipBlockRunner.d.ts.map