import {camelCase, includes, isArray, isObject, reduce} from 'lodash'

export const DEFAULT_EXCLUSIONS = ['choices', 'platformMetadata', 'platform_metadata']

export default function convertKeysToCamelCase(x: any, exclusions = DEFAULT_EXCLUSIONS): any {
  if (isArray(x)) {
    return x.map(_ => convertKeysToCamelCase(_, exclusions))
  }

  if (!isObject(x)) {
    return x
  }

  return reduce(x, (memo: any, value: any, key: string) => {
    memo[includes(exclusions, key) ? key : camelCase(key)] =
      convertKeysToCamelCase(value, exclusions)

    return memo
  }, {})
}
