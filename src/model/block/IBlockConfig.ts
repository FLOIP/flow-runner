export interface ISetContactPropertyBlockConfig {
  setContactProperty?: {
    propertyKey: string
    propertyValue: string
  }
}

export function isSetContactPropertyConfig(arg: unknown): arg is ISetContactPropertyBlockConfig {
  if (typeof arg === 'object' && arg !== null) {
    return (
      'setContactProperty' in arg &&
      typeof (arg as ISetContactPropertyBlockConfig).setContactProperty?.propertyKey === 'string' &&
      typeof (arg as ISetContactPropertyBlockConfig).setContactProperty?.propertyValue === 'string'
    )
  }
  return false
}
