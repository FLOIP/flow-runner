import IContact from "../../src/flow-spec/IContact"
import SetContactPropertyBlockRunner from "../../src/domain/runners/SetContactPropertyBlockRunner"
import ISetContactPropertyBlock from "../../src/model/block/ISetContactPropertyBlock"
import ISetContactPropertyBlockConfig from "../../src/model/block/ISetContactPropertyBlockConfig"
import IBlockExit from "../../src/flow-spec/IBlockExit"
import IContext from "../../src/flow-spec/IContext"

describe('SetContactPropertyBlockRunner', () => {
	describe('run', () => {
		it('should return the first block exit', () => {
			const contact: IContact = {
				id: '123'
			}
			const blockConfig: ISetContactPropertyBlockConfig = {
				propertyName: 'foo',
				propertyValue: 'bar'
			}
			const mockExit = {} as IBlockExit
	
			const mockBlock = {
				exits: [mockExit],
				config: blockConfig
			} as ISetContactPropertyBlock
	
			const mockContext = {
				contact
			} as IContext

			const runner = new SetContactPropertyBlockRunner(mockBlock, mockContext)

			const result = runner.run()

			expect(result).toBe(mockExit)
		})

		it('should set a property in the contact', () => {
			const contact: IContact = {
				id: '123'
			}
			const blockConfig: ISetContactPropertyBlockConfig = {
				propertyName: 'foo',
				propertyValue: 'bar'
			}
			const mockExit = {} as IBlockExit
	
			const mockBlock = {
				exits: [mockExit],
				config: blockConfig
			} as ISetContactPropertyBlock
	
			const mockContext = {
				contact
			} as IContext

			const runner = new SetContactPropertyBlockRunner(mockBlock, mockContext)

			runner.run()

			expect(contact['foo']).toBe('bar')
		})
	})
})
