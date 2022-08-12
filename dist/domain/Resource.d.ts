/**
 * Flow Interoperability Project (flowinterop.org)
 * Flow Runner
 * Copyright (c) 2019, 2020 Viamo Inc.
 * Authored by: Brett Zabos (brett.zabos@viamo.io)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/
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
    /**
     * Convenience replacement for getData("text/csv").
     * This should be deprecated and replaced with getData() to stick to the spec and be simpler.
     * @returns equivalent of this.getData("text/csv")
     */
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