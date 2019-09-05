import { SupportedMode } from '..';
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
    criteria: {
        languageId: string;
        modes: SupportedMode[];
    };
    hasText(): boolean;
    getText(): string;
    hasAudio(): boolean;
    getAudio(): string;
    hasImage(): boolean;
    getImage(): string;
    hasVideo(): boolean;
    getVideo(): string;
}
export default interface IResourceResolver {
    modes: SupportedMode[];
    languageId: string;
    resourceDefinitions: IResources;
    resolve(resourceId: string): IResource;
}
//# sourceMappingURL=IResourceResolver.d.ts.map