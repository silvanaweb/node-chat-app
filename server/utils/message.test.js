var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('it should generate correct message', () => {
        let msg = {
            from: "Me",
            text: "test"
        };
        let res = generateMessage(msg.from, msg.text);

        expect(res.createdAt).toBeA('number');
        expect(res).toInclude(msg);

    });
});
describe('generateLocationMessage', () => {
    it('it should generate correct location message', () => {
        let msg = {
            from: "Me",
            latitude: 1, longitude: 1
        };
        let res = generateLocationMessage(msg.from, msg.latitude, msg.longitude);

        expect(res.createdAt).toBeA('number');
        expect(res.from).toBe(msg.from);
        expect(res.url).toBe("https://www.google.com/maps?q=1,1");

    });
});