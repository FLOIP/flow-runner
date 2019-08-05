// import {read} from 'yaml-import'
// import IDataset from "../IDataset";


describe('FlowRunner/stepInto', () => {
  // let dataset: IDataset

  beforeEach(() => {
    // dataset = read('__tests__/dataset.yml')
  })

  it.todo('should raise when block type is not RunFlow')
  it.todo('should raise when last interaction doesn\'t match provided blockId -- aka only allow step ins during active interaction')
  it.todo('should push run flow interaction onto nest flow block intx stack')

  describe('returned block', () => {
    it.todo('should return null when first block absent on freshly nested flow')
    it.todo('should return first block when first block present on freshly nested flow')
  })

  it.todo('should generate an additional exit to tie run flow block definition to its nested flow')
  it.todo('should tie intx associated with provided run flow block to newly generated exit')
})
