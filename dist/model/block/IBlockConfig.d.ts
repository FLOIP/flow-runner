export interface IBlockConfig {
}
export interface SetContactProperty {
    property_key: string;
    property_value: string;
}
export interface ISetContactPropertyBlockConfig extends IBlockConfig {
    set_contact_property?: SetContactProperty | SetContactProperty[];
}
export declare function isSetContactPropertyConfig(thing: unknown): thing is ISetContactPropertyBlockConfig;
export declare function isSetContactProperty(thing: unknown): thing is SetContactProperty;
//# sourceMappingURL=IBlockConfig.d.ts.map