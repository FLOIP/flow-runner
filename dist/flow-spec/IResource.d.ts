import { SupportedMode } from '..';
export interface IResourceValue {
    language_id: string;
    content_type: string;
    mime_type?: string;
    modes: SupportedMode[];
    value: string;
}
export interface IResource {
    uuid: string;
    values: IResourceValue[];
}
export declare type IResources = IResource[];
//# sourceMappingURL=IResource.d.ts.map