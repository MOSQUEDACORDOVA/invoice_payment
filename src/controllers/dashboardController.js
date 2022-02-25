const fs = require("fs");
const path = require("path");
const request = require("request-promise");
var queryFolder = 'SAWTEST1' //Name the query folder x3
var URI = `https://sawoffice.technolify.com:8443/api1/x3/erp/${queryFolder}/`; //URI query link 
var moment = require("moment-timezone");
var DataBasequerys = require("../models/data");// Functions for X3 querys
var DataBaseSq = require("../models/dataSequelize"); // Functions for SQL querys
const { encrypt, decrypt } = require("./crypto");//Encrypt / decrypt
var pdf = require("html-pdf");
const xml2js = require("xml2js");//XML parse

//Payment process configuration
var cybersourceRestApi = require("cybersource-rest-client");
var configuration = require("./ConfigurationPayment");
const { parse } = require("path");

/**START FUNCTIONS FOR PAGES */

/**FUNCTION TO RENDER CONTACT US PAGE */
exports.contactUs = async (req, res) => {
  const user = res.locals.user["$resources"][0]; //User info
  const pictureProfile = res.locals.user["$resources"][1]["pic"]; // Profile Pic

  res.render("contacts", {
    pageName: "Contact Us",
    dashboardPage: true,
    menu: true,
    contactUs: true,
    user,
    pictureProfile,
  });
};

/**FUNCTION TO RENDER OPEN INVOICES PAGE */
exports.dashboard = async (req, res) => {
  let msg = false;
  var admin = false;
  if (req.params.msg) {
    msg = req.params.msg;
  }

  const user = res.locals.user["$resources"][0];//User info
  const pictureProfile = res.locals.user["$resources"][1]["pic"];//Pic Profile

  const SessionKeyLog = req.session.SessionLog;// SessionKey from SQL Table
  var ip = req.connection.remoteAddress;
  let query_consulting = "&where=EMAIL eq '" + req.params.email + "'";//Clause where with email
  let where_filter_inv = "", //Prepare the var for consulting invoices
    count = 0;
  if (user["ROLE"] == 4) {
    //If User Role is 4 the Settings page is enabled
    admin = true;
  }

  //Declare and send log to SystemLo
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 5,
    SessionKey = SessionKeyLog,
    Description = "Preparing openInv list",
    Status = 1,
    Comment = "Starting- line 20-";

  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );
  if (user["ROLE"] > 1) {
    // If User rol is 1, consulting query by EMAIL
    count = 100;
    where_filter_inv = "&where=EMAIL eq '" + user.EMAIL + "' ";
  } else {
    //Else consulting Loggin Map
    count = 100;

    const maping_login = JSON.parse(
      await request({
        uri: URI + "YPORTALBPS?representation=YPORTALBPS.$query&count=1000" + query_consulting,
        method: "GET",
        insecure: true,
        rejectUnauthorized: false,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
        },
        json: true, // Decode JSON 
      }).then(async (map_loggin) => {
        //Save Log mapping Loggin
        (Description = "Request map_loggin  from X3 success"),
          (Status = 1),
          (Comment = "Not comments");
        SystemLogL = await DataBasequerys.tSystemLog(
          UserID,
          IPAddress,
          LogTypeKey,
          SessionKey,
          Description,
          Status,
          Comment
        );
        return JSON.stringify(map_loggin); // return response
      })
    );
    where_filter_inv = "&where=EMAIL eq '" + user["EMAIL"] + "' "; //Consulting OpenInv querys by EMAIL
  }
  // Save Log: Init GET open Invoices List
  (Description = "Request Open invoices list from X3"),
    (Status = 1),
    (Comment = "Function: Dashboard- Line 116");
  SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );

  //GET Open Invoices List to X3 by where clause EMAIL 
  request({
    uri:
      URI +
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
  }).then(async (inv_wofilter) => {

    let inv_filtering = JSON.stringify(inv_wofilter["$resources"]);// Create JSON String with the Open Invoices List for dataTable
    let links = JSON.stringify(inv_wofilter["$links"]);// Create JSON String with Links to use for "Next or Previous page" consulting
    inv_wofilter = inv_wofilter["$resources"];// Create JSON Array with the Open Invoices List

    //Save LogSystem
    (Description = "Open Invoices list success to X3"),
      (Status = 1),
      (Comment = "Function: Dashboard-line 153");
    SystemLogL = await DataBasequerys.tSystemLog(
      UserID,
      IPAddress,
      LogTypeKey,
      SessionKey,
      Description,
      Status,
      Comment
    );

    var paymentsL = await DataBaseSq.Get_tPaymentsByUser(UserID);//Get Payments by userID from SQLTable

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
      paymentsL,
      admin,
      links,
    });
  });
};

/**FUNCTION TO RENDER NEXT_PAGE O PREVIOUS PAGE REQUEST FOR OPEN INVOICES*/
exports.next_pageIO = async (req, res) => {
  let msg = false;
  var admin = false;
  if (req.params.msg) {
    msg = req.params.msg;
  }
  const user = res.locals.user["$resources"][0];// User info
  const pictureProfile = res.locals.user["$resources"][1]["pic"];// Pic profile
  if (user["ROLE"] == 4) {
    admin = true;
  }
  
  //Request for GET the next page from query consulting
  var data = req.params.data;
  request({
    uri:
      URI +
      `YPORTALINV?representation=YPORTALINVO.$query&${data}&orderBy=EMAIL,NUM&where=EMAIL eq '${user["EMAIL"]}'`,
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
    let inv_filtering = JSON.stringify(inv_wofilter["$resources"]);// Create JSON String with the Open Invoices List for dataTable
    let links = JSON.stringify(inv_wofilter["$links"]);// Create JSON String with Links to use for "Next or Previous page" consulting
    inv_wofilter = inv_wofilter["$resources"];// Create JSON Array with the Open Invoices List

    var paymentsL = await DataBaseSq.Get_tPaymentsByUser(UserID); //Get payments from SQL Table

    //RENDER PAGE
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
      paymentsL,
      admin,
      links,
    });
  });
};
/**FUNCTION TO RENDER NEXT_PAGE O PREVIOUS PAGE REQUEST FOR CLOSED INVOICES*/
exports.next_pageIC = async (req, res) => {
  let msg = false;
  var admin = false;
  if (req.params.msg) {
    msg = req.params.msg;
  }
  const user = res.locals.user["$resources"][0];// User info
  const pictureProfile = res.locals.user["$resources"][1]["pic"];// Pic profile
  if (user["ROLE"] == 4) {
    admin = true;
  }
  
  //Request for GET the next page from query consulting
  var data = req.params.data;
  request({
    uri:
      URI +
      `YPORTALINV?representation=YPORTALINVC.$query&${data}&orderBy=EMAIL,NUM&where=EMAIL eq '${user["EMAIL"]}'`,
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
    let inv_filtering = JSON.stringify(inv_wofilter["$resources"]);// Create JSON String with the Open Invoices List for dataTable
    let links = JSON.stringify(inv_wofilter["$links"]);// Create JSON String with Links to use for "Next or Previous page" consulting
    inv_wofilter = inv_wofilter["$resources"];// Create JSON Array with the Open Invoices List

    var paymentsL = await DataBaseSq.Get_tPaymentsByUser(UserID); //Get payments from SQL Table

    //RENDER PAGE
    res.render("close_invoices", {
      pageName: "Closed Invoices",
      dashboardPage: true,
      menu: true,
      invoiceC: true,
      user,
      msg,
      inv_wofilter,
      inv_filtering,
      pictureProfile,
      paymentsL,
      admin,
      links,
    });
  });
};

/**FUNCTION TO RENDER CLOSED INVOICES PAGE */
exports.close_invoices = async (req, res) => {
  const user = res.locals.user["$resources"][0];//User info
  const pictureProfile = res.locals.user["$resources"][1]["pic"];//Pic profile 
  let admin = false;
  if (user["ROLE"] === 4) {
    admin = true;
  }
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let query_consulting = "&where=EMAIL eq '" + req.params.email + "'";
  let where_filter_inv = "",
    count = 0;
  if (user["ROLE"] == 3 || user["ROLE"] == 4) {
    count = 100;
  } else {
    count = 1000;
    const maping_login = JSON.parse(
      await request({
        uri:
          URI +
          `YPORTALBPS?representation=YPORTALBPS.$query&count=10000` +
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
      }).then((map_loggin) => {
        //Return the mapping loggin response
        return JSON.stringify(map_loggin);
      })
    );

    where_filter_inv = "&where=EMAIL eq '" + user["EMAIL"] + "' ";//Where clause eq EMAIL
  }
  //Save LogSystem SQL init Request Closed invoices from X3
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 5,
    SessionKey = SessionKeyLog,
    Description = "Request Closed invoices list from X3",
    Status = 1,
    Comment = "Function: close_invoices- Line 285";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );

  //GET closed invoices from X3
  request({
    uri:
      URI +
      "YPORTALINV?representation=YPORTALINVC.$query&count=" +
      count +
      "" +
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
  }).then(async (inv_wofilter) => {
    // GET INVOICES
    let inv_filtering = JSON.stringify(inv_wofilter["$resources"]);//JSON String of Closed inv list
    inv_wofilter = inv_wofilter["$resources"];//JSON Array of Closed inv list
    let links = JSON.stringify(inv_wofilter["$links"]);// Create JSON String with Links to use for "Next or Previous page" consulting
    //Save LogSystem SQL
    (Description = "Closed invoices list success from X3"),
      (Status = 1),
      (Comment = "Function: close_invoices- Line 285 321");
    SystemLogL = await DataBasequerys.tSystemLog(
      UserID,
      IPAddress,
      LogTypeKey,
      SessionKey,
      Description,
      Status,
      Comment
    );

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
      links
    });
  });
};

/**FUNCTION TO RENDER INVOICE OPEN DETAILS PAGE */
exports.inoviceO_detail = async (req, res) => {
  const user = res.locals.user["$resources"][0];//USER INFO
  const pictureProfile = res.locals.user["$resources"][1]["pic"];//PIC PROFILE
  const SessionKeyLog = req.session.SessionLog;
  let admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  }
  var ip = req.connection.remoteAddress;
  let inv_num = req.params.inv_num;//Invoice NUM to consult

  //SAVE SYSTEMLOG SQL
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 5,
    SessionKey = SessionKeyLog,
    Description = "Request Open invoice details from X3",
    Status = 1,
    Comment = "Function: inoviceO_detail-Line 420";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );

  //Get Inv details from X3
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
    // SAVE SYSEMLOG SQL
    (Description = "Open Invoice details success from X3"),
      (Status = 1),
      (Comment = "Loading Page");
    SystemLogL = await DataBasequerys.tSystemLog(
      UserID,
      IPAddress,
      LogTypeKey,
      SessionKey,
      Description,
      Status,
      Comment
    );

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
      
    });
  });
};

/**FUNCTION TO RENDER INVOICE CLOSE DETAILS PAGE */
exports.inoviceC_detail = async (req, res) => {
  const user = res.locals.user["$resources"][0];//USER INFO
  const pictureProfile = res.locals.user["$resources"][1]["pic"];//PIC PROFILE
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  var admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  }
  let inv_num = req.params.inv_num;//Invoice NUM to consult

   //SAVE SYSTEMLOG SQL
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 5,
    SessionKey = SessionKeyLog,
    Description = "Request closed invoice details from X3",
    Status = 1,
    Comment = "Function: inoviceC_detail-Line 493";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );

  //Get invoice colse detail from x3
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
    // SAVE SYSTEMLOG SQL
    (Description = "Closed Invoice Details success from X3"),
      (Status = 1),
      (Comment = "Loading Page");
    SystemLogL = await DataBasequerys.tSystemLog(
      UserID,
      IPAddress,
      LogTypeKey,
      SessionKey,
      Description,
      Status,
      Comment
    );

    //HERE RENDER PAGE AND INTRO INFO
    res.render("detail_invoice", {
      pageName: "Details " + inv_num,
      dashboardPage: true,
      menu: true,
      invoiceC: true,
      closed_inv:true,      
      user,
      inv_detail,
      pictureProfile,
      admin,
    });
  });
};

/**FUNCTION TO RENDER PAY METHOD PAGE */
exports.pay_methods = async (req, res) => {
  const user = res.locals.user["$resources"][0];//User info
  const pictureProfile = res.locals.user["$resources"][1]["pic"];//Pic profile
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  var admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  }

  let query_consulting = "&where=EMAIL eq '" + req.params.email + "'";//Where clause with EMAIL
  let count = 1000;

  //SAVE SYSTEMLOG SQL
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 6,
    SessionKey = SessionKeyLog,
    Description = "Request payments methods from X3",
    Status = 1,
    Comment = "Function: pay_methods - Line 567";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );

  //GET PayMethods from X3
  request({
    uri:
      URI +
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
    var SystemLogL = await DataBasequerys.tSystemLog(
      UserID,
      IPAddress,
      LogTypeKey,
      SessionKey,
      Description,
      Status,
      Comment
    );

    pay_methods = pay_methods["$resources"];//Pay Methods List

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
    });
  });
};

/**FUNCTION TO SAVE PAY METHODS - X3 */
exports.add_pay_methods = async (req, res) => {
  const user = res.locals.user["$resources"][0];
  const pictureProfile = res.locals.user["$resources"][1]["pic"];
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  var {
    cardNumber,
    cardName,
    addCardExpiryDate,
    cvv,
    addressCard,
    zipCode,
    totalAmountcard,
    state,
    city,
    cardNickName,
  } = req.body;
  //console.log(user)
  let query_consulting = "&where=EMAIL eq '" + user.EMAIL + "'";
  let count = 1000;
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 9,
    SessionKey = SessionKeyLog,
    Description = "Loading Add payments methods module to X3",
    Status = 1,
    Comment = "Preparing for add payments methods";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );
  cardNumber = encrypt(cardNumber);
  cvv = encrypt(cvv);
  addCardExpiryDate = encrypt(addCardExpiryDate);
  zipCode = encrypt(zipCode);
  cardName = encrypt(cardName);
  console.log(cardNumber);

  const payIDs = JSON.parse(
    await request({
      uri:
        URI +
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
      json: true, // Para que lo decodifique automáticamente
    }).then(async (list_pays) => {
      //Get the mapping loggin
      console.log("---------------------");
      console.log(list_pays);
      (Description = "Getting payments methods from X3 to created PAYID"),
        (Status = 1),
        (Comment = "Get Success");
      SystemLogL = await DataBasequerys.tSystemLog(
        UserID,
        IPAddress,
        LogTypeKey,
        SessionKey,
        Description,
        Status,
        Comment
      );

      return JSON.stringify(list_pays);
    })
  );
  let IDPay = 0;
  for (let i = 0; i < payIDs["$resources"].length; i++) {
    IDPay = parseInt(payIDs["$resources"][i]["PAYID"]);
    if (payIDs["$resources"][i]["CARDNO"] === cardNumber) {
      console.log("Card Number exist");
      (Description = "Card Number exist in payments methods from X3 "),
        (Status = 1),
        (Comment = "Card Number exist, go back payment methods");
      SystemLogL = await DataBasequerys.tSystemLog(
        UserID,
        IPAddress,
        LogTypeKey,
        SessionKey,
        Description,
        Status,
        Comment
      );
      if (totalAmountcard) {
        res.send({ msg: "Card Number exist, try another" });
        return;
      }
      req.flash("error", "Card Number exist, try another");
      return res.redirect("/payments_methods/" + user.EMAIL);
    }
  }
  console.log(IDPay);
  IDPay = parseInt(IDPay) + 1;
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
      EMAIL: user.EMAIL,
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
    json: true, // Para que lo decodifique automáticamente
  }).then(async (added_pay_methods) => {
    // response
    //console.log(added_pay_methods)
    (Description = "Payments methods added to X3 "),
      (Status = 1),
      (Comment = "Payment method added success");
    SystemLogL = await DataBasequerys.tSystemLog(
      UserID,
      IPAddress,
      LogTypeKey,
      SessionKey,
      Description,
      Status,
      Comment
    );
    if (totalAmountcard) {
      res.send({ success: "success" });
      return;
    }
    req.flash("success", "Card added");
    res.redirect("/payments_methods/" + user.EMAIL);
  });
};
exports.edit_pay_methods = async (req, res) => {
  const user = res.locals.user["$resources"][0];
  const pictureProfile = res.locals.user["$resources"][1]["pic"];
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 9,
    SessionKey = SessionKeyLog,
    Description = "Edit payments methods module to X3",
    Status = 1,
    Comment = "Preparing for edit payments methods";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );
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
  cardNumber = encrypt(cardNumber);
  cvv = encrypt(cvv);
  addCardExpiryDate = encrypt(addCardExpiryDate);
  zipCode = encrypt(zipCode);
  cardName = encrypt(cardName);
  let query_consulting = "&where=EMAIL eq '" + user.EMAIL + "'";
  let count = 1000;
  console.log(cardNickName);

  request({
    uri:
      URI +
      `YPORTALPAY('${user.EMAIL}~${payID}')?representation=YPORTALPAY.$edit`,
    method: "PUT",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    body: {
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
    json: true, // Para que lo decodifique automáticamente
  }).then(async (added_pay_methods) => {
    // response
    //console.log(added_pay_methods)
    (Description = "Success Edit payments methods module to X3"),
      (Status = 1),
      (Comment = "Success edit payments methods");
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
    res.redirect("/payments_methods/" + user.EMAIL);
  });
};
exports.delete_pay_methods = async (req, res) => {
  const user = res.locals.user["$resources"][0];
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 6,
    SessionKey = SessionKeyLog,
    Description = "Delete payments methods module to X3",
    Status = 1,
    Comment = "Preparing for delete payments methods";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );
  const payID = req.params.IDPay;
  //console.log(user)
  let query_consulting = "&where=EMAIL eq '" + user.EMAIL + "'";
  let count = 1000;
  console.log(query_consulting);

  request({
    uri:
      URI +
      `YPORTALPAY('${user.EMAIL}~${payID}')?representation=YPORTALPAY.$edit`,
    method: "DELETE",
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
    },
    json: true, // Para que lo decodifique automáticamente
  }).then(async (delete_pay_methods) => {
    // response
    (Description = "Success Delete payments methods module to X3"),
      (Status = 1),
      (Comment = "Success for delete payments methods");
    SystemLogL = await DataBasequerys.tSystemLog(
      UserID,
      IPAddress,
      LogTypeKey,
      SessionKey,
      Description,
      Status,
      Comment
    );
    req.flash("success", "Card deleted");
    res.redirect("/payments_methods/" + user.EMAIL);
  });
};
exports.pay_invoices = async (req, res) => {
  const user = res.locals.user["$resources"][0];
  const pictureProfile = res.locals.user["$resources"][1]["pic"];
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 6,
    SessionKey = SessionKeyLog,
    Description = "Preparing pay invoices view",
    Status = 1,
    Comment = "No commets";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );

  let query_consulting = "&where=EMAIL eq '" + user.EMAIL + "'";

  const list_methods_par = JSON.parse(
    await request({
      uri:
        URI +
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
      json: true, // Para que lo decodifique automáticamente
    }).then(async (pay_methods) => {
      // GET INVOICES
      (Description = "Get PaymentMethods for pay"),
        (Status = 1),
        (Comment = "PayMethods, preparing for pay invoices");
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

  console.log(req.body);
  let count = 100;
  const { ids_invoices } = req.body;
  let split_id = ids_invoices.split(",");
  let where_filter_inv;
  var inv_wofilter = [];
  //where_filter_inv = "&where=NUM eq '" + split_id[0] + "' "
  if (split_id.length > 1) {
    for (let i = 0; i < split_id.length; i++) {
      console.log(where_filter_inv);
      where_filter_inv = "&where=NUM eq '" + split_id[i] + "' ";
      inv_wofilter.push(
        await request({
          uri:
            URI +
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
          json: true, // Para que lo decodifique automáticamente
        }).then(async (inv_wofilter2) => {
          // GET INVOICES
          console.log(inv_wofilter2);
          if (inv_wofilter2["$resources"].length == 0) {
            (Description = "Error get invoice for pay"),
              (Status = 1),
              (Comment =
                "Invoice query response blank or closed inv trying to pay. - Line 526");
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
          let inv_filtering = JSON.stringify(inv_wofilter2["$resources"]);
          return inv_wofilter2["$resources"][0];
        })
      );
    }
  } else {
    where_filter_inv = "&where=NUM eq '" + split_id[0] + "' ";
    inv_wofilter.push(
      await request({
        uri:
          URI +
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
        json: true, // Para que lo decodifique automáticamente
      }).then(async (inv_wofilter2) => {
        // GET INVOICES
        console.log(inv_wofilter2["$resources"].length);
        if (inv_wofilter2["$resources"].length == 0) {
          (Description = "Error get invoice for pay"),
            (Status = 1),
            (Comment =
              "Invoice query response blank or closed inv trying to pay. - Line 552");
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

        let inv_filtering = JSON.stringify(inv_wofilter2["$resources"]);
        return inv_wofilter2["$resources"][0];
      })
    );
  }

  console.log(inv_wofilter);
  console.log(inv_wofilter[0]);
  if (inv_wofilter[0] == false) {
    console.log("inv blank");
    msg =
      "One or more invoice don't  exist in query for openInv. chekeout wiht support";
    return res.redirect(`/dashboard/${user["EMAIL"]}/${msg}`);
  }
  let subTotal = 0,
    taxes = 0,
    Total = 0;
  for (let i = 0; i < inv_wofilter.length; i++) {
    subTotal += parseFloat(inv_wofilter[i].AMTNOT);
    Total += parseFloat(inv_wofilter[i].OPENLOC);
  }
  let admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  }
  taxes = parseFloat(Total) - parseFloat(subTotal);
  let items = inv_wofilter.length;
  //HERE RENDER PAGE AND INTRO INFO
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
  });
};

exports.process_payment = async (req, res) => {
  const user = res.locals.user["$resources"][0];
  var ip = req.connection.remoteAddress;
  const SessionKeyLog = req.session.SessionLog;
  console.log(req.body);
  var {
    paymentID,
    cardNumber,
    cardName,
    expMonth,
    expYear,
    cvv,
    totalAmountcard,
    emailCard,
    addressCard,
    zipCode,
    state,
    city,
    inv,
    appliedAmount,
    reasonLessAmta,
    userIDInv,
    typeCC,
  } = req.body;
  var enable_capture = true;
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 7,
    SessionKey = SessionKeyLog,
    Description = "Connecting with process payment",
    Status = 1,
    Comment = "Preparing process payument";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );

  try {
    var configObject = new configuration();
    var apiClient = new cybersourceRestApi.ApiClient();
    var requestObj = new cybersourceRestApi.CreatePaymentRequest();

    var clientReferenceInformation =
      new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
    clientReferenceInformation.code = "TC50171_3";
    requestObj.clientReferenceInformation = clientReferenceInformation;

    var processingInformation =
      new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
    processingInformation.capture = false;
    if (enable_capture === true) {
      processingInformation.capture = true;
    }

    requestObj.processingInformation = processingInformation;

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

    var instance = new cybersourceRestApi.PaymentsApi(configObject, apiClient);

    instance.createPayment(requestObj, async function (error, data, response) {
      if (error) {
        console.log("\nError : " + JSON.stringify(error));
        let errorLogD = "Error:" + error.status + "- process payment";
        console.log(errorLogD);
        let errorLogC = error.response.text;
        errorLogC = JSON.parse(errorLogC).message;

        console.log(errorLogC);
        (Description = errorLogD), (Status = 1), (Comment = errorLogC);
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
        //console.log('\nData : ' + JSON.stringify(data));
        let descp;
        let comm;
        let TranAmount = parseFloat(totalAmountcard);
        var tPaymentSave;
        var paymentx3S;
        var paymenKey;
        cardNumber = encrypt(cardNumber);
        cvv = encrypt(cvv);

        zipCode = encrypt(zipCode);
        cardName = encrypt(cardName);
        if (data.status == "AUTHORIZED") {
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
          console.log(data.orderInformation.amountDetails.totalAmount);
          console.log(TranAmount);
          let CCExpDate = expMonth + "/" + expYear;
          CCExpDate = encrypt(CCExpDate);
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
          paymenKey = JSON.parse(tPaymentSave).pmtKey;
          console.log("--Sucess in SQL" + paymenKey);

          console.log("\nData : " + JSON.stringify(data));
          console.log("\nResponse : " + JSON.stringify(response));

          //paymentx3S= await savePaymentX3(inv,appliedAmount,user['EMAIL'])
          //FUNTION TO SAVE IN SOAPx3
          invoices = inv.split(",");
          appliedAmount = appliedAmount.split(",");
          reasonLessAmta = reasonLessAmta.split(",");
          var i_file = "",
            inv_detail,
            amountPayment,
            paymentx3S,
            errorSOAP;
          let today = moment().format("YYYYMMDD");
          var statusSOAP = [];
          const parser = new xml2js.Parser({
            explicitArray: true,
          });
          var msgErroSOAP = [],
            inVError = [];
          for (let i = 0; i < invoices.length; i++) {
            console.log(
              "--------------------------------------------------------"
            );
            inv_detail = JSON.parse(
              await request({
                uri:
                  URI +
                  `YPORTALINVD('${invoices[i]}')?representation=YPORTALINVD.$details`,
                method: "GET",
                insecure: true,
                rejectUnauthorized: false,
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: "Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=",
                },
                json: true, // Para que lo decodifique automáticamente
              }).then(async (invD) => {
                // GET INVOICES
                // Description = "Get PaymentMethods for pay", Status = 1, Comment = "PayMethods, preparing for pay invoices";
                // SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
                return JSON.stringify(invD);
              })
            );

            amountPayment = Number.parseFloat(appliedAmount[i]).toFixed(2);
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
            let cardNumberD = decrypt(cardNumber);
            let Lastfour = cardNumberD.slice(-4);
            console.log("reason:" + reasonLessAmta[i].toUpperCase());
            i_file = `P;;RECPT;${inv_detail.BPCINV};ENG;10501;S001;${inv_detail.CUR
              };${amountPayment};${today};${data.processorInformation.transactionId
              };${typeCC}${Lastfour}|D;PAYRC;${inv_detail.GTE};${inv_detail.NUM
              };${inv_detail.CUR};${amountPayment};${reasonLessAmta[
                i
              ].toUpperCase()}|A;LOC;${inv_detail.SIVSIHC_ANA[0].CCE};DPT;${inv_detail.SIVSIHC_ANA[1].CCE
              };BRN;${inv_detail.SIVSIHC_ANA[2].CCE};BSU;${inv_detail.SIVSIHC_ANA[3].CCE
              };SBU;${inv_detail.SIVSIHC_ANA[4].CCE};${amountPayment}|END`;
            console.log(i_file);
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
                //json: true, // Para que lo decodifique automáticamente
              }).then(async (SOAP) => {
                // GET INVOICES
                //console.log(SOAP)
                // Description = "Get PaymentMethods for pay", Status = 1, Comment = "PayMethods, preparing for pay invoices";
                // SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
                return JSON.stringify(SOAP);
              })
            );
            parser.parseString(SOAPP, async function (err, result) {
              if (
                result["soapenv:Envelope"]["soapenv:Body"][0][
                "wss:runResponse"
                ][0]["runReturn"][0]["status"][0]["_"] == "1"
              ) {
                console.log(
                  result["soapenv:Envelope"]["soapenv:Body"][0][
                  "wss:runResponse"
                  ][0]["runReturn"][0]["status"][0]["_"]
                );
                //Description = "SOAP status 1", Status = 1, Comment = "SOAP SUccess";
                //  SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
                statusSOAP.push({
                  status:
                    result["soapenv:Envelope"]["soapenv:Body"][0][
                    "wss:runResponse"
                    ][0]["runReturn"][0]["status"][0]["_"],
                  error: msgErroSOAP,
                });
                return statusSOAP;
              } else {
                for (
                  let i = 0;
                  i <
                  result["soapenv:Envelope"]["soapenv:Body"][0]["multiRef"]
                    .length;
                  i++
                ) {
                  console.log(
                    result["soapenv:Envelope"]["soapenv:Body"][0][
                    "wss:runResponse"
                    ][0]["runReturn"][0]["status"][0]["_"]
                  );
                  msgErroSOAP.push(
                    result["soapenv:Envelope"]["soapenv:Body"][0]["multiRef"][
                    i
                    ]["message"][0]
                  );
                }

                inVError.push(inv_detail.NUM);
                statusSOAP.push({
                  status:
                    result["soapenv:Envelope"]["soapenv:Body"][0][
                    "wss:runResponse"
                    ][0]["runReturn"][0]["status"][0]["_"],
                  error: msgErroSOAP,
                  invError: inVError,
                });
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
            paymentx3S = statusSOAP;
            console.log("ss : " + JSON.stringify(paymentx3S));

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
          });
        } else {
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
          paymenKey = JSON.parse(tPaymentSave).pmtKey;
          console.log(tPaymentSave);
          return res.send({ error, data, response, paymenKey });
        }
      }
    });
  } catch (error) {
    console.log("\nException on calling the API : " + error);
  }
};
exports.applied_amount = async (req, res) => {
  const user = res.locals.user["$resources"][0];
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 6,
    SessionKey = SessionKeyLog,
    Description = "Applied amount",
    Status = 1,
    Comment = "Preparing data";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );

  console.log(req.body);
  var paymentAplication;
  var { inv, amount, shortDesc, appliedAmount, pmtKey, status } = req.body;
  inv = inv.split(",");
  amount = amount.split(",");
  shortDesc = shortDesc.split(",");
  appliedAmount = appliedAmount.split(",");
  status = status.split(",");
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
  console.log("--here");

  console.log(paymentAplication);
  res.send({ data: paymentAplication });
};
exports.save_PicProfile = async (req, res) => {
  const user = res.locals.user["$resources"][0];
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 5,
    SessionKey = SessionKeyLog,
    Description = "Saving pic profile",
    Status = 1,
    Comment = "Preparing data";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );

  console.log("(----");
  const { email, picture } = req.body;
  var SavePic;
  var consultingPrevious = await DataBasequerys.consultingPicProfile(email);
  //console.log(consultingPrevious)
  if (consultingPrevious) {
    SavePic = await DataBasequerys.uploadPicProfile(email, picture, "update");
    SavePic = "Updated success";
    res.locals.user["$resources"][1]["pic"] = picture;
  } else {
    SavePic = await DataBasequerys.uploadPicProfile(email, picture, "insert");
    res.locals.user["$resources"][1]["pic"] = picture;
  }

  console.log(SavePic);
  res.send({ data: SavePic, picture: picture });
};

exports.printInvoice = async (req, res) => {
  const user = res.locals.user["$resources"][0];
  const pictureProfile = res.locals.user["$resources"][1]["pic"];
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  console.log(user);
  let inv_num = req.params.inv;
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 5,
    SessionKey = SessionKeyLog,
    Description = "Request invoice details from X3 for print",
    Status = 1,
    Comment = "Not comments";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );
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
    json: true, // Para que lo decodifique automáticamente
  }).then(async (inv_detail) => {
    // GET INVOICES
    console.log(inv_detail);
    (Description = "Closed Invoice Details success from X3"),
      (Status = 1),
      (Comment = "Loading Page");
    SystemLogL = await DataBasequerys.tSystemLog(
      UserID,
      IPAddress,
      LogTypeKey,
      SessionKey,
      Description,
      Status,
      Comment
    );
    //HERE RENDER PAGE AND INTRO INFO
    res.render("print_invoice", {
      pageName: "Print: " + inv_num,
      dashboardPage: true,
      print_inv: true,
      user,
      inv_detail,
      pictureProfile,
    });
  });
};

exports.payments = async (req, res) => {
  const user = res.locals.user["$resources"][0];
  const pictureProfile = res.locals.user["$resources"][1]["pic"];
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;
  console.log(user);
  var admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  }
  let query_consulting = "&where=EMAIL eq '" + req.params.email + "'";
  let count = 1000;
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 6,
    SessionKey = SessionKeyLog,
    Description = "Request payments methods from X3",
    Status = 1,
    Comment = "Not comments";
  var SystemLogL = await DataBasequerys.tSystemLog(
    UserID,
    IPAddress,
    LogTypeKey,
    SessionKey,
    Description,
    Status,
    Comment
  );

  const maping_login = JSON.parse(
    await request({
      uri:
        URI +
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
      json: true, // Para que lo decodifique automáticamente
    }).then(async (map_loggin) => {
      //Get the mapping loggin

      (Description = "Request map_loggin  from X3 succes"),
        (Status = 1),
        (Comment = "Not comments");
      SystemLogL = await DataBasequerys.tSystemLog(
        UserID,
        IPAddress,
        LogTypeKey,
        SessionKey,
        Description,
        Status,
        Comment
      );
      return JSON.stringify(map_loggin);
    })
  );
  let bpcnum = [];

  for (let i = 0; i < maping_login["$resources"].length; i++) {
    bpcnum.push(maping_login["$resources"][i]["BPCNUM"]);
  }
  console.log(bpcnum);
  let payments = [],
    getPayments;
  for (let i = 0; i < bpcnum.length; i++) {
    await DataBaseSq.Get_tPayments(bpcnum[i]).then((response) => {
      response = JSON.parse(response);
      //console.log(response)
      for (let j = 0; j < response.length; j++) {
        console.log(payments.length);
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
  let newarr = [];

  console.log("----");
  var hash = {};
  payments = payments.filter(function (current) {
    var exists = !hash[current.pmtKey];
    hash[current.pmtKey] = true;
    return exists;
  });

  payments = JSON.stringify(payments.filter((el) => el != ""));
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

//settings
exports.settingsPreview = async (req, res) => {
  const user = res.locals.user["$resources"][0];
  const pictureProfile = res.locals.user["$resources"][1]["pic"];
  let settings = await DataBaseSq.settingsTable();
  let admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  }
  res.render("sysSettings", {
    pageName: "System Settings",
    dashboardPage: true,
    menu: true,
    sysSettings: true,
    user,
    pictureProfile,
    settings,
    admin,
  });
};
exports.saveSetting = async (req, res) => {
  const { sValue, sType, sStatus } = req.body;
  let saveSys = await DataBaseSq.saveSetting(sValue, sType, sStatus);
  console.log(saveSys);
  let settings = await DataBaseSq.settingsTable();

  res.send({ settings });
};
exports.saveEditSetting = async (req, res) => {
  console.log(req.body);
  const { sValue, sType, sStatus, sId } = req.body;
  let saveSys = await DataBaseSq.saveEditSetting(sValue, sType, sStatus, sId);
  console.log(saveSys);
  let settings = await DataBaseSq.settingsTable();

  res.send({ settings });
};
exports.editSetting = async (req, res) => {
  const { sId } = req.body;
  let saveSys = JSON.parse(await DataBaseSq.editSetting(sId));
  console.log(saveSys);

  res.send({ saveSys });
};

exports.payments_detail = async (req, res) => {
  const user = res.locals.user["$resources"][0];
  const pictureProfile = res.locals.user["$resources"][1]["pic"];
  const SessionKeyLog = req.session.SessionLog;
  var ip = req.connection.remoteAddress;

  var admin = false;
  if (user["ROLE"] == 4) {
    admin = true;
  }
  let query_consulting = "&where=EMAIL eq '" + user["EMAIL"] + "'";
  let count = 1000;
  let UserID = user["EMAIL"],
    IPAddress = ip,
    LogTypeKey = 6,
    SessionKey = SessionKeyLog,
    Description = "Request payments methods from X3",
    Status = 1,
    Comment = "Not comments";
  // var SystemLogL = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)

  let pmtKey = req.params.id;
  let payments_dt = [],
    getPayments;
  console.log(pmtKey);
  await DataBaseSq.Get_tPaymentsBypmtKey(pmtKey).then((response) => {
    response = JSON.parse(response);
    //
    console.log(response);
    console.log(payments_dt.length);
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

  console.log("----");
  console.log(payments_dt[0].tPaymentApplication);
  let where_filter_inv;
  var inv_wofilter = [];
  for (let i = 0; i < payments_dt[0].tPaymentApplication.length; i++) {
    console.log(payments_dt[0].tPaymentApplication[i]["OpenAmount"]);
    console.log(payments_dt[0].tPaymentApplication[i]["AppliedAmount"]);
    if (
      payments_dt[0].tPaymentApplication[i]["OpenAmount"] ==
      payments_dt[0].tPaymentApplication[i]["AppliedAmount"] &&
      payments_dt[0].tPaymentApplication[i]["Status"] == "1"
    ) {
      where_filter_inv =
        "&where=NUM eq '" +
        payments_dt[0].tPaymentApplication[i].INVOICENUM +
        "' ";
      inv_wofilter.push(
        await request({
          uri:
            URI +
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
          json: true, // Para que lo decodifique automáticamente
        }).then(async (inv_wofilter2) => {
          // GET INVOICES
          if (inv_wofilter2["$resources"].length == 0) {
            (Description = "Error get invoice for pay"),
              (Status = 1),
              (Comment =
                "Invoice query response blank or closed inv trying to pay. - Line 526");
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
          let inv_filtering = JSON.stringify(inv_wofilter2["$resources"]);
          return inv_wofilter2["$resources"][0];
        })
      );
    } else {
      where_filter_inv =
        "&where=NUM eq '" +
        payments_dt[0].tPaymentApplication[i].INVOICENUM +
        "' ";
      inv_wofilter.push(
        await request({
          uri:
            URI +
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
          json: true, // Para que lo decodifique automáticamente
        }).then(async (inv_wofilter2) => {
          // GET INVOICES
          if (inv_wofilter2["$resources"].length == 0) {
            (Description = "Error get invoice for pay"),
              (Status = 1),
              (Comment =
                "Invoice query response blank or closed inv trying to pay. - Line 526");
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
          let inv_filtering = JSON.stringify(inv_wofilter2["$resources"]);
          return inv_wofilter2["$resources"][0];
        })
      );
    }
  }
  let payments_st = JSON.stringify(payments_dt),
    inv_wofilter_st = JSON.stringify(inv_wofilter);
  console.log(payments_dt);
  console.log(inv_wofilter);
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
