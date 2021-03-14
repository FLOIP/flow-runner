import { IFlow, IResource } from '..';
export interface IContainer {
    specification_version: string;
    uuid: string;
    name: string;
    description?: string;
    vendor_metadata?: object;
    flows: IFlow[];
    resources: IResource[];
}
//# sourceMappingURL=IContainer.d.ts.map