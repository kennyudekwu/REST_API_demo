const {User}  = require('../../../models/users')
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

// Jwt generator function should return something (mock jwt token)
describe('jwt token generator test', () => {
    it('should return jwt token when called', () => {
        // To prevent '_id' from taking new values when called, we store the current and only value
        // in payload as a property and then create the user object with this payload
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true}
        const user = new User(payload);
        const token = user.generateAuthToken();

        // The private key used here is a fake one for testing purposes stored in the
        // test.json file. In order words, there is a dummy config environment designed
        // specifically for testing

        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload);
    });
});


