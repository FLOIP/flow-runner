import { IBlockConfig } from '../..';
export interface SetContactProperty {
    property_key: string;
    property_value: string;
}
export interface ISetContactPropertyBlockConfig extends IBlockConfig {
    set_contact_property: SetContactProperty[];
}
export declare function isSetContactPropertyConfig(thing: unknown): thing is ISetContactPropertyBlockConfig;
export declare function isSetSingleContactProperty(thing: unknown): thing is SetContactProperty;
//# sourceMappingURL=ISetContactPropertyBlockConfig.d.ts.map