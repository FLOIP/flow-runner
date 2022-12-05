import {IBlock, ISetContactPropertyBlockConfig} from '../..'

export const SET_CONTACT_PROPERTY_BLOCK_TYPE = 'Core.SetContactProperty'

export interface ISetContactPropertyBlock extends IBlock<ISetContactPropertyBlockConfig> {
  type: typeof SET_CONTACT_PROPERTY_BLOCK_TYPE
}
