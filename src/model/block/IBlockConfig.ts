export interface ISetContactPropertyBlockConfig {
  set_contact_property?: {
    property_key: string
    property_value: string
  }
}

export function isSetContactPropertyConfig(arg: unknown): arg is ISetContactPropertyBlockConfig {
  if (typeof arg === 'object' && arg !== null) {
    return (
      'set_contact_property' in arg &&
      typeof (arg as ISetContactPropertyBlockConfig).set_contact_property?.property_key === 'string' &&
      typeof (arg as ISetContactPropertyBlockConfig).set_contact_property?.property_value === 'string'
    )
  }
  return false
}
