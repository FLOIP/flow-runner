import IResourceResolver, { IResource } from './IResourceResolver';
import IContext from '../flow-spec/IContext';
export declare class ResourceResolver implements IResourceResolver {
    context: IContext;
    constructor(context: IContext);
    resolve(resourceId: string): IResource;
}
export default ResourceResolver;
//# sourceMappingURL=ResourceResolver.d.ts.map