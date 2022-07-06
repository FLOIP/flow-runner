import { IBlockConfig } from '../..';
export interface SetContactProperty {
    property_key: string;
    property_value: string;
}
export interface ISetContactPropertyBlockConfig extends IBlockConfig {
}
export interface ISetContactPropertyBlockConfigRequired extends ISetContactPropertyBlockConfig {
    set_contact_property: SetContactProperty[];
}
export declare function isSetContactPropertyConfig(thing: unknown): thing is ISetContactPropertyBlockConfigRequired;
export declare function isSetContactProperty(thing: unknown): thing is SetContactProperty;
//# sourceMappingURL=ISetContactPropertyBlockConfig.d.ts.map