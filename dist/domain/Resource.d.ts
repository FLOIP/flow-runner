import { IContext, IResourceWithContext, IResourceValue, SupportedContentType } from '..';
export declare class Resource implements IResourceWithContext {
    uuid: string;
    values: IResourceValue[];
    context: IContext;
    constructor(uuid: string, values: IResourceValue[], context: IContext);
    _getValueByContentType(contentType: SupportedContentType): string;
    _getValueByContentAndMimeType(contentType: SupportedContentType, mimeType: string): string;
    _hasByContentType(contentType: SupportedContentType): boolean;
    _hasByContentAndMimeType(contentType: SupportedContentType, mimeType: string): boolean;
    _findByContentType(contentType: SupportedContentType): IResourceValue | undefined;
    _findByContentAndMimeType(contentType: SupportedContentType, mimeType: string): IResourceValue | undefined;
    getAudio(): string;
    getImage(): string;
    getText(): string;
    getVideo(): string;
    getCsv(): string;
    getData(mimeType: string): string;
    get(key: SupportedContentType): string;
    hasAudio(): boolean;
    hasImage(): boolean;
    hasText(): boolean;
    hasVideo(): boolean;
    hasCsv(): boolean;
    hasData(mimeType: string): boolean;
    has(key: SupportedContentType): boolean;
}
//# sourceMappingURL=Resource.d.ts.map