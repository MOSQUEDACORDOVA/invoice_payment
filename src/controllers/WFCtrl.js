var http = require('https');
const fs = require("fs");
let file_N = __dirname + "/../config/client.crt";
let file_N2 = __dirname + "/../config/client.key";
var DataBaseSq = require("../models/dataSequelize"); // Functions for SQL querys with sequelize
const { encrypt, decrypt } = require("./crypto");//Encrypt / decrypt
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { v4: uuidv4 } = require('uuid');
  //API wells Fargo setting
  let uuid = uuidv4()
  var GATEWAYCOMPANYID = `2517282804`//'{your gateway company id}'
  var requestId = uuid //'{UUID that you generated to identify the request}'

module.exports = {
  /**THIS FUNCTION IS FOR SEND PAYMENT TO WELLS FARGO API */
   WF(totalAmountcard,apiKey,NamePayer_Bank,bank_id,bank_account_number,payment_id) {
    return new Promise(async (resolve, reject) => {
      let modeEnv = JSON.parse(await DataBaseSq.settingsTableTypeEnvProduction());
      let gateaway = JSON.parse(await DataBaseSq.settingsgateway());
      let hostLink = gateaway[4]['valueSett'];
      let bank_id_default = gateaway[5]['valueSett'];
      let bank_account_number_default = gateaway[6]['valueSett'];
    if (modeEnv.Status == 1) {
      console.log('production');
    let keyA =fs.readFileSync(file_N2, 'utf8', (error, data) => {
      if (error) throw error;
     return data;
    });
    let crt =fs.readFileSync(file_N,'utf8', (error, data) => {
      if (error) throw error;
     return data;
    });
          //SET HEADER
          keyA=decrypt(keyA)
          crt=decrypt(crt)
          console.log(hostLink)
          var options = {
            method: 'POST',
            hostname: hostLink,
            path: '/ach/v1/payments',
            key:keyA , 
            cert:crt ,
            headers: {
              'Authorization': 'Bearer ' + apiKey,
              'Content-Type': 'application/json',
              'request-id': requestId,
              'gateway-company-id': decrypt(gateaway[0]['valueSett']),
              'gateway-entity-id': decrypt(gateaway[1]['valueSett']),
              'Accept': '*/*', 
            }
          };
    }else{
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
    }
      
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
          'bank_id': `${decrypt(bank_id_default)}`,
          'bank_id_type': 'ABA',
          'bank_account_number': `${decrypt(bank_account_number_default)}`,
          'bank_account_type': 'D'
        }
      }
    });
    
    req2.write(payload);
    req2.end();
  })
  },
  /**THIS FUNCTION IS FOR GET DE APYKEY FROM WLLS FARGO API */
  APYKeyGet(hostLink){
    return new Promise(async (resolve, reject) => {
      let gateaway = JSON.parse(await DataBaseSq.settingsgateway());
      let hostLink = gateaway[4]['valueSett'];
    
    let modeEnv = JSON.parse(await DataBaseSq.settingsTableTypeEnvProduction())
    if (modeEnv.Status == 1) {
      console.log('production');      
      var CONSUMERKEY = decrypt(gateaway[2]['valueSett'])
    var CONSUMERSECRET = decrypt(gateaway[3]['valueSett'])
    var SCOPES = 'NA'
    
    //BUFFER AUTHORIZATION CODE
    var buffer = new Buffer.from(CONSUMERKEY + ':' + CONSUMERSECRET);
    var AUTHTOKEN = buffer.toString('base64');
    // let key = decrypt();
    // let ctr = decrypt();
          //SET HEADER
          let keyA =fs.readFileSync(file_N2, 'utf8', (error, data) => {
            if (error) throw error;
           return data;
          });
          let crt =fs.readFileSync(file_N,'utf8', (error, data) => {
            if (error) throw error;
           return data;
          });
          keyA=decrypt(keyA)
        crt=decrypt(crt)
        console.log(keyA)

    var options = {
      
      method: 'POST',
      hostname: hostLink,
      path: '/token?grant_type=client_credentials&scope=' + escape(SCOPES),
      key:keyA , 
      cert: crt,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + AUTHTOKEN,       

      }
    };
    }else{

      var CONSUMERKEY = 'vzpjBJ7h9xmhlz3QusKoTHlUoZT4PeLv'
    var CONSUMERSECRET = 'KgZlBlyxslPSD7Cc'
    var SCOPES = 'ACH-Payments ACH-Payments-Status'
    
    //BUFFER AUTHORIZATION CODE
    var buffer = new Buffer.from(CONSUMERKEY + ':' + CONSUMERSECRET);
    var AUTHTOKEN = buffer.toString('base64');

     var options = {
      method: 'POST',
      hostname: 'api-sandbox.wellsfargo.com',
      path: '/oauth2/v1/token?grant_type=client_credentials&scope=' + escape(SCOPES),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + AUTHTOKEN
      }
    }; 
    }

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
  },
  validateAPI(apiKey,hostLink){
    return new Promise(async (resolve, reject) => {      
    
    let modeEnv = JSON.parse(await DataBaseSq.settingsTableTypeEnvProduction())
    if (modeEnv.Status == 1) {
      console.log('production')
      let gateaway = JSON.parse(await DataBaseSq.settingsgateway())

    let keyA =fs.readFileSync(file_N2, 'utf8', (error, data) => {
      if (error) throw error;
     return data;
    });
    let crt =fs.readFileSync(file_N,'utf8', (error, data) => {
      if (error) throw error;
     return data;
    });
    keyA=decrypt(keyA)
    crt=decrypt(crt)
          //SET HEADER
          console.log(hostLink)
          var options = {
            method: 'GET',
            hostname: hostLink,
            path: '/utilities/v1/hello-wellsfargo',
            key:keyA , 
            cert:crt ,
            headers: {
              'Authorization': 'Bearer ' + apiKey,
              'Content-Type': 'application/json',
              'request-id': requestId,
              'gateway-company-id': decrypt(gateaway[0]['valueSett']),
              'gateway-entity-id':decrypt( gateaway[1]['valueSett']),
              'Accept': '*/*', 
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
    }else{

     return resolve ('Development Mode')
    }


  })
  },
    /**THIS FUNCTION IS FOR SEND PAYMENT TO WELLS FARGO API */
    WF_FraudProtection(totalAmountcard,apiKey,NamePayer_Bank,bank_id,bank_account_number,payment_id) {
      return new Promise(async (resolve, reject) => {
        let modeEnv = JSON.parse(await DataBaseSq.settingsTableTypeEnvProduction());
        let gateaway = JSON.parse(await DataBaseSq.settingsgateway());
        let hostLink = gateaway[4]['valueSett'];
        let bank_id_default = gateaway[5]['valueSett'];
        let bank_account_number_default = gateaway[6]['valueSett'];
      if (modeEnv.Status == 1) {
        console.log('production');
      let keyA =fs.readFileSync(file_N2, 'utf8', (error, data) => {
        if (error) throw error;
       return data;
      });
      let crt =fs.readFileSync(file_N,'utf8', (error, data) => {
        if (error) throw error;
       return data;
      });
            //SET HEADER
            keyA=decrypt(keyA)
            crt=decrypt(crt)
            console.log(hostLink)
            var options = {
              method: 'POST',
              hostname: hostLink,
              path: '/ach/v1/payments',
              key:keyA , 
              cert:crt ,
              headers: {
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json',
                'request-id': requestId,
                'gateway-company-id': decrypt(gateaway[0]['valueSett']),
                'gateway-entity-id': decrypt(gateaway[1]['valueSett']),
                'Accept': '*/*', 
              }
            };
      }else{
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
      }
        
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
     
      // THIS HAVE THE JSON WITH THE PAYMENT INFO FOR SEND TO WF API
      var payload = JSON.stringify({
        'payment_method': 'NURG',
        'payment_id': payment_id,
        'payment_amount': parseFloat(totalAmountcard),
        'debit_credit_indicator': 'C',
        'payment_format': 'WEB',
        'payment_description': 'Bank Account Verification Deposit',
        'payer': {
          'name': 'San Antonio Winery',
          'bank_information': {
            'bank_id': `${decrypt(bank_id_default)}`,
            'bank_id_type': 'ABA',
            'bank_account_number': `${decrypt(bank_account_number_default)}`,
            'bank_account_type': 'D'
          }
        },
        'payee': {
          'name': `${NamePayer_Bank}`,
          'bank_information': {
            'bank_id': `${bank_id}`,
            'bank_id_type': 'ABA',
            'bank_account_number': `${bank_account_number}`,
            'bank_account_type': 'D'
          }
        }
      });
      console.log("🚀 ~ file: WFCtrl.js ~ line 354 ~ returnnewPromise ~ payload", payload)
      
      req2.write(payload);
      req2.end();
    })
    },
    GetStatus(apikey, TransactionID){
      return new Promise(async (resolve, reject) => {            
      let modeEnv = JSON.parse(await DataBaseSq.settingsTableTypeEnvProduction())
      if (modeEnv.Status == 1) {
        console.log('GetStatus')
        let gateaway = JSON.parse(await DataBaseSq.settingsgateway())
        let hostLink = gateaway[4]['valueSett'];
      let keyA =fs.readFileSync(file_N2, 'utf8', (error, data) => {
        if (error) throw error;
       return data;
      });
      let crt =fs.readFileSync(file_N,'utf8', (error, data) => {
        if (error) throw error;
       return data;
      });
      keyA=decrypt(keyA)
      crt=decrypt(crt)
            //SET HEADER
            console.log(hostLink)
            var options = {
              method: 'GET',
              hostname: hostLink,
              path: '/ach/v1/payments/'+TransactionID,
              key:keyA , 
              cert:crt ,
              headers: {
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json',
                'request-id': requestId,
                'gateway-company-id': decrypt(gateaway[0]['valueSett']),
                'gateway-entity-id':decrypt( gateaway[1]['valueSett']),
                'Accept': '*/*', 
              }
            };
           
      }else{
          //SET HEADER
          console.log(TransactionID)
          TransactionID= '100000002'
          var options = {
            method: 'GET',
            hostname: 'api-sandbox.wellsfargo.com',
            path: '/ach/v1/payments/'+TransactionID,
            headers: {
              'Authorization': 'Bearer ' + apikey,
              'Content-Type': 'application/json',
              'request-id': requestId,
              'gateway-company-id': GATEWAYCOMPANYID,
              'Accept': '*/*'
            }
          };
      }
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
    },
}
