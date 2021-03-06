import {camelCase, includes, isArray, isObject, reduce} from 'lodash'

export const EXCLUDED_DATA_HIERARCHIES_BY_KEY = ['choices', 'vendorMetadata', 'vendor_metadata']

export function convertKeysToCamelCase(x: any, exclusions = EXCLUDED_DATA_HIERARCHIES_BY_KEY): any {
  if (isArray(x)) {
    return x.map(_ => convertKeysToCamelCase(_, exclusions))
  }

  if (!isObject(x)) {
    return x
  }

  return reduce(
    x,
    (memo: any, value: any, key: string) => {
      memo[includes(exclusions, key) ? key : camelCase(key)] = convertKeysToCamelCase(value, exclusions)

      return memo
    },
    {}
  )
}
