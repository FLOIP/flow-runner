import { IContext, IResource, IResourceResolver } from '..';
export declare class ResourceResolver implements IResourceResolver {
    context: IContext;
    constructor(context: IContext);
    resolve(resourceId: string): IResource;
}
//# sourceMappingURL=ResourceResolver.d.ts.map