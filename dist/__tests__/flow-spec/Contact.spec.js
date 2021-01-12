"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
const Group_1 = require("../../flow-spec/Group");
describe('Contact', () => {
    const contact = new __1.Contact();
    beforeEach(() => {
        contact.groups = [];
    });
    const matchGroup = (group) => expect.arrayContaining([expect.objectContaining(group)]);
    describe('group operations', () => {
        it('should add a group', () => {
            const group = new Group_1.Group('someGroup');
            contact.addGroup(group);
            expect(contact.groups).toHaveLength(1);
            expect(contact.groups).toEqual(matchGroup(group));
        });
        it('should add a group atomically', () => {
            const group = new Group_1.Group('someGroup');
            contact.addGroup(group);
            contact.addGroup(group);
            contact.addGroup(group);
            expect(contact.groups).toHaveLength(1);
            expect(contact.groups).toEqual(matchGroup(group));
        });
        it('should remove a group', () => {
            const group = new Group_1.Group('someGroup');
            const group2 = new Group_1.Group('someGroup2');
            contact.groups = [new Group_1.ContactGroup(group), new Group_1.ContactGroup(group2)];
            contact.delGroup(group);
            expect(contact.groups).toHaveLength(2);
            expect(contact.groups[0].deletedAt).not.toBeUndefined();
            expect(contact.groups[1].deletedAt).toBeUndefined();
            const deletedGroup = contact.groups.find(g => g.deletedAt != null);
            expect(deletedGroup).toMatchObject(group);
        });
        it('should remove a group atomically', () => {
            const group = new Group_1.Group('someGroup');
            const group2 = new Group_1.Group('someGroup2');
            contact.groups = [new Group_1.ContactGroup(group), new Group_1.ContactGroup(group2)];
            contact.delGroup(group);
            contact.delGroup(group);
            contact.delGroup(group);
            expect(contact.groups).toHaveLength(2);
            expect(contact.groups[0].deletedAt).not.toBeUndefined();
            expect(contact.groups[1].deletedAt).toBeUndefined();
            const deletedGroup = contact.groups.find(g => g.deletedAt != null);
            expect(deletedGroup).toMatchObject(group);
        });
    });
});
//# sourceMappingURL=Contact.spec.js.map