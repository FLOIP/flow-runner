// import UUID32 from "../model/UUID32";
import IBlock from './IBlock'
import {find} from 'lodash'
import ValidationException from '../domain/exceptions/ValidationException'
import SupportedMode from './SupportedMode'

export default interface IFlow {
  uuid: string // UUID32
  name: string
  label?: string
  lastModified: string // UTC like: 2016-12-25 13:42:05.234598
  interactionTimeout: number
  platformMetadata: object

  supportedModes: SupportedMode[]
  languages: string[] // eunm for ISO 639-3 codes
  blocks: IBlock[]

  firstBlockId: string
  exitBlockId?: string
}

export function findBlockWith(uuid: string, {blocks}: IFlow): IBlock {
  const block = find(blocks, {uuid})
  if (block == null) {
    throw new ValidationException('Unable to find block on flow')
  }

  return block
}