export interface ISetContactPropertyBlockConfig {
  setContactProperty?: {
    propertyKey: string
    propertyValue: string
  }
}

export function isSetContactPropertyConfig(arg: any): arg is ISetContactPropertyBlockConfig {
  return (
    typeof arg === 'object' &&
    typeof arg.setContactProperty === 'object' &&
    typeof arg.setContactProperty.propertyKey !== 'undefined' &&
    typeof arg.setContactProperty.propertyValue !== 'undefined'
  )
}
