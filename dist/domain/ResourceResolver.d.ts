import { IContext, IResourceWithContext, IResourceResolver } from '..';
export declare class ResourceResolver implements IResourceResolver {
    context: IContext;
    constructor(context: IContext);
    resolve(resourceId: string): IResourceWithContext;
}
//# sourceMappingURL=ResourceResolver.d.ts.map