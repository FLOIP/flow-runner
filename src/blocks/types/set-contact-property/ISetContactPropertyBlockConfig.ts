/* TODO: Why are these here? They are Viamo spec. If we can't make this feature without calling these, then maybe the block needs to be
    brought into Flow Spec? */
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
