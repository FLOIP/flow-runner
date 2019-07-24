// import UUID32 from "../model/UUID32";
import IBlockExit from "./IBlockExit";

export default interface IBlock {
  uuid: string//UUID32
  name: string
  label?: string
  semantic_label?: string
  type: string // todo: dyamic enum based upon capabilities?
  config: object
  exits: IBlockExit[]
}
