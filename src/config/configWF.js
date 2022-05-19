// config.js
const dotenv = require('dotenv').config();

module.exports = {

  NODE_ENV: process.env.NODE_ENV || 'development',
  CONSUMERKEY: process.env.CONSUMERKEY || 'vzpjBJ7h9xmhlz3QusKoTHlUoZT4PeLv',
  CONSUMERSECRET: process.env.CONSUMERSECRET || 'KgZlBlyxslPSD7Cc',
  HOST: process.env.HOST || 'api-sandbox.wellsfargo.com'
}


