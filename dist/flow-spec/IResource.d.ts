import { SupportedMode } from '..';
export interface IResourceValue {
    language_id: string;
    content_type: string;
    mime_type?: string;
    modes: SupportedMode[];
    /**
     * @minLength 1
     * @format floip-expression
     */
    value: string;
}
export interface IResource {
    uuid: string;
    values: IResourceValue[];
}
export type IResources = IResource[];
//# sourceMappingURL=IResource.d.ts.map