import {Contact} from '../../'
import {Group} from '../../flow-spec/Group'

describe('Contact', () => {
  const contact = new Contact()

  beforeEach(() => {
    contact.groups = []
  })

  describe('addGroup', () => {
    it('should add a group', () => {
      const group = new Group('someGroup')

      contact.addGroup(group)

      expect(contact.groups).toContainEqual(group)
    })

    it('should add a group atomically', () => {
      const group = new Group('someGroup')

      contact.addGroup(group)
      contact.addGroup(group)
      contact.addGroup(group)

      expect(contact.groups).toHaveLength(1)
    })

    it('should remove a group', () => {
      const group = new Group('someGroup')
      const group2 = new Group('someGroup2')
      contact.groups = [group, group2]

      contact.delGroup(group)

      expect(contact.groups).toHaveLength(1)
      expect(contact.groups).toContainEqual(group2)
    })

    it('should remove a group atomically', () => {
      const group = new Group('someGroup')
      const group2 = new Group('someGroup2')
      contact.groups = [group, group2]

      contact.delGroup(group)
      contact.delGroup(group)
      contact.delGroup(group)

      expect(contact.groups).toHaveLength(1)
      expect(contact.groups).toContainEqual(group2)
    })
  })
})
