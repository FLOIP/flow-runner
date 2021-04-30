import { IContext, IResource, IResourceValue } from '..';
export interface IResourceWithContext extends IResource {
    uuid: string;
    values: IResourceValue[];
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
    resolve(resourceId: string): IResourceWithContext;
}
export declare function createTextResourceVariantWith(value: string, ctx: IContext): IResourceValue;
export declare function getResource(context: IContext, resourceId: string): IResourceWithContext;
//# sourceMappingURL=IResourceResolver.d.ts.map