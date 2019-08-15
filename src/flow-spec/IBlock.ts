// import UUID32 from "../model/UUID32";
import IBlockExit from './IBlockExit'
import {find} from 'lodash'
import ValidationException from '../domain/exceptions/ValidationException'

export default interface IBlock {
  uuid: string,// UUID32
  name: string,
  label?: string,
  semanticLabel?: string,
  type: string, // todo: dyamic enum based upon capabilities?
  config: object,
  exits: IBlockExit[],
}


export function findBlockExitWith(uuid: string, block: IBlock): IBlockExit {
  const exit = find(block.exits, {uuid})
  if (exit == null) {
    throw new ValidationException('Unable to find exit on block')
  }

  return exit
}