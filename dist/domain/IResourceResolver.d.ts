import { IContext, SupportedContentType, SupportedMode } from '..';
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
    getText(): string;
    hasText(): boolean;
    getAudio(): string;
    hasAudio(): boolean;
    getImage(): string;
    hasImage(): boolean;
    getVideo(): string;
    hasVideo(): boolean;
    getCsv(): string;
    hasCsv(): boolean;
    get(key: string): string;
    has(key: string): boolean;
}
export interface IResourceResolver {
    context: IContext;
    resolve(resourceId: string): IResource;
}
export declare function createTextResourceVariantWith(value: string, ctx: IContext): IResourceDefinitionContentTypeSpecific;
//# sourceMappingURL=IResourceResolver.d.ts.map