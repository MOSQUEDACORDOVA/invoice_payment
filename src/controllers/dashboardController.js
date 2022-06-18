const fs = require("fs");
const path = require("path");
const request = require("request-promise");
var queryFolder = "SAWTEST1"; //Name the query folder X3
///var URI = `https://sawoffice.technolify.com:8443/api1/x3/erp/${queryFolder}/`; //URI query link
var URLHost = `https://sawoffice.technolify.com:8443/api1/x3/erp/`; //URI query link
var moment = require("moment-timezone");
var DataBasequerys = require("../models/data"); // Functions for SQL querys
var DataBaseSq = require("../models/dataSequelize"); // Functions for SQL querys with sequelize
const {
  encrypt,
  decrypt
} = require("./crypto"); //Encrypt / decrypt
var pdf = require("html-pdf"); //  THIS MODULE USE IN CASE CREATE PDF FILE
const xml2js = require("xml2js"); //XML parse
var http = require("https");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const {
  v4: uuidv4
} = require("uuid");
//Payment process configuration
var cybersourceRestApi = require("cybersource-rest-client");
var configuration = require("./ConfigurationPayment");
const { parse} = require("path");
const WFCCtrl = require("./WFCtrl");
require("dotenv").config();

/**START FUNCTIONS FOR PAGES */

/**FUNCTION TO RENDER CONTACT US PAGE */
exports.contactUs = async (req, res) => {
  const user = res.locals.user["$resources"][0]; //User info
  const pictureProfile = res.locals.user["$resources"][1]["pic"]; // Profile Pic
  var admin = false;
  if (user["ROLE"] == 4) {
    //If User Role is 4 the Settings page is enabled
    admin = true;
  }
  res.render("contacts", {
    pageName: "Contact Us",
    dashboardPage: true,
    menu: true,
    contactUs: true,
    user,
    pictureProfile,
    admin,
  });
};

/**FUNCTION TO RENDER OPEN INVOICES PAGE */
exports.dashboard = async (req, res) => {
  let msg = false;
  var admin = false;
  if (req.params.msg) {
    msg = req.params.msg;
  }

  const user = res.locals.user["$resources"][0]; //User info
  const pictureProfile = res.locals.user["$resources"][1]["pic"]; //Pic Profile

  const SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table
  var ip = req.connection.remoteAddress;
  let query_consulting = "&where=ID eq " + user["ID"].toString() + ""; //Clause where with email
  let where_filter_inv = "", //Prepare the var for consulting invoices
    count = 0;
  if (user["ROLE"] == 4) {
    //If User Role is 4 the Settings page is enabled
    admin = true;
  }
  //Declare and send log to SystemLo
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Function: Dashboard", Status = 1, Comment = "Starting- line 71-";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
  let Yportal = 'YPORTALINV',portalRepresentation = 'YPORTALINVO';
  if (user["ROLE"] == 4) {
    // If User rol is 1, consulting query by EMAIL
    count = 100;
    Yportal = 'YPORTALINA';
    portalRepresentation = 'YPORTALINVAO'
    where_filter_inv = "&OrderBy=NUM";
  } else if (user["ROLE"] == 1 || user["ROLE"] == 2){
    //Else consulting Loggin Map
    count = 100;
    where_filter_inv = "&OrderBy=ID,NUM&where=ID eq " + user["ID"] + " "; //Consulting OpenInv querys by EMAIL
  }
  let URL0 = URLHost + req.session.queryFolder + "/";
  if (user["ROLE"] != 3) {
  //GET Open Invoices List to X3 by where clause EMAIL
  request({
    uri: URL0 +
    Yportal +`?representation=${portalRepresentation}.$query&count=` +
      count + where_filter_inv,
    method: "GET",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    json: true,
  }).then(async (inv_wofilter) => {
    let inv_filtering = JSON.stringify(inv_wofilter["$resources"]); // Create JSON String with the Open Invoices List for dataTable
    let links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting
    inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List
    //HERE RENDER PAGE AND INTRO INFO
    res.render("open_invoices", {
      pageName: "Open Invoices",
      dashboardPage: true,
      menu: true,
      invoiceO: true,
      user,
      msg,
      inv_wofilter,
      inv_filtering,
      pictureProfile,
      admin,
      links,
    });
  });
  }else{
    let query_consulting = " " + user["ID"] + "";
    const maping_login = JSON.parse(
      await request({
        uri: URL0 +
          "YPORTALBPS?representation=YPORTALBPS.$query&count=100" +
          query_consulting,
        method: "GET",
        insecure: true,
        rejectUnauthorized: false,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
        },
        json: true,
      }).then(async (map_loggin) => {
        return JSON.stringify(map_loggin);
      })
    );
    // STORE BPCNUM FORM MAPPINGLOGGING
    let bpcnum = [];
    for (let i = 0; i < maping_login["$resources"].length; i++) {
      bpcnum.push(maping_login["$resources"][i]["BPCNUM"]);
    }

    //GET PAYMENTS FROM SQL TABLE
    let payments = [],
      getPayments;
      console.log(bpcnum)
    for (let i = 0; i < bpcnum.length; i++) {
      await DataBasequerys.Get_YPORTALINAO(bpcnum[i]).then((response) => {
        response = JSON.parse(response); //PARSE RESPONSE
console.log(response)
      });
    }

    let inv_filtering = JSON.stringify(inv_wofilter["$resources"]); // Create JSON String with the Open Invoices List for dataTable
    let links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting
    inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List
    //HERE RENDER PAGE AND INTRO INFO
    res.render("open_invoices", {
      pageName: "Open Invoices",
      dashboardPage: true,
      menu: true,
      invoiceO: true,
      user,
      msg,
      inv_wofilter,
      inv_filtering,
      pictureProfile,
      admin,
      links,
    });
  }
  



};
/**FUNCTION TO RENDER OPEN INVOICES PAGE */
exports.openInvMore = async (req, res) => {
  const user = res.locals.user["$resources"][0]; //User info
  //console.log(user)
  const SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table
  var ip = req.connection.remoteAddress;
  let query_consulting = "&where=ID eq " + user["ID"].toString() + ""; //Clause where with email
  let where_filter_inv = "", //Prepare the var for consulting invoices
    count = 0;
  //Declare and send log to SystemLo
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Function: openInvMore list", Status = 1, Comment = "Starting- line 139-";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
  let Yportal = 'YPORTALINV',portalRepresentation = 'YPORTALINVO';
  if (user["ROLE"] == 4) {
    // If User rol is 1, consulting query by EMAIL
    count = 100;
    Yportal = 'YPORTALINA';
    portalRepresentation = 'YPORTALINVAO'
    where_filter_inv = "&OrderBy=NUM";
  } else {
    //Else consulting Loggin Map
    count = 100;
    where_filter_inv = "&OrderBy=ID,NUM&where=ID eq " + user["ID"] + " "; //Consulting OpenInv querys by EMAIL
  }
  let URL0 = URLHost + req.session.queryFolder + "/";
  //GET Open Invoices List to X3 by where clause EMAIL
  request({
    uri: URL0 +
    Yportal +`?representation=${portalRepresentation}.$query&count=` +
      count + where_filter_inv,
    method: "GET",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    json: true,
  }).then(async (inv_wofilter) => {
    let links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting
    inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List

    //Save LogSystem
    (Description = "Open Invoices list success to X3"),
      (Status = 1),
      (Comment = "Function: openInvMore-line 307");
    SystemLogL = await DataBasequerys.tSystemLog(UserID,IPAddress,LogTypeKey,SessionKey,Description,Status,Comment    );

    var paymentsL;
    //FIRTS MAPPING LOG FOR GET BPCNUM'S
    let query_consulting = "&where=ID eq " + user["ID"] + "";
    const maping_login = JSON.parse(
      await request({
        uri: URL0 +
          "YPORTALBPS?representation=YPORTALBPS.$query&count=100" +
          query_consulting,
        method: "GET",
        insecure: true,
        rejectUnauthorized: false,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
        },
        json: true,
      }).then(async (map_loggin) => {
        return JSON.stringify(map_loggin);
      })
    );
    // STORE BPCNUM FORM MAPPINGLOGGING
    let bpcnum = [];
    for (let i = 0; i < maping_login["$resources"].length; i++) {
      bpcnum.push(maping_login["$resources"][i]["BPCNUM"]);
    }

    //GET PAYMENTS FROM SQL TABLE
    let payments = [],
      getPayments;
    for (let i = 0; i < bpcnum.length; i++) {
      await DataBaseSq.Get_tPayments(bpcnum[i]).then((response) => {
        response = JSON.parse(response); //PARSE RESPONSE
        //STORE IN ARRAY PAYMENTS
        for (let j = 0; j < response.length; j++) {
          //console.log(payments.length);
          payments.push({
            pmtKey: response[j].pmtKey,
            CustID: response[j].CustID,
            TransactionID: response[j].TransactionID,
            TranAmount: response[j].TranAmount,
            ProcessorStatus: response[j].ProcessorStatus,
            ProcessorStatusDesc: response[j].ProcessorStatusDesc,
            DateProcessesed: response[j].DateProcessesed,
            tPaymentApplication: response[j].tPaymentApplication,
          });
        }
      });
    }

    //CLEAN PAYMENTS BLANK
    paymentsL = JSON.stringify(payments.filter((el) => el != ""));
    res.send({
      inv_wofilter,
      links,
      paymentsL
    });
  });
};
/**FUNCTION TO RENDER OPEN INVOICES PAGE */
exports.paymentsL = async (req, res) => {
  const user = res.locals.user["$resources"][0]; //User info
  const SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table
  var ip = req.connection.remoteAddress;
  //Declare and send log to SystemLo
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "FUNCTION:paymentsL ", Status = 1, Comment = "Starting- line 270-";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment
  );
  var paymentsL;
  //FIRTS MAPPING LOG FOR GET BPCNUM'S
  let query_consulting = "&where=ID eq " + user["ID"] + "";
  let URL0 = URLHost + req.session.queryFolder + "/";
  const maping_login = JSON.parse(
    await request({
      uri: URL0 +
        "YPORTALBPS?representation=YPORTALBPS.$query&count=1000" +
        query_consulting,
      method: "GET",
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
      },
      json: true,
    }).then(async (map_loggin) => {
      return JSON.stringify(map_loggin);
    })
  );
  // STORE BPCNUM FORM MAPPINGLOGGING
  let bpcnum = [];
  for (let i = 0; i < maping_login["$resources"].length; i++) {
    bpcnum.push(maping_login["$resources"][i]["BPCNUM"]);
  }

  //GET PAYMENTS FROM SQL TABLE
  let payments = [],
    getPayments = [];
  //console.log(bpcnum)
  for (let i = 0; i < bpcnum.length; i++) {
    await DataBaseSq.Get_tPayments(bpcnum[i]).then((response) => {
      response = JSON.parse(response); //PARSE RESPONSE
      //STORE IN ARRAY PAYMENTS
      for (let j = 0; j < response.length; j++) {
        payments.push({
          pmtKey: response[j].pmtKey,
          CustID: response[j].CustID,
          TransactionID: response[j].TransactionID,
          TranAmount: response[j].TranAmount,
          ProcessorStatus: response[j].ProcessorStatus,
          ProcessorStatusDesc: response[j].ProcessorStatusDesc,
          DateProcessesed: response[j].DateProcessesed,
          tPaymentApplication: response[j].tPaymentApplication,
        });
      }
    });
  }

  //CLEAN PAYMENTS BLANK
  paymentsL = JSON.stringify(payments.filter((el) => el != ""));
  res.send({
    paymentsL
  });
};
/**FUNCTION TO RENDER NEXT_PAGE  PAGE REQUEST FOR OPEN INVOICES*/
exports.next_pageIO2 = async (req, res) => {
  const user = res.locals.user["$resources"][0]; // User info
  const SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table
  var ip = req.connection.remoteAddress;
  //Declare and send log to SystemLo
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "FUNCTION:next_pageIO2 ", Status = 1, Comment = "Starting- line 348-";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
  //Request for GET the next page from query consulting
  var data = req.params.data;
  let URL0 = URLHost + req.session.queryFolder + "/";
  let Yportal = 'YPORTALINV',portalRepresentation = 'YPORTALINVO';
  if (user["ROLE"] == 4) {
    // If User rol is 1, consulting query by EMAIL
    count = 100;
    Yportal = 'YPORTALINA';
    portalRepresentation = 'YPORTALINVAO'
    where_filter_inv = "&OrderBy=NUM";
  } else {
    //Else consulting Loggin Map
    count = 100;
    where_filter_inv = "&OrderBy=ID,NUM&where=ID eq " + user["ID"] + " "; //Consulting OpenInv querys by EMAIL
  }
  //GET Open Invoices List to X3 by where clause EMAIL
  request({
    uri: URL0 +
    Yportal +`?representation=${portalRepresentation}.$query&${data}&count=` +
      count + where_filter_inv,
    method: "GET",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    json: true,
  }).then(async (inv_wofilter) => {
    // GET INVOICES
    let links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting
    inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List
    res.send({
      inv_wofilter,
      links
    });
  });
};
/**FUNCTION TO RENDER NEXT_PAGE  PAGE REQUEST FOR CLOSED INVOICES*/
exports.next_pageIC2 = async (req, res) => {
  const user = res.locals.user["$resources"][0]; // User info
  const SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table
  var ip = req.connection.remoteAddress;
  //Declare and send log to SystemLo
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "FUNCTION:next_pageIC2 ", Status = 1, Comment = "Starting- line 392-";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment
  );
  // console.log(SystemLogL)
  //Request for GET the next page from query consulting
  var data = req.params.data;
  let Yportal = 'YPORTALINV',portalRepresentation = 'YPORTALINVC';
  if (user["ROLE"] == 4) {
    // If User rol is 1, consulting query by EMAIL
    count = 100;
    Yportal = 'YPORTALINA';
    portalRepresentation = 'YPORTALINVAC'
    where_filter_inv = "&OrderBy=NUM";
  } else {
    //Else consulting Loggin Map
    count = 100;
    where_filter_inv = "&OrderBy=ID,NUM&where=ID eq " + user["ID"] + " "; //Consulting OpenInv querys by EMAIL
  }
  //GET Open Invoices List to X3 by where clause EMAIL
  request({
    uri: URL0 +
    Yportal +`?representation=${portalRepresentation}.$query&${data}&count=` +
      count + where_filter_inv,
    method: "GET",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    json: true,
  })
    .then(async (inv_wofilter) => {
      // console.log(inv_wofilter)
      // GET INVOICES
      let links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting
      inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List
      // console.log('go go')
      res.send({
        inv_wofilter,
        links
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

/** FUNCTION TO SEARCH IN OPENINVOICE WHIT THE API */
exports.searchOpenInvO = async (req, res) => {
  const user = res.locals.user["$resources"][0]; // User info
  const SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table
  var ip = req.connection.remoteAddress;
  //Declare and send log to SystemLo
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "FUNCTION:searchOpenInvO ", Status = 1, Comment = "Starting- line 440-";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
  // console.log(SystemLogL);
  //Request for GET the next page from query consulting
  var filter = req.params.filter;
  var search = req.params.search;
  var query = "";

  if (filter == "INVDAT" || filter == "DUDDAT") {
    query = `and ${filter} eq @${search}@`;
    if (user["ROLE"] == 4) {
      query = `${filter} eq @${search}@`;
    }
    
  } else {
    query = `and ${filter} like '%25${search}%25'`;
    if (user["ROLE"] == 4) {
      query = `${filter} like '%25${search}%25'`;
    }
  }
  // console.log(query);
  if (filter == "NUM" && search == "-") {
    query = ``;
  }
  let Yportal = 'YPORTALINV',portalRepresentation = 'YPORTALINVO';
  if (user["ROLE"] == 4) {
    // If User rol is 1, consulting query by EMAIL
    count = 100;
    Yportal = 'YPORTALINA';
    portalRepresentation = 'YPORTALINVAO'
    where_filter_inv = "&OrderBy=NUM&where="+query;
  } else {
    //Else consulting Loggin Map
    count = 100;
    where_filter_inv = "&OrderBy=ID,NUM&where=ID eq " + user["ID"] +" "+ query; //Consulting OpenInv querys by EMAIL
  }
  let URL0 = URLHost + req.session.queryFolder + "/";
  //GET Open Invoices List to X3 by where clause EMAIL
  request({
    uri: URL0 +
    Yportal +`?representation=${portalRepresentation}.$query&count=` +
      count + where_filter_inv,
    method: "GET",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    json: true,
  }).then(async (inv_wofilter) => {
    /// console.log(inv_wofilter);
    // GET INVOICES
    let links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting
    inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List
    return res.send({
      inv_wofilter,
      links
    });
  });
};
/** FUNCTION TO SEARCH IN TABLE CLOSEINVOICE WHIT THE API */
exports.searchCloseInvC = async (req, res) => {
  const user = res.locals.user["$resources"][0]; // User info
  const SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table
  var ip = req.connection.remoteAddress;
  //Declare and send log to SystemLo
  let UserID = user["ID"].toString(),IPAddress = ip,LogTypeKey = 5,SessionKey = SessionKeyLog,Description = "FUNCTION:searchCloseInvC ",Status = 1,Comment = "Starting- line 440-";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID,IPAddress,LogTypeKey,SessionKey,Description,Status,Comment );
  //Request for GET the next page from query consulting
  var filter = req.params.filter;
  var search = req.params.search;
  var query = "";
  if (filter == "INVDAT" || filter == "DUDDAT") {
    query = `and ${filter} eq @${search}@`;
    if (user["ROLE"] == 4) {
      query = `${filter} eq @${search}@`;
    }
    
  } else {
    query = `and ${filter} like '%25${search}%25'`;
    if (user["ROLE"] == 4) {
      query = `${filter} like '%25${search}%25'`;
    }
  }
  // console.log(query);
  if (filter == "NUM" && search == "-") {
    query = ``;
  }
  let Yportal = 'YPORTALINV',portalRepresentation = 'YPORTALINVC';
  if (user["ROLE"] == 4) {
    // If User rol is 1, consulting query by EMAIL
    count = 100;
    Yportal = 'YPORTALINA';
    portalRepresentation = 'YPORTALINVAC'
    where_filter_inv = "&OrderBy=NUM&where="+query;
  } else {
    //Else consulting Loggin Map
    count = 100;
    where_filter_inv = "&OrderBy=ID,NUM&where=ID eq " + user["ID"] +" "+ query; //Consulting OpenInv querys by EMAIL
  }
  let URL0 = URLHost + req.session.queryFolder + "/";
  //GET Open Invoices List to X3 by where clause EMAIL
  request({
    uri: URL0 +
    Yportal +`?representation=${portalRepresentation}.$query&count=` +
      count + where_filter_inv,
    method: "GET",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    json: true,
  }).then(async (inv_wofilter) => {
    // GET INVOICES
    let links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting
    inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List
    res.send({
      inv_wofilter,
      links
    });
  });
};
/**FUNCTION TO RENDER CLOSED INVOICES PAGE */
exports.close_invoices = async (req, res) => {
  const user = res.locals.user["$resources"][0]; //User info
  const pictureProfile = res.locals.user["$resources"][1]["pic"]; //Pic profile
  let admin = false;
  if (user["ROLE"] === 4) {
    admin = true;
  }
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let query_consulting = "&where=ID eq " + user["ID"].toString() + "";
  let where_filter_inv = "",
    count = 0;
  //Save LogSystem SQL init Request Closed invoices from X3
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Request Closed invoices list from X3", Status = 1, Comment = "Function: close_invoices- Line 559";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
  let Yportal = 'YPORTALINV',portalRepresentation = 'YPORTALINVC';
  if (user["ROLE"] == 4) {
    // If User rol is 1, consulting query by EMAIL
    count = 100;
    Yportal = 'YPORTALINA';
    portalRepresentation = 'YPORTALINVAC'
    where_filter_inv = "&OrderBy=NUM";
  } else {
    //Else consulting Loggin Map
    count = 100;
    where_filter_inv = "&OrderBy=ID,NUM&where=ID eq " + user["ID"] + " "; //Consulting OpenInv querys by EMAIL
  }
  let URL0 = URLHost + req.session.queryFolder + "/";
  //GET Open Invoices List to X3 by where clause EMAIL
  request({
    uri: URL0 +
    Yportal +`?representation=${portalRepresentation}.$query&count=` +
      count + where_filter_inv,
    method: "GET",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    json: true,
  }).then(async (inv_wofilter) => {
    // GET INVOICES
    let inv_filtering = JSON.stringify(inv_wofilter["$resources"]); // Create JSON String with the Close Invoices List for dataTable
    let links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting
    inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List
    //Save LogSystem SQL
    (Description = "Closed invoices list success from X3"),
      (Status = 1),
      (Comment = "Function: close_invoices- Line 557");
    SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
    //HERE RENDER PAGE AND INTRO INFO
    res.render("close_invoices", {
      pageName: "Closed Invoices",
      dashboardPage: true,
      menu: true,
      invoiceC: true,
      user,
      inv_wofilter,
      inv_filtering,
      pictureProfile,
      admin,
      links,
    });
  });
};

/**FUNCTION TO RENDER INVOICE OPEN DETAILS PAGE */
exports.inoviceO_detail = async (req, res) => {
  const user = res.locals.user["$resources"][0]; //USER INFO
  const pictureProfile = res.locals.user["$resources"][1]["pic"]; //PIC PROFILE
  const SessionKeyLog = req.session.SessionLog;
  let admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  }
  var ip = req.connection.remoteAddress;
  let inv_num = req.params.inv_num; //Invoice NUM to consult

  //SAVE SYSTEMLOG SQL
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Request Open invoice details from X3", Status = 1, Comment = "Function: inoviceO_detail-Line 420";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
  let URI0 = URLHost + req.session.queryFolder + "/";
  //Get Inv details from X3
  request({
    uri: URI0 + `YPORTALINVD('${inv_num}')?representation=YPORTALINVD.$details`,
    method: "GET",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    json: true,
  }).then(async (inv_detail) => {
    // SAVE SYSEMLOG SQL
    (Description = "Open Invoice details success from X3"),
      (Status = 1),
      (Comment = "Loading Page");
    SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

    let query_consulting = "&where=ID eq " + user["ID"] + "";
    const maping_login = JSON.parse(
      await request({
        uri: URI0 +
          "YPORTALBPS?representation=YPORTALBPS.$query&count=100" +
          query_consulting,
        method: "GET",
        insecure: true,
        rejectUnauthorized: false,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
        },
        json: true,
      }).then(async (map_loggin) => {
        return JSON.stringify(map_loggin);
      })
    );
    // BPCNUM FORM MAPPINGLOGGING
    console.log(inv_detail["BPCINV"]);
    let msg = false,
      find = 0;
    for (let i = 0; i < maping_login["$resources"].length; i++) {
      console.log(maping_login["$resources"]);
      console.log(maping_login["$resources"][i]["BPCNUM"]);
      if (maping_login["$resources"][i]["BPCNUM"] == inv_detail["BPCINV"]) {
        console.log("msg");
        find++;
      }
    }
    console.log(find);
    if (find == 0) {
      inv_detail = "";
      msg =
        "Unable to load invoice. This invoice is not available to your user account.";
    }
    //HERE RENDER PAGE AND INTRO INFO
    res.render("detail_invoice", {
      pageName: "Details " + inv_num,
      dashboardPage: true,
      menu: true,
      invoiceO: true,
      closed_inv: false,
      user,
      inv_detail,
      pictureProfile,
      admin,
      msg,
    });
  });
};

/**FUNCTION TO RENDER INVOICE CLOSE DETAILS PAGE */
exports.inoviceC_detail = async (req, res) => {
  const user = res.locals.user["$resources"][0]; //USER INFO
  const pictureProfile = res.locals.user["$resources"][1]["pic"]; //PIC PROFILE
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  var admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  }
  let inv_num = req.params.inv_num; //Invoice NUM to consult

  //SAVE SYSTEMLOG SQL
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Request closed invoice details from X3", Status = 1, Comment = "Function: inoviceC_detail-Line 493";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
  let URI0 = URLHost + req.session.queryFolder + "/";
  //Get invoice colse detail from x3
  request({
    uri: URI0 + `YPORTALINVD('${inv_num}')?representation=YPORTALINVD.$details`,
    method: "GET",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    json: true,
  }).then(async (inv_detail) => {
    // SAVE SYSTEMLOG SQL
    (Description = "Closed Invoice Details success from X3"), (Status = 1), (Comment = "Loading Page");
    SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
    let query_consulting = "&where=ID eq " + user["ID"] + "";
    const maping_login = JSON.parse(
      await request({
        uri: URI0 +
          "YPORTALBPS?representation=YPORTALBPS.$query&count=100" +
          query_consulting,
        method: "GET",
        insecure: true,
        rejectUnauthorized: false,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
        },
        json: true,
      }).then(async (map_loggin) => {
        return JSON.stringify(map_loggin);
      })
    );
    // BPCNUM FORM MAPPINGLOGGING
    console.log(inv_detail["BPCINV"]);
    let msg = false,
      find = 0;
    for (let i = 0; i < maping_login["$resources"].length; i++) {
      console.log(maping_login["$resources"]);
      console.log(maping_login["$resources"][i]["BPCNUM"]);
      if (maping_login["$resources"][i]["BPCNUM"] == inv_detail["BPCINV"]) {
        console.log("msg");
        find++;
      }
    }
    console.log(find);
    if (find == 0) {
      inv_detail = "";
      msg =
        "Unable to load invoice. This invoice is not available to your user account.";
    }
    //HERE RENDER PAGE AND INTRO INFO
    res.render("detail_invoice", {
      pageName: "Details " + inv_num,
      dashboardPage: true,
      menu: true,
      invoiceC: true,
      closed_inv: true,
      user,
      inv_detail,
      pictureProfile,
      admin,
      msg,
    });
  });
};

/**FUNCTION TO RENDER PAY METHOD PAGE */
exports.pay_methods = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0]; //User info
  const pictureProfile = res.locals.user["$resources"][1]["pic"]; //Pic profile
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  var admin = false;
  let msg
  if (user["ROLE"] == 4) {
    admin = true;
  }

  let query_consulting = "&where=ID eq " + user["ID"].toString() + ""; //Where clause with EMAIL
  let count = 1000;

  //SAVE SYSTEMLOG SQL
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Request payments methods from X3", Status = 1, Comment = "Function: pay_methods - Line 567";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

  //GET PayMethods from X3
  request({
    uri: URI +
      "YPORTALPAY?representation=YPORTALPAY.$query&count=" +
      count +
      "" +
      query_consulting,
    method: "GET",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    json: true,
  }).then(async (pay_methods) => {
    // SAVE SYSTEMLOG SQL
    (Description = "Payments methods list from X3 success"),
      (Status = 1),
      (Comment = "Function: pay_methods - Line 599");
    var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

    pay_methods = pay_methods["$resources"]; //Pay Methods List
    let CCMethod = [],
      ACHMethod = [], activeACH = [];
    // console.log(pay_methods)
    for (let i = 0; i < pay_methods.length; i++) {
      switch (pay_methods[i]["PAYTYPE"]) {
        case "CC":
          CCMethod.push(pay_methods[i]);
          break;
        case "ACH":
          ACHMethod.push(pay_methods[i]);
          break;
      }
    }
    let search =[]
    for (let i = 0; i < ACHMethod.length; i++) {
      search[0] = JSON.parse(await DataBaseSq.verifyPaymentMethodIDProcess(ACHMethod[i]['PAYID'], UserID));
      ACHMethod[i].verify = 0;
      console.log(search[0])
      if (search[0] == null) {
        ACHMethod[i].verify = 1;
      }
    }
    console.log('message')
    if (req.cookies.errorLogC) {
      msg = req.cookies.errorLogC
    }
    if (req.cookies.success) {
      msg = req.cookies.success
    }
    //HERE RENDER PAGE AND INTRO INFO
    res.render("payments_methods", {
      pageName: "Payments Methods",
      dashboardPage: true,
      menu: true,
      pay_methods: true,
      user,
      pay_methods,
      pictureProfile,
      admin,
      CCMethod, msg,
      ACHMethod,
    });
  });
};

/**FUNCTION TO SAVE PAYMENTS METHODS TO X3  */
exports.add_pay_methods = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0]; //User info
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;

  //console.log(user)
  let query_consulting = "&where=ID eq " + user["ID"] + "";
  let count = 1000;

  //Save SQL LOG
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 9, SessionKey = SessionKeyLog, Description = "Loading Add payments methods module to X3", Status = 1, Comment = "Function: add_pay_methods - line 659";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
  //Get PayMethods for check out if not duplicate
  const payIDs = JSON.parse(await request({
    uri: URI +
      "YPORTALPAY?representation=YPORTALPAY.$query&count=" +
      count +
      " " +
      query_consulting,
    method: "GET",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    json: true,
  }).then(async (list_pays) => {
    //SAVE SQL LOG
    (Description =
      "Getting payments methods from X3 to created PAYID-Get Success"),
      (Status = 1),
      (Comment = "Function: add_pay_methods - line 695");
    SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

    return JSON.stringify(list_pays);
  })
  );
  var typeMP = req.body.typeM;
  console.log(typeMP);

  if (typeMP == "CC") {
    var { cardNumber, cardName, addCardExpiryDate, cvv, addressCard, zipCode, totalAmountcard, state, city, cardNickName, } = req.body; //This variables contain  info about credit card for save in x3
    /**ENCRYPT INFO CREDIT CARD BEFORE SEND TO X3 */
    cardNumber = encrypt(cardNumber);
    cvv = encrypt(cvv);
    addCardExpiryDate = encrypt(addCardExpiryDate);
    zipCode = encrypt(zipCode);
    cardName = encrypt(cardName);

    // Check out if credit Card is duplicate
    let IDPay = 0;
    for (let i = 0; i < payIDs["$resources"].length; i++) {
      IDPay = parseInt(payIDs["$resources"][i]["PAYID"]);
      if (payIDs["$resources"][i]["CARDNO"] === cardNumber) {
        // Card Number exist in X3
        (Description = "Card Number exist in payments methods from X3 "),
          (Status = 1),
          (Comment = "Function: add_pay_methods - line 718");
        SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

        if (totalAmountcard) {
          //If the request comes from the payment of invoices Page, it returns a message of Card Number exist, try another
          res.send({
            msg: "Card Number exist, try another"
          });
          return;
        }
        req.flash("error", "Card Number exist, try another");
        return res.redirect("/payments_methods"); //If the request comes from the PayMethods Page, redirect with a message of Card Number exist, try another
      }
    }

    //If Card Number not exist in X3 Save
    IDPay = parseInt(IDPay) + 1; //Create PayID
    request({
      uri: URI + "YPORTALPAY?representation=YPORTALPAY.$create",
      method: "POST",
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
      },
      body: {
        ID: user.ID,
        PAYID: IDPay,
        CARDNAME: cardNickName,
        BPCNUM: "",
        CARDNO: cardNumber,
        CVC: cvv,
        EXPDAT: addCardExpiryDate,
        NAME: cardName,
        ADDLIG1: addressCard,
        ADDLIG2: "",
        ADDLIG3: "",
        CTY: city,
        SAT: state,
        ZIP: zipCode,
        CRY: "",
      },
      json: true,
    }).then(async (added_pay_methods) => {
      //Save LOG SYSTEM SQL
      (Description = "Payments methods added to X3 "),
        (Status = 1),
        (Comment = "Payment method added success");
      SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

      if (totalAmountcard) {
        //If the request comes from the payment of invoices Page, it returns success
        res.send({
          success: "success"
        });
        return;
      }
      req.flash("success", "Card added");
      res.redirect("/payments_methods"); //If the request comes from the PayMethods Page, redirect with a message Card added
    });
  } else {
    var { payName, bank_id, bank_account_number, legalNameAccount } = req.body; //This variables contain  info about ACH for save in x3
    /**ENCRYPT INFO ACH BEFORE SEND TO X3 */
    bank_account_number = encrypt(bank_account_number);
    bank_id = encrypt(bank_id);
    payName = encrypt(payName);
    legalNameAccount = encrypt(legalNameAccount);
    // Check out if ACH is duplicate
    let IDPay = 0;
    for (let i = 0; i < payIDs["$resources"].length; i++) {
      IDPay = parseInt(payIDs["$resources"][i]["PAYID"]);
      if (payIDs["$resources"][i]["BANKACCT"] === bank_account_number) {
        // Card Number exist in X3
        (Description = "Card Number exist in payments methods from X3 "), (Status = 1), (Comment = "Function: add_pay_methods - line 827");
        SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

        if (totalAmountcard) {//If the request comes from the payment of invoices Page, it returns a message of Card Number exist, try another
          res.send({
            msg: "Bank Account exist, try another"
          });
          return;
        }
        res.cookie('errorLogC', "Bank Account exist, try another", { maxAge: 3600 });
        return res.redirect("/payments_methods"); //If the request comes from the PayMethods Page, redirect with a message of Card Number exist, try another
      }
    }

    //If ACH not exist in X3 Save
    IDPay = parseInt(IDPay) + 1; //Create PayID
    request({
      uri: URI + "YPORTALPAY?representation=YPORTALPAY.$create",
      method: "POST",
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
      },
      body: {
        PAYTYPE: typeMP,
        ID: user.ID,
        PAYID: IDPay,
        PAYNAME: payName,
        BANKACCT: bank_account_number,
        BANKROUT: bank_id,
        BPCNUM: "",
        CARDNO: "",
        CVC: "",
        EXPDAT: "",
        NAME: legalNameAccount,
        ADDLIG1: "",
        ADDLIG2: "",
        ADDLIG3: "",
        CTY: "city",
        SAT: "state",
        ZIP: "zipCode",
        CRY: "",
      },
      json: true,
    }).then(async () => {
      //Save LOG SYSTEM SQL
      (Description = "Payments methods added to X3 "), (Status = 1), (Comment = "Payment method added success");
      SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

      if (totalAmountcard) {
        //If the request comes from the payment of invoices Page, it returns success
        res.send({
          success: "success"
        });
        return;
      }

      let apikey;
      let modeEnv = JSON.parse(
        await DataBaseSq.settingsTableTypeEnvProduction()
      );
      if (req.cookies.wf && modeEnv.Status == 1) {
        apikey = req.cookies.wf;
      } else {
        let gateaway = JSON.parse(await DataBaseSq.settingsgateway());
        let hostLink = gateaway[4]["valueSett"];
        let WF_APIKey = JSON.parse(
          await WFCCtrl.APYKeyGet(hostLink).then((response) => {
            return JSON.stringify(response);
          })
        );
        apikey = WF_APIKey["access_token"];
        if (modeEnv.Status == 1) {
          res.cookie("wf", WF_APIKey["access_token"], {
            maxAge: WF_APIKey["expires_in"],
          });
        }
      }
      //console.log(req.body)

      let FirstAmount = 0.025;
      console.log()
      //SEND PAYMENT TO WF API
      for (let i = 0; i < 2; i++) {
        FirstAmount= Math.random().toFixed(2)
        let consult_paymentID = JSON.parse(await DataBaseSq.GetLastPaymenTIDFraudP())//GET Last PaymentID WF to create next
        console.log(consult_paymentID);
        let prepare_idWF;
        if (consult_paymentID.length == 0) {
          prepare_idWF = "FP000000000001";
        } else {
          let payment_id0 = consult_paymentID[0]["TransactionID"]; // GET TRANSACTIONID FOR CREATE NEXT NUM
          prepare_idWF = payment_id0.replace("FP", ""); //
          prepare_idWF = parseInt(consult_paymentID[0]["pmtKey"]) + 1;
          let complete_seq = prepare_idWF.toString().padStart(12, "0");
          prepare_idWF = "FP" + complete_seq;
        }
        bank_account_number = decrypt(bank_account_number);
        bank_id = decrypt(bank_id);
        payName = decrypt(payName);
        legalNameAccount = decrypt(legalNameAccount);
        let fraudProtection = await WFCCtrl.WF_FraudProtection(FirstAmount, apikey, legalNameAccount, bank_id, bank_account_number, prepare_idWF);
        console.log(fraudProtection);

        let back_side_res = fraudProtection["x-backside-transport"],
          payment_id = fraudProtection["payment-id"];
        let transactionDate = moment(fraudProtection["date"]).format(
          "YYYY-MM-DD"
        );
        let error = "";
        if (fraudProtection["errors"]) {
          console.log(fraudProtection["errors"][0]);
          error = fraudProtection["errors"];
          //IF RESPONSE ERROR, SAVE IN LOGSYSTEM SQL THE ERROR
          console.log("\nError : " + JSON.stringify(error)); //SHOW IN CONSOLE THE ERROR
          let errorLogD = "Error:" + fraudProtection["errors"][0]["error_code"] + "- process payment";
          console.log(errorLogD); //SHOW IN CONSOLE THE ERROR
          let errorLogC = fraudProtection["errors"][0]["description"];
          console.log('errorLogC'); //SHOW IN CONSOLE THE ERROR
          (Description = errorLogD), (Status = 0), (Comment = errorLogC);
          SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
          SystemLogL = JSON.parse(SystemLogL);
          res.cookie('errorLogC', errorLogC, { maxAge: 3600 });
          return res.redirect("/payments_methods");
          ///return res.send({ error, SystemLogL });// RETURN RESPONSE TO AJAX
        } else if (back_side_res == "OK OK") {
          //IF RESPONSE FINE, SAVE PAYMENT INFO IN SQL TABLE
          let descp, comm, TranAmount = parseFloat(totalAmountcard), tPaymentSave;
          var paymentKey;
          //ENCRYPT CREDIT CARD INFO FOR SAVE IN SQL TABLE
          bank_id = encrypt(bank_id);
          bank_account_number = encrypt(bank_account_number);
          payName = encrypt(payName);
          legalNameAccount = encrypt(legalNameAccount);
          //IF PAYMENT STATUS IS "AUTHORIZED" SAVE IN SQL TABLE LOG SYSTEM
          descp = "Process status res: " + back_side_res;
          comm = "Process payment success: OK-PENDDING";
          (Description = descp), (Status = 1), (Comment = comm), (SessionKey = SessionKeyLog);
          SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

          //IF PAYMENT STATUS IS "OK OK" SAVE IN SQL TABLE PAYMENT
          tPaymentSave = await DataBaseSq.tPaymentFraudProtectionSave(1, SessionKey, UserID, payment_id, FirstAmount, 0, transactionDate, 0, "PENDING", "PENDING", IDPay);

          paymentKey = JSON.parse(tPaymentSave).pmtKey; // THIS GET THE PAYMENT KEY ID
          //SHOW CONSOLE INFO ABOUT PAYMENT
          console.log("--Sucess in SQL: " + paymentKey);
          // return res.send({
          //   error,
          //   WF_TransactionID,
          //   SystemLogL,
          //   paymentKey,
          // });//SEND RESPONSE TO AJAX REQUEST
        }
      }
      res.cookie('success', "ACH Bank Account added, please check your bank account for two deposits under $1 and verify the amounts. You have 14 days to verify the account, otherwise the deposits will be transferred and the bank account verification process will need to be restarted.", { maxAge: 3600 });
      res.redirect("/payments_methods"); //If the request comes from the PayMethods Page, redirect with a message Card added
    });
  }
};

exports.verify_PM = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  let PaymentMethodID = req.params.IDPay;
  const user = res.locals.user["$resources"][0]; //User info
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 9, SessionKey = SessionKeyLog, Description = "Verify Payments Methods", Status = 1, Comment = "Function: verify_PM - line 1280";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
  let search = JSON.parse(await DataBaseSq.verifyPaymentMethodID(PaymentMethodID, UserID));
  console.log(search);


  let status
  let apikey;
  let modeEnv = JSON.parse(
    await DataBaseSq.settingsTableTypeEnvProduction()
  );
  if (req.cookies.wf && modeEnv.Status == 1) {
    apikey = req.cookies.wf;
  } else {
    let gateaway = JSON.parse(await DataBaseSq.settingsgateway());
    let hostLink = gateaway[4]["valueSett"];
    let WF_APIKey = JSON.parse(
      await WFCCtrl.APYKeyGet(hostLink).then((response) => {
        return JSON.stringify(response);
      })
    );
    apikey = WF_APIKey["access_token"];
    if (modeEnv.Status == 1) {
      res.cookie("wf", WF_APIKey["access_token"], {
        maxAge: WF_APIKey["expires_in"],
      });
    }
  }
  const amount1 = req.params.amount1,amount2 = req.params.amount2
  let accountVerified = 0;
  for (let i = 0; i < search.length; i++) {
    console.log('amount2:' + amount2)
    console.log('i:' + i)
    console.log(search[i]['TranAmount'])
    if (i== 0 && search[i]['TranAmount'] != parseFloat(amount1) ) {    
      res.cookie('errorLogC', "The amount 1 does not correspond to the one sent to the account", { maxAge: 3600 });
      accountVerified = -1;
      break
    }
    if (i== 1 && search[i]['TranAmount'] != parseFloat(amount2) ) {
      res.cookie('success', "The amount 2 does not correspond to the one sent to the account", { maxAge: 3600 });
      accountVerified = -1;
      break     
    }

    status = JSON.parse(await WFCCtrl.GetStatus(apikey, search[i]['TransactionID']).then((response) => {
      return JSON.stringify(response);
    }))
    console.log(status);
    if (status['payment_status'] == 'PROCESSED') {     

      let saveFraudPr = JSON.parse(await DataBaseSq.saveFraudProtectionSave(status['trace_number'], status['payment_status'], status['payment_status'], search[i]['pmtKey']));
      accountVerified++;
            
    }
  }
  console.log(accountVerified)

  //console.log(search[0]['PaymentMethodID'])
  
  if (accountVerified > 1) {
    
    const payIDs = JSON.parse(await request({
      uri: URI +
        `YPORTALPAY?representation=YPORTALPAY.$query&where=PAYID eq ${search[0]['PaymentMethodID']}` ,
      method: "GET",
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
      },
      json: true,
    }).then(async (list_pays) => {
      //SAVE SQL LOG  
      return JSON.stringify(list_pays);
    })
    );
      console.log(payIDs)
      
      let consult_paymentID = JSON.parse(await DataBaseSq.GetLastPaymenTIDFraudP())//GET Last PaymentID WF to create next
        console.log(consult_paymentID);
        let prepare_idWF;
        if (consult_paymentID.length == 0) {
          prepare_idWF = "FP000000000001";
        } else {
          let payment_id0 = consult_paymentID[0]["TransactionID"]; // GET TRANSACTIONID FOR CREATE NEXT NUM
          prepare_idWF = payment_id0.replace("FP", ""); //
          prepare_idWF = parseInt(consult_paymentID[0]["pmtKey"]) + 1;
          let complete_seq = prepare_idWF.toString().padStart(12, "0");
          prepare_idWF = "FP" + complete_seq;
        }
       let bank_account_number = decrypt(payIDs["$resources"][0]["BANKACCT"]);
       let bank_id = decrypt(payIDs["$resources"][0]["BANKROUT"]);
       let legalNameAccount = decrypt(payIDs["$resources"][0]["NAME"]);
        let fraudProtection = await WFCCtrl.WF(0.50, apikey, legalNameAccount, bank_id, bank_account_number, prepare_idWF);
        console.log(fraudProtection);

        let back_side_res = fraudProtection["x-backside-transport"],
          payment_id = fraudProtection["payment-id"];
        let transactionDate = moment(fraudProtection["date"]).format(      "YYYY-MM-DD"    );
        let error = "";
        if (fraudProtection["errors"]) {
          console.log(fraudProtection["errors"][0]);
          error = fraudProtection["errors"];
          //IF RESPONSE ERROR, SAVE IN LOGSYSTEM SQL THE ERROR
          console.log("\nError : " + JSON.stringify(error)); //SHOW IN CONSOLE THE ERROR
          let errorLogD = "Error:" + fraudProtection["errors"][0]["error_code"] + "- process payment";
          console.log(errorLogD); //SHOW IN CONSOLE THE ERROR
          let errorLogC = fraudProtection["errors"][0]["description"];
          console.log('errorLogC'); //SHOW IN CONSOLE THE ERROR
          (Description = errorLogD), (Status = 0), (Comment = errorLogC);
          SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
          SystemLogL = JSON.parse(SystemLogL);
          res.cookie('errorLogC', errorLogC, { maxAge: 3600 });
          return res.redirect("/payments_methods");
          ///return res.send({ error, SystemLogL });// RETURN RESPONSE TO AJAX
        } else if (back_side_res == "OK OK") {
          //IF RESPONSE FINE, SAVE PAYMENT INFO IN SQL TABLE
          let descp, comm, TranAmount = parseFloat(0.50), tPaymentSave;
          var paymentKey;
          //IF PAYMENT STATUS IS "AUTHORIZED" SAVE IN SQL TABLE LOG SYSTEM
          descp = "Process status res: " + back_side_res;
          comm = "Process payment success: OK-PENDDING";
          (Description = descp), (Status = 1), (Comment = comm), (SessionKey = SessionKeyLog);
          SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

          //IF PAYMENT STATUS IS "OK OK" SAVE IN SQL TABLE PAYMENT
          tPaymentSave = await DataBaseSq.tPaymentFraudProtectionSave(1, SessionKey, UserID, payment_id, 0.50, 0, transactionDate, 0, "OK", "OK", null);

          paymentKey = JSON.parse(tPaymentSave).pmtKey; // THIS GET THE PAYMENT KEY ID
          //SHOW CONSOLE INFO ABOUT PAYMENT
          console.log("--Sucess in SQL: " + paymentKey);
        }
    res.cookie('success', "Your account was verified. Now is available to use.", { maxAge: 3600 });
    res.redirect("/payments_methods");
  } else {
    if (accountVerified == -1) {
     return res.redirect("/payments_methods");
    }
    res.cookie('errorLogC', "Your account could not be verified, please reach out to support.", { maxAge: 3600 });
    res.redirect("/payments_methods");
  }

}
/**FUNCTION TO SAVE EDITED PAYMENTS METHODS TO X3 */
exports.edit_pay_methods = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0];

  //SAVE SQL LOGSYSTEM
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user["ID"].toString(),
    IPAddress = ip,
    LogTypeKey = 9,
    SessionKey = SessionKeyLog,
    Description = "Edit payments methods module to X3",
    Status = 1,
    Comment = "Function: edit_pay_methods- line 805";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );
  var typeMP = req.body.typeM;
  //console.log(typeMP)
  if (typeMP == "CC") {
    //GET INFO OF CC
    var {
      cardNumber,
      cardName,
      addCardExpiryDate,
      cvv,
      payID,
      addressCard,
      zipCode,
      state,
      city,
      cardNickName,
    } = req.body;

    //ENCRYPT INFO ABOUT CREDIT CARD
    cardNumber = encrypt(cardNumber);
    cvv = encrypt(cvv);
    addCardExpiryDate = encrypt(addCardExpiryDate);
    zipCode = encrypt(zipCode);
    cardName = encrypt(cardName);

    //SAVE CREDIT CARD EDITED INFO
    request({
      uri: URI +
        `YPORTALPAY('${user.ID}~${payID}')?representation=YPORTALPAY.$edit`,
      method: "PUT",
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
      },
      body: {
        PAYTYPE: typeMP,
        BPCNUM: "",
        CARDNAME: cardNickName,
        CARDNO: cardNumber,
        CVC: cvv,
        EXPDAT: addCardExpiryDate,
        NAME: cardName,
        ADDLIG1: addressCard,
        ADDLIG2: "",
        ADDLIG3: "",
        CTY: city,
        SAT: state,
        ZIP: zipCode,
        CRY: "",
      },
      json: true,
    }).then(async (added_pay_methods) => {
      // SAVE SQL LOGSYSTEM
      (Description = "Success Edit payments methods module to X3"),
        (Status = 1),
        (Comment = "Function: edit_pay_methods- line 870");
      SystemLogL = await DataBasequerys.tSystemLog(
        UserID,
        IPAddress,
        LogTypeKey,
        SessionKey,
        Description,
        Status,
        Comment
      );
      req.flash("success", "Card edited");
      res.redirect("/payments_methods"); //Redirect with msg success Card Edited
    });
  } else {
    //GET INFO OF ACH
    var {
      payName,
      bank_id,
      bank_account_number,
      payID,
      legalNameAccount
    } =
      req.body;

    //ENCRYPT INFO ABOUT ACH
    bank_account_number = encrypt(bank_account_number);
    bank_id = encrypt(bank_id);
    payName = encrypt(payName);
    legalNameAccount = encrypt(legalNameAccount);
    //SAVE ACH EDITED INFO
    request({
      uri: URI +
        `YPORTALPAY('${user.ID}~${payID}')?representation=YPORTALPAY.$edit`,
      method: "PUT",
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
      },
      body: {
        PAYTYPE: typeMP,
        EMAIL: user.EMAIL,
        PAYNAME: payName,
        BANKACCT: bank_account_number,
        BANKROUT: bank_id,
        BPCNUM: "",
        CARDNO: "",
        CVC: "",
        EXPDAT: "",
        NAME: legalNameAccount,
        ADDLIG1: "",
        ADDLIG2: "",
        ADDLIG3: "",
        CTY: "city",
        SAT: "state",
        ZIP: "zipCode",
        CRY: "",
      },
      json: true,
    }).then(async (added_pay_methods) => {
      // SAVE SQL LOGSYSTEM
      (Description = "Success Edit payments methods module to X3"),
        (Status = 1),
        (Comment = "Function: edit_pay_methods- line 1049");
      SystemLogL = await DataBasequerys.tSystemLog(
        UserID,
        IPAddress,
        LogTypeKey,
        SessionKey,
        Description,
        Status,
        Comment
      );
      req.flash("success", "ACH Edited");
      res.redirect("/payments_methods"); //Redirect with msg success Card Edited
    });
  }
};

/**FUNCTION TO DELETE PAYMENT METHOD */
exports.delete_pay_methods = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0];

  //SAVE SQL LOGSYSTEM
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user["ID"].toString(),
    IPAddress = ip,
    LogTypeKey = 6,
    SessionKey = SessionKeyLog,
    Description = "Delete payments methods module to X3",
    Status = 1,
    Comment = "Function: delete_pay_methods- line 898";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );

  //Delete Payment Method by IDPAY param
  const payID = req.params.IDPay;
  request({
    uri: URI + `YPORTALPAY('${user.ID}~${payID}')?representation=YPORTALPAY.$edit`,
    method: "DELETE",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    json: true,
  }).then(async (delete_pay_methods) => {
    //SAVE SQL LOGSYSTEM
    (Description = "Success Delete payments methods module to X3"),
      (Status = 1),
      (Comment = "Function: delete_pay_methods- line 928");
    SystemLogL = await DataBasequerys.tSystemLog(UserID,IPAddress,LogTypeKey,SessionKey,Description,Status,Comment );
    let disabledPaymentMIDSQL = JSON.parse(await DataBaseSq.deletePaymentMethod(payID,UserID ))
    req.flash("success", "Card deleted");
    res.redirect("/payments_methods"); //Redirect to payment Methods page with success card deleted message
  });
};

/**FUNCTION TO RENDER PAY INVOICES PAGE */
exports.pay_invoices = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0]; //USER INFO
  const pictureProfile = res.locals.user["$resources"][1]["pic"]; //PROFILE PICTURE

  //SAVE SQL LOGSYSTEM
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user["ID"].toString(),
    IPAddress = ip,
    LogTypeKey = 6,
    SessionKey = SessionKeyLog,
    Description = "Preparing pay invoices view",
    Status = 1,
    Comment = "Function: pay_invoices- Line 957";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );

  //GET PAYMENTS METHODS FOR USE TO PAY BY USER EMAIL
  let query_consulting = "&where=ID eq " + user["ID"] + "";
  const list_methods_par = JSON.parse(
    await request({
      uri: URI +
        "YPORTALPAY?representation=YPORTALPAY.$query&count=100" +
        query_consulting,
      method: "GET",
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
      },
      json: true,
    }).then(async (pay_methods) => {
      // SAVE SQL LOGSYSTEM
      (Description = "Get PaymentMethods for pay Invoices"),
        (Status = 1),
        (Comment = "Function:pay_invoices - Line 989 ");
      SystemLogL = await DataBasequerys.tSystemLog(
        UserID,
        IPAddress,
        LogTypeKey,
        SessionKey,
        Description,
        Status,
        Comment
      );
      return JSON.stringify(pay_methods["$resources"]);
    })
  );
  let CCMethod = [],
    ACHMethod = [];
  //console.log(list_methods_par)
  for (let i = 0; i < list_methods_par.length; i++) {
    switch (list_methods_par[i]["PAYTYPE"]) {
      case "CC":
        CCMethod.push(list_methods_par[i]);
        break;
      case "ACH":
        ACHMethod.push(list_methods_par[i]);
        break;
    }
  }
  let activeACH = [];
  let search =[]
    for (let i = 0; i < ACHMethod.length; i++) {
      search[0] = JSON.parse(await DataBaseSq.verifyPaymentMethodIDProcess(ACHMethod[i]['PAYID'], UserID));
      ACHMethod[i].verify = 0;
      if (search[0] == null) {
        activeACH.push(ACHMethod[i]);
      }
    }
    

  //GET INVOICES INFO BY SELECTED IN THE OPEN INV TABLE
  let count = 100;
  const {
    ids_invoices
  } = req.body;
  let split_id = ids_invoices.split(","); // CREATE ARRAY WITH DE INVOICES NUM
  let where_filter_inv;
  var inv_wofilter = [];

  if (split_id.length > 1) {
    // IF INVOICES QUANTITY GREATER THAN 1, CONSULT QUERY ONE BY ONE AND STORE IN ARRAY "INV_WOFILTER"
    for (let i = 0; i < split_id.length; i++) {
      where_filter_inv = "&where=NUM eq '" + split_id[i] + "' "; // WHERE CLAUSE WHIT NUM INV
      inv_wofilter.push(
        await request({
          uri: URI +
            "YPORTALINV?representation=YPORTALINVO.$query&count=" +
            count +
            " " +
            where_filter_inv,
          method: "GET",
          insecure: true,
          rejectUnauthorized: false,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
          },
          json: true,
        }).then(async (inv_wofilter2) => {
          // IN CASE THE QUERY REQUEST RESPONSE BLANK, SAVE SQL LOGSYSTEM
          if (inv_wofilter2["$resources"].length == 0) {
            (Description = "Error get invoice for pay"),
              (Status = 1),
              (Comment =
                "Invoice query response blank or closed inv trying to pay. -pay_invoices Line 1037");
            SystemLogL = await DataBasequerys.tSystemLog(UserID,IPAddress,LogTypeKey,SessionKey,Description,Status,Comment            );
            return false;
          }
          let inv_filtering = JSON.stringify(inv_wofilter2["$resources"]);
          return inv_wofilter2["$resources"][0];
        })
      );
    }
  } else {
    // IF INVOICES QUANTITY IS EQUAL TO 1, CONSULT QUERY AND STORE IN ARRAY "INV_WOFILTER"
    where_filter_inv = "&where=NUM eq '" + split_id[0] + "' ";
    inv_wofilter.push(
      await request({
        uri: URI +
          "YPORTALINV?representation=YPORTALINVO.$query&count=" +
          count +
          " " +
          where_filter_inv,
        method: "GET",
        insecure: true,
        rejectUnauthorized: false,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
        },
        json: true,
      }).then(async (inv_wofilter2) => {
        // IN CASE THE QUERY REQUEST RESPONSE BLANK, SAVE SQL LOGSYSTEM
        if (inv_wofilter2["$resources"].length == 0) {
          (Description = "Error get invoice for pay"),
            (Status = 1),
            (Comment =
              "Invoice query response blank or closed inv trying to pay. - Line 1080");
          SystemLogL = await DataBasequerys.tSystemLog(UserID,IPAddress,LogTypeKey,SessionKey,Description,Status,Comment          );
          return false;
        }

        let inv_filtering = JSON.stringify(inv_wofilter2["$resources"]);
        return inv_wofilter2["$resources"][0];
      })
    );
  }

  //IF INVOICES INFO IS BLANK REDIRECT TO OPEN INVOICE PAGE AND SHOW MSG WITH THE ERROR
  if (inv_wofilter[0] == false) {
    msg =
      "One or more invoice don't  exist in query for openInv. chekeout wiht support";
    return res.redirect(`/dashboard/${msg}`);
  }

  //IF INVOICES INFO IS OK, CALCULATE THE TAXES AND TOTAL AMOUNT TO PAY, AND QUANTITY OF INVOICES  TO PAY
  let subTotal = 0,
    taxes = 0,
    Total = 0;
  for (let i = 0; i < inv_wofilter.length; i++) {
    subTotal += parseFloat(inv_wofilter[i].AMTNOT);
    Total += parseFloat(inv_wofilter[i].OPENLOC);
  }
  taxes = parseFloat(Total) - parseFloat(subTotal);
  let items = inv_wofilter.length;

  //IF USER ROLE IS 4 SHOW THE MODULE SYSTEMSETTINGS
  let admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  }

  //HERE RENDER PAGE AND ENTER INFO
  res.render("pay_invoices", {
    pageName: "Pay Invoices",
    dashboardPage: true,
    menu: true,
    pay_invoices: true,
    user,
    inv_wofilter,
    subTotal,
    taxes,
    Total,
    items,
    list_methods_par,
    pictureProfile,
    admin,
    CCMethod,
    ACHMethod,activeACH
  });
};

/**FUNCTION TO PROCESS PAYMENT */
exports.process_payment = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0]; //User info

  //Save SQL SYSTEMLOG
  var ip = req.connection.remoteAddress;
  const SessionKeyLog = req.session.SessionLog;
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 7, SessionKey = SessionKeyLog, Description = "Connecting with process payment", Status = 1, Comment = "FUNCTION: process_payment-LINE 1153";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

  //START PROCCESS PAYMENT
  var { paymentID, cardNumber, cardName, expMonth, expYear, cvv, totalAmountcard, emailCard, addressCard, zipCode, state, city, inv, appliedAmount, reasonLessAmta, userIDInv, typeCC } = req.body;
  var enable_capture = true; // ENABLE CAPTURE DATA FOR API PROCCESS PAYMENT
  // THIS CODE IS FROM API PROCCESS PAYMENT DOCUMENTATION
  try {
    var configObject = new configuration();
    var apiClient = new cybersourceRestApi.ApiClient();
    var requestObj = new cybersourceRestApi.CreatePaymentRequest();

    var clientReferenceInformation =
      new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
    clientReferenceInformation.code = "TC50171_3";
    requestObj.clientReferenceInformation = clientReferenceInformation;

    // ACTIVE DE PROCESS INFORMATION CAPTURE
    var processingInformation =
      new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
    processingInformation.capture = false;
    if (enable_capture === true) {
      processingInformation.capture = true;
    }

    requestObj.processingInformation = processingInformation;

    //PAYMENT INFORMATION IS REQUIRED
    var paymentInformation =
      new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
    var paymentInformationCard =
      new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();
    paymentInformationCard.number = cardNumber; ///'4111111111111111'
    paymentInformationCard.expirationMonth = expMonth; //'12'
    paymentInformationCard.expirationYear = expYear; //'2031'
    paymentInformationCard.securityCode = cvv;
    paymentInformation.card = paymentInformationCard;

    requestObj.paymentInformation = paymentInformation;

    var orderInformation =
      new cybersourceRestApi.Ptsv2paymentsOrderInformation();
    var orderInformationAmountDetails =
      new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
    orderInformationAmountDetails.totalAmount = parseFloat(totalAmountcard);
    orderInformationAmountDetails.currency = "USD";
    orderInformation.amountDetails = orderInformationAmountDetails;

    var orderInformationBillTo =
      new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
    orderInformationBillTo.firstName = cardName;
    orderInformationBillTo.lastName = "x";
    orderInformationBillTo.address1 = addressCard;
    orderInformationBillTo.locality = city;
    orderInformationBillTo.administrativeArea = state;
    orderInformationBillTo.postalCode = zipCode;
    orderInformationBillTo.country = "US";
    orderInformationBillTo.email = emailCard;
    orderInformationBillTo.phoneNumber = "4158880000";
    orderInformation.billTo = orderInformationBillTo;

    requestObj.orderInformation = orderInformation;

    var instance = new cybersourceRestApi.PaymentsApi(configObject, apiClient); //INSTANCE ALL INFORMATION AND CONFIGURATION FOR PAYMENTAPI

    instance.createPayment(requestObj, async function (error, data, response) {
      if (error) {
        //IF RESPONSE ERROR, SAVE IN LOGSYSTEM SQL THE ERROR
        console.log("\nError : " + JSON.stringify(error)); //SHOW IN CONSOLE THE ERROR
        let errorLogD = "Error:" + error.status + "- process payment";
        console.log(errorLogD); //SHOW IN CONSOLE THE ERROR
        let errorLogC = error.response.text;
        errorLogC = JSON.parse(errorLogC).message;
        console.log(errorLogC); //SHOW IN CONSOLE THE ERROR
        (Description = errorLogD), (Status = 0), (Comment = errorLogC);
        SystemLogL = await DataBasequerys.tSystemLog(
          UserID,
          IPAddress,
          LogTypeKey,
          SessionKey,
          Description,
          Status,
          Comment
        );
      } else if (data) {
        //IF RESPONSE FINE, SAVE PAYMENT INFO IN SQL TABLE
        let descp;
        let comm;
        let TranAmount = parseFloat(totalAmountcard);
        var tPaymentSave;
        var paymentx3S;
        var paymenKey;
        //ENCRYPT CREDIT CARD INFO FOR SAVE IN SQL TABLE
        cardNumber = encrypt(cardNumber);
        cvv = encrypt(cvv);
        zipCode = encrypt(zipCode);
        cardName = encrypt(cardName);
        let CCExpDate = expMonth + "/" + expYear;
        CCExpDate = encrypt(CCExpDate);

        if (data.status == "AUTHORIZED") {
          //IF PAYMENT STATUS IS "AUTHORIZED" SAVE IN SQL TABLE LOG SYSTEM
          descp = "Process status res: " + data.status;
          comm = "Process payment success: OK";
          (Description = descp),
            (Status = 1),
            (Comment = comm),
            (SessionKey = SessionKeyLog);
          SystemLogL = await DataBasequerys.tSystemLog(
            UserID,
            IPAddress,
            LogTypeKey,
            SessionKey,
            Description,
            Status,
            Comment
          );

          //IF PAYMENT STATUS IS "AUTHORIZED" SAVE IN SQL TABLE PAYMENT
          tPaymentSave = await DataBaseSq.RegtPayment(
            1,
            SessionKey,
            UserID,
            data.processorInformation.transactionId,
            TranAmount,
            data.processorInformation.approvalCode,
            data.submitTimeUtc,
            data.processorInformation.transactionId,
            data.status,
            data.status,
            cardNumber,
            CCExpDate,
            cvv,
            cardName,
            addressCard,
            zipCode,
            userIDInv
          );

          paymenKey = JSON.parse(tPaymentSave).pmtKey; // THIS GET THE PAYMENT KEY ID
          //SHOW CONSOLE INFO ABOUT PAYMENT
          console.log("--Sucess in SQL" + paymenKey);
          console.log("\nData : " + JSON.stringify(data));
          console.log("\nResponse : " + JSON.stringify(response));

          //FUNCTION TO SAVE IN SOAP X3
          invoices = inv.split(","); //CREATE ARRAY WHIT INVOICES NUMS PAIDS
          appliedAmount = appliedAmount.split(","); //CREATE ARRAY WHIT APPLIED AMOUNT PAIDS
          reasonLessAmta = reasonLessAmta.split(","); //CREATE ARRAY WHIT REASONS TO SHORT PAY PAIDS
          var i_file = "",
            inv_detail,
            amountPayment,
            paymentx3S,
            errorSOAP;
          let today = moment().format("YYYYMMDD"); //FORMAY DATE: 20220101
          var statusSOAP = []; //ALMACENATE IN ARRAY SOAP STATUS RESPONSE
          const parser = new xml2js.Parser({
            explicitArray: true,
          }); //THIS FUNCTION IS FOR PARSER XML

          var msgErroSOAP = [],
            inVError = [];

          //SAVE ONE BY ONE INVOICES PAIDS IN SOAP X3
          for (let i = 0; i < invoices.length; i++) {
            // FIRTS GET INVOICE DETAIL FROM X3
            inv_detail = JSON.parse(
              await request({
                uri: URI +
                  `YPORTALINVD('${invoices[i]}')?representation=YPORTALINVD.$details`,
                method: "GET",
                insecure: true,
                rejectUnauthorized: false,
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
                },
                json: true,
              }).then(async (invD) => {
                return JSON.stringify(invD);
              })
            );

            //GET AMOUNT APPLIED FOR INVOICE
            amountPayment = Number.parseFloat(appliedAmount[i]).toFixed(2);
            // GET TYPE OF CREDIT CARD
            switch (typeCC) {
              case "Visa":
                typeCC = "VISA";
                break;
              case "Mastercard":
                typeCC = "MAST";
                break;
              case "Discover":
                typeCC = "DISC";
                break;
              default:
                typeCC = typeCC;
                break;
            }

            let cardNumberD = decrypt(cardNumber); //DECRYPT CREDIT CARD NUMBER
            let Lastfour = cardNumberD.slice(-4); // GET LAST FOR NUMBER FROM CC

            i_file = `P;;RECPT;${inv_detail.BPCINV};ENG;10501;S001;${inv_detail.CUR
              };${amountPayment};${today};${data.processorInformation.transactionId
              };${typeCC}${Lastfour}|D;PAYRC;${inv_detail.GTE};${inv_detail.NUM
              };${inv_detail.CUR};${amountPayment};${reasonLessAmta[
                i
              ].toUpperCase()}|A;LOC;${inv_detail.SIVSIHC_ANA[0].CCE};DPT;${inv_detail.SIVSIHC_ANA[1].CCE
              };BRN;${inv_detail.SIVSIHC_ANA[2].CCE};BSU;${inv_detail.SIVSIHC_ANA[3].CCE
              };SBU;${inv_detail.SIVSIHC_ANA[4].CCE};${amountPayment}|END`; //I_FILE VARIABLE

            //console.log(i_file);

            //PREPARE THE XML FOR SAVE IN SOAP X3, ENTER THE I_FILE VARIABLE
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
</soapenv:Envelope>`;

            //SEND TO SOAP X3 THE XML WIHT THE PAYMENT INFO, AND GET RESPONSE
            var SOAPP = JSON.parse(
              await request({
                uri: `https://sawoffice.technolify.com:8443/soap-generic/syracuse/collaboration/syracuse/CAdxWebServiceXmlCC`,
                method: "POST",
                insecure: true,
                rejectUnauthorized: false,
                headers: {
                  "Content-Type": "application/json",
                  Accept: "*/*",
                  Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
                  soapaction: "*",
                },
                body: xmlB,
              }).then(async (SOAP) => {
                return JSON.stringify(SOAP);
              })
            );

            //PARSE XML RESPONSE FROM SOAP X3
            parser.parseString(SOAPP, async function (err, result) {
              if (
                result["soapenv:Envelope"]["soapenv:Body"][0][
                "wss:runResponse"
                ][0]["runReturn"][0]["status"][0]["_"] == "1"
              ) {
                //IF STATUS RESPONSE IS 1, PUSH IN ARRAY STATUS FOR THAT INVOICE
                statusSOAP.push({
                  status: result["soapenv:Envelope"]["soapenv:Body"][0][
                    "wss:runResponse"
                  ][0]["runReturn"][0]["status"][0]["_"],
                  error: msgErroSOAP,
                });
                return statusSOAP;
              } else {
                //IF STATUS RESPONSE IS 0, CHECK OUT THE MESSAGE RES FROM SOAP AND STORE IN ARRAY "msgErroSOAP"
                for (
                  let i = 0; i <
                  result["soapenv:Envelope"]["soapenv:Body"][0]["multiRef"]
                    .length; i++
                ) {
                  msgErroSOAP.push(
                    result["soapenv:Envelope"]["soapenv:Body"][0]["multiRef"][
                    i
                    ]["message"][0]
                  );
                }

                inVError.push(inv_detail.NUM); //STORE THE INVOICE IS IN ERROR
                statusSOAP.push({
                  status: result["soapenv:Envelope"]["soapenv:Body"][0][
                    "wss:runResponse"
                  ][0]["runReturn"][0]["status"][0]["_"],
                  error: msgErroSOAP,
                  invError: inVError,
                }); //STORE IN ARRAY: STATUS SOAP, MSG ERROR FROM X3, INVOICE NUM WITH ERROR

                //SAVE IN SQL SYSTEM LOG, SOAP ERROR WITH THE MSG RESPONSE
                (Description = "SOAP status 0"),
                  (Status = 0),
                  (Comment =
                    "SOAP Failed: " +
                    JSON.stringify(msgErroSOAP) +
                    "Inv: " +
                    JSON.stringify(inVError));
                SystemLogL = await DataBasequerys.tSystemLog(
                  UserID,
                  IPAddress,
                  LogTypeKey,
                  SessionKey,
                  Description,
                  Status,
                  Comment
                );
              }

              return statusSOAP;
            });
            paymentx3S = statusSOAP; // STORE IN VARIABLE "paymentx3S" FOR SEND TO AJAX REQUEST
            console.log("ss : " + JSON.stringify(paymentx3S)); // IN CONSOLE CHECKOUT PAYMENT X3 SOAP STATUS RESPONSE
            // console.log('\nResponse : ' + JSON.stringify(response));
            console.log(
              "\nResponse Code of Process a Payment : " +
              JSON.stringify(response["status"])
            );
          }
          return res.send({
            error,
            data,
            response,
            paymentx3S,
            SystemLogL,
            paymenKey,
          }); //SEND RESPONSE TO AJAX REQUEST
        } else {
          // IF RESPONSE OF API PROCCESS PAYMENT IS NOT "AUTHORIED"
          //SAVE IN SQL LOGSYSTEM THIS RESPONSE
          descp = "Process status res: " + data.status;
          comm = "Process payment reason:" + data.errorInformation.reason;
          (Description = descp), (Status = 0), (Comment = comm);
          SystemLogL = await DataBasequerys.tSystemLog(
            UserID,
            IPAddress,
            LogTypeKey,
            SessionKey,
            Description,
            Status,
            Comment
          );

          //SAVE PAYMENT IN SQL TABLE
          let CCExpDate = expMonth + "/" + expYear;
          let today = new Date();
          tPaymentSave = await DataBaseSq.RegtPayment(
            0,
            SessionKey,
            UserID,
            data.id,
            TranAmount,
            null,
            today,
            data.id,
            data.status,
            data.errorInformation.reason,
            cardNumber,
            CCExpDate,
            cvv,
            cardName,
            addressCard,
            zipCode
          );
          paymenKey = JSON.parse(tPaymentSave).pmtKey; //GET THE PAYMENTKEY ID FROM SQL
          //  console.log(tPaymentSave);
          return res.send({
            error,
            data,
            response,
            paymenKey
          }); // RETURN RESPONSE TO AJAX
        }
      }
    });
  } catch (error) {
    console.log("\nException on calling the API : " + error);
  }
};

/** FUNCTION TO SAVE APPLIED AMOUNT IN SQL TABLE */
exports.applied_amount = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0]; //USER INFO

  // SAVE SQL SYSTEMLOG
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Applied amount int process", Status = 1, Comment = "FUNCITON: applied_amount - LINE 1760";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

  var paymentAplication;
  var { inv, amount, shortDesc, appliedAmount, pmtKey, status
  } = req.body;
  inv = inv.split(","); // PARSE INVOICES TO ARRAY
  amount = amount.split(","); // PARSE AMOUNTS TO ARRAY
  shortDesc = shortDesc.split(","); // PARSE SHORT DESCRIPTION TO ARRAY
  appliedAmount = appliedAmount.split(","); // PARSE APPLIED AMOUNT TO ARRAY
  status = status.split(","); // PARSE STATUS TO ARRAY

  //SAVE ONE BY ONE, INVOICE PAID IN SQL TABLE PAYMENT APPLICATION
  for (let i = 0; i < inv.length; i++) {
    paymentAplication = JSON.parse(
      await DataBaseSq.RegtPaymentApplication(
        inv[i],
        amount[i],
        shortDesc[i],
        appliedAmount[i],
        pmtKey,
        status[i]
      )
    );
  }
  res.send({
    data: paymentAplication
  });
};

/**FUNCTION TO SAVE PROFILE PICTURE */
exports.save_PicProfile = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0]; //USER INFO

  //SAVE IN SQL LOGSYSTEM
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Saving pic profile", Status = 1, Comment = "FUNCTION: save_PicProfile - LINE 1614";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment
  );

  //FIRTS CONSULTING IF EXIST A PREVIOUS PIC FOR CURRENT USER
  const { email, picture } = req.body;
  var SavePic;
  var consultingPrevious = await DataBasequerys.consultingPicProfile(email);
  if (consultingPrevious) {
    //IF EXIST PICTURE, UPDATE IN SQL TABLE AND AFTER UPDATE PIC IN LOCAL USER INFO SESSION
    SavePic = await DataBasequerys.uploadPicProfile(email, picture, "update");
    SavePic = "Updated success";
    res.locals.user["$resources"][1]["pic"] = picture;
  } else {
    // ELSE INSERT THE PICTURE IN SQL TABLE AND SAVE PIC IN LOCAL USER SESSION
    SavePic = await DataBasequerys.uploadPicProfile(email, picture, "insert");
    res.locals.user["$resources"][1]["pic"] = picture;
  }

  res.send({
    data: SavePic,
    picture: picture
  }); //SEND DATA TO AJAX
};

/**FUNCTION TO PRINT INVOICE */
exports.printInvoice = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0]; //USER INFO

  //SAVE SQL SYSTEMLOG
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  // console.log(user);
  let inv_num = req.params.inv;
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Request invoice details from X3 for print", Status = 1, Comment = "FUNCTION: printInvoice - LINE 1658";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

  //GET INVOICE DETAIL FROM X3
  request({
    uri: URI + `YPORTALINVD('${inv_num}')?representation=YPORTALINVD.$details`,
    method: "GET",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    json: true,
  }).then(async (inv_detail) => {
    //HERE RENDER PAGE AND ENTER INFO
    res.render("print_invoice", {
      pageName: "Print: " + inv_num,
      dashboardPage: true,
      print_inv: true,
      user,
      inv_detail,
    });
  });
};

/** FUNCTION TO RENDER PAYMENTS PAGE */
exports.payments = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0]; //USER INFO
  const pictureProfile = res.locals.user["$resources"][1]["pic"]; //PIC PROFILE

  //SAVE SQL LOGSYSTEM
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Request payments methods from SQL TABLE", Status = 1, Comment = "FUNCTION: payments - LINE 1708";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

  var admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  }

  //FIRTS MAPPING LOG FOR GET BPCNUM'S
  let query_consulting = "&where=ID eq " + user["ID"].toString() + "";
  let count = 1000;
  const maping_login = JSON.parse(
    await request({
      uri: URI +
        "YPORTALBPS?representation=YPORTALBPS.$query&count=1000" +
        query_consulting,
      method: "GET",
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
      },
      json: true,
    }).then(async (map_loggin) => {
      return JSON.stringify(map_loggin);
    })
  );
  // STORE BPCNUM FORM MAPPINGLOGGING
  let bpcnum = [];
  for (let i = 0; i < maping_login["$resources"].length; i++) {
    bpcnum.push(maping_login["$resources"][i]["BPCNUM"]);
  }

  //GET PAYMENTS FROM SQL TABLE
  let payments = [],
    getPayments;
  for (let i = 0; i < bpcnum.length; i++) {
    await DataBaseSq.Get_tPayments(bpcnum[i]).then((response) => {
      response = JSON.parse(response); //PARSE RESPONSE
      //STORE IN ARRAY PAYMENTS
      for (let j = 0; j < response.length; j++) {
        //        console.log(payments.length);
        payments.push({
          pmtKey: response[j].pmtKey,
          CustID: response[j].CustID,
          TransactionID: response[j].TransactionID,
          TranAmount: response[j].TranAmount,
          ProcessorStatus: response[j].ProcessorStatus,
          ProcessorStatusDesc: response[j].ProcessorStatusDesc,
          DateProcessesed: response[j].DateProcessesed,
          tPaymentApplication: response[j].tPaymentApplication,
        });
      }
    });
  }

  //CLEAN PAYMENTS BLANK
  payments = JSON.stringify(payments.filter((el) => el != ""));
  //RENDER PAYMENTS PAGE
  res.render("payments", {
    pageName: "Payments",
    dashboardPage: true,
    menu: true,
    payments: true,
    user,
    pictureProfile,
    payments,
    admin,
  });
};

/**FUNCTION TO RENDER SETTINGS SYSTEM PAGE*/
exports.settingsPreview = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0]; //USER INFO
  const pictureProfile = res.locals.user["$resources"][1]["pic"]; //PIC PROFILE

  let settings = await DataBaseSq.settingsTable(); //GET SETTING FROM SQL TABLE

  let admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  } else {
    return res.redirect("/dashboard");
  }
  let file_N = __dirname + "/../config/client.crt";
  let file_N2 = __dirname + "/../config/client.key";

  let text0, text1;
  text0 = fs.readFileSync(file_N, "utf8", (error, data) => {
    if (error) throw error;
    return data;
  });
  text1 = fs.readFileSync(file_N2, "utf8", (error, data) => {
    if (error) throw error;
    return data;
  });
  text1 = decrypt(text1);
  text0 = decrypt(text0);
  let modeEnv = JSON.parse(await DataBaseSq.settingsTableTypeEnvProduction()); //GET SETTING FROM SQL TABLE
  let gateaway = JSON.parse(await DataBaseSq.settingsgateway());
  let sagex3Folder = req.session.queryFolder;
  //console.log(gateaway)
  //RENDER SYSTEM SETTING PAGE
  res.render("sysSettings", {
    pageName: "System Settings",
    dashboardPage: true,
    menu: true,
    sysSettings: true,
    user,
    pictureProfile,
    settings,
    admin,
    text0,
    text1,
    modeEnv,
    gateaway,
    sagex3Folder,
  });
};

/**FUNCTION TO SAVE SETTINGS SYSTEM */
exports.saveSetting = async (req, res) => {
  const { sValue, sType, sStatus } = req.body;

  let saveSys = await DataBaseSq.saveSetting(sValue, sType, sStatus); // SAVE SETTING IN SQL TABLE

  let settings = await DataBaseSq.settingsTable(); // GET SETTINGS FOR UPDATE DATABLE AFTER INSERT THE NEW SETTING

  res.send({
    settings
  }); //SEND TO AJAX SETTING FOR UPDATE DATATABLE
};

/**FUNCTION TO SAVE EDITED SETTINGS SYSTEM */
exports.saveEditSetting = async (req, res) => {
  const { sValue, sType, sStatus, sId } = req.body;
  let enValue = sValue;
  if (sType == "gatewayCompanyId" || sType == "gatewayEntity" || sType == "consumerKey" || sType == "consumerSecret") {
    enValue = encrypt(sValue);
  }
  let saveSys = await DataBaseSq.saveEditSetting(enValue, sType, sStatus, sId); //SAVE IN SQL TABLE EDITED SETTINGS SYSTEM

  let settings = await DataBaseSq.settingsTable(); // GET SETTINGS FOR UPDATE DATABLE AFTER INSERT THE NEW SETTING
  if (sType == "gatewayCompanyId" || sType == "Env" || sType == "gatewayEntity" || sType == "consumerKey" || sType == "consumerSecret") {
    return res.sendStatus(200);
  }
  if (sType == "queryFolder") {
    req.session.queryFolder = sValue;
  }
  return res.sendStatus(200);
  /// res.send({ settings });//SEND TO AJAX SETTING FOR UPDATE DATATABLE
};

/**FUNCTION TO GET INFO OF SETTINGS SYS TO EDIT */
exports.editSetting = async (req, res) => {
  const { sId } = req.body;
  let saveSys = JSON.parse(await DataBaseSq.editSetting(sId)); //GET INFO FROM SQL TABLE OF SETTING SYSTEM BY ID

  res.send({
    saveSys
  }); //SEND TO AJAX
};

/**FUNCTION TO PAYMENTS DETAIL PAGE */
exports.payments_detail = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0]; //USER INFO
  const pictureProfile = res.locals.user["$resources"][1]["pic"]; //PIC PROFILE
  var admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  }

  //SAVE SQL TABLE SYSTEMLOG
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let count = 1000;
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Init consulting payments details", Status = 1, Comment = "FUNCTION: payments_detail-line 1864";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

  //FIRTS GET PAYMENTS FROM SQL TABLE BY "PMTKEY"
  let pmtKey = req.params.id;
  let payments_dt = []; //USE THIS ARRAY TO STORE PAYMENTS
  await DataBaseSq.Get_tPaymentsBypmtKey(pmtKey).then((response) => {
    response = JSON.parse(response);
    //PUSH IN ARRAY PAYMENTS INFO
    payments_dt.push({
      pmtKey: response.pmtKey,
      CustID: response.CustID,
      TransactionID: response.TransactionID,
      TranAmount: response.TranAmount,
      ProcessorStatus: response.ProcessorStatus,
      ProcessorStatusDesc: response.ProcessorStatusDesc,
      DateProcessesed: response.DateProcessesed,
      tPaymentApplication: response.tPaymentApplication,
    });
  });

  let where_filter_inv;
  var inv_wofilter = []; //USE THIS ARRAY TO STORE INVOICES INFO
  //GET FROM X3, INVOICE IN PAYMENTS ARRAY INFO ONE BY ONE
  for (let i = 0; i < payments_dt[0].tPaymentApplication.length; i++) {
    //THIS IS FOR GET INFO OF CLOSED INVOICES WITH STATUS SOAP 1
    if (
      payments_dt[0].tPaymentApplication[i]["OpenAmount"] ==
      payments_dt[0].tPaymentApplication[i]["AppliedAmount"] &&
      payments_dt[0].tPaymentApplication[i]["Status"] == "1"
    ) {
      where_filter_inv =
        "&where=NUM eq '" +
        payments_dt[0].tPaymentApplication[i].INVOICENUM +
        "' "; //WHERE CLAUSE WITH INVNUM,FOR X3
      //STORE INFO INVOICE IN ARRAY
      inv_wofilter.push(
        await request({
          uri: URI +
            "YPORTALINV?representation=YPORTALINVC.$query&count=" +
            count +
            " " +
            where_filter_inv,
          method: "GET",
          insecure: true,
          rejectUnauthorized: false,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
          },
          json: true,
        }).then(async (inv_wofilter2) => {
          // IF RESPONSE BLANK, SAVE IN SQL LOGSYSTEM ERROR AND RETURN
          if (inv_wofilter2["$resources"].length == 0) {
            (Description = "Error get invoice for pay"),
              (Status = 1),
              (Comment =
                "Invoice query response blank or closed inv trying to pay. - Line 1915");
            SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
            return false;
          }
          return inv_wofilter2["$resources"][0]; //RETURN INFO INVOICE IN ARRAY
        })
      );
    } else {
      //GET INFO OPEN INVOICES OR WITH STATUS SOAP 0
      where_filter_inv =
        "&where=NUM eq '" +
        payments_dt[0].tPaymentApplication[i].INVOICENUM +
        "' "; //WHERE CLAUSE FOR X3
      //STORE INFO INVOICE IN ARRAY
      inv_wofilter.push(
        await request({
          uri: URI +
            "YPORTALINV?representation=YPORTALINVO.$query&count=" +
            count +
            " " +
            where_filter_inv,
          method: "GET",
          insecure: true,
          rejectUnauthorized: false,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
          },
          json: true,
        }).then(async (inv_wofilter2) => {
          // IF RESPONSE BLANK, SAVE IN SQL LOGSYSTEM ERROR AND RETURN
          if (inv_wofilter2["$resources"].length == 0) {
            (Description = "Error get invoice for pay"), (Status = 1), (Comment = "Invoice query response blank or closed inv trying to pay. - Line 1957");
            SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
            return false;
          }
          return inv_wofilter2["$resources"][0]; //RETURN INFO INVOICES TO ARRAY
        })
      );
    }
  }

  let payments_st = JSON.stringify(payments_dt), //CONVERT ARRAY PAYMENTS IN STRING FOR DATATABLE
    inv_wofilter_st = JSON.stringify(inv_wofilter); //CONVERT ARRAY INVOICES INFO IN STRING FOR DATATABLE

  //RENDER PAGE
  res.render("detail_payments", {
    pageName: "Payments Details",
    dashboardPage: true,
    menu: true,
    payment_detail: true,
    user,
    pictureProfile,
    payments_dt,
    admin,
    inv_wofilter,
    payments_st,
    inv_wofilter_st,
  });
};

/**FUNCTION TO STATUS PAYMENTS DETAIL PAGE */
exports.status_payments_detail = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0]; //USER INFO
  const pictureProfile = res.locals.user["$resources"][1]["pic"]; //PIC PROFILE
  var admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  }

  //SAVE SQL TABLE SYSTEMLOG
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let count = 1000;
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Init consulting payments details", Status = 1, Comment = "FUNCTION: payments_detail-line 1864";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

  //FIRTS GET PAYMENTS FROM SQL TABLE BY "PMTKEY"
  let pmtKey = req.params.id;
  let payments_dt = []; //USE THIS ARRAY TO STORE PAYMENTS
  await DataBaseSq.Get_tPaymentsBypmtKey(pmtKey).then((response) => {
    response = JSON.parse(response);
    //PUSH IN ARRAY PAYMENTS INFO
    payments_dt.push({
      pmtKey: response.pmtKey,
      CustID: response.CustID,
      TransactionID: response.TransactionID,
      TranAmount: response.TranAmount,
      ProcessorStatus: response.ProcessorStatus,
      ProcessorStatusDesc: response.ProcessorStatusDesc,
      DateProcessesed: response.DateProcessesed,
      tPaymentApplication: response.tPaymentApplication,
    });
  });

  let where_filter_inv;
  var inv_wofilter = []; //USE THIS ARRAY TO STORE INVOICES INFO
  //GET FROM X3, INVOICE IN PAYMENTS ARRAY INFO ONE BY ONE
  for (let i = 0; i < payments_dt[0].tPaymentApplication.length; i++) {
    console.log('searchLog')
    //THIS IS FOR GET INFO OF CLOSED INVOICES WITH STATUS SOAP 1
    let searchLog = await DataBasequerys.GetLogError(payments_dt[0].tPaymentApplication[i]['tlogKey']);
    console.log(searchLog)
    if (!searchLog) {
      payments_dt[0].tPaymentApplication[i].errorLog = 'N/A'
    }else {
     payments_dt[0].tPaymentApplication[i].errorLog = searchLog 
    }
    
  }

  let payments_st = JSON.stringify(payments_dt); //CONVERT ARRAY PAYMENTS IN STRING FOR DATATABLE

  //RENDER PAGE
  res.render("statusPayment", {
    pageName: "Status Payments Details",
    dashboardPage: true,
    menu: true,
    status_payment_detail: true,
    user,
    pictureProfile,
    payments_dt,
    admin,
    inv_wofilter,
    payments_st,
  });
};


/**FUNCTION TO PRINT  PAYMENTS DETAIL PAGE */
exports.Print_payments_detail = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";

  const user = res.locals.user["$resources"][0]; //USER INFO
  const pictureProfile = res.locals.user["$resources"][1]["pic"]; //PIC PROFILE
  var admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  }

  //SAVE SQL TABLE SYSTEMLOG
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let count = 1000;
  let UserID = user["ID"].toString(),
    IPAddress = ip,
    LogTypeKey = 6,
    SessionKey = SessionKeyLog,
    Description = "Init consulting payments details",
    Status = 1,
    Comment = "FUNCTION: payments_detail-line 1864";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );

  //FIRTS GET PAYMENTS FROM SQL TABLE BY "PMTKEY"
  let pmtKey = req.params.id;
  let payments_dt = []; //USE THIS ARRAY TO STORE PAYMENTS
  await DataBaseSq.Get_tPaymentsBypmtKey(pmtKey).then((response) => {
    response = JSON.parse(response);
    //PUSH IN ARRAY PAYMENTS INFO
    payments_dt.push({
      pmtKey: response.pmtKey,
      CustID: response.CustID,
      TransactionID: response.TransactionID,
      TranAmount: response.TranAmount,
      ProcessorStatus: response.ProcessorStatus,
      ProcessorStatusDesc: response.ProcessorStatusDesc,
      DateProcessesed: response.DateProcessesed,
      tPaymentApplication: response.tPaymentApplication,
    });
  });

  let where_filter_inv;
  var inv_wofilter = []; //USE THIS ARRAY TO STORE INVOICES INFO
  //GET FROM X3, INVOICE IN PAYMENTS ARRAY INFO ONE BY ONE
  for (let i = 0; i < payments_dt[0].tPaymentApplication.length; i++) {
    //THIS IS FOR GET INFO OF CLOSED INVOICES WITH STATUS SOAP 1
    if (
      payments_dt[0].tPaymentApplication[i]["OpenAmount"] ==
      payments_dt[0].tPaymentApplication[i]["AppliedAmount"] &&
      payments_dt[0].tPaymentApplication[i]["Status"] == "1"
    ) {
      where_filter_inv =
        "&where=NUM eq '" +
        payments_dt[0].tPaymentApplication[i].INVOICENUM +
        "' "; //WHERE CLAUSE WITH INVNUM,FOR X3
      //STORE INFO INVOICE IN ARRAY
      inv_wofilter.push(
        await request({
          uri: URI +
            "YPORTALINV?representation=YPORTALINVC.$query&count=" +
            count +
            " " +
            where_filter_inv,
          method: "GET",
          insecure: true,
          rejectUnauthorized: false,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
          },
          json: true,
        }).then(async (inv_wofilter2) => {
          // IF RESPONSE BLANK, SAVE IN SQL LOGSYSTEM ERROR AND RETURN
          if (inv_wofilter2["$resources"].length == 0) {
            (Description = "Error get invoice for pay"),
              (Status = 1),
              (Comment =
                "Invoice query response blank or closed inv trying to pay. - Line 1915");
            SystemLogL = await DataBasequerys.tSystemLog(
              UserID,
              IPAddress,
              LogTypeKey,
              SessionKey,
              Description,
              Status,
              Comment
            );
            return false;
          }
          return inv_wofilter2["$resources"][0]; //RETURN INFO INVOICE IN ARRAY
        })
      );
    } else {
      //GET INFO OPEN INVOICES OR WITH STATUS SOAP 0
      where_filter_inv =
        "&where=NUM eq '" +
        payments_dt[0].tPaymentApplication[i].INVOICENUM +
        "' "; //WHERE CLAUSE FOR X3
      //STORE INFO INVOICE IN ARRAY
      inv_wofilter.push(
        await request({
          uri: URI +
            "YPORTALINV?representation=YPORTALINVO.$query&count=" +
            count +
            " " +
            where_filter_inv,
          method: "GET",
          insecure: true,
          rejectUnauthorized: false,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
          },
          json: true,
        }).then(async (inv_wofilter2) => {
          // IF RESPONSE BLANK, SAVE IN SQL LOGSYSTEM ERROR AND RETURN
          if (inv_wofilter2["$resources"].length == 0) {
            (Description = "Error get invoice for pay"),
              (Status = 1),
              (Comment =
                "Invoice query response blank or closed inv trying to pay. - Line 1957");
            SystemLogL = await DataBasequerys.tSystemLog(
              UserID,
              IPAddress,
              LogTypeKey,
              SessionKey,
              Description,
              Status,
              Comment
            );
            return false;
          }
          return inv_wofilter2["$resources"][0]; //RETURN INFO INVOICES TO ARRAY
        })
      );
    }
  }

  let payments_st = JSON.stringify(payments_dt), //CONVERT ARRAY PAYMENTS IN STRING FOR DATATABLE
    inv_wofilter_st = JSON.stringify(inv_wofilter); //CONVERT ARRAY INVOICES INFO IN STRING FOR DATATABLE

  //RENDER PAGE
  res.render("print_details_payment", {
    pageName: "Payments Details",
    dashboardPage: true,
    menu: true,
    payment_detail_print: true,
    print_inv: true,
    user,
    pictureProfile,
    payments_dt,
    admin,
    inv_wofilter,
    payments_st,
    inv_wofilter_st,
  });
};

/**FUNCTION TO PROCESS PAYMENT WITH WELLS FARGO */
exports.process_payment_WF = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";

  const user = res.locals.user["$resources"][0]; //User info
  //Save SQL SYSTEMLOG
  var ip = req.connection.remoteAddress;
  const SessionKeyLog = req.session.SessionLog;
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 7, SessionKey = SessionKeyLog, Description = "Connecting process payment with wells fargo", Status = 1, Comment = "FUNCTION: process_payment_WF-LINE 2009";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

  let apikey;
  let modeEnv = JSON.parse(await DataBaseSq.settingsTableTypeEnvProduction());
  if (req.cookies.wf && modeEnv.Status == 1) {
    apikey = req.cookies.wf;
  } else {
    let gateaway = JSON.parse(await DataBaseSq.settingsgateway());
    let hostLink = gateaway[4]["valueSett"];
    let WF_APIKey = JSON.parse(
      await WFCCtrl.APYKeyGet(hostLink).then((response) => {
        return JSON.stringify(response);
      })
    );
    apikey = WF_APIKey["access_token"];
    if (modeEnv.Status == 1) {
      res.cookie("wf", WF_APIKey["access_token"], {
        maxAge: WF_APIKey["expires_in"],
      });
    }
  }

  //START PROCCESS PAYMENT
  var { bank_id, bank_account_number, totalAmountcard, inv, appliedAmount, reasonLessAmta, userIDInv, NamePayer_Bank, Payname, legalNameAccount } = req.body;
  //console.log(req.body)
  let consult_paymentID = JSON.parse(await DataBaseSq.GetLastPaymenTIDWF()); //GET Last PaymentID WF to create next
  console.log(consult_paymentID);
  let prepare_idWF;
  if (consult_paymentID.length == 0) {
    prepare_idWF = "POR000000000001";
  } else {
    let payment_id0 = consult_paymentID[0]["TransactionID"]; // GET TRANSACTIONID FOR CREATE NEXT NUM
    prepare_idWF = payment_id0.replace("POR", ""); //
    prepare_idWF = parseInt(consult_paymentID[0]["pmtKey"]) + 1;
    let complete_seq = prepare_idWF.toString().padStart(12, "0");
    prepare_idWF = "POR" + complete_seq;
  }
  //CREATE THE NEXT PAYMENT ID

  if (NamePayer_Bank == "" || NamePayer_Bank == null) {
    NamePayer_Bank = decrypt(Payname);
    console.log("NamePayer_Bank");
  }
  console.log(NamePayer_Bank);

  //SEND PAYMENT TO WF API
  let WF_TransactionID = JSON.parse(
    await WFCCtrl.WF(totalAmountcard, apikey, legalNameAccount, bank_id, bank_account_number, prepare_idWF).then((response) => {
      return JSON.stringify(response);
    })
  );

  let back_side_res = WF_TransactionID["x-backside-transport"],
    payment_id = WF_TransactionID["payment-id"];
  let transactionDate = moment(WF_TransactionID["date"]).format("YYYY-MM-DD");
  let error = "";
  if (WF_TransactionID["errors"]) {
    console.log(WF_TransactionID["errors"][0]);
    error = WF_TransactionID["errors"];
    //IF RESPONSE ERROR, SAVE IN LOGSYSTEM SQL THE ERROR
    console.log("\nError : " + JSON.stringify(error)); //SHOW IN CONSOLE THE ERROR
    let errorLogD =
      "Error:" +
      WF_TransactionID["errors"][0]["error_code"] +
      "- process payment";
    console.log(errorLogD); //SHOW IN CONSOLE THE ERROR
    let errorLogC = WF_TransactionID["errors"][0]["description"];
    console.log(errorLogC); //SHOW IN CONSOLE THE ERROR
    (Description = errorLogD), (Status = 0), (Comment = errorLogC);
    SystemLogL = await DataBasequerys.tSystemLog(
      UserID,
      IPAddress,
      LogTypeKey,
      SessionKey,
      Description,
      Status,
      Comment
    );
    SystemLogL = JSON.parse(SystemLogL);
    return res.send({
      error,
      SystemLogL
    }); // RETURN RESPONSE TO AJAX
  } else if (back_side_res == "OK OK") {
    //IF RESPONSE FINE, SAVE PAYMENT INFO IN SQL TABLE
    let descp;
    let comm;
    let TranAmount = parseFloat(totalAmountcard);
    var tPaymentSave;
    var paymentKey;
    //ENCRYPT CREDIT CARD INFO FOR SAVE IN SQL TABLE
    bank_id = encrypt(bank_id);
    bank_account_number = encrypt(bank_account_number);
    //IF PAYMENT STATUS IS "AUTHORIZED" SAVE IN SQL TABLE LOG SYSTEM
    descp = "Process status res: " + back_side_res;
    comm = "Process payment success: OK-PENDDING";
    (Description = descp), (Status = 1), (Comment = comm), (SessionKey = SessionKeyLog);
    SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

    //IF PAYMENT STATUS IS "OK OK" SAVE IN SQL TABLE PAYMENT
    tPaymentSave = await DataBaseSq.RegtPaymentWF(1, SessionKey, UserID, payment_id, TranAmount, 0, transactionDate, 0, "PENDING", "PENDING", bank_id, bank_account_number, userIDInv);

    paymentKey = JSON.parse(tPaymentSave).pmtKey; // THIS GET THE PAYMENT KEY ID
    //SHOW CONSOLE INFO ABOUT PAYMENT
    console.log("--Sucess in SQL: " + paymentKey);
    return res.send({ error, WF_TransactionID, SystemLogL, paymentKey }); //SEND RESPONSE TO AJAX REQUEST
  }
};

/**FUNCTION TO CHANGE CRON TASK SERVER (WF VERIFY) */
exports.changeCronServer = async (req, res) => {
  // var process = require('child_process');
  // process.exec('pm2 stop 1',function (error, stdout, stderr) {
  //   if (error !== null) {
  //       console.log('exec error: ' + error);
  //   }
  var exec = require("child_process").exec,
    child;
  ///C:/Users/isaac/Documents/init_checkWF.bat
  child = exec("pm2 restart 2", function (error, stdout, stderr) {
    console.log("stdout: " + stdout);
    console.log("stderr: " + stderr);
    if (error !== null) {
      console.log("exec error: " + error);
    }
  });
  return res.sendStatus(200);
};

/**FUNCTION TO STATUS PAYMENTS DETAIL PAGE */
exports.resendX3 = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0]; //USER INFO

  //SAVE SQL TABLE SYSTEMLOG
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let count = 1000;
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Init resendX3", Status = 1, Comment = "FUNCTION: resendX3-line ";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

    console.log(req.body)
    const {tPaymentPmtKey,INVOICENUM,   AppliedAmount,  ShortDescription} = req.body
    var i_file = "",inv_detail,amountPayment;
  let today = moment().format("YYYYMMDD");//FORMAY DATE: 20220101
  var statusSOAP = [];//ALMACENATE IN ARRAY SOAP STATUS RESPONSE
  const parser = new xml2js.Parser({
    explicitArray: true,
  });//THIS FUNCTION IS FOR PARSER XML 
  
  var msgErroSOAP = [],inVError = [];

    statusSOAP.pop()
    console.log('reSendX3')
    let Payment = JSON.parse(await DataBaseSq.Get_tPaymentsBypmtKey(tPaymentPmtKey))
    console.log(Payment)
    // FIRTS GET INVOICE DETAIL FROM X3
    inv_detail = JSON.parse(
      await request({
        uri:
          URI +
          `YPORTALINVD('${INVOICENUM}')?representation=YPORTALINVD.$details`,
        method: "GET",
        insecure: true,
        rejectUnauthorized: false,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
        },
        json: true,
      }).then(async (invD) => {
        return JSON.stringify(invD);
      })
    );
    //GET AMOUNT APPLIED FOR INVOICE
    amountPayment = Number.parseFloat(AppliedAmount).toFixed(2);
    let bankAccount = decrypt(Payment['bank_account_number']);//DECRYPT
    let Lastfour = bankAccount.slice(-4);// GET LAST FOR NUMBER 
    let reasonLeast = ShortDescription;
  
  
    i_file = `P;;RECPT;${inv_detail.BPCINV};ENG;10501;S001;${inv_detail.CUR};${amountPayment};${today};${Payment['ProcessorTranID']};${Payment['TransactionID']};ACH${Lastfour};10204|D;PAYRC;${inv_detail.GTE};${inv_detail.NUM};${inv_detail.CUR};${amountPayment};${reasonLeast.toUpperCase()}|A;LOC;${inv_detail.SIVSIHC_ANA[0].CCE};DPT;${inv_detail.SIVSIHC_ANA[1].CCE};BRN;000;BSU;${inv_detail.SIVSIHC_ANA[3].CCE};SBU;${inv_detail.SIVSIHC_ANA[4].CCE};${amountPayment}|END`; //I_FILE
  
    console.log(i_file);//CHECK I_FILE
  
    //PREPARE THE XML FOR SAVE IN SOAP X3, ENTER THE I_FILE VARIABLE
    let xmlB = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wss="http://www.adonix.com/WSS">
  <soapenv:Header/>
  <soapenv:Body>
  <wss:run soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
  <callContext xsi:type="wss:CAdxCallContext">
  <codeLang xsi:type="xsd:string">ENG</codeLang>
  <poolAlias xsi:type="xsd:string">${req.session.queryFolder}</poolAlias>
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
  </soapenv:Envelope>`;
  
    //SEND TO SOAP X3 THE XML WIHT THE PAYMENT INFO, AND GET RESPONSE
    var SOAPP = JSON.parse(
      await request({
        uri: `https://sawoffice.technolify.com:8443/soap-generic/syracuse/collaboration/syracuse/CAdxWebServiceXmlCC`,
        method: "POST",
        insecure: true,
        rejectUnauthorized: false,
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
          soapaction: "*",
        },
        body: xmlB,
      }).then(async (SOAP) => {
        return JSON.stringify(SOAP);
      })
    );
  var newSystemLog
    //PARSE XML RESPONSE FROM SOAP X3
    parser.parseString(SOAPP, async function (err, result) {
      if (result["soapenv:Envelope"]["soapenv:Body"][0]["wss:runResponse"][0]["runReturn"][0]["status"][0]["_"] == "1") {
        //IF STATUS RESPONSE IS 1, PUSH IN ARRAY STATUS FOR THAT INVOICE
        statusSOAP.push({
          status:
            result["soapenv:Envelope"]["soapenv:Body"][0][
            "wss:runResponse"
            ][0]["runReturn"][0]["status"][0]["_"],
          error: msgErroSOAP,
        });
        console.log('Line 145')
        console.log(statusSOAP)
        return statusSOAP;
      } else {
        //IF STATUS RESPONSE IS 0, CHECK OUT THE MESSAGE RES FROM SOAP AND STORE IN ARRAY "msgErroSOAP"
        for (let i = 0; i < result["soapenv:Envelope"]["soapenv:Body"][0]["multiRef"].length; i++) {
  
          msgErroSOAP.push(
            result["soapenv:Envelope"]["soapenv:Body"][0]["multiRef"][
            i
            ]["message"][0]
          );
        }
  
        inVError.push(inv_detail.NUM);//STORE THE INVOICE IS IN ERROR
        statusSOAP.push({
          status:
            result["soapenv:Envelope"]["soapenv:Body"][0][
            "wss:runResponse"
            ][0]["runReturn"][0]["status"][0]["_"],
          error: msgErroSOAP,
          invError: inVError,
        });//STORE IN ARRAY: STATUS SOAP, MSG ERROR FROM X3, INVOICE NUM WITH ERROR
        
            console.log(newSystemLog)
            statusSOAP.push({newSystemLog : newSystemLog});
      }

      return statusSOAP;
    });
    console.log("ss : " + JSON.stringify(statusSOAP));// IN CONSOLE CHECKOUT PAYMENT X3 SOAP STATUS RESPONSE
    console.log('--------------------')
  console.log(statusSOAP[0]['status'])
  
  let extraida = JSON.stringify(statusSOAP[0]['error']).substring(0, 70);
        //SAVE IN SQL SYSTEM LOG, SOAP ERROR WITH THE MSG RESPONSE
       Description = "Resend SOAP ",
          Status = 1,
          Comment =extraida + "-Inv: " + INVOICENUM;
            newSystemLog = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
            console.log(newSystemLog)
    //UPDATE INVOICE PAID IN SQL TABLE PAYMENT APPLICATION
    var paymentAplication = JSON.parse(await DataBaseSq.UpdPaymentApplication(inv_detail.NUM, tPaymentPmtKey, statusSOAP[0]['status'],newSystemLog));
    console.log(paymentAplication)

  res.send({statusx3: statusSOAP[0]['status'], error:statusSOAP[0]['error']})
};
/**FUNCTION TO cancelPayment PAYMENTS DETAIL PAGE */
exports.cancelPayment = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0]; //USER INFO

  //SAVE SQL TABLE SYSTEMLOG
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let count = 1000;
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Init cancelPayment", Status = 1, Comment = "FUNCTION: cancelPayment-line ";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

    console.log(req.body)
    const {tPaymentPmtKey,INVOICENUM} = req.body
    console.log('finalizePayment')
    let Payment = JSON.parse(await DataBaseSq.Get_tPaymentsBypmtKey(tPaymentPmtKey))
    console.log(Payment)
    //UPDATE INVOICE PAID IN SQL TABLE PAYMENT APPLICATION
    var paymentAplication = JSON.parse(await DataBaseSq.UpdPaymentApplication(INVOICENUM, tPaymentPmtKey, 2));
    console.log(paymentAplication)

  res.send({paymentAplication})
};
/**FUNCTION TO finalizePayment PAYMENTS DETAIL PAGE */
exports.finalizePayment = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  const user = res.locals.user["$resources"][0]; //USER INFO

  //SAVE SQL TABLE SYSTEMLOG
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let count = 1000;
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Init finalizePayment", Status = 1, Comment = "FUNCTION: finalizePayment-line ";
  var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);

    console.log(req.body)
    const {tPaymentPmtKey,INVOICENUM} = req.body
    console.log('finalizePayment')
    let Payment = JSON.parse(await DataBaseSq.Get_tPaymentsBypmtKey(tPaymentPmtKey))
    console.log(Payment)
  var newSystemLog  
        //SAVE IN SQL SYSTEM LOG, SOAP ERROR WITH THE MSG RESPONSE
       Description = "finalizePayment",
          Status = 1,
          Comment = "finalizePayment-Inv: " + INVOICENUM;
            newSystemLog = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
            console.log(newSystemLog)
    //UPDATE INVOICE PAID IN SQL TABLE PAYMENT APPLICATION
    var paymentAplication = JSON.parse(await DataBaseSq.UpdPaymentApplication(INVOICENUM, tPaymentPmtKey, 1,newSystemLog));
    console.log(paymentAplication)

  res.send({paymentAplication})
};