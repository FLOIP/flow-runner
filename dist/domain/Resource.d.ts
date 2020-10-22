import { IContext, IResource, IResourceDefinitionContentTypeSpecific, SupportedContentType } from '..';
export declare class Resource implements IResource {
    uuid: string;
    values: IResourceDefinitionContentTypeSpecific[];
    context: IContext;
    constructor(uuid: string, values: IResourceDefinitionContentTypeSpecific[], context: IContext);
    _getValueByContentType(contentType: SupportedContentType): string;
    _hasByContentType(contentType: SupportedContentType): boolean;
    _findByContentType(contentType: SupportedContentType): IResourceDefinitionContentTypeSpecific | undefined;
    getAudio(): string;
    getImage(): string;
    getText(): string;
    getVideo(): string;
    getCsv(): string;
    get(key: string): string;
    hasAudio(): boolean;
    hasImage(): boolean;
    hasText(): boolean;
    hasVideo(): boolean;
    hasCsv(): boolean;
    has(key: string): boolean;
}
//# sourceMappingURL=Resource.d.ts.map