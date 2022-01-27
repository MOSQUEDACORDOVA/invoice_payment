const crypto = require('crypto');
var CryptoJS = require("crypto-js");
const algorithm = 'aes-256-cbc';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv =Buffer.from('ivString'); //crypto.randomBytes(16);

const encrypt = (text) => {

  //  let cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  //  let encrypted = cipher.update(text, "utf-8", "hex");
  //  //encrypted = Buffer.concat([encrypted, cipher.final()]);
  //  encrypted += cipher.final("hex");
  //  return encrypted;
  var encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
  return encrypted;
};

const decrypt = (hash) => {

  //  let encryptedText = Buffer.from(hash, 'hex');
  //  let decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  //  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  //  //decrypted = Buffer.concat([decrypted, decipher.final()]);
  //  decrypted += decipher.final("utf8");

  var decrypted = CryptoJS.AES.decrypt(hash, secretKey);
  var originalText = decrypted.toString(CryptoJS.enc.Utf8);
   return originalText;
};

module.exports = {
    encrypt,
    decrypt
};