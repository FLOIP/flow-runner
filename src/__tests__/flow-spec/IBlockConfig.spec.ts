import {isSetContactPropertyConfig} from '../../model/block/IBlockConfig'

describe('IBlockConfig', () => {
  it('asserts the type of ISetContactPropertyBlockConfig', () => {
    const trueCase = {
      set_contact_property: {
        property_key: 'foo',
        property_value: 'bar',
      },
    }
    const falseCase = {}
    expect(isSetContactPropertyConfig(trueCase)).toBeTruthy()
    expect(isSetContactPropertyConfig(falseCase)).toBeFalsy()
  })

  it('asserts the type of ISetContactPropertyBlockConfig with array', () => {
    const trueCase = {
      set_contact_property: [
        {
          property_key: 'foo',
          property_value: 'bar',
        },
        {
          property_key: 'baz',
          property_value: 'qux',
        },
      ],
    }
    const falseCase = {
      set_contact_property: [
        {
          property_key: 'foo',
          property_value: 'bar',
        },
        {}, // this is invalid
      ],
    }
    expect(isSetContactPropertyConfig(trueCase)).toBeTruthy()
    expect(isSetContactPropertyConfig(falseCase)).toBeFalsy()
  })
})
