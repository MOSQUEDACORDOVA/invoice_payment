/** This scrypt is for encrypt and decrypt */
/** Use the algorithm AES 256-CBC */
const crypto = require('crypto');
var CryptoJS = require("crypto-js");
const algorithm = 'aes-256-cbc';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv =Buffer.from('ivString'); //crypto.randomBytes(16);

const encrypt = (text) => {
  var encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
  return encrypted;
};

const decrypt = (hash) => {
  var decrypted = CryptoJS.AES.decrypt(hash, secretKey);
  var originalText = decrypted.toString(CryptoJS.enc.Utf8);
   return originalText;
};

module.exports = {
    encrypt,
    decrypt
};