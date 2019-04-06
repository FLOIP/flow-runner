import {FlowRunner} from '../src/index';

describe('FlowRunner', () => {
  describe('run', () => {
      it('should return a promise', () => {
          expect(FlowRunner.run()).toBeInstanceOf(Promise);
      })
  })
})
