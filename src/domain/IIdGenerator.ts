/**
 * Interface for a class that can generate unique IDs. The [[FlowRunner]] needs to generate unique IDs internally, but different projects may have different standards/requirements for ID formats. An implementation of IIdGenerator must be injected into the FlowRunner, which it will use to generate IDs when needed. For a reference version, see [[IdGeneratorUuidV4]].
 */
export default interface IIdGenerator {
	generate() : string
}
