import IResourceResolver, { IResource, IResourceDefinitionContentTypeSpecific, IResources } from './IResourceResolver';
import { SupportedMode } from '..';
export default class ResourceResolver implements IResourceResolver {
    modes: SupportedMode[];
    languageId: string;
    resourceDefinitions: IResources;
    constructor(modes: SupportedMode[], languageId: string, resourceDefinitions?: IResources);
    resolve(resourceId: string): IResource;
    createTextResourceVariantWith(value: string): IResourceDefinitionContentTypeSpecific;
}
//# sourceMappingURL=ResourceResolver.d.ts.map