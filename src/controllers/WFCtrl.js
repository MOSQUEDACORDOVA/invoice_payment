var http = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { v4: uuidv4 } = require('uuid');
  //API wells Fargo setting
  let uuid = uuidv4()
  var GATEWAYCOMPANYID = `2517282804`//'{your gateway company id}'
  var requestId = uuid //'{UUID that you generated to identify the request}'

module.exports = {
  /**THIS FUNCTION IS FOR SEND PAYMENT TO WELLS FARGO API */
   WF(totalAmountcard,apiKey,NamePayer_Bank,bank_id,bank_account_number) {
    return new Promise((resolve, reject) => {
      //SET HEADER
    var options = {
      method: 'POST',
      hostname: 'api-sandbox.wellsfargo.com',
      path: '/ach/v1/payments',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'request-id': requestId,
        'gateway-company-id': GATEWAYCOMPANYID,
        'Accept': '*/*'
      }
    };
    var req2 = http.request(options, function (res2) {
      var chunks = [];
      res2.on('data', function (chunk) {    
        chunks.push(chunk);
      });
    
      res2.on('end', function () {    
        var body = new Buffer.concat(chunks);
                   
        if (body.toString().length > 0) {
          let errors = JSON.parse(body.toString())
          resolve(errors) //RETURN ERROR
        } else {
          resolve(res2.headers) //RETURN HEADER FOR GET DE RESPONSE AND PAYMENT-ID
        }
        
      });
    });
    //CREATE THE PAYMENT ID
    let payment_id = 'POAR123456'
    // THIS HAVE THE JSON WITH THE PAYMENT INFO FOR SEND TO WF API
    var payload = JSON.stringify({
      'payment_method': 'NURG',
      'payment_id': payment_id,
      'payment_amount': parseFloat(totalAmountcard),
      'debit_credit_indicator': 'D',
      'payment_format': 'WEB',
      'payment_description': 'Payment from San Antonio Payment Portal',
      'payer': {
        'name': `${NamePayer_Bank}`,
        'bank_information': {
          'bank_id': `${bank_id}`,
          'bank_id_type': 'ABA',
          'bank_account_number': `${bank_account_number}`,
          'bank_account_type': 'D'
        }
      },
      'payee': {
        'name': 'San Antonio Winery',
        'bank_information': {
          'bank_id': '121042882',
          'bank_id_type': 'ABA',
          'bank_account_number': '12312312345',
          'bank_account_type': 'D'
        }
      }
    });
    
    req2.write(payload);
    req2.end();
  })
  },
  /**THIS FUNCTION IS FOR GET DE APYKEY FROM WLLS FARGO API */
  APYKeyGet(){
    return new Promise((resolve, reject) => {
    var CONSUMERKEY = 'vzpjBJ7h9xmhlz3QusKoTHlUoZT4PeLv'
    var CONSUMERSECRET = 'KgZlBlyxslPSD7Cc'
    var SCOPES = 'ACH-Payments ACH-Payments-Status'
    
    //BUFFER AUTHORIZATION CODE
    var buffer = new Buffer.from(CONSUMERKEY + ':' + CONSUMERSECRET);
    var AUTHTOKEN = buffer.toString('base64');

    //SET HEADER
    var options = {
      method: 'POST',
      hostname: 'api-sandbox.wellsfargo.com',
      path: '/oauth2/v1/token?grant_type=client_credentials&scope=' + escape(SCOPES),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + AUTHTOKEN
      }
    };

    var reqAPIKey = http.request(options, function (resAPIKey) {
      var chunks = [];    
      resAPIKey.on('data', function (chunk) {
        chunks.push(chunk);
      });
    
      resAPIKey.on('end', function () {
        var body = Buffer.concat(chunks);
        var response = JSON.parse(body);
        resolve (response)//Return the body from response
      });
    });
    
    reqAPIKey.end();
  })
  }
}
