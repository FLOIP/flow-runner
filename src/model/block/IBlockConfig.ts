import {SetContactProperty} from '../..'

/**
 * All blocks have a standard capability to specify how a contact property should be updated.
 * This update shall happen immediately prior to following the exit node out of the block.
 * This is specified via the optional set_contact_property object within the Block config
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IBlockConfig extends Record<string, any> {
  set_contact_property?: SetContactProperty
}
