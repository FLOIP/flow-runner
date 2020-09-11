import {isSetContactPropertyConfig} from '../..'

describe('IBlockConfig', () => {
  it('asserts the type of ISetContactPropertyBlockConfig', () => {
    const trueCase = {
      setContactProperty: {
        propertyKey: 'foo',
        propertyValue: 'bar',
      },
    }
    const falseCase = {}
    expect(isSetContactPropertyConfig(trueCase)).toBeTruthy()
    expect(isSetContactPropertyConfig(falseCase)).toBeFalsy()
  })
})
