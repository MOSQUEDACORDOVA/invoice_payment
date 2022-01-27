const fs = require("fs");
const path = require("path");
const request = require("request-promise");
const URI = 'https://sawoffice.technolify.com:8443/api1/x3/erp/SAWTEST1/'
var moment = require('moment-timezone');
var DataBasequerys = require('../models/data')
const { encrypt, decrypt } = require('./crypto');
var pdf = require('html-pdf');
const xml2js = require('xml2js');

//payment proccess
var cybersourceRestApi = require('cybersource-rest-client');
var configuration = require('./ConfigurationPayment');
const { parse } = require("path");


exports.dashboard = async (req, res) => {

  const user = res.locals.user['$resources'][0];
  const pictureProfile = res.locals.user['$resources'][1]['pic']
  const SessionKeyLog = req.session.SessionLog
  var ip = req.connection.remoteAddress;
  let query_consulting = "&where=EMAIL eq '" + req.params.email + "'"
  let where_filter_inv = "", count = 0
  let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Preparing openInv list", Status = 1, Comment = "Starting- line 20-";
  var SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
  if (user['ROLE'] == 4) {
    count = 100
  } else {
    count = 1000
    
    const maping_login = JSON.parse(await request({
      uri: URI + 'YPORTALBPS?representation=YPORTALBPS.$query&count=1000' + query_consulting,
      method: 'GET',
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
      },
      json: true, // Para que lo decodifique automáticamente 
    }).then(async map_loggin => { //Get the mapping loggin

     Description = "Request map_loggin  from X3 succes", Status = 1, Comment = "Not comments";
     SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
      return JSON.stringify(map_loggin)

    }))

    where_filter_inv = "&where=BPCINV eq '" + maping_login['$resources'][0]['BPCNUM'] + "' "

    for (let i = 1; i < maping_login['$resources'].length; i++) {
      where_filter_inv += "or BPCINV eq '" + maping_login['$resources'][i]['BPCNUM'] + "' "
    }
  }
  Description = "Request Open invoices list from X3", Status = 1, Comment = "Not comments";
 SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
  request({
    uri: URI + 'YPORTALINV?representation=YPORTALINVO.$query&count=' + count + " " + where_filter_inv,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(async inv_wofilter => {// GET INVOICES
    let inv_filtering = JSON.stringify(inv_wofilter['$resources'])
    inv_wofilter = inv_wofilter['$resources']
    Description = "Open Invoices list success to X3", Status = 1, Comment = "Loading Page";
    SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
    //HERE RENDER PAGE AND INTRO INFO
  
    res.render("open_invoices", {
      pageName: "Open Invoices",
      dashboardPage: true,
      menu: true,
      invoiceO: true,
      user,
      inv_wofilter, inv_filtering,
      pictureProfile
    });


  });

};

exports.close_invoices = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  const pictureProfile = res.locals.user['$resources'][1]['pic']

  const SessionKeyLog = req.session.SessionLog
  var ip = req.connection.remoteAddress;
  console.log(user)
  let query_consulting = "&where=EMAIL eq '" + req.params.email + "'"
  let where_filter_inv = "", count = 0

  if (user['ROLE'] == 3 || user['ROLE'] == 4) {
    count = 100
  } else {
    count = 1000
    const maping_login = JSON.parse(await request({
      uri: URI + `YPORTALBPS?representation=YPORTALBPS.$query&count=10000` + query_consulting,
      method: 'GET',
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
      },
      json: true, // Para que lo decodifique automáticamente 
    }).then(map_loggin => { //Get the mapping loggin
      return JSON.stringify(map_loggin)
    }))

    where_filter_inv = "&where=BPCINV eq '" + maping_login['$resources'][0]['BPCNUM'] + "' "
    for (let i = 1; i < maping_login['$resources'].length; i++) {
      where_filter_inv += "or BPCINV eq '" + maping_login['$resources'][i]['BPCNUM'] + "' "
    }
  }
  let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Request Closed invoices list from X3", Status = 1, Comment = "Not comments";
  var SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
  request({
    uri: URI + 'YPORTALINV?representation=YPORTALINVC.$query&count=' + count + " " + where_filter_inv,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(async inv_wofilter => {// GET INVOICES
    let inv_filtering = JSON.stringify(inv_wofilter['$resources'])
    inv_wofilter = inv_wofilter['$resources']
    Description = "Closed invoices list success from X3", Status = 1, Comment = "Loading Page";
    SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
    //HERE RENDER PAGE AND INTRO INFO
    res.render("close_invoices", {
      pageName: "Closed Invoices",
      dashboardPage: true,
      menu: true,
      invoiceC: true,
      user,
      inv_wofilter, inv_filtering,pictureProfile
    });


  });

};

exports.inoviceO_detail = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  const pictureProfile = res.locals.user['$resources'][1]['pic']
  const SessionKeyLog = req.session.SessionLog
  var ip = req.connection.remoteAddress;
  console.log(user)
  let inv_num = req.params.inv_num
  let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Request Open invoice details from X3", Status = 1, Comment = "Not comments";
  var SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
  request({
    uri: URI + `YPORTALINVD('${inv_num}')?representation=YPORTALINVD.$details`,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(async inv_detail => {// GET INVOICES
    Description = "Open Invoice details success from X3", Status = 1, Comment = "Loading Page";
    SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
    //HERE RENDER PAGE AND INTRO INFO
    res.render("detail_invoice", {
      pageName: "Details " + inv_num,
      dashboardPage: true,
      menu: true,
      invoiceO: true,
      user, inv_detail,pictureProfile
    });


  });

};
exports.inoviceC_detail = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  const pictureProfile = res.locals.user['$resources'][1]['pic']
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  console.log(user)
  let inv_num = req.params.inv_num
  let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Request closed invoice details from X3", Status = 1, Comment = "Not comments";
  var SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
  request({
    uri: URI + `YPORTALINVD('${inv_num}')?representation=YPORTALINVD.$details`,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(async inv_detail => {// GET INVOICES
    console.log(inv_detail)
    Description = "Closed Invoice Details success from X3", Status = 1, Comment = "Loading Page";
    SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
    //HERE RENDER PAGE AND INTRO INFO
    res.render("detail_invoice", {
      pageName: "Details " + inv_num,
      dashboardPage: true,
      menu: true,
      invoiceC: true,
      user, inv_detail,pictureProfile
    });


  });

};

exports.pay_methods = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  const pictureProfile = res.locals.user['$resources'][1]['pic']
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  console.log(user)
  let query_consulting = "&where=EMAIL eq '" + req.params.email + "'"
  let count = 1000
  let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Request payments methods from X3", Status = 1, Comment = "Not comments";
  var SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
  request({
    uri: URI + 'YPORTALPAY?representation=YPORTALPAY.$query&count=' + count + " " + query_consulting,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(async pay_methods => {// GET 
    Description = "Payments methods list from X3 success", Status = 1, Comment = "Loading page";
    var SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
    pay_methods = pay_methods['$resources']
    console.log(pay_methods)

    //HERE RENDER PAGE AND INTRO INFO
    res.render("payments_methods", {
      pageName: "Payments Methods",
      dashboardPage: true,
      menu: true,
      pay_methods: true,
      user,
      pay_methods,pictureProfile
    });


  });

};
exports.add_pay_methods = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  const pictureProfile = res.locals.user['$resources'][1]['pic']
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  var { cardNumber, cardName, addCardExpiryDate, cvv, addressCard, zipCode, totalAmountcard, state, city } = req.body
  //console.log(user)
  let query_consulting = "&where=EMAIL eq '" + user.EMAIL + "'"
  let count = 1000
  let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 9, SessionKey = SessionKeyLog, Description = "Loading Add payments methods module to X3", Status = 1, Comment = "Preparing for add payments methods";
  var SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
  cardNumber = encrypt(cardNumber);
  cvv = encrypt(cvv);
  addCardExpiryDate = encrypt(addCardExpiryDate);
  zipCode = encrypt(zipCode);
  cardName = encrypt(cardName);
  console.log(cardNumber)

  const payIDs = JSON.parse(await request({
    uri: URI + 'YPORTALPAY?representation=YPORTALPAY.$query&count=' + count + " " + query_consulting,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(async list_pays => { //Get the mapping loggin
    console.log('---------------------')
    console.log(list_pays)
    Description = "Getting payments methods from X3 to created PAYID", Status = 1, Comment = "Get Success";
    SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)

    return JSON.stringify(list_pays)
  }))
  let IDPay = 0
  for (let i = 0; i < payIDs['$resources'].length; i++) {
    IDPay = parseInt(payIDs['$resources'][i]['PAYID'])
    if (payIDs['$resources'][i]['CARDNO'] === cardNumber) {
      console.log('Card Number exist')
      Description = "Card Number exist in payments methods from X3 ", Status = 1, Comment = "Card Number exist, go back payment methods";
      SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
      if (totalAmountcard) {
        res.send({ msg: 'Card Number exist, try another' })
        return
      }
      req.flash("error", "Card Number exist, try another");
      return res.redirect('/payments_methods/' + user.EMAIL)
    }
  }
  console.log(IDPay)
  IDPay = parseInt(IDPay) + 1
  request({
    uri: URI + 'YPORTALPAY?representation=YPORTALPAY.$create',
    method: 'POST',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    },
    body: {
      "EMAIL": user.EMAIL,
      "PAYID": IDPay,
      "BPCNUM": "",
      "CARDNO": cardNumber,
      "CVC": cvv,
      "EXPDAT": addCardExpiryDate,
      "NAME": cardName,
      "ADDLIG1": addressCard,
      "ADDLIG2": "",
      "ADDLIG3": "",
      "CTY": city,
      "SAT": state,
      "ZIP": zipCode,
      "CRY": ""
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(async added_pay_methods => {// response
    //console.log(added_pay_methods)
    Description = "Payments methods added to X3 ", Status = 1, Comment = "Payment method added success";
    SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
    if (totalAmountcard) {
      res.send({ success: 'success' })
      return
    }
    req.flash("success", "Card added");
    res.redirect('/payments_methods/' + user.EMAIL)


  });

};
exports.edit_pay_methods = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  const pictureProfile = res.locals.user['$resources'][1]['pic']
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 9, SessionKey = SessionKeyLog, Description = "Edit payments methods module to X3", Status = 1, Comment = "Preparing for edit payments methods";
  var SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
  var { cardNumber, cardName, addCardExpiryDate, cvv, payID, addressCard, zipCode, state, city } = req.body
  cardNumber = encrypt(cardNumber);
  cvv = encrypt(cvv);
  addCardExpiryDate = encrypt(addCardExpiryDate);
  zipCode = encrypt(zipCode);
  cardName = encrypt(cardName);
  let query_consulting = "&where=EMAIL eq '" + user.EMAIL + "'"
  let count = 1000
  console.log(query_consulting)

  request({
    uri: URI + `YPORTALPAY('${user.EMAIL}~${payID}')?representation=YPORTALPAY.$edit`,
    method: 'PUT',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    },
    body: {
      "BPCNUM": "",
      "CARDNO": cardNumber,
      "CVC": cvv,
      "EXPDAT": addCardExpiryDate,
      "NAME": cardName,
      "ADDLIG1": addressCard,
      "ADDLIG2": "",
      "ADDLIG3": "",
      "CTY": city,
      "SAT": state,
      "ZIP": zipCode,
      "CRY": ""
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(async added_pay_methods => {// response
    //console.log(added_pay_methods)
    Description = "Success Edit payments methods module to X3", Status = 1, Comment = "Success edit payments methods";
    SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
    req.flash("success", "Card edited");
    res.redirect('/payments_methods/' + user.EMAIL)


  });

};
exports.delete_pay_methods = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Delete payments methods module to X3", Status = 1, Comment = "Preparing for delete payments methods";
  var SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
  const payID = req.params.IDPay
  //console.log(user)
  let query_consulting = "&where=EMAIL eq '" + user.EMAIL + "'"
  let count = 1000
  console.log(query_consulting)

  request({
    uri: URI + `YPORTALPAY('${user.EMAIL}~${payID}')?representation=YPORTALPAY.$edit`,
    method: 'DELETE',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(async delete_pay_methods => {// response
    Description = "Success Delete payments methods module to X3", Status = 1, Comment = "Success for delete payments methods";
    SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
    req.flash("success", "Card deleted");
    res.redirect('/payments_methods/' + user.EMAIL)


  });

};
exports.pay_invoices = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  const pictureProfile = res.locals.user['$resources'][1]['pic']
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Preparing pay invoices view", Status = 1, Comment = "No commets";
  var SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)

  let query_consulting = "&where=EMAIL eq '" + user.EMAIL + "'"

  const list_methods_par = JSON.parse(await request({
    uri: URI + 'YPORTALPAY?representation=YPORTALPAY.$query&count=100' + query_consulting,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(async pay_methods => {// GET INVOICES
    Description = "Get PaymentMethods for pay", Status = 1, Comment = "PayMethods, preparing for pay invoices";
    SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
    return JSON.stringify(pay_methods['$resources'])
  }))

  console.log(req.body)
  let count = 100
  const { ids_invoices } = req.body
  let split_id = ids_invoices.split(',')
  let where_filter_inv
  var inv_wofilter = []
  //where_filter_inv = "&where=NUM eq '" + split_id[0] + "' "
  if (split_id.length > 1) {
    for (let i = 0; i < split_id.length; i++) {
      console.log(where_filter_inv)
      where_filter_inv = "&where=NUM eq '" + split_id[i] + "' "
     inv_wofilter.push( await request({
    uri: URI + 'YPORTALINV?representation=YPORTALINVO.$query&count=' + count + " " + where_filter_inv,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(async inv_wofilter2 => {// GET INVOICES
    console.log("ip-->>" + ip)
  //  Description = "Ready to pay invoices selected", Status = 1, Comment = "Loading page: Pay invoices";
    //SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
    let inv_filtering = JSON.stringify(inv_wofilter2['$resources'])
    return inv_wofilter2['$resources'][0]  

   
  })
  )  
    }
  }else{
    where_filter_inv = "&where=NUM eq '" + split_id[0] + "' "
    inv_wofilter.push( await request({
      uri: URI + 'YPORTALINV?representation=YPORTALINVO.$query&count=' + count + " " + where_filter_inv,
      method: 'GET',
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
      },
      json: true, // Para que lo decodifique automáticamente 
    }).then(async inv_wofilter2 => {// GET INVOICES
      console.log("ip-->>" + ip)
    //  Description = "Ready to pay invoices selected", Status = 1, Comment = "Loading page: Pay invoices";
      //SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
      let inv_filtering = JSON.stringify(inv_wofilter2['$resources'])
      return inv_wofilter2['$resources'][0]  
  
     
    })
    )  
  }

 // console.log(inv_wofilter)
   let subTotal = 0, taxes = 0, Total = 0;
    for (let i = 0; i < inv_wofilter.length; i++) {
      subTotal += parseFloat(inv_wofilter[i].AMTNOT)
      Total += parseFloat(inv_wofilter[i].OPENLOC)
    }

    taxes = parseFloat(Total) - parseFloat(subTotal)
    let items = inv_wofilter.length;
 //HERE RENDER PAGE AND INTRO INFO
    res.render("pay_invoices", {
      pageName: "Pay Invoices",
      dashboardPage: true,
      menu: true,
      pay_invoices: true,
      user, inv_wofilter, subTotal, taxes,
      Total, items, list_methods_par,pictureProfile
    });

};

exports.process_payment = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  var ip = req.connection.remoteAddress;
  const SessionKeyLog = req.session.SessionLog;
  console.log(req.body)
  const { paymentID, cardNumber, cardName, expMonth, expYear, cvv, totalAmountcard, emailCard, addressCard, zipCode, state, city,inv, appliedAmount } = req.body
  var enable_capture = true
  let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 7, SessionKey = SessionKeyLog, Description = "Connecting with process payment", Status = 1, Comment = "Preparing process payument";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)

  try {
    var configObject = new configuration();
    var apiClient = new cybersourceRestApi.ApiClient();
    var requestObj = new cybersourceRestApi.CreatePaymentRequest();

    var clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
    clientReferenceInformation.code = 'TC50171_3';
    requestObj.clientReferenceInformation = clientReferenceInformation;

    var processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
    processingInformation.capture = false;
    if (enable_capture === true) {
      processingInformation.capture = true;
    }

    requestObj.processingInformation = processingInformation;

    var paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
    var paymentInformationCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();
    paymentInformationCard.number = cardNumber;///'4111111111111111'
    paymentInformationCard.expirationMonth = expMonth;//'12'
    paymentInformationCard.expirationYear = expYear;//'2031'
    paymentInformationCard.securityCode = cvv;
    paymentInformation.card = paymentInformationCard;

    requestObj.paymentInformation = paymentInformation;

    var orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
    var orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
    orderInformationAmountDetails.totalAmount = parseFloat(totalAmountcard);
    orderInformationAmountDetails.currency = 'USD';
    orderInformation.amountDetails = orderInformationAmountDetails;

    var orderInformationBillTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
    orderInformationBillTo.firstName = cardName;
    orderInformationBillTo.lastName = 'x';
    orderInformationBillTo.address1 = addressCard;
    orderInformationBillTo.locality = city;
    orderInformationBillTo.administrativeArea = state;
    orderInformationBillTo.postalCode = zipCode;
    orderInformationBillTo.country = 'US';
    orderInformationBillTo.email = emailCard;
    orderInformationBillTo.phoneNumber = '4158880000';
    orderInformation.billTo = orderInformationBillTo;

    requestObj.orderInformation = orderInformation;


    var instance = new cybersourceRestApi.PaymentsApi(configObject, apiClient);

    instance.createPayment(requestObj, async function (error, data, response) {
      if (error) {
        console.log('\nError : ' + JSON.stringify(error));
        let errorLogD = "Error:" + error.status + "- process payment"
        console.log(errorLogD);
        let errorLogC = error.response.text
        errorLogC = (JSON.parse(errorLogC)).message

        console.log(errorLogC);
        Description = errorLogD, Status = 1, Comment = errorLogC;
        SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)

      }
      else if (data) {
        //console.log('\nData : ' + JSON.stringify(data));
        let descp
        let comm
        let TranAmount = parseFloat(totalAmountcard)
        var tPaymentSave
        var paymentx3S
        if (data.status == "AUTHORIZED") {
          descp = "Process status res: " + data.status
          comm = "Process payment success: OK"
          Description = descp, Status = 1, Comment = comm;
          SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
          console.log(data.orderInformation.amountDetails.totalAmount)
          console.log(TranAmount)
          let CCExpDate = expMonth + "/" + expYear
          tPaymentSave = await DataBasequerys.tPayment(1, SessionKey, UserID, data.processorInformation.transactionId, TranAmount, data.processorInformation.approvalCode, data.submitTimeUtc, data.processorInformation.transactionId, data.status, data.status, cardNumber, CCExpDate, cvv, cardName, addressCard, zipCode)
          console.log("--Sucess in SQL"+tPaymentSave)
          console.log('\nData : ' + JSON.stringify(data));
          
          paymentx3S= await savePaymentX3(inv,appliedAmount,user['EMAIL'])

          console.log('\ss : ' + JSON.stringify(paymentx3S));

     // console.log('\nResponse : ' + JSON.stringify(response));
     console.log('\nResponse Code of Process a Payment : ' + JSON.stringify(response['status']));
if (paymentx3S[0].status == "1") {
  Description = "SOAP status 1", Status = 1, Comment = "SOAP SUccess";
          SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
}else{
  console.log('\error SOAP : ' + JSON.stringify(paymentx3S[0].error[0].message[0]));
  Description = "SOAP status 0", Status = 0, Comment = "SOAP Failed: "+ JSON.stringify(paymentx3S[0].error[0].message[0]);
  SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
}
  return res.send({ error, data, response, paymentx3S,SystemLogL});
        } else {
          descp = "Process status res: " + data.status
          comm = "Process payment reason:" + data.errorInformation.reason
          Description = descp, Status = 0, Comment = comm;
          SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
          let CCExpDate = expMonth + "/" + expYear
          let today = new Date()
          tPaymentSave = await DataBasequerys.tPayment(1, SessionKey, UserID, data.id, TranAmount, null, today, data.id, data.status, data.errorInformation.reason, cardNumber, CCExpDate, cvv, cardName, addressCard, zipCode)
          console.log(tPaymentSave)
          return res.send({ error, data, response });
        }
      }      
      
    });
  }
  catch (error) {
    console.log('\nException on calling the API : ' + error);
  }

}
exports.applied_amount = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Applied amount", Status = 1, Comment = "Preparing data";
  var SystemLogLogin = await  DataBasequerys.tSystemLog(UserID,IPAddress,LogTypeKey,SessionKey,Description,Status,Comment)

  console.log(req.body)
  var paymentAplication
  var { inv, amount, shortDesc, appliedAmount } = req.body
inv = inv.split(',');
amount = amount.split(',');
shortDesc =shortDesc. split(',');
appliedAmount =appliedAmount. split(',');
for (let i = 0; i < inv.length; i++) {
  paymentAplication = await DataBasequerys.tPaymentApplication(inv[i], amount[i], shortDesc[i], appliedAmount[i])
}
  

  console.log(paymentAplication)
  res.send({ data: paymentAplication })
};
exports.save_PicProfile = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Saving pic profile", Status = 1, Comment = "Preparing data";
  var SystemLogLogin = await  DataBasequerys.tSystemLog(UserID,IPAddress,LogTypeKey,SessionKey,Description,Status,Comment)

  console.log('(----')
  const { email, picture } = req.body
  var SavePic
  var consultingPrevious = await  DataBasequerys.consultingPicProfile(email)
  //console.log(consultingPrevious)
  if (consultingPrevious) {
    SavePic = await  DataBasequerys.uploadPicProfile(email, picture,'update')
    SavePic = "Updated success"
    res.locals.user['$resources'][1]['pic'] = picture
  }else{
    SavePic = await  DataBasequerys.uploadPicProfile(email, picture,'insert')
    res.locals.user['$resources'][1]['pic'] = picture
  }
  

  console.log(SavePic)
  res.send({ data: SavePic, picture: picture })
};

//OTHERS FUNCTIONS NO EXPORTED
savePaymentX3 = async (invoices,appliedAmount, userEmail) => {
 // let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Saving pic profile", Status = 1, Comment = "Preparing data";
 // var SystemLogLogin = await  DataBasequerys.tSystemLog(UserID,IPAddress,LogTypeKey,SessionKey,Description,Status,Comment)

 invoices = invoices.split(',')
 appliedAmount = appliedAmount.split(',')

var i_file="",inv_detail,amountPayment
let today = moment().format('YYYYMMDD')
for (let i = 0; i < invoices.length; i++) {
  
   inv_detail = JSON.parse(await request({
    uri: URI + `YPORTALINVD('${invoices[i]}')?representation=YPORTALINVD.$details`,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(async invD => {// GET INVOICES
   // Description = "Get PaymentMethods for pay", Status = 1, Comment = "PayMethods, preparing for pay invoices";
   // SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
    return JSON.stringify(invD)
  }))

  amountPayment = Number.parseFloat(appliedAmount[i]).toFixed(2);

  i_file += `P;;RECDP;${inv_detail.BPCINV};ENG;10501;S001;${inv_detail.CUR};${amountPayment};${today}|D;PAYRC;${inv_detail.GTE};${inv_detail.NUM};${inv_detail.CUR};${amountPayment}|A;LOC;${inv_detail.SIVSIHC_ANA[0].CCE};DPT;${inv_detail.SIVSIHC_ANA[1].CCE};BRN;${inv_detail.SIVSIHC_ANA[2].CCE};BSU;${inv_detail.SIVSIHC_ANA[3].CCE};SBU;${inv_detail.SIVSIHC_ANA[4].CCE};${amountPayment}|`
}
i_file = i_file + `END`
console.log(i_file)
let xmlB = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wss="http://www.adonix.com/WSS">
<soapenv:Header/>
<soapenv:Body>
  <wss:run soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <callContext xsi:type="wss:CAdxCallContext">
      <codeLang xsi:type="xsd:string">ENG</codeLang>
      <poolAlias xsi:type="xsd:string">SAWTEST1</poolAlias>
      <poolId xsi:type="xsd:string"></poolId>
      <requestConfig xsi:type="xsd:string">
        <![CDATA[adxwss.optreturn=JSON&adxwss.beautify=true&adxwss.trace.on=off]]>
      </requestConfig>
    </callContext>
    <publicName xsi:type="xsd:string">AOWSIMPORT</publicName>
    <inputXml xsi:type="xsd:string">
      <![CDATA[{
        "GRP1": {
          "I_MODIMP": "YPORTALPAY",
          "I_AOWSTA": "NO",
          "I_EXEC": "REALTIME",
          "I_RECORDSEP": "|",
          "I_FILE":"${i_file}"
        }
      }]]>
    </inputXml>
  </wss:run>
</soapenv:Body>
</soapenv:Envelope>`
const parser = new xml2js.Parser({
  explicitArray: true
});

let SOAPP = JSON.parse(await request({
  uri: `https://sawoffice.technolify.com:8443/soap-generic/syracuse/collaboration/syracuse/CAdxWebServiceXmlCC`,
  method: 'POST',
  insecure: true,
  rejectUnauthorized: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    'soapaction' : '*'
  },
  body:xmlB,
  //json: true, // Para que lo decodifique automáticamente 
}).then(async SOAP => {// GET INVOICES
  //console.log(SOAP)
 // Description = "Get PaymentMethods for pay", Status = 1, Comment = "PayMethods, preparing for pay invoices";
 // SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
  return JSON.stringify(SOAP)
}))
var status = []
parser.parseString(SOAPP,function(err, result) {

  status.push({status: result['soapenv:Envelope']['soapenv:Body'][0]['wss:runResponse'][0]['runReturn'][0]['status'][0]['_'], error: result['soapenv:Envelope']['soapenv:Body'][0]['multiRef']})  
  return status
});
return status
};

exports.printInvoice = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  const pictureProfile = res.locals.user['$resources'][1]['pic']
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  console.log(user)
  let inv_num = req.params.inv
  let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Request invoice details from X3 for print", Status = 1, Comment = "Not comments";
  var SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
  request({
    uri: URI + `YPORTALINVD('${inv_num}')?representation=YPORTALINVD.$details`,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(async inv_detail => {// GET INVOICES
    console.log(inv_detail)
    Description = "Closed Invoice Details success from X3", Status = 1, Comment = "Loading Page";
    SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
    //HERE RENDER PAGE AND INTRO INFO
    res.render("print_invoice", {
      pageName: "Print: " + inv_num,
      dashboardPage: true,
      print_inv: true,
      user, inv_detail,pictureProfile
    });


  });

};
// exports.pdfInvoice = async (req, res) => {
//   const user = res.locals.user['$resources'][0];
//   const pictureProfile = res.locals.user['$resources'][1]['pic']
//   const SessionKeyLog = req.session.SessionLog;
//   var ip = req.connection.remoteAddress;
//   console.log(user)
//   let inv_num = req.params.inv
//   let UserID = user['EMAIL'], IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Request invoice details from X3 for PDF", Status = 1, Comment = "Not comments";
//   var SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
//   request({
//     uri: URI + `YPORTALINVD('${inv_num}')?representation=YPORTALINVD.$details`,
//     method: 'GET',
//     insecure: true,
//     rejectUnauthorized: false,
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//       'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
//     },
//     json: true, // Para que lo decodifique automáticamente 
//   }).then(async inv_detail => {// GET INVOICES
//     console.log(inv_detail)
//     Description = "Closed Invoice Details success from X3", Status = 1, Comment = "Loading Page";
//     SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
//     //HERE RENDER PDF
//     var html = `<!DOCTYPE html>
//     <html class="loading" lang="en" data-textdirection="ltr">
//     <!-- BEGIN: Head test MOSS.SH -->
    
//     <head>
//         <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
//         <meta http-equiv="X-UA-Compatible" content="IE=edge">
//         <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=0,minimal-ui">
//         <meta name="description" content="Super flexible, powerful, clean &amp; modern responsive bootstrap 4 admin with unlimited possibilities.">
//         <meta name="keywords" content="admin template, admin template, dashboard template, flat admin template, responsive admin template, web app">
//         <title>{{pageName}}</title>
//         <link rel="shortcut icon" type="image/x-icon" href="https://sanantoniowinery.com/apple-touch-icon-57x57.png">
//         <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500;1,600" rel="stylesheet">
//         <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.js"></script>
    
//         <!-- BEGIN: Vendor CSS-->
//         <link rel="stylesheet" type="text/css" href="../../../app-assets/vendors/css/vendors.min.css">
//         <!-- END: Vendor CSS-->    
//         <!-- BEGIN: Theme CSS-->
//         <link rel="stylesheet" type="text/css" href="../../../app-assets/css/bootstrap.css">
//         <link rel="stylesheet" type="text/css" href="../../../app-assets/css/bootstrap-extended.css">
//         <link rel="stylesheet" type="text/css" href="../../../app-assets/css/colors.css">
//         <link rel="stylesheet" type="text/css" href="../../../app-assets/css/components.css">
//         <link rel="stylesheet" type="text/css" href="../../../app-assets/css/themes/dark-layout.css">
//         <link rel="stylesheet" type="text/css" href="../../../app-assets/css/themes/bordered-layout.css">
//         <link rel="stylesheet" type="text/css" href="../../../app-assets/css/themes/semi-dark-layout.css">
    
//         <link rel="stylesheet" type="text/css" href="../../../app-assets/vendors/css/animate/animate.min.css">
//         <link rel="stylesheet" type="text/css" href="../../../app-assets/vendors/css/extensions/sweetalert2.min.css">
    
//         <link rel="stylesheet" type="text/css" href="../../../app-assets/css/core/menu/menu-types/vertical-menu.css">
    
//         <link rel="stylesheet" type="text/css" href="../../../app-assets/css/main.css">
//         <!-- END: Page CSS-->
//     <!-- PER MODULES --><link rel="stylesheet" type="text/css" href="../../../app-assets/css/pages/app-invoice-print.css" media="print">
//     </head>
//     <!-- END: Head--><!-- END: Head-->
//     <!-- BEGIN: Body-->
//     <body class="vertical-layout vertical-menu-modern blank-page navbar-floating footer-static  " data-open="click" data-menu="vertical-menu-modern" data-col="blank-page">
//     <style>
//     .invoices-details-colums{
//         display: grid;
//     grid-template-columns: 2fr 2fr 2fr;
//     }
//     .col-per{
//     width: 0.5rem !important;
//     padding: 0.72rem 0.5rem !important;
//     }
//        .col-per2{
//     width: 0.8% !important;
//     }
// </style>


// <!-- BEGIN: Content-->
// <div class="app-content content ">
//         <div class="content-overlay"></div>
//         <div class="header-navbar-shadow"></div>
//         <div class="content-wrapper">
//             <div class="content-header row">
//             </div>
//             <div class="content-body">
//                 <div class="invoice-print p-3">
//                     <div class="invoice-header d-flex justify-content-between flex-md-row flex-column">
//                         <div>
//                             <div class="d-flex mb-1">
                               
//                                  <div class="logo-wrapper">
//                                             <img src="../../app-assets/images/logo/saw_logo.jpg" class="round" alt="" width="345"
//                                                 height="auto">
//                                         </div>
                                        
//                             </div>
//                             <p class="card-text mb-25">737 LAMAR STREET, LOS ANGELES, CA 90031 USA</p>
//                                         <p class="card-text mb-0">TEL: +1 (323) 223 1401, FAX: +44 (323) 221 5957</p>
//                         </div>
//                         <div class="mt-md-0 mt-2">
//                             <h4 class="invoice-title">
//                                             Invoice:
//                                             <span class="invoice-number">{{inv_detail.NUM}}</span>
//                                         </h4>
//                                         <div class="invoice-date-wrapper">
//                                             <p class="invoice-date-title">Date Issued: {{#format_date
//                                                 inv_detail.INVDAT}} {{/format_date}}</p>
//                                         </div>
//                                         <div class="invoice-date-wrapper">
//                                             <p class="invoice-date-title">Due Date: {{#format_date
//                                                 inv_detail.SIVYPORINV.0.DUDDAT}}{{/format_date}}</p>
//                                         </div>
//                         </div>
//                     </div>

//                     <hr class="my-1" />

//                     <div class="row pb-2" style="margin-left: 2rem;">
//                         <div class="row invoice-spacing invoices-details-colums">
//                                     <div class="col-xl-8 p-0">
//                                         <h6 class="mb-25">Invoice Address:</h6>
//                                         <h6 class="mb-25">{{inv_detail.SIVBPIADD.0.BPIADDLIG1}} {{inv_detail.SIVBPIADD.0.BPIADDLIG2}} {{inv_detail.SIVBPIADD.0.BPIADDLIG3}}</h6>
//                                         <p class="card-text mb-25">{{inv_detail.SIVBPIADD.0.BPICTY}}, {{inv_detail.SIVBPIADD.0.BPISAT}} {{inv_detail.SIVBPIADD.0.BPIPOSCOD}}</p>
//                                         <p class="card-text mb-25">{{inv_detail.SIVBPIADD.0.BPICRYNAM}}</p>
//                                     </div>
//                                      <div class="col-xl-6 p-0">
//                                         <h6 class="mb-25">Ship to:</h6>
//                                         <h6 class="card-text mb-25">{{inv_detail.BPCORD}}</h6>
//                                         <p class="card-text mb-25">{{inv_detail.BPDADDLIG1}} {{inv_detail.BPDADDLIG2}} {{inv_detail.BPDADDLIG3}}</p>
//                                         <p class="card-text mb-25">{{inv_detail.BPDCTY}}, {{inv_detail.BPDSAT}} {{inv_detail.BPDPOSCOD}}</p>
//                                         <p class="card-text mb-25">{{inv_detail.BPDCRYNAM}}</p>

//                                     </div>
//                                     <div class="col-xl-4 p-0">
//                                         <h6 class="mb-2">Invoice Details:</h6>
//                                         <p class="card-text mb-25">Unpaid Amount: ${inv_detail['SIVYPORINV'][0]['OPENLOC']}
//                                         </p>
//                                         <p class="card-text mb-25">Last Payment Date: {{#format_date
//                                             inv_detail.SIVYPORINV.0.LASTPAYDAT}}{{/format_date}} </p>
//                                         <p class="card-text mb-25"> </p>
//                                         <p class="card-text mb-0"> </p>

//                                     </div>
//                                 </div>
//                     </div>

//                     <div class="table-responsive mt-1">
//                                 <table class="table">
//                                     <thead>
//                                         <tr>
//                                             <th class="py-1 col-per">Products</th>
//                                             <th class="py-1 col-per text-center " style="width: 2% !important;">Sales Order #</th>


//                                             <th class="py-1 col-per text-center col-per2">QTY</th>
//                                             <th class="py-1 col-per text-center col-per2">PRICE</th>
//                                             <th class="py-1 col-per text-center col-per2">CRV/Unit</th>
//                                             <th class="py-1 col-per text-center" >Sub-Total</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>`
//         for (let i = 0; i < inv_detail['SIVSID'].length; i++) {
//     console.log(Number.parseFloat(inv_detail['SIVSID'][i]['GROPRI']))
//          html +=`
//          <tr>
//          <td class="col-1 col-per">
//              <p class="card-text fw-bold mb-25">{{ITMREF}}</p>
//              <p class="card-text ">{{ITMDES}}</p>
//          </td>
//          <td class="col-1 text-center col-per">
//              <span class="fw-bold">{{SOHNUM}}</span>
//          </td>


//          <td class="col-1 text-center col-per col-per2">
//              <span class="fw-bold">{{QTY}}</span>
//          </td>
//          <td class="col-1 text-center col-per col-per2">
//              <span class="fw-bold">${Number.parseFloat(inv_detail['SIVSID'][i]['GROPRI']).toFixed(2)}</span>
//          </td>
//          <td class="col-1 text-center col-per col-per2">
//              <span class="fw-bold">${Number.parseFloat(inv_detail['SIVSID'][i]['DISCRGVAL3'])}</span>
//          </td>
//          <td class="col-1 text-center col-per">
//              <span class="fw-bold">${Number.parseFloat(inv_detail['SIVSID'][i]['AMTNOTLIN'])}</span>
//          </td>
//      </tr>
//          `
          
//         }
//                                         {{#each inv_detail.SIVSID as |details i|}}
                                       
//                                         {{/each}}
//                html+=`                     </tbody>
//                                 </table>
//                     </div>

//                     <div class="row invoice-sales-total-wrapper mt-1">
//                         <div class="col-md-4 order-md-1 order-2 mt-md-0 mt-3">
//                             <p class="card-text mb-0 d-none"><span class="fw-bold">Salesperson:</span> <span class="ms-75">Alfie Solomons</span></p>
//                         </div>
//                         <div class="col-md-3 d-flex order-md-2">
//                             <div class="invoice-total-wrapper">
//                                 <div class="invoice-total-item">
//                                     <p class="invoice-total-title">Subtotal:</p>
//                                     <p class="invoice-total-amount">${{#decimals inv_detail.AMTNOT}}{{/decimals}}</p>
//                                 </div>
//                                 <div class="invoice-total-item">
//                                     <p class="invoice-total-title">Discount:</p>
//                                     <p class="invoice-total-amount">$0</p>
//                                 </div>
//                                 <div class="invoice-total-item">
//                                     <p class="invoice-total-title">Tax:</p>
//                                     <p class="invoice-total-amount">${{#tax_calculate inv_detail.AMTNOT
//                                                     inv_detail.AMTATI}} {{/tax_calculate}}</p>
//                                 </div>
//                                 <hr class="my-50" />
//                                 <div class="invoice-total-item">
//                                     <p class="invoice-total-title">Total:</p>
//                                     <p class="invoice-total-amount">${{#decimals inv_detail.AMTATI}}{{/decimals}}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <hr class="my-2" />

//                     <div class="row">
//                         <div class="col-12">
//                             <span class="fw-bold">Note:</span>
//                             <span>It was a pleasure working with you and your team. Thank You!</span>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     </div>
// <!-- END: Content-->`
    

//   });

// };