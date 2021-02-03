import {Contact} from '../../'
import {ContactGroup, Group} from '../../flow-spec/Group'

describe('Contact', () => {
  const contact = new Contact()

  beforeEach(() => {
    contact.groups = []
  })

  // since we can't do exact object matches between IGroup and IContactGroup,
  // we can just match the properties that they share
  const matchGroup = (group: Group): unknown => expect.arrayContaining<Group>([expect.objectContaining(group)])

  describe('group operations', () => {
    it('should add a group', () => {
      const group = new Group('someGroup')

      contact.addGroup(group)

      expect(contact.groups).toHaveLength(1)
      expect(contact.groups).toEqual(matchGroup(group))
    })

    it('should add a group atomically', () => {
      const group = new Group('someGroup')

      contact.addGroup(group)
      contact.addGroup(group)
      contact.addGroup(group)

      expect(contact.groups).toHaveLength(1)
      expect(contact.groups).toEqual(matchGroup(group))
    })

    it('should remove a group', () => {
      const group = new Group('someGroup')
      const group2 = new Group('someGroup2')
      contact.groups = [new ContactGroup(group), new ContactGroup(group2)]

      contact.delGroup(group)

      expect(contact.groups).toHaveLength(2)

      expect(contact.groups[0].deleted_at).not.toBeUndefined()
      expect(contact.groups[1].deleted_at).toBeUndefined()

      const deletedGroup = contact.groups.find(g => g.deleted_at != null)

      expect(deletedGroup).toMatchObject(group)
    })

    it('should remove a group atomically', () => {
      const group = new Group('someGroup')
      const group2 = new Group('someGroup2')
      contact.groups = [new ContactGroup(group), new ContactGroup(group2)]

      contact.delGroup(group)
      contact.delGroup(group)
      contact.delGroup(group)

      expect(contact.groups).toHaveLength(2)

      expect(contact.groups[0].deleted_at).not.toBeUndefined()
      expect(contact.groups[1].deleted_at).toBeUndefined()

      const deletedGroup = contact.groups.find(g => g.deleted_at != null)

      expect(deletedGroup).toMatchObject(group)
    })
  })
})
