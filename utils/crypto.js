const crypto = require('crypto');
const crypto_algorithm = 'aes-256-ctr';
const crypto_password = 'crypt0-Passw0rd';

const encrypt = (text) => {
    const cipher = crypto.createCipher(crypto_algorithm, crypto_password);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

const decrypt = (text) => {
    const decipher = crypto.createDecipher(crypto_algorithm, crypto_password);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = {
    encrypt,
    decrypt,
};