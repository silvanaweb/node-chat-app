const expect = require('expect');

const {Users} = require('./users');

describe ('Users', () => {

    beforeEach ( () => {
        users = new Users();
        users.users = [
            {
                id: "1",
                name: "mike",
                room: "Node Course"
            },
            {
                id: "2",
                name: "joy",
                room: "React Course"
            },
            {
                id: "3",
                name: "lala",
                room: "Node Course"
            }
        ]
    });
    it('Should add user', () => {
        var testusers = new Users();
        var user = {
            id: '123',
            name: "James",
            room: "box"
        };
        testusers.addUser(user.id, user.name, user.room);
        expect(testusers.users).toEqual([user]);

    });
    it('Should return names of users for node course', () => {
        var userList = users.getUserList('Node Course');
        expect(userList).toEqual(['mike', 'lala']);
    });
    it('Should return names of users for react course', () => {
        var userList = users.getUserList('React Course');
        expect(userList).toEqual(['joy']);
    });
    it('Should return user lala', () => {
        var user = users.getUser('3');
        expect(user.id).toEqual('3');
    });
    it('Should return not user', () => {
        var user = users.getUser('4');
        expect(user).toNotExist() ;
    });
    it('Should remove a user', () => {
        var user = users.removeUser('3');
        expect(user.id).toEqual('3');
        expect(users.users.length).toBe(2);
    });
    it('Should NOT remove a user', () => {
        var user = users.removeUser('4');
        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });
});