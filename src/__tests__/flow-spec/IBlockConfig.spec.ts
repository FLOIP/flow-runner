import {isSetContactPropertyConfig} from '../../model/block/ISetContactPropertyBlockConfig'

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
})
