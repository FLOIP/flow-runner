import IBlockRunner from './IBlockRunner';
import { ISelectOnePromptConfig } from '../..';
import IBlockExit from '../../flow-spec/IBlockExit';
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock';
import IContext from '../../flow-spec/IContext';
export default class SelectOneResponseBlockRunner implements IBlockRunner {
    block: ISelectOneResponseBlock;
    context: IContext;
    constructor(block: ISelectOneResponseBlock, context: IContext);
    initialize(): ISelectOnePromptConfig;
    run(): IBlockExit;
    createEvalContextFrom(context: IContext): {
        contact: import("../../flow-spec/IContact").default;
        channel: {
            mode: import("../..").SupportedMode;
        };
        flow: {
            language: string;
            uuid: string;
            name: string;
            label?: string | undefined;
            lastModified: string;
            interactionTimeout: number;
            platformMetadata: object;
            supportedModes: import("../..").SupportedMode[];
            languages: string[];
            blocks: import("../../flow-spec/IBlock").default[];
            firstBlockId: string;
            exitBlockId?: string | undefined;
        };
        block: {
            value: any;
            config: import("../../model/block/ISelectOneResponseBlockConfig").default;
            uuid: string;
            name: string;
            label?: string | undefined;
            semanticLabel?: string | undefined;
            type: string;
            exits: IBlockExit[];
        };
    };
    evaluateToBool(expr: string, ctx: object): any;
}
//# sourceMappingURL=SelectOneResponseBlockRunner.d.ts.map