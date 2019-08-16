export default class BlockType {
  static CORE_LOG = new BlockType('Core\\Log')
  static CORE_CASE = new BlockType('Core\\Case')
  static CORE_RUN_FLOW = new BlockType('Core\\Run\\Flow')
  static CORE_OUTPUT = new BlockType('Core\\Output')
  static CONSOLE_IO_PRINT = new BlockType('ConsoleIo\\Print')
  static CONSOLE_IO_READ = new BlockType('ConsoleIo\\Read')
  static MOBILE_PRIMITIVES_MESSAGE = new BlockType('MobilePrimitives\\Message')
  static MOBILE_PRIMITIVES_SELECT_ONE_RESPONSE = new BlockType('MobilePrimitives\\SelectOneResponse')
  static MOBILE_PRIMITIVES_NUMERIC_RESPONSE = new BlockType('MobilePrimitives\\NumericResponse')
  static MOBILE_PRIMITIVES_OPEN_RESPONSE = new BlockType('MobilePrimitives\\OpenResponse')
  static SMART_DEVICES_LOCATION_RESPONSE = new BlockType('SmartDevices\\LocationResponse')
  static SMART_DEVICES_PHOTO_RESPONSE = new BlockType('SmartDevices\\PhotoResponse')

  static BLOCK_TYPES: BlockType[] = []

  namespace: string

  constructor(namespace: string) {
    this.namespace = namespace
    BlockType.BLOCK_TYPES.push(this)
  }

  static valueOf(name: string): BlockType | null {
    return BlockType.BLOCK_TYPES.filter(value => value.namespace == name)[0]
  }
}