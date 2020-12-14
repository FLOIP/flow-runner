export interface SetContactProperty {
  property_key: string
  property_value: string
}
export interface ISetContactPropertyBlockConfig {
  set_contact_property?: SetContactProperty | SetContactProperty[]
}

export function isSetContactPropertyConfig(thing: unknown): thing is ISetContactPropertyBlockConfig {
  if (typeof thing === 'object' && thing !== null) {
    if ('set_contact_property' in thing) {
      const setContactProperty = (thing as ISetContactPropertyBlockConfig).set_contact_property
      if (Array.isArray(setContactProperty)) {
        return setContactProperty.every(isSetContactProperty)
      } else {
        return isSetContactProperty(setContactProperty)
      }
    }
  }
  return false
}

export function isSetContactProperty(thing: unknown): thing is SetContactProperty {
  if (typeof thing === 'object' && thing !== null) {
    return (
      'property_key' in thing &&
      'property_value' in thing &&
      typeof (thing as SetContactProperty).property_key === 'string' &&
      typeof (thing as SetContactProperty).property_value === 'string'
    )
  }
  return false
}
