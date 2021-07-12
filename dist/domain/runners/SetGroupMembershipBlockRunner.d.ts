import { IBlockExit, IBlockRunner, IContext, IRichCursor, ISetGroupMembershipBlock } from '../..';
export declare class SetGroupMembershipBlockRunner implements IBlockRunner {
    block: ISetGroupMembershipBlock;
    context: IContext;
    constructor(block: ISetGroupMembershipBlock, context: IContext);
    initialize(): Promise<undefined>;
    run(_cursor: IRichCursor): Promise<IBlockExit>;
}
//# sourceMappingURL=SetGroupMembershipBlockRunner.d.ts.map