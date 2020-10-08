import { IContext, SupportedMode } from '..';
export declare enum SupportedContentType {
    TEXT = "text",
    AUDIO = "audio",
    IMAGE = "image",
    VIDEO = "video"
}
export interface IResourceDefinitionContentTypeSpecific {
    languageId: string;
    contentType: SupportedContentType;
    modes: SupportedMode[];
    value: string;
}
export interface IResourceDefinition {
    uuid: string;
    values: IResourceDefinitionContentTypeSpecific[];
}
export declare type IResources = IResourceDefinition[];
export interface IResource {
    uuid: string;
    values: IResourceDefinitionContentTypeSpecific[];
    context: IContext;
    hasText(): boolean;
    getText(): string;
    hasAudio(): boolean;
    getAudio(): string;
    hasImage(): boolean;
    getImage(): string;
    hasVideo(): boolean;
    getVideo(): string;
}
export interface IResourceResolver {
    context: IContext;
    resolve(resourceId: string): IResource;
}
export declare function createTextResourceVariantWith(value: string, ctx: IContext): IResourceDefinitionContentTypeSpecific;
export declare function getResource(context: IContext, resourceId: string): IResource;
//# sourceMappingURL=IResourceResolver.d.ts.map