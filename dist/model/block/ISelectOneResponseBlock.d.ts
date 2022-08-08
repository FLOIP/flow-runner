import { IBlock, IBlockVendorMetadata, IBlockVendorMetadataFloip, IFloipUIMetadata, ISelectOneResponseBlockConfig } from '../..';
export interface ISelectOneResponseFloipUiMetadataChoice {
    voice_options: {
        voice_use_expression: boolean;
        voice_key_press: string;
        voice_expression: string | null;
    };
    text_options: Record<string, string[]>;
}
export declare type SelectOneResponseFloipUiMetadataChoiceByPrompt = Record<string, ISelectOneResponseFloipUiMetadataChoice>;
export interface ISelectOneResponseFloipUiMetadata extends IFloipUIMetadata {
    choices: SelectOneResponseFloipUiMetadataChoiceByPrompt;
}
export interface ISelectOneResponseBlockVendorMetadataFloip extends IBlockVendorMetadataFloip {
    ui_metadata: ISelectOneResponseFloipUiMetadata;
}
export interface ISelectOneResponseBlockVendorMetadata extends IBlockVendorMetadata {
    floip: ISelectOneResponseBlockVendorMetadataFloip;
}
export interface ISelectOneResponseBlock extends IBlock<ISelectOneResponseBlockConfig, ISelectOneResponseBlockVendorMetadata> {
}
//# sourceMappingURL=ISelectOneResponseBlock.d.ts.map