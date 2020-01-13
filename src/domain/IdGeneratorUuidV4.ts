import IIdGenerator from './IIdGenerator'
import uuid from 'uuid'

/**
 * Implementation of [[IIdGenerator]] that generates UUIDv4-format IDs.
 */
export class IdGeneratorUuidV4 implements IIdGenerator {
  generate() : string {
    return uuid.v4();
  }
  constructor() { }
}

export default IdGeneratorUuidV4