const crypto = require('crypto')


module.exports = password => crypto.pbkdf2Sync(
    password, 'secret code', 100, 64, 'sha512') // takes a password and  calculate the hash
    .toString('hex');
