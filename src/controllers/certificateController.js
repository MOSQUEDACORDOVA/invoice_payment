const fs = require("fs");
const path = require("path");
var moment = require("moment-timezone");
var DataBaseSq = require("../models/dataSequelize"); // Functions for SQL querys with sequelize
const { encrypt, decrypt } = require("./crypto");//Encrypt / decrypt

var http = require('https');

const WFCCtrl = require('./WFCtrl')
require('dotenv').config()

/**START FUNCTIONS FOR PAGES */

/**FUNCTION TO RENDER CONTACT US PAGE */
exports.saveCert = async (req, res) => {
  console.log(req.body);
const {clientctr, key} = req.body
  let file_N = __dirname + "/../config/client.crt";
  let file_N2 = __dirname + "/../config/client.key";

  let save0 = encrypt(clientctr)
  , save1 = encrypt(key);

 fs.writeFileSync (file_N, save0, (err) => {
    // throws an error, you could also catch it here
    if (err){
      return res.send({"Error file0": err})
    } 
   
});
fs.writeFileSync (file_N2, save1, (err) => {
  // throws an error, you could also catch it here
  if (err){
return res.send({"Error file1": err});
  } 
});
return res.sendStatus(200)

};


/**FUNCTION TO RENDER OPEN INVOICES PAGE */
exports.testValidate = async (req, res) => {
  console.log(req.body)
const hostLink = req.body.hostLink;
let apikey;
let modeEnv = JSON.parse(await DataBaseSq.settingsTableTypeEnvProduction())
if (req.cookies.wf && modeEnv.Status == 1) {
  apikey = req.cookies.wf
}else{
  let WF_APIKey = JSON.parse(await WFCCtrl.APYKeyGet(hostLink).then((response) => {
    return JSON.stringify(response)
  }));
  apikey=WF_APIKey['access_token'];
  if (modeEnv.Status == 1) {
    res.cookie('wf' , WF_APIKey['access_token'], {maxAge : WF_APIKey['expires_in']});
  }  
} 
console.log(apikey)

let validate = JSON.parse(await WFCCtrl.validateAPI(apikey,hostLink).then((response) => {
    return JSON.stringify(response)
  }))
  console.log(validate)
  res.send({validate})
};
