import IResourceResolver, { IResource, IResources } from './IResourceResolver';
import { SupportedMode } from '..';
export default class ResourceResolver implements IResourceResolver {
    resources: IResources;
    constructor(resources?: IResources);
    resolve(resourceId: string, modes: SupportedMode[], languageId: string): IResource;
}
//# sourceMappingURL=ResourceResolver.d.ts.map