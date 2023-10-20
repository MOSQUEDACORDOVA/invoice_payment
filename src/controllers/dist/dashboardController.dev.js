"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fs = require("fs");

var path = require("path");

var request = require("request-promise");

var queryFolder = "SAWTEST1"; //Name the query folder X3
///var URI = `https://sawoffice.technolify.com:8443/api1/x3/erp/${queryFolder}/`; //URI query link

var URLHost = "https://sawoffice.technolify.com:8443/api1/x3/erp/"; //URI query link

var moment = require("moment-timezone");

var DataBasequerys = require("../models/data"); // Functions for SQL querys


var DataBaseSq = require("../models/dataSequelize"); // Functions for SQL querys with sequelize


var _require = require("./crypto"),
    encrypt = _require.encrypt,
    decrypt = _require.decrypt; //Encrypt / decrypt


var pdf = require("html-pdf"); //  THIS MODULE USE IN CASE CREATE PDF FILE


var xml2js = require("xml2js"); //XML parse


var http = require("https");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var _require2 = require("uuid"),
    uuidv4 = _require2.v4; //Payment process configuration


var cybersourceRestApi = require("cybersource-rest-client");

var configuration = require("./ConfigurationPayment");

var _require3 = require("path"),
    parse = _require3.parse;

var WFCCtrl = require("./WFCtrl");

require("dotenv").config();
/**START FUNCTIONS FOR PAGES */

/**FUNCTION TO RENDER CONTACT US PAGE */


exports.contactUs = function _callee(req, res) {
  var user, pictureProfile, admin, banner, activeBanner;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = res.locals.user["$resources"][0]; //User info

          pictureProfile = res.locals.user["$resources"][1]["pic"]; // Profile Pic

          admin = false;

          if (user["ROLE"] == 4) {
            //If User Role is 4 the Settings page is enabled
            admin = true;
          }

          _context.t0 = JSON;
          _context.next = 7;
          return regeneratorRuntime.awrap(DataBaseSq.bannerSetting());

        case 7:
          _context.t1 = _context.sent;
          banner = _context.t0.parse.call(_context.t0, _context.t1);
          activeBanner = false;

          if (banner.Status == 1) {
            activeBanner = true;
          }

          res.render("contacts", {
            pageName: "Contact Us",
            dashboardPage: true,
            menu: true,
            contactUs: true,
            user: user,
            pictureProfile: pictureProfile,
            admin: admin,
            banner: banner,
            activeBanner: activeBanner
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
};
/**FUNCTION TO RENDER OPEN INVOICES PAGE */


exports.dashboard = function _callee4(req, res) {
  var msg, admin, user, pictureProfile, SessionKeyLog, ip, query_consulting, where_filter_inv, count, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, Yportal, portalRepresentation, URL0, _query_consulting, maping_login, bpcnum, i, payments, inv_wofilter, getPayments, _i, response, inv_filtering, links, banner, activeBanner;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          msg = false;
          admin = false;

          if (req.params.msg) {
            msg = req.params.msg;
          }

          user = res.locals.user["$resources"][0]; //User info

          pictureProfile = res.locals.user["$resources"][1]["pic"]; //Pic Profile

          SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table

          ip = req.connection.remoteAddress;
          query_consulting = "&where=ID eq " + user["ID"].toString() + ""; //Clause where with email

          where_filter_inv = "", count = 0;

          if (user["ROLE"] == 4) {
            //If User Role is 4 the Settings page is enabled
            admin = true;
          } //Declare and send log to SystemLo


          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Function: Dashboard", Status = 1, Comment = "Starting- line 71-";
          _context4.next = 13;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 13:
          SystemLogL = _context4.sent;
          Yportal = 'YPORTALINV', portalRepresentation = 'YPORTALINVO';

          if (user["ROLE"] == 4 || user["ROLE"] == 5) {
            // If User rol is 1, consulting query by EMAIL
            count = 100;
            Yportal = 'YPORTALINA';
            portalRepresentation = 'YPORTALINVAO';
            where_filter_inv = "&OrderBy=NUM";
          } else if (user["ROLE"] == 1 || user["ROLE"] == 2) {
            //Else consulting Loggin Map
            count = 100;
            where_filter_inv = "&OrderBy=ID,NUM&where=ID eq " + user["ID"] + " "; //Consulting OpenInv querys by EMAIL
          }

          URL0 = URLHost + req.session.queryFolder + "/";

          if (!(user["ROLE"] != 3)) {
            _context4.next = 21;
            break;
          }

          //GET Open Invoices List to X3 by where clause EMAIL
          request({
            uri: URL0 + Yportal + "?representation=".concat(portalRepresentation, ".$query&count=") + count + where_filter_inv,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee2(inv_wofilter) {
            var inv_filtering, links, banner, activeBanner;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    inv_filtering = JSON.stringify(inv_wofilter["$resources"]); // Create JSON String with the Open Invoices List for dataTable

                    links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting

                    inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List3
                    //console.log(links)

                    _context2.t0 = JSON;
                    _context2.next = 6;
                    return regeneratorRuntime.awrap(DataBaseSq.bannerSetting());

                  case 6:
                    _context2.t1 = _context2.sent;
                    banner = _context2.t0.parse.call(_context2.t0, _context2.t1);
                    activeBanner = false;

                    if (banner.Status == 1) {
                      activeBanner = true;
                    } //HERE RENDER PAGE AND INTRO INFO


                    res.render("open_invoices", {
                      pageName: "Open Invoices",
                      dashboardPage: true,
                      menu: true,
                      invoiceO: true,
                      user: user,
                      msg: msg,
                      inv_wofilter: inv_wofilter,
                      inv_filtering: inv_filtering,
                      pictureProfile: pictureProfile,
                      admin: admin,
                      links: links,
                      banner: banner,
                      activeBanner: activeBanner
                    });

                  case 11:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: dashboardController.js ~ line 122 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 122";
            return res.redirect("/dashboard/".concat(msg0));
          });
          _context4.next = 51;
          break;

        case 21:
          console.log('test');
          _query_consulting = "&where=ID eq " + user["ID"] + "";
          _context4.t0 = JSON;
          _context4.next = 26;
          return regeneratorRuntime.awrap(request({
            uri: URL0 + "YPORTALBPS?representation=YPORTALBPS.$query&count=100" + _query_consulting,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee3(map_loggin) {
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    return _context3.abrupt("return", JSON.stringify(map_loggin));

                  case 1:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: dashboardController.js ~ line 148 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 148";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 26:
          _context4.t1 = _context4.sent;
          maping_login = _context4.t0.parse.call(_context4.t0, _context4.t1);
          // STORE BPCNUM FORM MAPPINGLOGGING
          bpcnum = [];

          for (i = 0; i < maping_login["$resources"].length; i++) {
            bpcnum.push(maping_login["$resources"][i]["BPCNUM"]);
          } //GET PAYMENTS FROM SQL TABLE


          payments = [], inv_wofilter = [];
          _i = 0;

        case 32:
          if (!(_i < bpcnum.length)) {
            _context4.next = 40;
            break;
          }

          _context4.next = 35;
          return regeneratorRuntime.awrap(DataBasequerys.Get_YPORTALINAO(bpcnum[_i]));

        case 35:
          response = _context4.sent;

          if (response[0]) {
            inv_wofilter.push(response[0]);
          }

        case 37:
          _i++;
          _context4.next = 32;
          break;

        case 40:
          inv_filtering = JSON.stringify(inv_wofilter); // Create JSON String with the Open Invoices List for dataTable

          links = JSON.stringify(maping_login["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting

          console.log(inv_wofilter);
          _context4.t2 = JSON;
          _context4.next = 46;
          return regeneratorRuntime.awrap(DataBaseSq.bannerSetting());

        case 46:
          _context4.t3 = _context4.sent;
          banner = _context4.t2.parse.call(_context4.t2, _context4.t3);
          activeBanner = false;

          if (banner.Status == 1) {
            activeBanner = true;
          } //HERE RENDER PAGE AND INTRO INFO


          res.render("open_invoices", {
            pageName: "Open Invoices",
            dashboardPage: true,
            menu: true,
            invoiceO: true,
            user: user,
            msg: msg,
            inv_wofilter: inv_wofilter,
            inv_filtering: inv_filtering,
            pictureProfile: pictureProfile,
            admin: admin,
            links: links,
            banner: banner,
            activeBanner: activeBanner
          });

        case 51:
        case "end":
          return _context4.stop();
      }
    }
  });
};
/**FUNCTION TO RENDER OPEN INVOICES PAGE */


exports.openInvMore = function _callee7(req, res) {
  var user, SessionKeyLog, ip, query_consulting, where_filter_inv, count, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, Yportal, portalRepresentation, URL0;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          user = res.locals.user["$resources"][0]; //User info
          //console.log(user)

          SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table

          ip = req.connection.remoteAddress;
          query_consulting = "&where=ID eq " + user["ID"].toString() + ""; //Clause where with email

          where_filter_inv = "", count = 0; //Declare and send log to SystemLo

          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Function: openInvMore list", Status = 1, Comment = "Starting- line 139-";
          _context7.next = 8;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 8:
          SystemLogL = _context7.sent;
          Yportal = 'YPORTALINV', portalRepresentation = 'YPORTALINVO';

          if (user["ROLE"] == 4 || user["ROLE"] == 5) {
            // If User rol is 1, consulting query by EMAIL
            count = 100;
            Yportal = 'YPORTALINA';
            portalRepresentation = 'YPORTALINVAO';
            where_filter_inv = "&OrderBy=NUM";
          } else {
            //Else consulting Loggin Map
            count = 100;
            where_filter_inv = "&OrderBy=ID,NUM&where=ID eq " + user["ID"] + " "; //Consulting OpenInv querys by EMAIL
          }

          URL0 = URLHost + req.session.queryFolder + "/"; //GET Open Invoices List to X3 by where clause EMAIL

          request({
            uri: URL0 + Yportal + "?representation=".concat(portalRepresentation, ".$query&count=") + count + where_filter_inv,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee6(inv_wofilter) {
            var links, paymentsL, query_consulting, maping_login, bpcnum, i, payments, getPayments, _i2;

            return regeneratorRuntime.async(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting

                    inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List
                    //Save LogSystem

                    Description = "Open Invoices list success to X3", Status = 1, Comment = "Function: openInvMore-line 307";
                    _context6.next = 5;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 5:
                    SystemLogL = _context6.sent;
                    //FIRTS MAPPING LOG FOR GET BPCNUM'S
                    query_consulting = "&where=ID eq " + user["ID"] + "";
                    _context6.t0 = JSON;
                    _context6.next = 10;
                    return regeneratorRuntime.awrap(request({
                      uri: URL0 + "YPORTALBPS?representation=YPORTALBPS.$query&count=100" + query_consulting,
                      method: "GET",
                      insecure: true,
                      rejectUnauthorized: false,
                      headers: {
                        "Content-Type": "application/json",
                        Connection: 'close',
                        Accept: "application/json",
                        Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
                      },
                      json: true
                    }).then(function _callee5(map_loggin) {
                      return regeneratorRuntime.async(function _callee5$(_context5) {
                        while (1) {
                          switch (_context5.prev = _context5.next) {
                            case 0:
                              return _context5.abrupt("return", JSON.stringify(map_loggin));

                            case 1:
                            case "end":
                              return _context5.stop();
                          }
                        }
                      });
                    }));

                  case 10:
                    _context6.t1 = _context6.sent;
                    maping_login = _context6.t0.parse.call(_context6.t0, _context6.t1);
                    // STORE BPCNUM FORM MAPPINGLOGGING
                    bpcnum = [];

                    for (i = 0; i < maping_login["$resources"].length; i++) {
                      bpcnum.push(maping_login["$resources"][i]["BPCNUM"]);
                    } //GET PAYMENTS FROM SQL TABLE


                    payments = [];
                    _i2 = 0;

                  case 16:
                    if (!(_i2 < bpcnum.length)) {
                      _context6.next = 22;
                      break;
                    }

                    _context6.next = 19;
                    return regeneratorRuntime.awrap(DataBaseSq.Get_tPayments(bpcnum[_i2]).then(function (response) {
                      response = JSON.parse(response); //PARSE RESPONSE
                      //STORE IN ARRAY PAYMENTS

                      for (var j = 0; j < response.length; j++) {
                        //console.log(payments.length);
                        payments.push({
                          pmtKey: response[j].pmtKey,
                          CustID: response[j].CustID,
                          TransactionID: response[j].TransactionID,
                          TranAmount: response[j].TranAmount,
                          ProcessorStatus: response[j].ProcessorStatus,
                          ProcessorStatusDesc: response[j].ProcessorStatusDesc,
                          DateProcessesed: response[j].DateProcessesed,
                          tPaymentApplication: response[j].tPaymentApplication
                        });
                      }
                    }));

                  case 19:
                    _i2++;
                    _context6.next = 16;
                    break;

                  case 22:
                    //CLEAN PAYMENTS BLANK
                    paymentsL = JSON.stringify(payments.filter(function (el) {
                      return el != "";
                    }));
                    res.send({
                      inv_wofilter: inv_wofilter,
                      links: links,
                      paymentsL: paymentsL
                    });

                  case 24:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 303 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 303";
            return res.redirect("/dashboard/".concat(msg0));
          });

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  });
};
/**FUNCTION TO RENDER OPEN INVOICES PAGE */


exports.paymentsL = function _callee9(req, res) {
  var user, SessionKeyLog, ip, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, paymentsL, query_consulting, URL0, maping_login, bpcnum, i, payments, getPayments, _i3;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          user = res.locals.user["$resources"][0]; //User info

          SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table

          ip = req.connection.remoteAddress; //Declare and send log to SystemLo

          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "FUNCTION:paymentsL ", Status = 1, Comment = "Starting- line 270-";
          _context9.next = 6;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 6:
          SystemLogL = _context9.sent;
          //FIRTS MAPPING LOG FOR GET BPCNUM'S
          query_consulting = "&where=ID eq " + user["ID"] + "";
          URL0 = URLHost + req.session.queryFolder + "/";
          _context9.t0 = JSON;
          _context9.next = 12;
          return regeneratorRuntime.awrap(request({
            uri: URL0 + "YPORTALBPS?representation=YPORTALBPS.$query&count=1000" + query_consulting,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee8(map_loggin) {
            return regeneratorRuntime.async(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    return _context8.abrupt("return", JSON.stringify(map_loggin));

                  case 1:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          }));

        case 12:
          _context9.t1 = _context9.sent;
          maping_login = _context9.t0.parse.call(_context9.t0, _context9.t1);
          // STORE BPCNUM FORM MAPPINGLOGGING
          bpcnum = [];

          for (i = 0; i < maping_login["$resources"].length; i++) {
            bpcnum.push(maping_login["$resources"][i]["BPCNUM"]);
          } //GET PAYMENTS FROM SQL TABLE


          payments = [], getPayments = []; //console.log(bpcnum)

          _i3 = 0;

        case 18:
          if (!(_i3 < bpcnum.length)) {
            _context9.next = 24;
            break;
          }

          _context9.next = 21;
          return regeneratorRuntime.awrap(DataBaseSq.Get_tPayments(bpcnum[_i3]).then(function (response) {
            response = JSON.parse(response); //PARSE RESPONSE
            //STORE IN ARRAY PAYMENTS

            for (var j = 0; j < response.length; j++) {
              payments.push({
                pmtKey: response[j].pmtKey,
                CustID: response[j].CustID,
                TransactionID: response[j].TransactionID,
                TranAmount: response[j].TranAmount,
                ProcessorStatus: response[j].ProcessorStatus,
                ProcessorStatusDesc: response[j].ProcessorStatusDesc,
                DateProcessesed: response[j].DateProcessesed,
                tPaymentApplication: response[j].tPaymentApplication
              });
            }
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 373 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 373";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 21:
          _i3++;
          _context9.next = 18;
          break;

        case 24:
          //CLEAN PAYMENTS BLANK
          paymentsL = JSON.stringify(payments.filter(function (el) {
            return el != "";
          }));
          res.send({
            paymentsL: paymentsL
          });

        case 26:
        case "end":
          return _context9.stop();
      }
    }
  });
};
/**FUNCTION TO RENDER NEXT_PAGE  PAGE REQUEST FOR OPEN INVOICES*/


exports.next_pageIO2 = function _callee12(req, res) {
  var user, SessionKeyLog, ip, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, data, URL0, Yportal, portalRepresentation, query_consulting, maping_login, bpcnum, i, payments, inv_wofilter, getPayments, _i4, response, inv_filtering, links;

  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          user = res.locals.user["$resources"][0]; // User info

          SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table

          ip = req.connection.remoteAddress; //Declare and send log to SystemLo

          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "FUNCTION:next_pageIO2 ", Status = 1, Comment = "Starting- line 348-";
          _context12.next = 6;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 6:
          SystemLogL = _context12.sent;
          //Request for GET the next page from query consulting
          data = req.params.data;
          URL0 = URLHost + req.session.queryFolder + "/";
          Yportal = 'YPORTALINV', portalRepresentation = 'YPORTALINVO';

          if (user["ROLE"] == 4 || user["ROLE"] == 5) {
            // If User rol is 1, consulting query by EMAIL
            count = 100;
            Yportal = 'YPORTALINA';
            portalRepresentation = 'YPORTALINVAO';
            where_filter_inv = "&OrderBy=NUM";
          } else {
            //Else consulting Loggin Map
            count = 100;
            where_filter_inv = "&OrderBy=ID,NUM&where=ID eq " + user["ID"] + " "; //Consulting OpenInv querys by EMAIL
          } //GET Open Invoices List to X3 by where clause EMAIL


          console.log(data);

          if (!(user["ROLE"] != 3)) {
            _context12.next = 16;
            break;
          }

          request({
            uri: URL0 + Yportal + "?representation=".concat(portalRepresentation, ".$query&").concat(data, "&count=") + count + where_filter_inv,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee10(inv_wofilter) {
            var links;
            return regeneratorRuntime.async(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    // GET INVOICES
                    links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting

                    inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List

                    res.send({
                      inv_wofilter: inv_wofilter,
                      links: links
                    });

                  case 3:
                  case "end":
                    return _context10.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 432 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 432";
            return res.redirect("/dashboard/".concat(msg0));
          });
          _context12.next = 41;
          break;

        case 16:
          console.log('test');
          query_consulting = "&where=ID eq " + user["ID"] + "";
          where_filter_inv = "&OrderBy=ID,BPCNUM asc&where=ID eq " + user["ID"]; //Consulting OpenInv querys by EMAIL

          _context12.t0 = JSON;
          _context12.next = 22;
          return regeneratorRuntime.awrap(request({
            uri: URL0 + "YPORTALBPS?representation=YPORTALBPS.$query&".concat(data, "&count=") + count + where_filter_inv,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee11(map_loggin) {
            return regeneratorRuntime.async(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    return _context11.abrupt("return", JSON.stringify(map_loggin));

                  case 1:
                  case "end":
                    return _context11.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 458 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 458";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 22:
          _context12.t1 = _context12.sent;
          maping_login = _context12.t0.parse.call(_context12.t0, _context12.t1);
          // STORE BPCNUM FORM MAPPINGLOGGING
          bpcnum = [];

          for (i = 0; i < maping_login["$resources"].length; i++) {
            bpcnum.push(maping_login["$resources"][i]["BPCNUM"]);
          } //GET PAYMENTS FROM SQL TABLE


          payments = [], inv_wofilter = [];
          console.log(bpcnum);
          _i4 = 0;

        case 29:
          if (!(_i4 < bpcnum.length)) {
            _context12.next = 37;
            break;
          }

          _context12.next = 32;
          return regeneratorRuntime.awrap(DataBasequerys.Get_YPORTALINAO(bpcnum[_i4]));

        case 32:
          response = _context12.sent;

          if (response[0]) {
            inv_wofilter.push(response[0]);
          }

        case 34:
          _i4++;
          _context12.next = 29;
          break;

        case 37:
          inv_filtering = JSON.stringify(inv_wofilter); // Create JSON String with the Open Invoices List for dataTable

          links = JSON.stringify(maping_login["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting

          console.log(links);
          res.send({
            inv_wofilter: inv_wofilter,
            links: links
          });

        case 41:
        case "end":
          return _context12.stop();
      }
    }
  });
};
/**FUNCTION TO RENDER NEXT_PAGE  PAGE REQUEST FOR CLOSED INVOICES*/


exports.next_pageIC2 = function _callee15(req, res) {
  var user, SessionKeyLog, ip, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, data, URL0, Yportal, portalRepresentation, query_consulting, maping_login, bpcnum, i, payments, inv_wofilter, getPayments, _i5, response, inv_filtering, links;

  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          user = res.locals.user["$resources"][0]; // User info

          SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table

          ip = req.connection.remoteAddress; //Declare and send log to SystemLo

          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "FUNCTION:next_pageIC2 ", Status = 1, Comment = "Starting- line 392-";
          _context15.next = 6;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 6:
          SystemLogL = _context15.sent;
          // console.log(SystemLogL)
          //Request for GET the next page from query consulting
          data = req.params.data;
          URL0 = URLHost + req.session.queryFolder + "/";
          Yportal = 'YPORTALINV', portalRepresentation = 'YPORTALINVO';

          if (user["ROLE"] == 4 || user["ROLE"] == 5) {
            // If User rol is 1, consulting query by EMAIL
            count = 100;
            Yportal = 'YPORTALINA';
            portalRepresentation = 'YPORTALINVAC';
            where_filter_inv = "&OrderBy=NUM";
          } else {
            //Else consulting Loggin Map
            count = 100;
            where_filter_inv = "&OrderBy=ID,NUM&where=ID eq " + user["ID"] + " "; //Consulting OpenInv querys by EMAIL
          }

          if (!(user["ROLE"] != 3)) {
            _context15.next = 15;
            break;
          }

          request({
            uri: URL0 + Yportal + "?representation=".concat(portalRepresentation, ".$query&").concat(data, "&count=") + count + where_filter_inv,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee13(inv_wofilter) {
            var links;
            return regeneratorRuntime.async(function _callee13$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    // GET INVOICES
                    links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting

                    inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List

                    res.send({
                      inv_wofilter: inv_wofilter,
                      links: links
                    });

                  case 3:
                  case "end":
                    return _context13.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 534 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 534";
            return res.redirect("/dashboard/".concat(msg0));
          });
          _context15.next = 40;
          break;

        case 15:
          console.log('test');
          query_consulting = "&where=ID eq " + user["ID"] + "";
          where_filter_inv = "&OrderBy=ID,BPCNUM asc&where=ID eq " + user["ID"]; //Consulting OpenInv querys by EMAIL

          _context15.t0 = JSON;
          _context15.next = 21;
          return regeneratorRuntime.awrap(request({
            uri: URL0 + "YPORTALBPS?representation=YPORTALBPS.$query&".concat(data, "&count=") + count + where_filter_inv,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee14(map_loggin) {
            return regeneratorRuntime.async(function _callee14$(_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    return _context14.abrupt("return", JSON.stringify(map_loggin));

                  case 1:
                  case "end":
                    return _context14.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 560 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 560";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 21:
          _context15.t1 = _context15.sent;
          maping_login = _context15.t0.parse.call(_context15.t0, _context15.t1);
          // STORE BPCNUM FORM MAPPINGLOGGING
          bpcnum = [];

          for (i = 0; i < maping_login["$resources"].length; i++) {
            bpcnum.push(maping_login["$resources"][i]["BPCNUM"]);
          } //GET PAYMENTS FROM SQL TABLE


          payments = [], inv_wofilter = [];
          console.log(bpcnum);
          _i5 = 0;

        case 28:
          if (!(_i5 < bpcnum.length)) {
            _context15.next = 36;
            break;
          }

          _context15.next = 31;
          return regeneratorRuntime.awrap(DataBasequerys.Get_YPORTALINAO(bpcnum[_i5]));

        case 31:
          response = _context15.sent;

          if (response[0]) {
            inv_wofilter.push(response[0]);
          }

        case 33:
          _i5++;
          _context15.next = 28;
          break;

        case 36:
          inv_filtering = JSON.stringify(inv_wofilter); // Create JSON String with the Open Invoices List for dataTable

          links = JSON.stringify(maping_login["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting

          console.log(links);
          res.send({
            inv_wofilter: inv_wofilter,
            links: links
          });

        case 40:
        case "end":
          return _context15.stop();
      }
    }
  });
};
/** FUNCTION TO SEARCH IN OPENINVOICE WHIT THE API */


exports.searchOpenInvO = function _callee18(req, res) {
  var user, SessionKeyLog, ip, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, filter, search, query, Yportal, portalRepresentation, URL0, query_consulting, maping_login, bpcnum, i, payments, inv_wofilter, getPayments, filter0, _i6, response, inv_filtering, links;

  return regeneratorRuntime.async(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          user = res.locals.user["$resources"][0]; // User info

          SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table

          ip = req.connection.remoteAddress; //Declare and send log to SystemLo

          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "FUNCTION:searchOpenInvO ", Status = 1, Comment = "Starting- line 440-";
          _context18.next = 6;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 6:
          SystemLogL = _context18.sent;
          // console.log(SystemLogL);
          //Request for GET the next page from query consulting
          filter = req.params.filter;
          search = req.params.search;
          query = "";

          if (filter == "INVDAT" || filter == "DUDDAT") {
            query = "and ".concat(filter, " eq @").concat(search, "@");

            if (user["ROLE"] == 4 || user["ROLE"] == 5) {
              query = "".concat(filter, " eq @").concat(search, "@");
            }
          } else {
            query = "and ".concat(filter, " like '%25").concat(search.toUpperCase(), "%25'");

            if (user["ROLE"] == 4 || user["ROLE"] == 5) {
              query = "".concat(filter, " like '%25").concat(search.toUpperCase(), "%25'");
            }
          } // console.log(query);


          if (filter == "NUM" && search == "-") {
            query = "";
          }

          Yportal = 'YPORTALINV', portalRepresentation = 'YPORTALINVO';

          if (user["ROLE"] == 4 || user["ROLE"] == 5) {
            // If User rol is 1, consulting query by EMAIL
            count = 100;
            Yportal = 'YPORTALINA';
            portalRepresentation = 'YPORTALINVAO';
            where_filter_inv = "&OrderBy=NUM&where=" + query;
          } else {
            //Else consulting Loggin Map
            count = 100;
            where_filter_inv = "&OrderBy=ID,NUM&where=ID eq " + user["ID"] + " " + query; //Consulting OpenInv querys by EMAIL
          }

          URL0 = URLHost + req.session.queryFolder + "/"; //GET Open Invoices List to X3 by where clause EMAIL

          if (!(user["ROLE"] != 3)) {
            _context18.next = 19;
            break;
          }

          request({
            uri: URL0 + Yportal + "?representation=".concat(portalRepresentation, ".$query&count=") + count + where_filter_inv,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee16(inv_wofilter) {
            var links;
            return regeneratorRuntime.async(function _callee16$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    /// console.log(inv_wofilter);
                    // GET INVOICES
                    links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting

                    inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List

                    return _context16.abrupt("return", res.send({
                      inv_wofilter: inv_wofilter,
                      links: links
                    }));

                  case 3:
                  case "end":
                    return _context16.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 661 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 661";
            return res.redirect("/dashboard/".concat(msg0));
          });
          _context18.next = 58;
          break;

        case 19:
          query_consulting = "&where=ID eq " + user["ID"] + "";
          _context18.t0 = JSON;
          _context18.next = 23;
          return regeneratorRuntime.awrap(request({
            uri: URL0 + "YPORTALBPS?representation=YPORTALBPS.$query&count=100" + query_consulting,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee17(map_loggin) {
            return regeneratorRuntime.async(function _callee17$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    return _context17.abrupt("return", JSON.stringify(map_loggin));

                  case 1:
                  case "end":
                    return _context17.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 686 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 686";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 23:
          _context18.t1 = _context18.sent;
          maping_login = _context18.t0.parse.call(_context18.t0, _context18.t1);
          // STORE BPCNUM FORM MAPPINGLOGGING
          bpcnum = [];

          for (i = 0; i < maping_login["$resources"].length; i++) {
            bpcnum.push(maping_login["$resources"][i]["BPCNUM"]);
          } //GET PAYMENTS FROM SQL TABLE


          payments = [], inv_wofilter = [];
          console.log(bpcnum);
          _context18.t2 = filter;
          _context18.next = _context18.t2 === 'NUM' ? 32 : _context18.t2 === 'INVREF' ? 34 : _context18.t2 === 'BPCORD' ? 36 : _context18.t2 === 'BPCORD' ? 38 : _context18.t2 === 'INVDAT' ? 40 : _context18.t2 === 'DUDDAT' ? 42 : 44;
          break;

        case 32:
          filter0 = 'NUM_0';
          return _context18.abrupt("break", 45);

        case 34:
          filter0 = 'INVREF_0';
          return _context18.abrupt("break", 45);

        case 36:
          filter0 = 'BPCORD_0';
          return _context18.abrupt("break", 45);

        case 38:
          filter0 = 'BPCORD_0';
          return _context18.abrupt("break", 45);

        case 40:
          filter0 = 'INVDAT_0';
          return _context18.abrupt("break", 45);

        case 42:
          filter0 = 'DUDDAT_0';
          return _context18.abrupt("break", 45);

        case 44:
          return _context18.abrupt("break", 45);

        case 45:
          _i6 = 0;

        case 46:
          if (!(_i6 < bpcnum.length)) {
            _context18.next = 54;
            break;
          }

          _context18.next = 49;
          return regeneratorRuntime.awrap(DataBasequerys.Get_YPORTALINAOs(bpcnum[_i6], filter0, search));

        case 49:
          response = _context18.sent;

          if (response[0]) {
            inv_wofilter.push(response[0]);
          }

        case 51:
          _i6++;
          _context18.next = 46;
          break;

        case 54:
          inv_filtering = JSON.stringify(inv_wofilter); // Create JSON String with the Open Invoices List for dataTable

          links = JSON.stringify(maping_login["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting

          console.log(inv_wofilter);
          res.send({
            inv_wofilter: inv_wofilter,
            links: links
          });

        case 58:
        case "end":
          return _context18.stop();
      }
    }
  });
};
/** FUNCTION TO SEARCH IN TABLE CLOSEINVOICE WHIT THE API */


exports.searchCloseInvC = function _callee21(req, res) {
  var user, SessionKeyLog, ip, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, filter, search, query, Yportal, portalRepresentation, URL0, query_consulting, maping_login, bpcnum, i, payments, inv_wofilter, getPayments, filter0, _i7, response, inv_filtering, links;

  return regeneratorRuntime.async(function _callee21$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          user = res.locals.user["$resources"][0]; // User info

          SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table

          ip = req.connection.remoteAddress; //Declare and send log to SystemLo

          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "FUNCTION:searchCloseInvC ", Status = 1, Comment = "Starting- line 440-";
          _context21.next = 6;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 6:
          SystemLogL = _context21.sent;
          //Request for GET the next page from query consulting
          filter = req.params.filter;
          search = req.params.search;
          query = "";

          if (filter == "INVDAT" || filter == "DUDDAT") {
            query = "and ".concat(filter, " eq @").concat(search, "@");

            if (user["ROLE"] == 4 || user["ROLE"] == 5) {
              query = "".concat(filter, " eq @").concat(search, "@");
            }
          } else {
            query = "and ".concat(filter, " like '%25").concat(search, "%25'");

            if (user["ROLE"] == 4 || user["ROLE"] == 5) {
              query = "".concat(filter, " like '%25").concat(search, "%25'");
            }
          } // console.log(query);


          if (filter == "NUM" && search == "-") {
            query = "";
          }

          Yportal = 'YPORTALINV', portalRepresentation = 'YPORTALINVC';

          if (user["ROLE"] == 4 || user["ROLE"] == 5) {
            // If User rol is 1, consulting query by EMAIL
            count = 100;
            Yportal = 'YPORTALINA';
            portalRepresentation = 'YPORTALINVAC';
            where_filter_inv = "&OrderBy=NUM&where=" + query;
          } else {
            //Else consulting Loggin Map
            count = 100;
            where_filter_inv = "&OrderBy=ID,NUM&where=ID eq " + user["ID"] + " " + query; //Consulting OpenInv querys by EMAIL
          }

          URL0 = URLHost + req.session.queryFolder + "/"; //GET Open Invoices List to X3 by where clause EMAIL

          if (!(user["ROLE"] != 3)) {
            _context21.next = 19;
            break;
          }

          request({
            uri: URL0 + Yportal + "?representation=".concat(portalRepresentation, ".$query&count=") + count + where_filter_inv,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee19(inv_wofilter) {
            var links;
            return regeneratorRuntime.async(function _callee19$(_context19) {
              while (1) {
                switch (_context19.prev = _context19.next) {
                  case 0:
                    /// console.log(inv_wofilter);
                    // GET INVOICES
                    links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting

                    inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List

                    return _context19.abrupt("return", res.send({
                      inv_wofilter: inv_wofilter,
                      links: links
                    }));

                  case 3:
                  case "end":
                    return _context19.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 807 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 807";
            return res.redirect("/dashboard/".concat(msg0));
          });
          _context21.next = 58;
          break;

        case 19:
          query_consulting = "&where=ID eq " + user["ID"] + "";
          _context21.t0 = JSON;
          _context21.next = 23;
          return regeneratorRuntime.awrap(request({
            uri: URL0 + "YPORTALBPS?representation=YPORTALBPS.$query&count=100" + query_consulting,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee20(map_loggin) {
            return regeneratorRuntime.async(function _callee20$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    return _context20.abrupt("return", JSON.stringify(map_loggin));

                  case 1:
                  case "end":
                    return _context20.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 832 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 832";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 23:
          _context21.t1 = _context21.sent;
          maping_login = _context21.t0.parse.call(_context21.t0, _context21.t1);
          // STORE BPCNUM FORM MAPPINGLOGGING
          bpcnum = [];

          for (i = 0; i < maping_login["$resources"].length; i++) {
            bpcnum.push(maping_login["$resources"][i]["BPCNUM"]);
          } //GET PAYMENTS FROM SQL TABLE


          payments = [], inv_wofilter = [];
          console.log(bpcnum);
          _context21.t2 = filter;
          _context21.next = _context21.t2 === 'NUM' ? 32 : _context21.t2 === 'INVREF' ? 34 : _context21.t2 === 'BPCORD' ? 36 : _context21.t2 === 'BPCORD' ? 38 : _context21.t2 === 'INVDAT' ? 40 : _context21.t2 === 'DUDDAT' ? 42 : 44;
          break;

        case 32:
          filter0 = 'NUM_0';
          return _context21.abrupt("break", 45);

        case 34:
          filter0 = 'INVREF_0';
          return _context21.abrupt("break", 45);

        case 36:
          filter0 = 'BPCORD_0';
          return _context21.abrupt("break", 45);

        case 38:
          filter0 = 'BPCORD_0';
          return _context21.abrupt("break", 45);

        case 40:
          filter0 = 'INVDAT_0';
          return _context21.abrupt("break", 45);

        case 42:
          filter0 = 'DUDDAT_0';
          return _context21.abrupt("break", 45);

        case 44:
          return _context21.abrupt("break", 45);

        case 45:
          _i7 = 0;

        case 46:
          if (!(_i7 < bpcnum.length)) {
            _context21.next = 54;
            break;
          }

          _context21.next = 49;
          return regeneratorRuntime.awrap(DataBasequerys.Get_YPORTALINACs(bpcnum[_i7], filter0, search));

        case 49:
          response = _context21.sent;

          if (response[0]) {
            inv_wofilter.push(response[0]);
          }

        case 51:
          _i7++;
          _context21.next = 46;
          break;

        case 54:
          inv_filtering = JSON.stringify(inv_wofilter); // Create JSON String with the Open Invoices List for dataTable

          links = JSON.stringify(maping_login["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting

          console.log(inv_wofilter);
          res.send({
            inv_wofilter: inv_wofilter,
            links: links
          });

        case 58:
        case "end":
          return _context21.stop();
      }
    }
  });
};
/**FUNCTION TO RENDER CLOSED INVOICES PAGE */


exports.close_invoices = function _callee24(req, res) {
  var user, pictureProfile, admin, SessionKeyLog, ip, query_consulting, where_filter_inv, count, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, Yportal, portalRepresentation, URL0, _query_consulting2, maping_login, bpcnum, i, payments, inv_wofilter, getPayments, _i8, response, inv_filtering, links, banner, activeBanner;

  return regeneratorRuntime.async(function _callee24$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          user = res.locals.user["$resources"][0]; //User info

          pictureProfile = res.locals.user["$resources"][1]["pic"]; //Pic profile

          admin = false;

          if (user["ROLE"] === 4) {
            admin = true;
          }

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          query_consulting = "&where=ID eq " + user["ID"].toString() + "";
          where_filter_inv = "", count = 0; //Save LogSystem SQL init Request Closed invoices from X3

          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Request Closed invoices list from X3", Status = 1, Comment = "Function: close_invoices- Line 559";
          _context24.next = 11;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 11:
          SystemLogL = _context24.sent;
          Yportal = 'YPORTALINV', portalRepresentation = 'YPORTALINVC';

          if (user["ROLE"] == 4 || user["ROLE"] == 5) {
            // If User rol is 1, consulting query by EMAIL
            count = 100;
            Yportal = 'YPORTALINA';
            portalRepresentation = 'YPORTALINVAC';
            where_filter_inv = "&OrderBy=NUM";
          } else {
            //Else consulting Loggin Map
            count = 100;
            where_filter_inv = "&OrderBy=ID,NUM&where=ID eq " + user["ID"] + " "; //Consulting OpenInv querys by EMAIL
          }

          URL0 = URLHost + req.session.queryFolder + "/";

          if (!(user["ROLE"] != 3)) {
            _context24.next = 19;
            break;
          }

          request({
            uri: URL0 + Yportal + "?representation=".concat(portalRepresentation, ".$query&count=") + count + where_filter_inv,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee22(inv_wofilter) {
            var inv_filtering, links, banner, activeBanner;
            return regeneratorRuntime.async(function _callee22$(_context22) {
              while (1) {
                switch (_context22.prev = _context22.next) {
                  case 0:
                    // GET INVOICES
                    inv_filtering = JSON.stringify(inv_wofilter["$resources"]); // Create JSON String with the Close Invoices List for dataTable

                    links = JSON.stringify(inv_wofilter["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting

                    inv_wofilter = inv_wofilter["$resources"]; // Create JSON Array with the Open Invoices List
                    //Save LogSystem SQL

                    Description = "Closed invoices list success from X3", Status = 1, Comment = "Function: close_invoices- Line 557";
                    _context22.next = 6;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 6:
                    SystemLogL = _context22.sent;
                    _context22.t0 = JSON;
                    _context22.next = 10;
                    return regeneratorRuntime.awrap(DataBaseSq.bannerSetting());

                  case 10:
                    _context22.t1 = _context22.sent;
                    banner = _context22.t0.parse.call(_context22.t0, _context22.t1);
                    activeBanner = false;

                    if (banner.Status == 1) {
                      activeBanner = true;
                    }

                    res.render("close_invoices", {
                      pageName: "Closed Invoices",
                      dashboardPage: true,
                      menu: true,
                      invoiceC: true,
                      user: user,
                      inv_wofilter: inv_wofilter,
                      inv_filtering: inv_filtering,
                      pictureProfile: pictureProfile,
                      admin: admin,
                      links: links,
                      banner: banner,
                      activeBanner: activeBanner
                    });

                  case 15:
                  case "end":
                    return _context22.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 953 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 953";
            return res.redirect("/dashboard/".concat(msg0));
          });
          _context24.next = 50;
          break;

        case 19:
          console.log('test');
          _query_consulting2 = "&where=ID eq " + user["ID"] + "";
          _context24.t0 = JSON;
          _context24.next = 24;
          return regeneratorRuntime.awrap(request({
            uri: URL0 + "YPORTALBPS?representation=YPORTALBPS.$query&count=100" + _query_consulting2,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee23(map_loggin) {
            return regeneratorRuntime.async(function _callee23$(_context23) {
              while (1) {
                switch (_context23.prev = _context23.next) {
                  case 0:
                    return _context23.abrupt("return", JSON.stringify(map_loggin));

                  case 1:
                  case "end":
                    return _context23.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 979 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 979";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 24:
          _context24.t1 = _context24.sent;
          maping_login = _context24.t0.parse.call(_context24.t0, _context24.t1);
          // STORE BPCNUM FORM MAPPINGLOGGING
          bpcnum = [];

          for (i = 0; i < maping_login["$resources"].length; i++) {
            bpcnum.push(maping_login["$resources"][i]["BPCNUM"]);
          } //GET PAYMENTS FROM SQL TABLE


          payments = [], inv_wofilter = [];
          console.log(bpcnum);
          _i8 = 0;

        case 31:
          if (!(_i8 < bpcnum.length)) {
            _context24.next = 39;
            break;
          }

          _context24.next = 34;
          return regeneratorRuntime.awrap(DataBasequerys.Get_YPORTALINAO(bpcnum[_i8]));

        case 34:
          response = _context24.sent;

          if (response[0]) {
            inv_wofilter.push(response[0]);
          }

        case 36:
          _i8++;
          _context24.next = 31;
          break;

        case 39:
          inv_filtering = JSON.stringify(inv_wofilter); // Create JSON String with the Open Invoices List for dataTable

          links = JSON.stringify(maping_login["$links"]); // Create JSON String with Links to use for "Next or Previous page" consulting

          console.log(links); //HERE RENDER PAGE AND INTRO INFO

          _context24.t2 = JSON;
          _context24.next = 45;
          return regeneratorRuntime.awrap(DataBaseSq.bannerSetting());

        case 45:
          _context24.t3 = _context24.sent;
          banner = _context24.t2.parse.call(_context24.t2, _context24.t3);
          activeBanner = false;

          if (banner.Status == 1) {
            activeBanner = true;
          }

          res.render("close_invoices", {
            pageName: "Closed Invoices",
            dashboardPage: true,
            menu: true,
            invoiceC: true,
            user: user,
            inv_wofilter: inv_wofilter,
            inv_filtering: inv_filtering,
            pictureProfile: pictureProfile,
            admin: admin,
            links: links,
            banner: banner,
            activeBanner: activeBanner
          });

        case 50:
        case "end":
          return _context24.stop();
      }
    }
  });
};
/**FUNCTION TO RENDER INVOICE OPEN DETAILS PAGE */


exports.inoviceO_detail = function _callee27(req, res) {
  var user, pictureProfile, SessionKeyLog, admin, ip, inv_num, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, URI0;
  return regeneratorRuntime.async(function _callee27$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          user = res.locals.user["$resources"][0]; //USER INFO

          pictureProfile = res.locals.user["$resources"][1]["pic"]; //PIC PROFILE

          SessionKeyLog = req.session.SessionLog;
          admin = false;

          if (user["ROLE"] == 4) {
            admin = true;
          }

          ip = req.connection.remoteAddress;
          inv_num = req.params.inv_num; //Invoice NUM to consult
          //SAVE SYSTEMLOG SQL

          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Request Open invoice details from X3", Status = 1, Comment = "Function: inoviceO_detail-Line 420";
          _context27.next = 10;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 10:
          SystemLogL = _context27.sent;
          URI0 = URLHost + req.session.queryFolder + "/"; //Get Inv details from X3

          request({
            uri: URI0 + "YPORTALINVD('".concat(inv_num, "')?representation=YPORTALINVD.$details"),
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee26(inv_detail) {
            var query_consulting, maping_login, msg, find, i, banner, activeBanner;
            return regeneratorRuntime.async(function _callee26$(_context26) {
              while (1) {
                switch (_context26.prev = _context26.next) {
                  case 0:
                    // SAVE SYSEMLOG SQL
                    Description = "Open Invoice details success from X3", Status = 1, Comment = "Loading Page";
                    _context26.next = 3;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 3:
                    SystemLogL = _context26.sent;
                    query_consulting = "&where=ID eq " + user["ID"] + "";
                    _context26.t0 = JSON;
                    _context26.next = 8;
                    return regeneratorRuntime.awrap(request({
                      uri: URI0 + "YPORTALBPS?representation=YPORTALBPS.$query&count=100" + query_consulting,
                      method: "GET",
                      insecure: true,
                      rejectUnauthorized: false,
                      headers: {
                        "Content-Type": "application/json",
                        Connection: 'close',
                        Accept: "application/json",
                        Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
                      },
                      json: true
                    }).then(function _callee25(map_loggin) {
                      return regeneratorRuntime.async(function _callee25$(_context25) {
                        while (1) {
                          switch (_context25.prev = _context25.next) {
                            case 0:
                              return _context25.abrupt("return", JSON.stringify(map_loggin));

                            case 1:
                            case "end":
                              return _context25.stop();
                          }
                        }
                      });
                    }));

                  case 8:
                    _context26.t1 = _context26.sent;
                    maping_login = _context26.t0.parse.call(_context26.t0, _context26.t1);
                    // BPCNUM FORM MAPPINGLOGGING
                    console.log(inv_detail["BPCINV"]);
                    msg = false, find = 0;

                    if (user["ROLE"] !== 4) {
                      for (i = 0; i < maping_login["$resources"].length; i++) {
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
                        msg = "Unable to load invoice. This invoice is not available to your user account.";
                      }
                    } //HERE RENDER PAGE AND INTRO INFO


                    _context26.t2 = JSON;
                    _context26.next = 16;
                    return regeneratorRuntime.awrap(DataBaseSq.bannerSetting());

                  case 16:
                    _context26.t3 = _context26.sent;
                    banner = _context26.t2.parse.call(_context26.t2, _context26.t3);
                    activeBanner = false;

                    if (banner.Status == 1) {
                      activeBanner = true;
                    }

                    res.render("detail_invoice", {
                      pageName: "Details " + inv_num,
                      dashboardPage: true,
                      menu: true,
                      invoiceO: true,
                      closed_inv: false,
                      user: user,
                      inv_detail: inv_detail,
                      pictureProfile: pictureProfile,
                      admin: admin,
                      msg: msg,
                      banner: banner,
                      activeBanner: activeBanner
                    });

                  case 21:
                  case "end":
                    return _context26.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 1112 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 1112";
            return res.redirect("/dashboard/".concat(msg0));
          });

        case 13:
        case "end":
          return _context27.stop();
      }
    }
  });
};
/**FUNCTION TO RENDER INVOICE CLOSE DETAILS PAGE */


exports.inoviceC_detail = function _callee30(req, res) {
  var user, pictureProfile, SessionKeyLog, ip, admin, inv_num, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, URI0;
  return regeneratorRuntime.async(function _callee30$(_context30) {
    while (1) {
      switch (_context30.prev = _context30.next) {
        case 0:
          user = res.locals.user["$resources"][0]; //USER INFO

          pictureProfile = res.locals.user["$resources"][1]["pic"]; //PIC PROFILE

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          admin = false;

          if (user["ROLE"] == 4) {
            admin = true;
          }

          inv_num = req.params.inv_num; //Invoice NUM to consult
          //SAVE SYSTEMLOG SQL

          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Request closed invoice details from X3", Status = 1, Comment = "Function: inoviceC_detail-Line 493";
          _context30.next = 10;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 10:
          SystemLogL = _context30.sent;
          URI0 = URLHost + req.session.queryFolder + "/"; //Get invoice colse detail from x3

          request({
            uri: URI0 + "YPORTALINVD('".concat(inv_num, "')?representation=YPORTALINVD.$details"),
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee29(inv_detail) {
            var query_consulting, maping_login, msg, find, i, banner, activeBanner;
            return regeneratorRuntime.async(function _callee29$(_context29) {
              while (1) {
                switch (_context29.prev = _context29.next) {
                  case 0:
                    // SAVE SYSTEMLOG SQL
                    Description = "Closed Invoice Details success from X3", Status = 1, Comment = "Loading Page";
                    _context29.next = 3;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 3:
                    SystemLogL = _context29.sent;
                    query_consulting = "&where=ID eq " + user["ID"] + "";
                    _context29.t0 = JSON;
                    _context29.next = 8;
                    return regeneratorRuntime.awrap(request({
                      uri: URI0 + "YPORTALBPS?representation=YPORTALBPS.$query&count=100" + query_consulting,
                      method: "GET",
                      insecure: true,
                      rejectUnauthorized: false,
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
                      },
                      json: true
                    }).then(function _callee28(map_loggin) {
                      return regeneratorRuntime.async(function _callee28$(_context28) {
                        while (1) {
                          switch (_context28.prev = _context28.next) {
                            case 0:
                              return _context28.abrupt("return", JSON.stringify(map_loggin));

                            case 1:
                            case "end":
                              return _context28.stop();
                          }
                        }
                      });
                    }));

                  case 8:
                    _context29.t1 = _context29.sent;
                    maping_login = _context29.t0.parse.call(_context29.t0, _context29.t1);
                    // BPCNUM FORM MAPPINGLOGGING
                    console.log(inv_detail["BPCINV"]);
                    msg = false, find = 0;

                    if (user["ROLE"] !== 4) {
                      for (i = 0; i < maping_login["$resources"].length; i++) {
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
                        msg = "Unable to load invoice. This invoice is not available to your user account.";
                      }
                    } //HERE RENDER PAGE AND INTRO INFO


                    _context29.t2 = JSON;
                    _context29.next = 16;
                    return regeneratorRuntime.awrap(DataBaseSq.bannerSetting());

                  case 16:
                    _context29.t3 = _context29.sent;
                    banner = _context29.t2.parse.call(_context29.t2, _context29.t3);
                    activeBanner = false;

                    if (banner.Status == 1) {
                      activeBanner = true;
                    }

                    res.render("detail_invoice", {
                      pageName: "Details " + inv_num,
                      dashboardPage: true,
                      menu: true,
                      invoiceC: true,
                      closed_inv: true,
                      user: user,
                      inv_detail: inv_detail,
                      pictureProfile: pictureProfile,
                      admin: admin,
                      msg: msg,
                      banner: banner,
                      activeBanner: activeBanner
                    });

                  case 21:
                  case "end":
                    return _context29.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 1205 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 1207";
            return res.redirect("/dashboard/".concat(msg0));
          });

        case 13:
        case "end":
          return _context30.stop();
      }
    }
  });
};
/**FUNCTION TO RENDER PAY METHOD PAGE */


exports.pay_methods = function _callee32(req, res) {
  var URI, user, pictureProfile, SessionKeyLog, ip, admin, msg, query_consulting, count, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL;
  return regeneratorRuntime.async(function _callee32$(_context32) {
    while (1) {
      switch (_context32.prev = _context32.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //User info

          pictureProfile = res.locals.user["$resources"][1]["pic"]; //Pic profile

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          admin = false;

          if (user["ROLE"] == 4) {
            admin = true;
          }

          query_consulting = "&where=ID eq " + user["ID"].toString() + ""; //Where clause with EMAIL

          count = 1000; //SAVE SYSTEMLOG SQL

          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Request payments methods from X3", Status = 1, Comment = "Function: pay_methods - Line 567";
          _context32.next = 12;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 12:
          SystemLogL = _context32.sent;
          //GET PayMethods from X3
          request({
            uri: URI + "YPORTALPAY?representation=YPORTALPAY.$query&count=" + count + "" + query_consulting,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee31(pay_methods) {
            var _res$render;

            var SystemLogL, CCMethod, ACHMethod, activeACH, i, search, _i9, banner, activeBanner;

            return regeneratorRuntime.async(function _callee31$(_context31) {
              while (1) {
                switch (_context31.prev = _context31.next) {
                  case 0:
                    // SAVE SYSTEMLOG SQL
                    Description = "Payments methods list from X3 success", Status = 1, Comment = "Function: pay_methods - Line 599";
                    _context31.next = 3;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 3:
                    SystemLogL = _context31.sent;
                    pay_methods = pay_methods["$resources"]; //Pay Methods List

                    CCMethod = [], ACHMethod = [], activeACH = []; // console.log(pay_methods)

                    i = 0;

                  case 7:
                    if (!(i < pay_methods.length)) {
                      _context31.next = 18;
                      break;
                    }

                    _context31.t0 = pay_methods[i]["PAYTYPE"];
                    _context31.next = _context31.t0 === "CC" ? 11 : _context31.t0 === "ACH" ? 13 : 15;
                    break;

                  case 11:
                    CCMethod.push(pay_methods[i]);
                    return _context31.abrupt("break", 15);

                  case 13:
                    ACHMethod.push(pay_methods[i]);
                    return _context31.abrupt("break", 15);

                  case 15:
                    i++;
                    _context31.next = 7;
                    break;

                  case 18:
                    search = [];
                    _i9 = 0;

                  case 20:
                    if (!(_i9 < ACHMethod.length)) {
                      _context31.next = 32;
                      break;
                    }

                    _context31.t1 = JSON;
                    _context31.next = 24;
                    return regeneratorRuntime.awrap(DataBaseSq.verifyPaymentMethodIDProcess(ACHMethod[_i9]['PAYID'], UserID));

                  case 24:
                    _context31.t2 = _context31.sent;
                    search[0] = _context31.t1.parse.call(_context31.t1, _context31.t2);
                    ACHMethod[_i9].verify = 0;
                    console.log(search[0]);

                    if (search[0] == null) {
                      ACHMethod[_i9].verify = 1;
                    }

                  case 29:
                    _i9++;
                    _context31.next = 20;
                    break;

                  case 32:
                    console.log('message');

                    if (!req.cookies.errorLogC) {
                      _context31.next = 42;
                      break;
                    }

                    msg = req.cookies.errorLogC;
                    console.log("🚀 ~ file: dashboardController.js:1240 ~ exports.pay_methods= ~ ms");
                    Description = "pay_methods Showing error Msg";
                    Status = 0;
                    Comment = msg;
                    _context31.next = 41;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 41:
                    SystemLogL = _context31.sent;

                  case 42:
                    if (!req.cookies.success) {
                      _context31.next = 51;
                      break;
                    }

                    msg = req.cookies.success;
                    console.log("🚀 ~ file: dashboardController.js:1248 ~ exports.pay_methods= ~ msg:", msg);
                    Description = "pay_methods Showing success Msg";
                    Status = 1;
                    Comment = msg;
                    _context31.next = 50;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 50:
                    SystemLogL = _context31.sent;

                  case 51:
                    _context31.t3 = JSON;
                    _context31.next = 54;
                    return regeneratorRuntime.awrap(DataBaseSq.bannerSetting());

                  case 54:
                    _context31.t4 = _context31.sent;
                    banner = _context31.t3.parse.call(_context31.t3, _context31.t4);
                    activeBanner = false;

                    if (banner.Status == 1) {
                      activeBanner = true;
                    } //HERE RENDER PAGE AND INTRO INFO


                    res.render("payments_methods", (_res$render = {
                      pageName: "Payments Methods",
                      dashboardPage: true,
                      menu: true,
                      pay_methods: true,
                      user: user
                    }, _defineProperty(_res$render, "pay_methods", pay_methods), _defineProperty(_res$render, "pictureProfile", pictureProfile), _defineProperty(_res$render, "admin", admin), _defineProperty(_res$render, "CCMethod", CCMethod), _defineProperty(_res$render, "msg", msg), _defineProperty(_res$render, "ACHMethod", ACHMethod), _defineProperty(_res$render, "banner", banner), _defineProperty(_res$render, "activeBanner", activeBanner), _res$render));

                  case 59:
                  case "end":
                    return _context31.stop();
                }
              }
            });
          });

        case 14:
        case "end":
          return _context32.stop();
      }
    }
  });
};
/**FUNCTION TO SAVE PAYMENTS METHODS TO X3  */


exports.add_pay_methods = function _callee36(req, res) {
  var URI, user, SessionKeyLog, ip, query_consulting, count, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, payIDs, typeMP, _req$body, cardNumber, cardName, addCardExpiryDate, cvv, addressCard, zipCode, totalAmountcard, state, city, cardNickName, IDPay, i, _req$body2, payName, bank_id, bank_account_number, legalNameAccount, _IDPay, _i10;

  return regeneratorRuntime.async(function _callee36$(_context36) {
    while (1) {
      switch (_context36.prev = _context36.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //User info

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress; //console.log(user)

          query_consulting = "&where=ID eq " + user["ID"] + "";
          count = 1000; //Save SQL LOG

          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 9, SessionKey = SessionKeyLog, Description = "Loading Add payments methods module to X3", Status = 1, Comment = "Function: add_pay_methods - line 659";
          _context36.next = 9;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 9:
          SystemLogL = _context36.sent;
          _context36.t0 = JSON;
          _context36.next = 13;
          return regeneratorRuntime.awrap(request({
            uri: URI + "YPORTALPAY?representation=YPORTALPAY.$query&count=" + count + " " + query_consulting,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee33(list_pays) {
            return regeneratorRuntime.async(function _callee33$(_context33) {
              while (1) {
                switch (_context33.prev = _context33.next) {
                  case 0:
                    //SAVE SQL LOG
                    Description = "Getting payments methods from X3 to created PAYID-Get Success", Status = 1, Comment = "Function: add_pay_methods - line 695";
                    _context33.next = 3;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 3:
                    SystemLogL = _context33.sent;
                    return _context33.abrupt("return", JSON.stringify(list_pays));

                  case 5:
                  case "end":
                    return _context33.stop();
                }
              }
            });
          }));

        case 13:
          _context36.t1 = _context36.sent;
          payIDs = _context36.t0.parse.call(_context36.t0, _context36.t1);
          typeMP = req.body.typeM;
          console.log("🚀 ~ file: dashboardController.js ~ line 1262 ~ exports.add_pay_methods= ~ typeMP", typeMP);

          if (!(typeMP == "CC")) {
            _context36.next = 45;
            break;
          }

          _req$body = req.body, cardNumber = _req$body.cardNumber, cardName = _req$body.cardName, addCardExpiryDate = _req$body.addCardExpiryDate, cvv = _req$body.cvv, addressCard = _req$body.addressCard, zipCode = _req$body.zipCode, totalAmountcard = _req$body.totalAmountcard, state = _req$body.state, city = _req$body.city, cardNickName = _req$body.cardNickName; //This variables contain  info about credit card for save in x3

          /**ENCRYPT INFO CREDIT CARD BEFORE SEND TO X3 */

          cardNumber = encrypt(cardNumber);
          cvv = encrypt(cvv);
          addCardExpiryDate = encrypt(addCardExpiryDate);
          zipCode = encrypt(zipCode);
          cardName = encrypt(cardName); // Check out if credit Card is duplicate

          IDPay = 0;
          i = 0;

        case 26:
          if (!(i < payIDs["$resources"].length)) {
            _context36.next = 41;
            break;
          }

          IDPay = parseInt(payIDs["$resources"][i]["PAYID"]);

          if (!(payIDs["$resources"][i]["CARDNO"] === cardNumber)) {
            _context36.next = 38;
            break;
          }

          // Card Number exist in X3
          Description = "Card Number exist in payments methods from X3 ", Status = 1, Comment = "Function: add_pay_methods - line 718";
          _context36.next = 32;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 32:
          SystemLogL = _context36.sent;

          if (!totalAmountcard) {
            _context36.next = 36;
            break;
          }

          //If the request comes from the payment of invoices Page, it returns a message of Card Number exist, try another
          res.send({
            msg: "Card Number exist, try another"
          });
          return _context36.abrupt("return");

        case 36:
          req.flash("error", "Card Number exist, try another");
          return _context36.abrupt("return", res.redirect("/payments_methods"));

        case 38:
          i++;
          _context36.next = 26;
          break;

        case 41:
          //If Card Number not exist in X3 Save
          IDPay = parseInt(IDPay) + 1; //Create PayID

          request({
            uri: URI + "YPORTALPAY?representation=YPORTALPAY.$create",
            method: "POST",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
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
              CRY: ""
            },
            json: true
          }).then(function _callee34(added_pay_methods) {
            return regeneratorRuntime.async(function _callee34$(_context34) {
              while (1) {
                switch (_context34.prev = _context34.next) {
                  case 0:
                    //Save LOG SYSTEM SQL
                    Description = "Payments methods added to X3 ", Status = 1, Comment = "Payment method added success";
                    _context34.next = 3;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 3:
                    SystemLogL = _context34.sent;

                    if (!totalAmountcard) {
                      _context34.next = 7;
                      break;
                    }

                    //If the request comes from the payment of invoices Page, it returns success
                    res.send({
                      success: "success"
                    });
                    return _context34.abrupt("return");

                  case 7:
                    req.flash("success", "Card added");
                    res.redirect("/payments_methods"); //If the request comes from the PayMethods Page, redirect with a message Card added

                  case 9:
                  case "end":
                    return _context34.stop();
                }
              }
            });
          });
          _context36.next = 69;
          break;

        case 45:
          _req$body2 = req.body, payName = _req$body2.payName, bank_id = _req$body2.bank_id, bank_account_number = _req$body2.bank_account_number, legalNameAccount = _req$body2.legalNameAccount; //This variables contain  info about ACH for save in x3

          /**ENCRYPT INFO ACH BEFORE SEND TO X3 */

          bank_account_number = encrypt(bank_account_number);
          bank_id = encrypt(bank_id);
          payName = encrypt(payName);
          legalNameAccount = encrypt(legalNameAccount); // Check out if ACH is duplicate

          _IDPay = 0;
          _i10 = 0;

        case 52:
          if (!(_i10 < payIDs["$resources"].length)) {
            _context36.next = 67;
            break;
          }

          _IDPay = parseInt(payIDs["$resources"][_i10]["PAYID"]);

          if (!(payIDs["$resources"][_i10]["BANKACCT"] === bank_account_number)) {
            _context36.next = 64;
            break;
          }

          // Card Number exist in X3
          Description = "ACHI exist in payments methods from X3 ", Status = 1, Comment = "Function: add_pay_methods - line 827";
          _context36.next = 58;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 58:
          SystemLogL = _context36.sent;

          if (!totalAmountcard) {
            _context36.next = 62;
            break;
          }

          //If the request comes from the payment of invoices Page, it returns a message of Card Number exist, try another
          res.send({
            msg: "Bank Account exist, try another"
          });
          return _context36.abrupt("return");

        case 62:
          res.cookie('errorLogC', "Bank Account exist, try another", {
            maxAge: 3600
          });
          return _context36.abrupt("return", res.redirect("/payments_methods"));

        case 64:
          _i10++;
          _context36.next = 52;
          break;

        case 67:
          //If ACH not exist in X3 Save
          _IDPay = parseInt(_IDPay) + 1; //Create PayID

          request({
            uri: URI + "YPORTALPAY?representation=YPORTALPAY.$create",
            method: "POST",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            body: {
              PAYTYPE: typeMP,
              ID: user.ID,
              PAYID: _IDPay,
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
              CRY: ""
            },
            json: true
          }).then(function _callee35(response) {
            var apikey, modeEnv, gateaway, hostLink, WF_APIKey, FirstAmount, _i11, consult_paymentID, prepare_idWF, payment_id0, complete_seq, fraudProtection, back_side_res, payment_id, transactionDate, error, errorLogD, errorLogC, descp, comm, TranAmount, _tPaymentSave, paymentKey;

            return regeneratorRuntime.async(function _callee35$(_context35) {
              while (1) {
                switch (_context35.prev = _context35.next) {
                  case 0:
                    //Save LOG SYSTEM SQL
                    Description = "Payments methods added to X3 ", Status = 1, Comment = "Payment method added success";
                    _context35.next = 3;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 3:
                    SystemLogL = _context35.sent;

                    if (!totalAmountcard) {
                      _context35.next = 7;
                      break;
                    }

                    //If the request comes from the payment of invoices Page, it returns success
                    res.send({
                      success: "success"
                    });
                    return _context35.abrupt("return");

                  case 7:
                    console.log("🚀 ~ file: dashboardController.js ~ line 1458 ~ exports.add_pay_methods= ~ response", response['$uuid']);
                    _context35.t0 = JSON;
                    _context35.next = 11;
                    return regeneratorRuntime.awrap(DataBaseSq.settingsTableTypeEnvProduction());

                  case 11:
                    _context35.t1 = _context35.sent;
                    modeEnv = _context35.t0.parse.call(_context35.t0, _context35.t1);

                    if (!(req.cookies.wf && modeEnv.Status == 1)) {
                      _context35.next = 17;
                      break;
                    }

                    apikey = req.cookies.wf;
                    _context35.next = 30;
                    break;

                  case 17:
                    _context35.t2 = JSON;
                    _context35.next = 20;
                    return regeneratorRuntime.awrap(DataBaseSq.settingsgateway());

                  case 20:
                    _context35.t3 = _context35.sent;
                    gateaway = _context35.t2.parse.call(_context35.t2, _context35.t3);
                    hostLink = gateaway[4]["valueSett"];
                    _context35.t4 = JSON;
                    _context35.next = 26;
                    return regeneratorRuntime.awrap(WFCCtrl.APYKeyGet(hostLink).then(function (response) {
                      return JSON.stringify(response);
                    }));

                  case 26:
                    _context35.t5 = _context35.sent;
                    WF_APIKey = _context35.t4.parse.call(_context35.t4, _context35.t5);
                    apikey = WF_APIKey["access_token"];

                    if (modeEnv.Status == 1) {
                      res.cookie("wf", WF_APIKey["access_token"], {
                        maxAge: WF_APIKey["expires_in"]
                      });
                    }

                  case 30:
                    //console.log(req.body)
                    FirstAmount = 0.025;
                    console.log(); //SEND PAYMENT TO WF API

                    _i11 = 0;

                  case 33:
                    if (!(_i11 < 2)) {
                      _context35.next = 102;
                      break;
                    }

                    FirstAmount = Math.random().toFixed(2);

                    if (FirstAmount >= 1) {
                      FirstAmount = Math.random().toFixed(2);
                    }

                    _context35.t6 = JSON;
                    _context35.next = 39;
                    return regeneratorRuntime.awrap(DataBaseSq.GetLastPaymenTIDFraudP());

                  case 39:
                    _context35.t7 = _context35.sent;
                    consult_paymentID = _context35.t6.parse.call(_context35.t6, _context35.t7);
                    //GET Last PaymentID WF to create next
                    console.log(consult_paymentID);
                    prepare_idWF = void 0;

                    if (consult_paymentID.length == 0) {
                      prepare_idWF = "FP000000000001";
                    } else {
                      payment_id0 = consult_paymentID[0]["TransactionID"]; // GET TRANSACTIONID FOR CREATE NEXT NUM

                      prepare_idWF = payment_id0.replace("FP", ""); //

                      prepare_idWF = parseInt(consult_paymentID[0]["pmtKey"]) + 1;
                      complete_seq = prepare_idWF.toString().padStart(12, "0");
                      prepare_idWF = "FP" + complete_seq;
                    }

                    bank_account_number = decrypt(bank_account_number);
                    bank_id = decrypt(bank_id);
                    payName = decrypt(payName);

                    if (bank_id.length < 9) {
                      console.log(bank_id.length);
                      bank_id = bank_id;
                      bank_id = bank_id.padStart(9, "0");
                    }

                    legalNameAccount = decrypt(legalNameAccount);
                    _context35.next = 51;
                    return regeneratorRuntime.awrap(WFCCtrl.WF_FraudProtection(FirstAmount, apikey, legalNameAccount, bank_id, bank_account_number, prepare_idWF));

                  case 51:
                    fraudProtection = _context35.sent;
                    console.log(fraudProtection);
                    back_side_res = fraudProtection["x-backside-transport"], payment_id = fraudProtection["payment-id"];
                    transactionDate = moment(fraudProtection["date"]).format("YYYY-MM-DD");
                    error = "";

                    if (!fraudProtection["errors"]) {
                      _context35.next = 82;
                      break;
                    }

                    console.log(fraudProtection["errors"][0]);
                    error = fraudProtection["errors"]; //IF RESPONSE ERROR, SAVE IN LOGSYSTEM SQL THE ERROR

                    console.log("Error : " + JSON.stringify(error)); //SHOW IN CONSOLE THE ERROR

                    errorLogD = "Error:" + fraudProtection["errors"][0]["error_code"] + "- process payment";
                    console.log(errorLogD); //SHOW IN CONSOLE THE ERROR

                    errorLogC = fraudProtection["errors"][0]["description"];
                    console.log('errorLogC'); //SHOW IN CONSOLE THE ERROR

                    Description = errorLogD, Status = 0, Comment = errorLogC;
                    _context35.next = 67;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 67:
                    SystemLogL = _context35.sent;
                    SystemLogL = JSON.parse(SystemLogL);
                    _context35.next = 71;
                    return regeneratorRuntime.awrap(DataBaseSq.tPaymentFraudProtectionSave(0, SessionKey, UserID, prepare_idWF, FirstAmount, 0, transactionDate, 0, "FAIL", "FAIL", _IDPay, response['$uuid'], errorLogC, 'Credit'));

                  case 71:
                    tPaymentSave = _context35.sent;
                    //res.cookie('errorLogC', errorLogC, { maxAge: 3600 });
                    Description = 'JSON call WFFP', Status = 0, Comment = "payee:".concat(legalNameAccount, "/bank_id:").concat(bank_id, "/bank_account_number:").concat(bank_account_number, "/bank_account_type: D");
                    _context35.next = 75;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 75:
                    SystemLogL = _context35.sent;
                    SystemLogL = JSON.parse(SystemLogL);
                    console.log("🚀 ~ file: dashboardController.js ~ line 1461 ~ exports.add_pay_methods= ~ errorLogC", errorLogC);
                    res.cookie('errorLogC', errorLogC, {
                      maxAge: 3600
                    });
                    return _context35.abrupt("return", res.redirect("/payments_methods"));

                  case 82:
                    if (!(back_side_res == "OK OK")) {
                      _context35.next = 99;
                      break;
                    }

                    //IF RESPONSE FINE, SAVE PAYMENT INFO IN SQL TABLE
                    descp = void 0, comm = void 0, TranAmount = parseFloat(totalAmountcard), _tPaymentSave = void 0;
                    //ENCRYPT CREDIT CARD INFO FOR SAVE IN SQL TABLE
                    bank_id = encrypt(bank_id);
                    bank_account_number = encrypt(bank_account_number);
                    payName = encrypt(payName);
                    legalNameAccount = encrypt(legalNameAccount); //IF PAYMENT STATUS IS "AUTHORIZED" SAVE IN SQL TABLE LOG SYSTEM

                    descp = "Process status res: " + back_side_res;
                    comm = "Process payment success: OK-PENDDING";
                    Description = descp, Status = 1, Comment = comm, SessionKey = SessionKeyLog;
                    _context35.next = 93;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 93:
                    SystemLogL = _context35.sent;
                    _context35.next = 96;
                    return regeneratorRuntime.awrap(DataBaseSq.tPaymentFraudProtectionSave(1, SessionKey, UserID, payment_id, FirstAmount, 0, transactionDate, 0, "PENDING", "PENDING", _IDPay, response['$uuid'], null, 'Credit'));

                  case 96:
                    _tPaymentSave = _context35.sent;
                    paymentKey = JSON.parse(_tPaymentSave).pmtKey; // THIS GET THE PAYMENT KEY ID
                    //SHOW CONSOLE INFO ABOUT PAYMENT

                    console.log("--Sucess in SQL: " + paymentKey);

                  case 99:
                    _i11++;
                    _context35.next = 33;
                    break;

                  case 102:
                    res.cookie('success', "ACH Bank Account added, please check your bank account for two deposits under $1 and verify the amounts. You have 14 days to verify the account, otherwise the deposits will be transferred and the bank account verification process will need to be restarted.", {
                      maxAge: 3600
                    });
                    res.redirect("/payments_methods"); //If the request comes from the PayMethods Page, redirect with a message Card added

                  case 104:
                  case "end":
                    return _context35.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: dashboardController.js ~ line 1519 ~ exports.add_pay_methods= ~ err", err);
            res.cookie('errorLogC', "Please contact support somethins wrong with X3.", {
              maxAge: 3600
            });
            res.redirect("/payments_methods");
          });

        case 69:
        case "end":
          return _context36.stop();
      }
    }
  });
};

exports.verify_PM = function _callee39(req, res) {
  var URI, PaymentMethodID, user, SessionKeyLog, ip, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, search, status, apikey, modeEnv, gateaway, hostLink, WF_APIKey, amount1, amount2, accountVerified, isThereAnyAmount1, isThereAnyAmount2, i, saveFraudPr, saveFraudPr0, payIDs, _loop, _i12, paymentKey, _ret;

  return regeneratorRuntime.async(function _callee39$(_context40) {
    while (1) {
      switch (_context40.prev = _context40.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          PaymentMethodID = req.params.IDPay;
          user = res.locals.user["$resources"][0]; //User info

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 9, SessionKey = SessionKeyLog, Description = "Verify Payments Methods", Status = 1, Comment = "Function: verify_PM - line 1586";
          _context40.next = 8;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 8:
          SystemLogL = _context40.sent;
          _context40.t0 = JSON;
          _context40.next = 12;
          return regeneratorRuntime.awrap(DataBaseSq.verifyPaymentMethodID(PaymentMethodID, UserID));

        case 12:
          _context40.t1 = _context40.sent;
          search = _context40.t0.parse.call(_context40.t0, _context40.t1);
          console.log('lines 1589', search);
          _context40.t2 = JSON;
          _context40.next = 18;
          return regeneratorRuntime.awrap(DataBaseSq.settingsTableTypeEnvProduction());

        case 18:
          _context40.t3 = _context40.sent;
          modeEnv = _context40.t2.parse.call(_context40.t2, _context40.t3);

          if (!(req.cookies.wf && modeEnv.Status == 1)) {
            _context40.next = 24;
            break;
          }

          apikey = req.cookies.wf;
          _context40.next = 37;
          break;

        case 24:
          _context40.t4 = JSON;
          _context40.next = 27;
          return regeneratorRuntime.awrap(DataBaseSq.settingsgateway());

        case 27:
          _context40.t5 = _context40.sent;
          gateaway = _context40.t4.parse.call(_context40.t4, _context40.t5);
          hostLink = gateaway[4]["valueSett"];
          _context40.t6 = JSON;
          _context40.next = 33;
          return regeneratorRuntime.awrap(WFCCtrl.APYKeyGet(hostLink).then(function (response) {
            return JSON.stringify(response);
          }));

        case 33:
          _context40.t7 = _context40.sent;
          WF_APIKey = _context40.t6.parse.call(_context40.t6, _context40.t7);
          apikey = WF_APIKey["access_token"];

          if (modeEnv.Status == 1) {
            res.cookie("wf", WF_APIKey["access_token"], {
              maxAge: WF_APIKey["expires_in"]
            });
          }

        case 37:
          amount1 = req.params.amount1, amount2 = req.params.amount2;
          accountVerified = 0;
          isThereAnyAmount1 = search.some(function (item) {
            return item.TranAmount == parseFloat(amount1);
          });
          console.log("🚀 ~ file: dashboardController.js ~ line 1609 ~ exports.verify_PM= ~ isThereAnyAmount1", isThereAnyAmount1);
          isThereAnyAmount2 = search.some(function (item) {
            return item.TranAmount == parseFloat(amount2);
          });
          console.log("🚀 ~ file: dashboardController.js ~ line 1611 ~ exports.verify_PM= ~ isThereAnyAmount2", isThereAnyAmount2);

          if (isThereAnyAmount1) {
            _context40.next = 52;
            break;
          }

          res.cookie('errorLogC', "The amount 1 not correspond to the one sent to the account", {
            maxAge: 3600
          });
          accountVerified = -1;
          Description = "Error: Amount Verify FP";
          Status = 1;
          Comment = "The amount 1 not correspond to the one sent to the account -1623";
          _context40.next = 51;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 51:
          SystemLogL = _context40.sent;

        case 52:
          if (isThereAnyAmount2) {
            _context40.next = 61;
            break;
          }

          res.cookie('errorLogC', "The amount 2 does not correspond to the one sent to the account", {
            maxAge: 3600
          });
          accountVerified = -1;
          Description = "Error: Amount Verify FP";
          Status = 1;
          Comment = "The amount 2 not correspond to the one sent to the account -1623";
          _context40.next = 60;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 60:
          SystemLogL = _context40.sent;

        case 61:
          if (!(isThereAnyAmount1 && isThereAnyAmount2)) {
            _context40.next = 105;
            break;
          }

          i = 0;

        case 63:
          if (!(i < search.length)) {
            _context40.next = 105;
            break;
          }

          console.log('amount1:', parseFloat(amount1));
          console.log('amount2:', parseFloat(amount2));
          console.log('i:' + i);
          console.log('TranAmount', search[i]['TranAmount']);
          _context40.t8 = JSON;
          _context40.next = 71;
          return regeneratorRuntime.awrap(WFCCtrl.GetStatus(apikey, search[i]['TransactionID']).then(function (response) {
            return JSON.stringify(response);
          }));

        case 71:
          _context40.t9 = _context40.sent;
          status = _context40.t8.parse.call(_context40.t8, _context40.t9);
          console.log('line 1640', status);

          if (!(status['payment_status'] == 'PROCESSED')) {
            _context40.next = 90;
            break;
          }

          _context40.t10 = JSON;
          _context40.next = 78;
          return regeneratorRuntime.awrap(DataBaseSq.saveFraudProtectionSave(status['trace_number'], status['payment_status'], status['payment_status'], search[i]['pmtKey']));

        case 78:
          _context40.t11 = _context40.sent;
          _context40.t12 = status['payment_status'];
          saveFraudPr = _context40.t10.parse.call(_context40.t10, _context40.t11, _context40.t12);
          accountVerified++;
          Description = "Success: payment_status Verify FP";
          Status = 1;
          Comment = "payment_status PROCESSED -1647";
          _context40.next = 87;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 87:
          SystemLogL = _context40.sent;
          _context40.next = 102;
          break;

        case 90:
          _context40.t13 = JSON;
          _context40.next = 93;
          return regeneratorRuntime.awrap(DataBaseSq.saveFraudProtectionSave(status['trace_number'], status['payment_status'], status['payment_status'], search[i]['pmtKey']));

        case 93:
          _context40.t14 = _context40.sent;
          _context40.t15 = status['payment_status'];
          saveFraudPr0 = _context40.t13.parse.call(_context40.t13, _context40.t14, _context40.t15);
          Description = "Error: payment_status Verify FP";
          Status = 1;
          Comment = "".concat(status['payment_status'], " PROCESSED -1651");
          _context40.next = 101;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 101:
          SystemLogL = _context40.sent;

        case 102:
          i++;
          _context40.next = 63;
          break;

        case 105:
          console.log('lines 1666', accountVerified); //console.log(search[0]['PaymentMethodID'])

          if (!(accountVerified > 1)) {
            _context40.next = 130;
            break;
          }

          _context40.t16 = JSON;
          _context40.next = 110;
          return regeneratorRuntime.awrap(request({
            uri: URI + "YPORTALPAY?representation=YPORTALPAY.$query&where=ID eq ".concat(user["ID"], " AND PAYID eq ").concat(search[0]['PaymentMethodID']),
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee37(list_pays) {
            return regeneratorRuntime.async(function _callee37$(_context37) {
              while (1) {
                switch (_context37.prev = _context37.next) {
                  case 0:
                    return _context37.abrupt("return", JSON.stringify(list_pays));

                  case 1:
                  case "end":
                    return _context37.stop();
                }
              }
            });
          }));

        case 110:
          _context40.t17 = _context40.sent;
          payIDs = _context40.t16.parse.call(_context40.t16, _context40.t17);
          console.log('lines 1780', payIDs);
          console.log('AMOUNT1', amount1, ' amount2: ', amount2);

          _loop = function _loop(_i12) {
            var consult_paymentID, amount, prepare_idWF, payment_id0, complete_seq, bank_account_number, bank_id, legalNameAccount, fraudProtection, back_side_res, payment_id, transactionDate, error, errorLogD, errorLogC, getpmtKeyToRefund, descp, comm, _tPaymentSave2, _getpmtKeyToRefund;

            return regeneratorRuntime.async(function _loop$(_context39) {
              while (1) {
                switch (_context39.prev = _context39.next) {
                  case 0:
                    _context39.t0 = JSON;
                    _context39.next = 3;
                    return regeneratorRuntime.awrap(DataBaseSq.GetLastPaymenTIDFraudP());

                  case 3:
                    _context39.t1 = _context39.sent;
                    consult_paymentID = _context39.t0.parse.call(_context39.t0, _context39.t1);
                    //GET Last PaymentID WF to create next
                    console.log(consult_paymentID);
                    amount = void 0;

                    if (_i12 == 0) {
                      amount = amount1;
                    }

                    if (_i12 == 1) {
                      amount = amount2;
                    }

                    prepare_idWF = void 0;

                    if (consult_paymentID.length == 0) {
                      prepare_idWF = "FP000000000001";
                    } else {
                      payment_id0 = consult_paymentID[0]["TransactionID"]; // GET TRANSACTIONID FOR CREATE NEXT NUM

                      prepare_idWF = payment_id0.replace("FP", ""); //

                      prepare_idWF = parseInt(consult_paymentID[0]["pmtKey"]) + 1;
                      complete_seq = prepare_idWF.toString().padStart(12, "0");
                      prepare_idWF = "FP" + complete_seq;
                    }

                    bank_account_number = decrypt(payIDs["$resources"][0]["BANKACCT"]);
                    bank_id = decrypt(payIDs["$resources"][0]["BANKROUT"]);
                    legalNameAccount = decrypt(payIDs["$resources"][0]["NAME"]);

                    if (bank_id.length < 9) {
                      console.log(bank_id.length);
                      bank_id = bank_id;
                      bank_id = bank_id.padStart(9, "0");
                    }

                    _context39.next = 17;
                    return regeneratorRuntime.awrap(WFCCtrl.WFFP_Debit(amount, apikey, legalNameAccount, bank_id, bank_account_number, prepare_idWF));

                  case 17:
                    fraudProtection = _context39.sent;
                    console.log('line 1806', fraudProtection);
                    back_side_res = fraudProtection["x-backside-transport"], payment_id = fraudProtection["payment-id"];
                    transactionDate = moment(fraudProtection["date"]).format("YYYY-MM-DD");
                    error = "";

                    if (!fraudProtection["errors"]) {
                      _context39.next = 52;
                      break;
                    }

                    console.log(fraudProtection["errors"][0]);
                    error = fraudProtection["errors"]; //IF RESPONSE ERROR, SAVE IN LOGSYSTEM SQL THE ERROR

                    console.log("\nError : " + JSON.stringify(error)); //SHOW IN CONSOLE THE ERROR

                    errorLogD = "Error:" + fraudProtection["errors"][0]["error_code"] + "- amount:" + amount;
                    console.log(errorLogD); //SHOW IN CONSOLE THE ERROR

                    errorLogC = fraudProtection["errors"][0]["description"];
                    console.log('errorLogC'); //SHOW IN CONSOLE THE ERROR

                    Description = errorLogD, Status = 0, Comment = errorLogC;
                    _context39.next = 33;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 33:
                    SystemLogL = _context39.sent;
                    SystemLogL = JSON.parse(SystemLogL);
                    _context39.next = 37;
                    return regeneratorRuntime.awrap(DataBaseSq.tPaymentFraudProtectionSave(0, SessionKey, UserID, prepare_idWF, amount, 0, transactionDate, 0, "FAIL", "FAIL", null, PaymentMethodID, errorLogC, 'Debit'));

                  case 37:
                    tPaymentSave = _context39.sent;
                    getpmtKeyToRefund = search.filter(function (x) {
                      return x.TranAmount == amount;
                    });
                    _context39.next = 41;
                    return regeneratorRuntime.awrap(DataBaseSq.saveFraudProtectionSaveFundsReturned(0, errorLogC, getpmtKeyToRefund[0]['pmtKey'], 'Debit'));

                  case 41:
                    saveFraudProtectionSaveFundsReturned = _context39.sent;
                    Description = 'JSON call WFFP Debit', Status = 0, Comment = "payee:".concat(legalNameAccount, "/bank_id:").concat(bank_id, "/bank_account_number:").concat(bank_account_number, "/bank_account_type: D");
                    _context39.next = 45;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 45:
                    SystemLogL = _context39.sent;
                    SystemLogL = JSON.parse(SystemLogL);
                    console.log("🚀 ~ file: dashboardController.js ~ line 1461 ~ exports.add_pay_methods= ~ errorLogC", errorLogC);
                    res.cookie('errorLogC', errorLogC, {
                      maxAge: 3600
                    });
                    return _context39.abrupt("return", {
                      v: res.redirect("/payments_methods")
                    });

                  case 52:
                    if (!(back_side_res == "OK OK")) {
                      _context39.next = 69;
                      break;
                    }

                    //IF RESPONSE FINE, SAVE PAYMENT INFO IN SQL TABLE
                    //IF PAYMENT STATUS IS "AUTHORIZED" SAVE IN SQL TABLE LOG SYSTEM
                    descp = "Process status res: " + back_side_res;
                    comm = "Process payment Debit success: OK-OK, amount: " + amount;
                    Description = descp, Status = 1, Comment = comm, SessionKey = SessionKeyLog;
                    _context39.next = 58;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 58:
                    SystemLogL = _context39.sent;
                    _context39.next = 61;
                    return regeneratorRuntime.awrap(DataBaseSq.tPaymentFraudProtectionSave(1, SessionKey, UserID, payment_id, amount, 0, transactionDate, 0, "OK", "OK", null, PaymentMethodID, null, 'Debit'));

                  case 61:
                    _tPaymentSave2 = _context39.sent;
                    _getpmtKeyToRefund = search.filter(function (x) {
                      return x.TranAmount == amount;
                    });
                    _context39.next = 65;
                    return regeneratorRuntime.awrap(DataBaseSq.saveFraudProtectionSaveFundsReturned(1, null, _getpmtKeyToRefund[0]['pmtKey'], 'Debit'));

                  case 65:
                    saveFraudProtectionSaveFundsReturned = _context39.sent;
                    paymentKey = JSON.parse(_tPaymentSave2).pmtKey; // THIS GET THE PAYMENT KEY ID

                    console.log("🚀 ~ file: dashboardController.js ~ line 1718 ~ exports.verify_PM= ~ paymentKey", paymentKey); //SHOW CONSOLE INFO ABOUT PAYMENT

                    console.log("--Sucess in SQL: " + paymentKey);

                  case 69:
                  case "end":
                    return _context39.stop();
                }
              }
            });
          };

          _i12 = 0;

        case 116:
          if (!(_i12 < 2)) {
            _context40.next = 125;
            break;
          }

          _context40.next = 119;
          return regeneratorRuntime.awrap(_loop(_i12));

        case 119:
          _ret = _context40.sent;

          if (!(_typeof(_ret) === "object")) {
            _context40.next = 122;
            break;
          }

          return _context40.abrupt("return", _ret.v);

        case 122:
          _i12++;
          _context40.next = 116;
          break;

        case 125:
          request({
            uri: URI + "YPORTALPAY('".concat(user.ID, "~").concat(search[0]['PaymentMethodID'], "')?representation=YPORTALPAY.$edit"),
            method: "PUT",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            body: {
              "VERIFIED": true
            },
            json: true
          }).then(function _callee38(added_pay_methods) {
            return regeneratorRuntime.async(function _callee38$(_context38) {
              while (1) {
                switch (_context38.prev = _context38.next) {
                  case 0:
                    // SAVE SQL LOGSYSTEM
                    Description = "Success payments methods VERIFIED", Status = 1, Comment = "Function: - VERIFIED";
                    _context38.next = 3;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 3:
                    SystemLogL = _context38.sent;

                  case 4:
                  case "end":
                    return _context38.stop();
                }
              }
            });
          });
          res.cookie('success', "Your account was verified. Now is available to use.", {
            maxAge: 3600
          });
          res.redirect("/payments_methods");
          _context40.next = 134;
          break;

        case 130:
          if (!(accountVerified == -1)) {
            _context40.next = 132;
            break;
          }

          return _context40.abrupt("return", res.redirect("/payments_methods"));

        case 132:
          res.cookie('errorLogC', "Your account could not be verified, please reach out to support.", {
            maxAge: 3600
          });
          res.redirect("/payments_methods");

        case 134:
        case "end":
          return _context40.stop();
      }
    }
  });
};
/**FUNCTION TO SAVE EDITED PAYMENTS METHODS TO X3 */


exports.edit_pay_methods = function _callee42(req, res) {
  var URI, user, SessionKeyLog, ip, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, typeMP, _req$body3, cardNumber, cardName, addCardExpiryDate, cvv, payID, addressCard, zipCode, state, city, cardNickName, _req$body4, payName, bank_id, bank_account_number, legalNameAccount;

  return regeneratorRuntime.async(function _callee42$(_context43) {
    while (1) {
      switch (_context43.prev = _context43.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //SAVE SQL LOGSYSTEM

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 9, SessionKey = SessionKeyLog, Description = "Edit payments methods module to X3", Status = 1, Comment = "Function: edit_pay_methods- line 805";
          _context43.next = 7;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 7:
          SystemLogL = _context43.sent;
          typeMP = req.body.typeM; //console.log(typeMP)

          if (typeMP == "CC") {
            //GET INFO OF CC
            _req$body3 = req.body, cardNumber = _req$body3.cardNumber, cardName = _req$body3.cardName, addCardExpiryDate = _req$body3.addCardExpiryDate, cvv = _req$body3.cvv, payID = _req$body3.payID, addressCard = _req$body3.addressCard, zipCode = _req$body3.zipCode, state = _req$body3.state, city = _req$body3.city, cardNickName = _req$body3.cardNickName; //ENCRYPT INFO ABOUT CREDIT CARD

            cardNumber = encrypt(cardNumber);
            cvv = encrypt(cvv);
            addCardExpiryDate = encrypt(addCardExpiryDate);
            zipCode = encrypt(zipCode);
            cardName = encrypt(cardName); //SAVE CREDIT CARD EDITED INFO

            request({
              uri: URI + "YPORTALPAY('".concat(user.ID, "~").concat(payID, "')?representation=YPORTALPAY.$edit"),
              method: "PUT",
              insecure: true,
              rejectUnauthorized: false,
              headers: {
                "Content-Type": "application/json",
                Connection: 'close',
                Accept: "application/json",
                Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
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
                CRY: ""
              },
              json: true
            }).then(function _callee40(added_pay_methods) {
              return regeneratorRuntime.async(function _callee40$(_context41) {
                while (1) {
                  switch (_context41.prev = _context41.next) {
                    case 0:
                      // SAVE SQL LOGSYSTEM
                      Description = "Success Edit payments methods module to X3", Status = 1, Comment = "Function: edit_pay_methods- line 870";
                      _context41.next = 3;
                      return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                    case 3:
                      SystemLogL = _context41.sent;
                      req.flash("success", "Card edited");
                      res.redirect("/payments_methods"); //Redirect with msg success Card Edited

                    case 6:
                    case "end":
                      return _context41.stop();
                  }
                }
              });
            })["catch"](function (err) {
              console.log("🚀 ~ file: .js ~ line 1881 ~ = ~ err", err);
              var msg0 = "Please contact support, sageX3 response Error-line 1881";
              return res.redirect("/dashboard/".concat(msg0));
            });
          } else {
            //GET INFO OF ACH
            _req$body4 = req.body, payName = _req$body4.payName, bank_id = _req$body4.bank_id, bank_account_number = _req$body4.bank_account_number, payID = _req$body4.payID, legalNameAccount = _req$body4.legalNameAccount; //ENCRYPT INFO ABOUT ACH

            bank_account_number = encrypt(bank_account_number);
            bank_id = encrypt(bank_id);
            payName = encrypt(payName);
            legalNameAccount = encrypt(legalNameAccount); //SAVE ACH EDITED INFO

            request({
              uri: URI + "YPORTALPAY('".concat(user.ID, "~").concat(payID, "')?representation=YPORTALPAY.$edit"),
              method: "PUT",
              insecure: true,
              rejectUnauthorized: false,
              headers: {
                "Content-Type": "application/json",
                Connection: 'close',
                Accept: "application/json",
                Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
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
                CRY: ""
              },
              json: true
            }).then(function _callee41(added_pay_methods) {
              return regeneratorRuntime.async(function _callee41$(_context42) {
                while (1) {
                  switch (_context42.prev = _context42.next) {
                    case 0:
                      // SAVE SQL LOGSYSTEM
                      Description = "Success Edit payments methods module to X3", Status = 1, Comment = "Function: edit_pay_methods- line 1049";
                      _context42.next = 3;
                      return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                    case 3:
                      SystemLogL = _context42.sent;
                      req.flash("success", "ACH Edited");
                      res.redirect("/payments_methods"); //Redirect with msg success Card Edited

                    case 6:
                    case "end":
                      return _context42.stop();
                  }
                }
              });
            })["catch"](function (err) {
              console.log("🚀 ~ file: .js ~ line 1952 ~ = ~ err", err);
              var msg0 = "Please contact support, sageX3 response Error-line 1952";
              return res.redirect("/dashboard/".concat(msg0));
            });
          }

        case 10:
        case "end":
          return _context43.stop();
      }
    }
  });
};
/**FUNCTION TO DELETE PAYMENT METHOD */


exports.delete_pay_methods = function _callee45(req, res) {
  var URI, user, SessionKeyLog, ip, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, payID, IUUD, search, _amount, _amount2, status, _apikey, modeEnv, gateaway, hostLink, WF_APIKey, i, saveFraudPr, saveFraudPr0, _payIDs, _loop2, _i13, paymentKey, _ret2;

  return regeneratorRuntime.async(function _callee45$(_context47) {
    while (1) {
      switch (_context47.prev = _context47.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //SAVE SQL LOGSYSTEM

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Delete payments methods module to X3", Status = 1, Comment = "Function: delete_pay_methods- line 1988";
          _context47.next = 7;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 7:
          SystemLogL = _context47.sent;
          payID = req.params.IDPay;
          IUUD = req.params.IUUD;
          _context47.t0 = JSON;
          _context47.next = 13;
          return regeneratorRuntime.awrap(DataBaseSq.verifyPaymentMethodID(payID, UserID));

        case 13:
          _context47.t1 = _context47.sent;
          search = _context47.t0.parse.call(_context47.t0, _context47.t1);
          console.log('line 1998', search);

          if (!(search[0].FundsReturned == 0)) {
            _context47.next = 107;
            break;
          }

          _amount = search[0].TranAmount; //FP amounts

          _amount2 = search[1].TranAmount; //FP amounts

          _context47.t2 = JSON;
          _context47.next = 22;
          return regeneratorRuntime.awrap(DataBaseSq.settingsTableTypeEnvProduction());

        case 22:
          _context47.t3 = _context47.sent;
          modeEnv = _context47.t2.parse.call(_context47.t2, _context47.t3);

          if (!(req.cookies.wf && modeEnv.Status == 1)) {
            _context47.next = 28;
            break;
          }

          _apikey = req.cookies.wf;
          _context47.next = 41;
          break;

        case 28:
          _context47.t4 = JSON;
          _context47.next = 31;
          return regeneratorRuntime.awrap(DataBaseSq.settingsgateway());

        case 31:
          _context47.t5 = _context47.sent;
          gateaway = _context47.t4.parse.call(_context47.t4, _context47.t5);
          hostLink = gateaway[4]["valueSett"];
          _context47.t6 = JSON;
          _context47.next = 37;
          return regeneratorRuntime.awrap(WFCCtrl.APYKeyGet(hostLink).then(function (response) {
            return JSON.stringify(response);
          }));

        case 37:
          _context47.t7 = _context47.sent;
          WF_APIKey = _context47.t6.parse.call(_context47.t6, _context47.t7);
          _apikey = WF_APIKey["access_token"];

          if (modeEnv.Status == 1) {
            res.cookie("wf", WF_APIKey["access_token"], {
              maxAge: WF_APIKey["expires_in"]
            });
          }

        case 41:
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Verify Amounts FPS before send debit-2004", Status = 1, Comment = "AMOUNT1: ".concat(_amount, ", amount2: ").concat(_amount2);
          _context47.next = 44;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 44:
          SystemLogL = _context47.sent;
          i = 0;

        case 46:
          if (!(i < search.length)) {
            _context47.next = 89;
            break;
          }

          console.log('amount1:', parseFloat(_amount));
          console.log('amount2:', parseFloat(_amount2));
          console.log('i:' + i);
          console.log('TranAmount', search[i]['TranAmount']);
          _context47.t8 = JSON;
          _context47.next = 54;
          return regeneratorRuntime.awrap(WFCCtrl.GetStatus(_apikey, search[i]['TransactionID']).then(function (response) {
            return JSON.stringify(response);
          }));

        case 54:
          _context47.t9 = _context47.sent;
          status = _context47.t8.parse.call(_context47.t8, _context47.t9);
          console.log('line 1640', status);

          if (!(status['payment_status'] == 'PROCESSED')) {
            _context47.next = 72;
            break;
          }

          _context47.t10 = JSON;
          _context47.next = 61;
          return regeneratorRuntime.awrap(DataBaseSq.saveFraudProtectionSave(status['trace_number'], status['payment_status'], status['payment_status'], search[i]['pmtKey']));

        case 61:
          _context47.t11 = _context47.sent;
          _context47.t12 = status['payment_status'];
          saveFraudPr = _context47.t10.parse.call(_context47.t10, _context47.t11, _context47.t12);
          Description = "Success: payment_status Verify FP Delete";
          Status = 1;
          Comment = "payment_status PROCESSED -2049 - Delete";
          _context47.next = 69;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 69:
          SystemLogL = _context47.sent;
          _context47.next = 86;
          break;

        case 72:
          _context47.t13 = JSON;
          _context47.next = 75;
          return regeneratorRuntime.awrap(DataBaseSq.saveFraudProtectionSave(status['trace_number'], status['payment_status'], status['payment_status'], search[i]['pmtKey']));

        case 75:
          _context47.t14 = _context47.sent;
          _context47.t15 = status['payment_status'];
          saveFraudPr0 = _context47.t13.parse.call(_context47.t13, _context47.t14, _context47.t15);
          Description = "Error: payment_status Verify FP-Delete";
          Status = 1;
          Comment = "".concat(status['payment_status'], " PROCESSED -2055");
          _context47.next = 83;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 83:
          SystemLogL = _context47.sent;
          res.cookie('errorLogC', "Your account could not be deleted, verification is PENDING, please reach out to support(".concat(status['payment_status'], ").-2057"), {
            maxAge: 3600
          });
          return _context47.abrupt("return", res.redirect("/payments_methods"));

        case 86:
          i++;
          _context47.next = 46;
          break;

        case 89:
          _context47.t16 = JSON;
          _context47.next = 92;
          return regeneratorRuntime.awrap(request({
            uri: URI + "YPORTALPAY?representation=YPORTALPAY.$query&where=ID eq ".concat(user["ID"], " AND PAYID eq ").concat(payID),
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee43(list_pays) {
            return regeneratorRuntime.async(function _callee43$(_context44) {
              while (1) {
                switch (_context44.prev = _context44.next) {
                  case 0:
                    return _context44.abrupt("return", JSON.stringify(list_pays));

                  case 1:
                  case "end":
                    return _context44.stop();
                }
              }
            });
          }));

        case 92:
          _context47.t17 = _context47.sent;
          _payIDs = _context47.t16.parse.call(_context47.t16, _context47.t17);
          console.log('lines 1780', _payIDs);
          console.log('AMOUNT1', _amount, ' amount2: ', _amount2);

          _loop2 = function _loop2(_i13) {
            var consult_paymentID, amount, prepare_idWF, payment_id0, complete_seq, bank_account_number, bank_id, legalNameAccount, fraudProtection, back_side_res, payment_id, transactionDate, error, errorLogD, errorLogC, getpmtKeyToRefund, descp, comm, _tPaymentSave3, _getpmtKeyToRefund2;

            return regeneratorRuntime.async(function _loop2$(_context45) {
              while (1) {
                switch (_context45.prev = _context45.next) {
                  case 0:
                    _context45.t0 = JSON;
                    _context45.next = 3;
                    return regeneratorRuntime.awrap(DataBaseSq.GetLastPaymenTIDFraudP());

                  case 3:
                    _context45.t1 = _context45.sent;
                    consult_paymentID = _context45.t0.parse.call(_context45.t0, _context45.t1);
                    //GET Last PaymentID WF to create next
                    console.log('line 2035', consult_paymentID);
                    amount = void 0;

                    if (_i13 == 0) {
                      amount = _amount;
                    }

                    if (_i13 == 1) {
                      amount = _amount2;
                    }

                    prepare_idWF = void 0;

                    if (consult_paymentID.length == 0) {
                      prepare_idWF = "FP000000000001";
                    } else {
                      payment_id0 = consult_paymentID[0]["TransactionID"]; // GET TRANSACTIONID FOR CREATE NEXT NUM

                      prepare_idWF = payment_id0.replace("FP", ""); //

                      prepare_idWF = parseInt(consult_paymentID[0]["pmtKey"]) + 1;
                      complete_seq = prepare_idWF.toString().padStart(12, "0");
                      prepare_idWF = "FP" + complete_seq;
                      console.log('line 2053', prepare_idWF);
                    }

                    bank_account_number = decrypt(_payIDs["$resources"][0]["BANKACCT"]);
                    bank_id = decrypt(_payIDs["$resources"][0]["BANKROUT"]);
                    legalNameAccount = decrypt(_payIDs["$resources"][0]["NAME"]);

                    if (bank_id.length < 9) {
                      bank_id = bank_id;
                      bank_id = bank_id.padStart(9, "0");
                    }

                    console.log('line 2063', amount, bank_account_number, bank_id, legalNameAccount);
                    _context45.next = 18;
                    return regeneratorRuntime.awrap(WFCCtrl.WFFP_Debit(amount, _apikey, legalNameAccount, bank_id, bank_account_number, prepare_idWF));

                  case 18:
                    fraudProtection = _context45.sent;
                    console.log('line 1806', fraudProtection);
                    back_side_res = fraudProtection["x-backside-transport"], payment_id = fraudProtection["payment-id"];
                    transactionDate = moment(fraudProtection["date"]).format("YYYY-MM-DD");
                    error = "";

                    if (!fraudProtection["errors"]) {
                      _context45.next = 47;
                      break;
                    }

                    console.log(fraudProtection["errors"][0]);
                    error = fraudProtection["errors"]; //IF RESPONSE ERROR, SAVE IN LOGSYSTEM SQL THE ERROR

                    console.log("\nError : " + JSON.stringify(error)); //SHOW IN CONSOLE THE ERROR

                    errorLogD = "Error:" + fraudProtection["errors"][0]["error_code"] + "- FP amount:" + amount;
                    console.log(errorLogD); //SHOW IN CONSOLE THE ERROR

                    errorLogC = fraudProtection["errors"][0]["description"];
                    console.log('errorLogC'); //SHOW IN CONSOLE THE ERROR

                    Description = errorLogD, Status = 0, Comment = errorLogC;
                    _context45.next = 34;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 34:
                    SystemLogL = _context45.sent;
                    SystemLogL = JSON.parse(SystemLogL);
                    _context45.next = 38;
                    return regeneratorRuntime.awrap(DataBaseSq.tPaymentFraudProtectionSave(0, SessionKey, UserID, prepare_idWF, amount, 0, transactionDate, 0, "FAIL", "FAIL", null, payID, errorLogC, 'Debit'));

                  case 38:
                    tPaymentSave = _context45.sent;
                    getpmtKeyToRefund = search.filter(function (x) {
                      return x.TranAmount == amount;
                    });
                    _context45.next = 42;
                    return regeneratorRuntime.awrap(DataBaseSq.saveFraudProtectionSaveFundsReturned(0, errorLogC, getpmtKeyToRefund[0]['pmtKey'], 'Credit'));

                  case 42:
                    saveFraudProtectionSaveFundsReturned = _context45.sent;
                    res.cookie('errorLogC', errorLogC, {
                      maxAge: 3600
                    });
                    return _context45.abrupt("return", {
                      v: res.redirect("/payments_methods")
                    });

                  case 47:
                    if (!(back_side_res == "OK OK")) {
                      _context45.next = 64;
                      break;
                    }

                    //IF RESPONSE FINE, SAVE PAYMENT INFO IN SQL TABLE
                    //IF PAYMENT STATUS IS "AUTHORIZED" SAVE IN SQL TABLE LOG SYSTEM
                    descp = "Process status res: " + back_side_res;
                    comm = "WFback_side_res (OK OK) Debit amount: " + amount + "-2089";
                    Description = descp, Status = 1, Comment = comm, SessionKey = SessionKeyLog;
                    _context45.next = 53;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 53:
                    SystemLogL = _context45.sent;
                    _context45.next = 56;
                    return regeneratorRuntime.awrap(DataBaseSq.tPaymentFraudProtectionSave(1, SessionKey, UserID, payment_id, amount, 0, transactionDate, 0, "OK", "OK", null, payID, null, 'Debit'));

                  case 56:
                    _tPaymentSave3 = _context45.sent;
                    _getpmtKeyToRefund2 = search.filter(function (x) {
                      return x.TranAmount == amount;
                    });
                    _context45.next = 60;
                    return regeneratorRuntime.awrap(DataBaseSq.saveFraudProtectionSaveFundsReturned(1, null, _getpmtKeyToRefund2[0]['pmtKey'], 'Debit'));

                  case 60:
                    saveFraudProtectionSaveFundsReturned = _context45.sent;
                    paymentKey = JSON.parse(_tPaymentSave3).pmtKey; // THIS GET THE PAYMENT KEY ID

                    console.log("🚀 ~ file: dashboardController.js ~ line 1718 ~ exports.verify_PM= ~ paymentKey", paymentKey); //SHOW CONSOLE INFO ABOUT PAYMENT

                    console.log("--Sucess in SQL: " + paymentKey);

                  case 64:
                  case "end":
                    return _context45.stop();
                }
              }
            });
          };

          _i13 = 0;

        case 98:
          if (!(_i13 < 2)) {
            _context47.next = 107;
            break;
          }

          _context47.next = 101;
          return regeneratorRuntime.awrap(_loop2(_i13));

        case 101:
          _ret2 = _context47.sent;

          if (!(_typeof(_ret2) === "object")) {
            _context47.next = 104;
            break;
          }

          return _context47.abrupt("return", _ret2.v);

        case 104:
          _i13++;
          _context47.next = 98;
          break;

        case 107:
          //Delete Payment Method by IDPAY param
          request({
            uri: URI + "YPORTALPAY('".concat(user.ID, "~").concat(payID, "')?representation=YPORTALPAY.$edit"),
            method: "DELETE",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee44(delete_pay_methods) {
            var disabledPaymentMIDSQL;
            return regeneratorRuntime.async(function _callee44$(_context46) {
              while (1) {
                switch (_context46.prev = _context46.next) {
                  case 0:
                    //SAVE SQL LOGSYSTEM
                    Description = "Success Delete payments methods module to X3", Status = 1, Comment = "Function: delete_pay_methods- line 928";
                    _context46.next = 3;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 3:
                    SystemLogL = _context46.sent;
                    _context46.t0 = JSON;
                    _context46.next = 7;
                    return regeneratorRuntime.awrap(DataBaseSq.deletePaymentMethod(payID, UserID));

                  case 7:
                    _context46.t1 = _context46.sent;
                    disabledPaymentMIDSQL = _context46.t0.parse.call(_context46.t0, _context46.t1);
                    req.flash("success", "Payment Method deleted");
                    res.redirect("/payments_methods"); //Redirect to payment Methods page with success card deleted message

                  case 11:
                  case "end":
                    return _context46.stop();
                }
              }
            });
          });

        case 108:
        case "end":
          return _context47.stop();
      }
    }
  });
};
/**FUNCTION TO RENDER PAY INVOICES PAGE */


exports.pay_invoices = function _callee49(req, res) {
  var URI, user, pictureProfile, SessionKeyLog, ip, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, query_consulting, list_methods_par, CCMethod, ACHMethod, i, activeACH, search, _i14, count, ids_invoices, split_id, where_filter_inv, inv_wofilter, _i15, subTotal, taxes, Total, _i16, items, admin, banner, activeBanner;

  return regeneratorRuntime.async(function _callee49$(_context51) {
    while (1) {
      switch (_context51.prev = _context51.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //USER INFO

          pictureProfile = res.locals.user["$resources"][1]["pic"]; //PROFILE PICTURE
          //SAVE SQL LOGSYSTEM

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Preparing pay invoices view", Status = 1, Comment = "Function: pay_invoices- Line 957";
          _context51.next = 8;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 8:
          SystemLogL = _context51.sent;
          //GET PAYMENTS METHODS FOR USE TO PAY BY USER EMAIL
          query_consulting = "&where=ID eq " + user["ID"] + "";
          _context51.t0 = JSON;
          _context51.next = 13;
          return regeneratorRuntime.awrap(request({
            uri: URI + "YPORTALPAY?representation=YPORTALPAY.$query&count=100" + query_consulting,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee46(pay_methods) {
            return regeneratorRuntime.async(function _callee46$(_context48) {
              while (1) {
                switch (_context48.prev = _context48.next) {
                  case 0:
                    // SAVE SQL LOGSYSTEM
                    Description = "Get PaymentMethods for pay Invoices", Status = 1, Comment = "Function:pay_invoices - Line 989 ";
                    _context48.next = 3;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 3:
                    SystemLogL = _context48.sent;
                    return _context48.abrupt("return", JSON.stringify(pay_methods["$resources"]));

                  case 5:
                  case "end":
                    return _context48.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 2075 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 2077";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 13:
          _context51.t1 = _context51.sent;
          list_methods_par = _context51.t0.parse.call(_context51.t0, _context51.t1);
          CCMethod = [], ACHMethod = []; //console.log(list_methods_par)

          i = 0;

        case 17:
          if (!(i < list_methods_par.length)) {
            _context51.next = 28;
            break;
          }

          _context51.t2 = list_methods_par[i]["PAYTYPE"];
          _context51.next = _context51.t2 === "CC" ? 21 : _context51.t2 === "ACH" ? 23 : 25;
          break;

        case 21:
          CCMethod.push(list_methods_par[i]);
          return _context51.abrupt("break", 25);

        case 23:
          ACHMethod.push(list_methods_par[i]);
          return _context51.abrupt("break", 25);

        case 25:
          i++;
          _context51.next = 17;
          break;

        case 28:
          activeACH = [];
          search = [];
          console.log("🚀 ~ file: dashboardController.js ~ line 2020 ~ exports.pay_invoices= ~ ACHMethod", ACHMethod);

          for (_i14 = 0; _i14 < ACHMethod.length; _i14++) {
            if (ACHMethod[_i14]['VERIFIED']) {
              activeACH.push(ACHMethod[_i14]);
            } // search[0] = JSON.parse(await DataBaseSq.verifyPaymentMethodIDProcess(ACHMethod[i]['PAYID'], UserID));
            // ACHMethod[i].verify = 0;
            // if (search[0] != null) {
            //   activeACH.push(ACHMethod[i]);
            // }

          } //GET INVOICES INFO BY SELECTED IN THE OPEN INV TABLE


          count = 100;
          ids_invoices = req.body.ids_invoices;
          split_id = ids_invoices.split(","); // CREATE ARRAY WITH DE INVOICES NUM

          inv_wofilter = [];

          if (user["ROLE"] == 4 || user["ROLE"] == 5) {
            // If User rol is 1, consulting query by EMAIL
            count = 100;
            Yportal = 'YPORTALINA';
            portalRepresentation = 'YPORTALINVAO';
          } else {
            count = 100;
            Yportal = 'YPORTALINV';
            portalRepresentation = 'YPORTALINVO';
          }

          if (!(split_id.length > 1)) {
            _context51.next = 51;
            break;
          }

          _i15 = 0;

        case 39:
          if (!(_i15 < split_id.length)) {
            _context51.next = 49;
            break;
          }

          where_filter_inv = "&where=NUM eq '" + split_id[_i15] + "' "; // WHERE CLAUSE WHIT NUM INV

          _context51.t3 = inv_wofilter;
          _context51.next = 44;
          return regeneratorRuntime.awrap(request({
            uri: URI + "".concat(Yportal, "?representation=").concat(portalRepresentation, ".$query&count=") + count + " " + where_filter_inv,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee47(inv_wofilter2) {
            var inv_filtering;
            return regeneratorRuntime.async(function _callee47$(_context49) {
              while (1) {
                switch (_context49.prev = _context49.next) {
                  case 0:
                    if (!(inv_wofilter2["$resources"].length == 0)) {
                      _context49.next = 6;
                      break;
                    }

                    Description = "Error get invoice for pay", Status = 1, Comment = "Invoice query response blank or closed inv trying to pay. -pay_invoices Line 1037";
                    _context49.next = 4;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 4:
                    SystemLogL = _context49.sent;
                    return _context49.abrupt("return", false);

                  case 6:
                    inv_filtering = JSON.stringify(inv_wofilter2["$resources"]);
                    return _context49.abrupt("return", inv_wofilter2["$resources"][0]);

                  case 8:
                  case "end":
                    return _context49.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 2148 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 2148";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 44:
          _context51.t4 = _context51.sent;

          _context51.t3.push.call(_context51.t3, _context51.t4);

        case 46:
          _i15++;
          _context51.next = 39;
          break;

        case 49:
          _context51.next = 57;
          break;

        case 51:
          // IF INVOICES QUANTITY IS EQUAL TO 1, CONSULT QUERY AND STORE IN ARRAY "INV_WOFILTER"
          where_filter_inv = "&where=NUM eq '" + split_id[0] + "' ";
          _context51.t5 = inv_wofilter;
          _context51.next = 55;
          return regeneratorRuntime.awrap(request({
            uri: URI + "".concat(Yportal, "?representation=").concat(portalRepresentation, ".$query&count=") + count + " " + where_filter_inv,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee48(inv_wofilter2) {
            var inv_filtering;
            return regeneratorRuntime.async(function _callee48$(_context50) {
              while (1) {
                switch (_context50.prev = _context50.next) {
                  case 0:
                    if (!(inv_wofilter2["$resources"].length == 0)) {
                      _context50.next = 6;
                      break;
                    }

                    Description = "Error get invoice for pay", Status = 1, Comment = "Invoice query response blank or closed inv trying to pay. - Line 1080";
                    _context50.next = 4;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 4:
                    SystemLogL = _context50.sent;
                    return _context50.abrupt("return", false);

                  case 6:
                    inv_filtering = JSON.stringify(inv_wofilter2["$resources"]);
                    return _context50.abrupt("return", inv_wofilter2["$resources"][0]);

                  case 8:
                  case "end":
                    return _context50.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 2189 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 2189";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 55:
          _context51.t6 = _context51.sent;

          _context51.t5.push.call(_context51.t5, _context51.t6);

        case 57:
          if (!(inv_wofilter[0] == false)) {
            _context51.next = 60;
            break;
          }

          msg = "One or more invoice don't  exist in query for openInv. chekeout wiht support";
          return _context51.abrupt("return", res.redirect("/dashboard/".concat(msg)));

        case 60:
          //IF INVOICES INFO IS OK, CALCULATE THE TAXES AND TOTAL AMOUNT TO PAY, AND QUANTITY OF INVOICES  TO PAY
          subTotal = 0, taxes = 0, Total = 0;

          for (_i16 = 0; _i16 < inv_wofilter.length; _i16++) {
            subTotal += parseFloat(inv_wofilter[_i16].AMTNOT);
            Total += parseFloat(inv_wofilter[_i16].OPENLOC);
          }

          taxes = parseFloat(Total) - parseFloat(subTotal);
          items = inv_wofilter.length; //IF USER ROLE IS 4 SHOW THE MODULE SYSTEMSETTINGS

          admin = false;

          if (user["ROLE"] == 4) {
            admin = true;
          }

          console.log("🚀 ~ file: dashboardController.js ~ line 2055 ~ exports.pay_invoices= ~ inv_wofilter", inv_wofilter);
          UserID = user["EMAIL"].toString(), Description = 'pay_invoices line 2083  ', Status = 1, Comment = ids_invoices;
          _context51.next = 70;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 70:
          SystemLogL = _context51.sent;
          console.log("🚀 ~ file: dashboardController.js ~ line 2086 ~ exports.pay_invoices= ~ SystemLogL", SystemLogL); //HERE RENDER PAGE AND ENTER INFO

          _context51.t7 = JSON;
          _context51.next = 75;
          return regeneratorRuntime.awrap(DataBaseSq.bannerSetting());

        case 75:
          _context51.t8 = _context51.sent;
          banner = _context51.t7.parse.call(_context51.t7, _context51.t8);
          activeBanner = false;

          if (banner.Status == 1) {
            activeBanner = true;
          }

          res.render("pay_invoices", {
            pageName: "Pay Invoices",
            dashboardPage: true,
            menu: true,
            pay_invoices: true,
            user: user,
            inv_wofilter: inv_wofilter,
            subTotal: subTotal,
            taxes: taxes,
            Total: Total,
            items: items,
            list_methods_par: list_methods_par,
            pictureProfile: pictureProfile,
            admin: admin,
            CCMethod: CCMethod,
            ACHMethod: ACHMethod,
            activeACH: activeACH,
            banner: banner,
            activeBanner: activeBanner
          });

        case 80:
        case "end":
          return _context51.stop();
      }
    }
  });
};
/**FUNCTION TO PROCESS PAYMENT */


exports.process_payment = function _callee54(req, res) {
  var URI, user, ip, SessionKeyLog, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, _req$body5, paymentID, cardNumber, cardName, expMonth, expYear, cvv, totalAmountcard, emailCard, addressCard, zipCode, state, city, inv, appliedAmount, reasonLessAmta, userIDInv, typeCC, enable_capture, configObject, apiClient, requestObj, clientReferenceInformation, processingInformation, paymentInformation, paymentInformationCard, orderInformation, orderInformationAmountDetails, orderInformationBillTo, instance;

  return regeneratorRuntime.async(function _callee54$(_context56) {
    while (1) {
      switch (_context56.prev = _context56.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //User info
          //Save SQL SYSTEMLOG

          ip = req.connection.remoteAddress;
          SessionKeyLog = req.session.SessionLog;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 7, SessionKey = SessionKeyLog, Description = "Connecting with process payment", Status = 1, Comment = "FUNCTION: process_payment-LINE 1153";
          _context56.next = 7;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 7:
          SystemLogL = _context56.sent;
          //START PROCCESS PAYMENT
          _req$body5 = req.body, paymentID = _req$body5.paymentID, cardNumber = _req$body5.cardNumber, cardName = _req$body5.cardName, expMonth = _req$body5.expMonth, expYear = _req$body5.expYear, cvv = _req$body5.cvv, totalAmountcard = _req$body5.totalAmountcard, emailCard = _req$body5.emailCard, addressCard = _req$body5.addressCard, zipCode = _req$body5.zipCode, state = _req$body5.state, city = _req$body5.city, inv = _req$body5.inv, appliedAmount = _req$body5.appliedAmount, reasonLessAmta = _req$body5.reasonLessAmta, userIDInv = _req$body5.userIDInv, typeCC = _req$body5.typeCC;
          enable_capture = true; // ENABLE CAPTURE DATA FOR API PROCCESS PAYMENT
          // THIS CODE IS FROM API PROCCESS PAYMENT DOCUMENTATION

          try {
            configObject = new configuration();
            apiClient = new cybersourceRestApi.ApiClient();
            requestObj = new cybersourceRestApi.CreatePaymentRequest();
            clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
            clientReferenceInformation.code = "TC50171_3";
            requestObj.clientReferenceInformation = clientReferenceInformation; // ACTIVE DE PROCESS INFORMATION CAPTURE

            processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
            processingInformation.capture = false;

            if (enable_capture === true) {
              processingInformation.capture = true;
            }

            requestObj.processingInformation = processingInformation; //PAYMENT INFORMATION IS REQUIRED

            paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
            paymentInformationCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();
            paymentInformationCard.number = cardNumber; ///'4111111111111111'

            paymentInformationCard.expirationMonth = expMonth; //'12'

            paymentInformationCard.expirationYear = expYear; //'2031'

            paymentInformationCard.securityCode = cvv;
            paymentInformation.card = paymentInformationCard;
            requestObj.paymentInformation = paymentInformation;
            orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
            orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
            orderInformationAmountDetails.totalAmount = parseFloat(totalAmountcard);
            orderInformationAmountDetails.currency = "USD";
            orderInformation.amountDetails = orderInformationAmountDetails;
            orderInformationBillTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
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
            instance = new cybersourceRestApi.PaymentsApi(configObject, apiClient); //INSTANCE ALL INFORMATION AND CONFIGURATION FOR PAYMENTAPI

            instance.createPayment(requestObj, function _callee53(error, data, response) {
              var errorLogD, errorLogC, descp, comm, TranAmount, tPaymentSave, paymentx3S, paymenKey, CCExpDate, i_file, inv_detail, amountPayment, errorSOAP, today, statusSOAP, parser, msgErroSOAP, inVError, i, cardNumberD, Lastfour, xmlB, SOAPP, _CCExpDate, _today;

              return regeneratorRuntime.async(function _callee53$(_context55) {
                while (1) {
                  switch (_context55.prev = _context55.next) {
                    case 0:
                      if (!error) {
                        _context55.next = 13;
                        break;
                      }

                      //IF RESPONSE ERROR, SAVE IN LOGSYSTEM SQL THE ERROR
                      console.log("\nError : " + JSON.stringify(error)); //SHOW IN CONSOLE THE ERROR

                      errorLogD = "Error:" + error.status + "- process payment";
                      console.log(errorLogD); //SHOW IN CONSOLE THE ERROR

                      errorLogC = error.response.text;
                      errorLogC = JSON.parse(errorLogC).message;
                      console.log(errorLogC); //SHOW IN CONSOLE THE ERROR

                      Description = errorLogD, Status = 0, Comment = errorLogC;
                      _context55.next = 10;
                      return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                    case 10:
                      SystemLogL = _context55.sent;
                      _context55.next = 94;
                      break;

                    case 13:
                      if (!data) {
                        _context55.next = 94;
                        break;
                      }

                      //IF RESPONSE FINE, SAVE PAYMENT INFO IN SQL TABLE
                      TranAmount = parseFloat(totalAmountcard);
                      //ENCRYPT CREDIT CARD INFO FOR SAVE IN SQL TABLE
                      cardNumber = encrypt(cardNumber);
                      cvv = encrypt(cvv);
                      zipCode = encrypt(zipCode);
                      cardName = encrypt(cardName);
                      CCExpDate = expMonth + "/" + expYear;
                      CCExpDate = encrypt(CCExpDate);

                      if (!(data.status == "AUTHORIZED")) {
                        _context55.next = 81;
                        break;
                      }

                      //IF PAYMENT STATUS IS "AUTHORIZED" SAVE IN SQL TABLE LOG SYSTEM
                      descp = "Process status res: " + data.status;
                      comm = "Process payment success: OK";
                      Description = descp, Status = 1, Comment = comm, SessionKey = SessionKeyLog;
                      _context55.next = 27;
                      return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                    case 27:
                      SystemLogL = _context55.sent;
                      _context55.next = 30;
                      return regeneratorRuntime.awrap(DataBaseSq.RegtPayment(1, SessionKey, UserID, data.processorInformation.transactionId, TranAmount, data.processorInformation.approvalCode, data.submitTimeUtc, data.processorInformation.transactionId, data.status, data.status, cardNumber, CCExpDate, cvv, cardName, addressCard, zipCode, userIDInv));

                    case 30:
                      tPaymentSave = _context55.sent;
                      paymenKey = JSON.parse(tPaymentSave).pmtKey; // THIS GET THE PAYMENT KEY ID
                      //SHOW CONSOLE INFO ABOUT PAYMENT

                      console.log("--Sucess in SQL" + paymenKey);
                      console.log("\nData : " + JSON.stringify(data));
                      console.log("\nResponse : " + JSON.stringify(response)); //FUNCTION TO SAVE IN SOAP X3

                      invoices = inv.split(","); //CREATE ARRAY WHIT INVOICES NUMS PAIDS

                      appliedAmount = appliedAmount.split(","); //CREATE ARRAY WHIT APPLIED AMOUNT PAIDS

                      reasonLessAmta = reasonLessAmta.split(","); //CREATE ARRAY WHIT REASONS TO SHORT PAY PAIDS

                      i_file = "";
                      today = moment().format("YYYYMMDD"); //FORMAY DATE: 20220101

                      statusSOAP = []; //ALMACENATE IN ARRAY SOAP STATUS RESPONSE

                      parser = new xml2js.Parser({
                        explicitArray: true
                      }); //THIS FUNCTION IS FOR PARSER XML

                      msgErroSOAP = [], inVError = []; //SAVE ONE BY ONE INVOICES PAIDS IN SOAP X3

                      i = 0;

                    case 44:
                      if (!(i < invoices.length)) {
                        _context55.next = 78;
                        break;
                      }

                      _context55.t0 = JSON;
                      _context55.next = 48;
                      return regeneratorRuntime.awrap(request({
                        uri: URI + "YPORTALINVD('".concat(invoices[i], "')?representation=YPORTALINVD.$details"),
                        method: "GET",
                        insecure: true,
                        rejectUnauthorized: false,
                        headers: {
                          "Content-Type": "application/json",
                          Connection: 'close',
                          Accept: "application/json",
                          Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
                        },
                        json: true
                      }).then(function _callee50(invD) {
                        return regeneratorRuntime.async(function _callee50$(_context52) {
                          while (1) {
                            switch (_context52.prev = _context52.next) {
                              case 0:
                                return _context52.abrupt("return", JSON.stringify(invD));

                              case 1:
                              case "end":
                                return _context52.stop();
                            }
                          }
                        });
                      })["catch"](function (err) {
                        console.log("🚀 ~ file: .js ~ line 2435 ~ = ~ err", err);
                        var msg0 = "Please contact support, sageX3 response Error-line 2435";
                        return res.redirect("/dashboard/".concat(msg0));
                      }));

                    case 48:
                      _context55.t1 = _context55.sent;
                      inv_detail = _context55.t0.parse.call(_context55.t0, _context55.t1);
                      //GET AMOUNT APPLIED FOR INVOICE
                      amountPayment = Number.parseFloat(appliedAmount[i]).toFixed(2); // GET TYPE OF CREDIT CARD

                      _context55.t2 = typeCC;
                      _context55.next = _context55.t2 === "Visa" ? 54 : _context55.t2 === "Mastercard" ? 56 : _context55.t2 === "Discover" ? 58 : 60;
                      break;

                    case 54:
                      typeCC = "VISA";
                      return _context55.abrupt("break", 62);

                    case 56:
                      typeCC = "MAST";
                      return _context55.abrupt("break", 62);

                    case 58:
                      typeCC = "DISC";
                      return _context55.abrupt("break", 62);

                    case 60:
                      typeCC = typeCC;
                      return _context55.abrupt("break", 62);

                    case 62:
                      cardNumberD = decrypt(cardNumber); //DECRYPT CREDIT CARD NUMBER

                      Lastfour = cardNumberD.slice(-4); // GET LAST FOR NUMBER FROM CC

                      i_file = "P;;RECPT;".concat(inv_detail.BPCINV, ";ENG;10501;S001;").concat(inv_detail.CUR, ";").concat(amountPayment, ";").concat(today, ";").concat(data.processorInformation.transactionId, ";").concat(typeCC).concat(Lastfour, "|D;PAYRC;").concat(inv_detail.GTE, ";").concat(inv_detail.NUM, ";").concat(inv_detail.CUR, ";").concat(amountPayment, ";").concat(reasonLessAmta[i].toUpperCase(), "|A;LOC;").concat(inv_detail.SIVSIHC_ANA[0].CCE, ";DPT;").concat(inv_detail.SIVSIHC_ANA[1].CCE, ";BRN;").concat(inv_detail.SIVSIHC_ANA[2].CCE, ";BSU;").concat(inv_detail.SIVSIHC_ANA[3].CCE, ";SBU;").concat(inv_detail.SIVSIHC_ANA[4].CCE, ";").concat(amountPayment, "|END"); //I_FILE VARIABLE
                      //console.log(i_file);
                      //PREPARE THE XML FOR SAVE IN SOAP X3, ENTER THE I_FILE VARIABLE

                      xmlB = "<soapenv:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:wss=\"http://www.adonix.com/WSS\">\n<soapenv:Header/>\n<soapenv:Body>\n <wss:run soapenv:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\n   <callContext xsi:type=\"wss:CAdxCallContext\">\n     <codeLang xsi:type=\"xsd:string\">ENG</codeLang>\n     <poolAlias xsi:type=\"xsd:string\">SAWTEST1</poolAlias>\n     <poolId xsi:type=\"xsd:string\"></poolId>\n     <requestConfig xsi:type=\"xsd:string\">\n       <![CDATA[adxwss.optreturn=JSON&adxwss.beautify=true&adxwss.trace.on=off]]>\n     </requestConfig>\n   </callContext>\n   <publicName xsi:type=\"xsd:string\">AOWSIMPORT</publicName>\n   <inputXml xsi:type=\"xsd:string\">\n     <![CDATA[{\n       \"GRP1\": {\n         \"I_MODIMP\": \"YPORTALPAY\",\n         \"I_AOWSTA\": \"NO\",\n         \"I_EXEC\": \"REALTIME\",\n         \"I_RECORDSEP\": \"|\",\n         \"I_FILE\":\"".concat(i_file, "\"\n       }\n     }]]>\n   </inputXml>\n </wss:run>\n</soapenv:Body>\n</soapenv:Envelope>"); //SEND TO SOAP X3 THE XML WIHT THE PAYMENT INFO, AND GET RESPONSE

                      _context55.t3 = JSON;
                      _context55.next = 69;
                      return regeneratorRuntime.awrap(request({
                        uri: "https://sawoffice.technolify.com:8443/soap-generic/syracuse/collaboration/syracuse/CAdxWebServiceXmlCC",
                        method: "POST",
                        insecure: true,
                        rejectUnauthorized: false,
                        headers: {
                          "Content-Type": "application/json",
                          Connection: 'close',
                          Accept: "*/*",
                          Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW",
                          soapaction: "*"
                        },
                        body: xmlB
                      }).then(function _callee51(SOAP) {
                        return regeneratorRuntime.async(function _callee51$(_context53) {
                          while (1) {
                            switch (_context53.prev = _context53.next) {
                              case 0:
                                return _context53.abrupt("return", JSON.stringify(SOAP));

                              case 1:
                              case "end":
                                return _context53.stop();
                            }
                          }
                        });
                      })["catch"](function (err) {
                        console.log("🚀 ~ file: .js ~ line 2521 ~ = ~ err", err);
                        var msg0 = "Please contact support, sageX3 response Error-line 2521";
                        return res.redirect("/dashboard/".concat(msg0));
                      }));

                    case 69:
                      _context55.t4 = _context55.sent;
                      SOAPP = _context55.t3.parse.call(_context55.t3, _context55.t4);
                      //PARSE XML RESPONSE FROM SOAP X3
                      parser.parseString(SOAPP, function _callee52(err, result) {
                        var _i17;

                        return regeneratorRuntime.async(function _callee52$(_context54) {
                          while (1) {
                            switch (_context54.prev = _context54.next) {
                              case 0:
                                if (!(result["soapenv:Envelope"]["soapenv:Body"][0]["wss:runResponse"][0]["runReturn"][0]["status"][0]["_"] == "1")) {
                                  _context54.next = 5;
                                  break;
                                }

                                //IF STATUS RESPONSE IS 1, PUSH IN ARRAY STATUS FOR THAT INVOICE
                                statusSOAP.push({
                                  status: result["soapenv:Envelope"]["soapenv:Body"][0]["wss:runResponse"][0]["runReturn"][0]["status"][0]["_"],
                                  error: msgErroSOAP
                                });
                                return _context54.abrupt("return", statusSOAP);

                              case 5:
                                //IF STATUS RESPONSE IS 0, CHECK OUT THE MESSAGE RES FROM SOAP AND STORE IN ARRAY "msgErroSOAP"
                                for (_i17 = 0; _i17 < result["soapenv:Envelope"]["soapenv:Body"][0]["multiRef"].length; _i17++) {
                                  msgErroSOAP.push(result["soapenv:Envelope"]["soapenv:Body"][0]["multiRef"][_i17]["message"][0]);
                                }

                                inVError.push(inv_detail.NUM); //STORE THE INVOICE IS IN ERROR

                                statusSOAP.push({
                                  status: result["soapenv:Envelope"]["soapenv:Body"][0]["wss:runResponse"][0]["runReturn"][0]["status"][0]["_"],
                                  error: msgErroSOAP,
                                  invError: inVError
                                }); //STORE IN ARRAY: STATUS SOAP, MSG ERROR FROM X3, INVOICE NUM WITH ERROR
                                //SAVE IN SQL SYSTEM LOG, SOAP ERROR WITH THE MSG RESPONSE

                                Description = "SOAP status 0", Status = 0, Comment = "SOAP Failed: " + JSON.stringify(msgErroSOAP) + "Inv: " + JSON.stringify(inVError);
                                _context54.next = 11;
                                return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                              case 11:
                                SystemLogL = _context54.sent;

                              case 12:
                                return _context54.abrupt("return", statusSOAP);

                              case 13:
                              case "end":
                                return _context54.stop();
                            }
                          }
                        });
                      });
                      paymentx3S = statusSOAP; // STORE IN VARIABLE "paymentx3S" FOR SEND TO AJAX REQUEST

                      console.log("ss : " + JSON.stringify(paymentx3S)); // IN CONSOLE CHECKOUT PAYMENT X3 SOAP STATUS RESPONSE
                      // console.log('\nResponse : ' + JSON.stringify(response));

                      console.log("\nResponse Code of Process a Payment : " + JSON.stringify(response["status"]));

                    case 75:
                      i++;
                      _context55.next = 44;
                      break;

                    case 78:
                      return _context55.abrupt("return", res.send({
                        error: error,
                        data: data,
                        response: response,
                        paymentx3S: paymentx3S,
                        SystemLogL: SystemLogL,
                        paymenKey: paymenKey
                      }));

                    case 81:
                      // IF RESPONSE OF API PROCCESS PAYMENT IS NOT "AUTHORIED"
                      //SAVE IN SQL LOGSYSTEM THIS RESPONSE
                      descp = "Process status res: " + data.status;
                      comm = "Process payment reason:" + data.errorInformation.reason;
                      Description = descp, Status = 0, Comment = comm;
                      _context55.next = 86;
                      return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                    case 86:
                      SystemLogL = _context55.sent;
                      //SAVE PAYMENT IN SQL TABLE
                      _CCExpDate = expMonth + "/" + expYear;
                      _today = new Date();
                      _context55.next = 91;
                      return regeneratorRuntime.awrap(DataBaseSq.RegtPayment(0, SessionKey, UserID, data.id, TranAmount, null, _today, data.id, data.status, data.errorInformation.reason, cardNumber, _CCExpDate, cvv, cardName, addressCard, zipCode));

                    case 91:
                      tPaymentSave = _context55.sent;
                      paymenKey = JSON.parse(tPaymentSave).pmtKey; //GET THE PAYMENTKEY ID FROM SQL
                      //  console.log(tPaymentSave);

                      return _context55.abrupt("return", res.send({
                        error: error,
                        data: data,
                        response: response,
                        paymenKey: paymenKey
                      }));

                    case 94:
                    case "end":
                      return _context55.stop();
                  }
                }
              });
            });
          } catch (error) {
            console.log("\nException on calling the API : " + error);
          }

        case 11:
        case "end":
          return _context56.stop();
      }
    }
  });
};
/** FUNCTION TO SAVE APPLIED AMOUNT IN SQL TABLE */


exports.applied_amount = function _callee55(req, res) {
  var URI, user, SessionKeyLog, ip, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, paymentAplication, _req$body6, inv, amount, shortDesc, appliedAmount, pmtKey, status, i;

  return regeneratorRuntime.async(function _callee55$(_context57) {
    while (1) {
      switch (_context57.prev = _context57.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //USER INFO
          // SAVE SQL SYSTEMLOG

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Applied amount int process", Status = 1, Comment = "FUNCITON: applied_amount - LINE 1760";
          _context57.next = 7;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 7:
          SystemLogL = _context57.sent;
          _req$body6 = req.body, inv = _req$body6.inv, amount = _req$body6.amount, shortDesc = _req$body6.shortDesc, appliedAmount = _req$body6.appliedAmount, pmtKey = _req$body6.pmtKey, status = _req$body6.status;
          inv = inv.split(","); // PARSE INVOICES TO ARRAY

          amount = amount.split(","); // PARSE AMOUNTS TO ARRAY

          shortDesc = shortDesc.split(","); // PARSE SHORT DESCRIPTION TO ARRAY

          appliedAmount = appliedAmount.split(","); // PARSE APPLIED AMOUNT TO ARRAY

          status = status.split(","); // PARSE STATUS TO ARRAY
          //SAVE ONE BY ONE, INVOICE PAID IN SQL TABLE PAYMENT APPLICATION

          i = 0;

        case 15:
          if (!(i < inv.length)) {
            _context57.next = 24;
            break;
          }

          _context57.t0 = JSON;
          _context57.next = 19;
          return regeneratorRuntime.awrap(DataBaseSq.RegtPaymentApplication(inv[i], amount[i], shortDesc[i], appliedAmount[i], pmtKey, status[i]));

        case 19:
          _context57.t1 = _context57.sent;
          paymentAplication = _context57.t0.parse.call(_context57.t0, _context57.t1);

        case 21:
          i++;
          _context57.next = 15;
          break;

        case 24:
          res.send({
            data: paymentAplication
          });

        case 25:
        case "end":
          return _context57.stop();
      }
    }
  });
};
/**FUNCTION TO SAVE PROFILE PICTURE */


exports.save_PicProfile = function _callee56(req, res) {
  var URI, user, SessionKeyLog, ip, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, _req$body7, email, picture, SavePic, consultingPrevious;

  return regeneratorRuntime.async(function _callee56$(_context58) {
    while (1) {
      switch (_context58.prev = _context58.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //USER INFO
          //SAVE IN SQL LOGSYSTEM

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Saving pic profile", Status = 1, Comment = "FUNCTION: save_PicProfile - LINE 1614";
          _context58.next = 7;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 7:
          SystemLogL = _context58.sent;
          //FIRTS CONSULTING IF EXIST A PREVIOUS PIC FOR CURRENT USER
          _req$body7 = req.body, email = _req$body7.email, picture = _req$body7.picture;
          _context58.next = 11;
          return regeneratorRuntime.awrap(DataBasequerys.consultingPicProfile(email));

        case 11:
          consultingPrevious = _context58.sent;

          if (!consultingPrevious) {
            _context58.next = 20;
            break;
          }

          _context58.next = 15;
          return regeneratorRuntime.awrap(DataBasequerys.uploadPicProfile(email, picture, "update"));

        case 15:
          SavePic = _context58.sent;
          SavePic = "Updated success";
          res.locals.user["$resources"][1]["pic"] = picture;
          _context58.next = 24;
          break;

        case 20:
          _context58.next = 22;
          return regeneratorRuntime.awrap(DataBasequerys.uploadPicProfile(email, picture, "insert"));

        case 22:
          SavePic = _context58.sent;
          res.locals.user["$resources"][1]["pic"] = picture;

        case 24:
          res.send({
            data: SavePic,
            picture: picture
          }); //SEND DATA TO AJAX

        case 25:
        case "end":
          return _context58.stop();
      }
    }
  });
};
/**FUNCTION TO PRINT INVOICE */


exports.printInvoice = function _callee58(req, res) {
  var URI, user, SessionKeyLog, ip, inv_num, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL;
  return regeneratorRuntime.async(function _callee58$(_context60) {
    while (1) {
      switch (_context60.prev = _context60.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //USER INFO
          //SAVE SQL SYSTEMLOG

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress; // console.log(user);

          inv_num = req.params.inv;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Request invoice details from X3 for print", Status = 1, Comment = "FUNCTION: printInvoice - LINE 1658";
          _context60.next = 8;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 8:
          SystemLogL = _context60.sent;
          //GET INVOICE DETAIL FROM X3
          request({
            uri: URI + "YPORTALINVD('".concat(inv_num, "')?representation=YPORTALINVD.$details"),
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee57(inv_detail) {
            return regeneratorRuntime.async(function _callee57$(_context59) {
              while (1) {
                switch (_context59.prev = _context59.next) {
                  case 0:
                    //HERE RENDER PAGE AND ENTER INFO
                    res.render("print_invoice", {
                      pageName: "Print: " + inv_num,
                      dashboardPage: true,
                      print_inv: true,
                      user: user,
                      inv_detail: inv_detail
                    });

                  case 1:
                  case "end":
                    return _context59.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 2763 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 2763";
            return res.redirect("/dashboard/".concat(msg0));
          });

        case 10:
        case "end":
          return _context60.stop();
      }
    }
  });
};
/** FUNCTION TO RENDER PAYMENTS PAGE */


exports.payments = function _callee60(req, res) {
  var _res$render2;

  var URI, user, pictureProfile, SessionKeyLog, ip, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, admin, query_consulting, count, maping_login, bpcnum, i, payments, getPayments, _i18, banner, activeBanner;

  return regeneratorRuntime.async(function _callee60$(_context62) {
    while (1) {
      switch (_context62.prev = _context62.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //USER INFO

          pictureProfile = res.locals.user["$resources"][1]["pic"]; //PIC PROFILE
          //SAVE SQL LOGSYSTEM

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Request payments methods from SQL TABLE", Status = 1, Comment = "FUNCTION: payments - LINE 1708";
          _context62.next = 8;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 8:
          SystemLogL = _context62.sent;
          admin = false;

          if (user["ROLE"] == 4) {
            admin = true;
          } //FIRTS MAPPING LOG FOR GET BPCNUM'S


          query_consulting = "&where=ID eq " + user["ID"].toString() + "";
          count = 1000;
          _context62.t0 = JSON;
          _context62.next = 16;
          return regeneratorRuntime.awrap(request({
            uri: URI + "YPORTALBPS?representation=YPORTALBPS.$query&count=1000" + query_consulting,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee59(map_loggin) {
            return regeneratorRuntime.async(function _callee59$(_context61) {
              while (1) {
                switch (_context61.prev = _context61.next) {
                  case 0:
                    return _context61.abrupt("return", JSON.stringify(map_loggin));

                  case 1:
                  case "end":
                    return _context61.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 2808 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 2808";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 16:
          _context62.t1 = _context62.sent;
          maping_login = _context62.t0.parse.call(_context62.t0, _context62.t1);
          // STORE BPCNUM FORM MAPPINGLOGGING
          bpcnum = [];

          for (i = 0; i < maping_login["$resources"].length; i++) {
            bpcnum.push(maping_login["$resources"][i]["BPCNUM"]);
          } //GET PAYMENTS FROM SQL TABLE


          payments = [];
          _i18 = 0;

        case 22:
          if (!(_i18 < bpcnum.length)) {
            _context62.next = 28;
            break;
          }

          _context62.next = 25;
          return regeneratorRuntime.awrap(DataBaseSq.Get_tPayments(bpcnum[_i18]).then(function (response) {
            response = JSON.parse(response); //PARSE RESPONSE
            //STORE IN ARRAY PAYMENTS

            for (var j = 0; j < response.length; j++) {
              //        console.log(payments.length);
              payments.push({
                pmtKey: response[j].pmtKey,
                CustID: response[j].CustID,
                TransactionID: response[j].TransactionID,
                TranAmount: response[j].TranAmount,
                ProcessorStatus: response[j].ProcessorStatus,
                ProcessorStatusDesc: response[j].ProcessorStatusDesc,
                DateProcessesed: response[j].DateProcessesed,
                tPaymentApplication: response[j].tPaymentApplication
              });
            }
          }));

        case 25:
          _i18++;
          _context62.next = 22;
          break;

        case 28:
          //CLEAN PAYMENTS BLANK
          payments = JSON.stringify(payments.filter(function (el) {
            return el != "";
          })); //RENDER PAYMENTS PAGE

          _context62.t2 = JSON;
          _context62.next = 32;
          return regeneratorRuntime.awrap(DataBaseSq.bannerSetting());

        case 32:
          _context62.t3 = _context62.sent;
          banner = _context62.t2.parse.call(_context62.t2, _context62.t3);
          activeBanner = false;

          if (banner.Status == 1) {
            activeBanner = true;
          }

          res.render("payments", (_res$render2 = {
            pageName: "Payments",
            dashboardPage: true,
            menu: true,
            payments: true,
            user: user,
            pictureProfile: pictureProfile
          }, _defineProperty(_res$render2, "payments", payments), _defineProperty(_res$render2, "admin", admin), _defineProperty(_res$render2, "banner", banner), _defineProperty(_res$render2, "activeBanner", activeBanner), _res$render2));

        case 37:
        case "end":
          return _context62.stop();
      }
    }
  });
};
/**FUNCTION TO RENDER SETTINGS SYSTEM PAGE*/


exports.settingsPreview = function _callee61(req, res) {
  var URI, user, pictureProfile, settings, admin, file_N, file_N2, text0, text1, modeEnv, gateaway, hostLink, sagex3Folder, banner, activeBanner;
  return regeneratorRuntime.async(function _callee61$(_context63) {
    while (1) {
      switch (_context63.prev = _context63.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //USER INFO

          pictureProfile = res.locals.user["$resources"][1]["pic"]; //PIC PROFILE

          _context63.next = 5;
          return regeneratorRuntime.awrap(DataBaseSq.settingsTable());

        case 5:
          settings = _context63.sent;
          //GET SETTING FROM SQL TABLE
          admin = false;

          if (!(user["ROLE"] == 4)) {
            _context63.next = 11;
            break;
          }

          admin = true;
          _context63.next = 12;
          break;

        case 11:
          return _context63.abrupt("return", res.redirect("/dashboard"));

        case 12:
          file_N = "/www/wwwroot/10.99.99.10/repository/invoice_payment/src/config/client.crt";
          file_N2 = "/www/wwwroot/10.99.99.10/repository/invoice_payment/src/config/client.key";
          text0 = fs.readFileSync(file_N, "utf8", function (error, data) {
            if (error) throw error;
            return data;
          });
          text1 = fs.readFileSync(file_N2, "utf8", function (error, data) {
            if (error) throw error;
            return data;
          });
          text1 = decrypt(text1);
          text0 = decrypt(text0);
          _context63.t0 = JSON;
          _context63.next = 21;
          return regeneratorRuntime.awrap(DataBaseSq.settingsTableTypeEnvProduction());

        case 21:
          _context63.t1 = _context63.sent;
          modeEnv = _context63.t0.parse.call(_context63.t0, _context63.t1);
          _context63.t2 = JSON;
          _context63.next = 26;
          return regeneratorRuntime.awrap(DataBaseSq.settingsgateway());

        case 26:
          _context63.t3 = _context63.sent;
          gateaway = _context63.t2.parse.call(_context63.t2, _context63.t3);
          hostLink = gateaway[4]['valueSett'];
          sagex3Folder = req.session.queryFolder;
          _context63.t4 = JSON;
          _context63.next = 33;
          return regeneratorRuntime.awrap(DataBaseSq.bannerSetting());

        case 33:
          _context63.t5 = _context63.sent;
          banner = _context63.t4.parse.call(_context63.t4, _context63.t5);
          activeBanner = false;

          if (banner.Status == 1) {
            activeBanner = true;
          } //RENDER SYSTEM SETTING PAGE


          res.render("sysSettings", {
            pageName: "System Settings",
            dashboardPage: true,
            menu: true,
            sysSettings: true,
            user: user,
            pictureProfile: pictureProfile,
            settings: settings,
            admin: admin,
            text0: text0,
            text1: text1,
            modeEnv: modeEnv,
            gateaway: gateaway,
            sagex3Folder: sagex3Folder,
            banner: banner,
            activeBanner: activeBanner,
            hostLink: hostLink
          });

        case 38:
        case "end":
          return _context63.stop();
      }
    }
  });
};
/**FUNCTION TO SAVE SETTINGS SYSTEM */


exports.saveSetting = function _callee62(req, res) {
  var _req$body8, sValue, sType, sStatus, saveSys, settings;

  return regeneratorRuntime.async(function _callee62$(_context64) {
    while (1) {
      switch (_context64.prev = _context64.next) {
        case 0:
          _req$body8 = req.body, sValue = _req$body8.sValue, sType = _req$body8.sType, sStatus = _req$body8.sStatus;
          _context64.next = 3;
          return regeneratorRuntime.awrap(DataBaseSq.saveSetting(sValue, sType, sStatus));

        case 3:
          saveSys = _context64.sent;
          _context64.next = 6;
          return regeneratorRuntime.awrap(DataBaseSq.settingsTable());

        case 6:
          settings = _context64.sent;
          // GET SETTINGS FOR UPDATE DATABLE AFTER INSERT THE NEW SETTING
          res.send({
            settings: settings
          }); //SEND TO AJAX SETTING FOR UPDATE DATATABLE

        case 8:
        case "end":
          return _context64.stop();
      }
    }
  });
};
/**FUNCTION TO SAVE EDITED SETTINGS SYSTEM */


exports.saveEditSetting = function _callee63(req, res) {
  var _req$body9, sValue, sType, sStatus, sId, enValue, saveSys, settings;

  return regeneratorRuntime.async(function _callee63$(_context65) {
    while (1) {
      switch (_context65.prev = _context65.next) {
        case 0:
          _req$body9 = req.body, sValue = _req$body9.sValue, sType = _req$body9.sType, sStatus = _req$body9.sStatus, sId = _req$body9.sId;
          enValue = sValue;

          if (sType == "gatewayCompanyId" || sType == "gatewayEntity" || sType == "consumerKey" || sType == "consumerSecret" || sType == "bank_account_number" || sType == "bank_id" || sType == "bank_account_number_FP" || sType == "bank_id_FP") {
            enValue = encrypt(sValue);
          }

          _context65.next = 5;
          return regeneratorRuntime.awrap(DataBaseSq.saveEditSetting(enValue, sType, sStatus, sId));

        case 5:
          saveSys = _context65.sent;
          _context65.next = 8;
          return regeneratorRuntime.awrap(DataBaseSq.settingsTable());

        case 8:
          settings = _context65.sent;

          if (!(sType == "gatewayCompanyId" || sType == "Env" || sType == "gatewayEntity" || sType == "consumerKey" || sType == "consumerSecret" || sType == "bank_account_number" || sType == "bank_id" || sType == "bank_account_number_FP" || sType == "bank_id_FP" || sType == "PauseCustomerPaymentMethods")) {
            _context65.next = 11;
            break;
          }

          return _context65.abrupt("return", res.sendStatus(200));

        case 11:
          if (sType == "queryFolder") {
            req.session.queryFolder = sValue;
          }

          return _context65.abrupt("return", res.sendStatus(200));

        case 13:
        case "end":
          return _context65.stop();
      }
    }
  });
};
/**FUNCTION TO SAVE EDIT BANNER  */


exports.saveEditSettingBanner = function _callee64(req, res) {
  var _req$body10, bannerText, colorText, colorBg, status, bannerKey, saveSys;

  return regeneratorRuntime.async(function _callee64$(_context66) {
    while (1) {
      switch (_context66.prev = _context66.next) {
        case 0:
          _req$body10 = req.body, bannerText = _req$body10.bannerText, colorText = _req$body10.colorText, colorBg = _req$body10.colorBg, status = _req$body10.status, bannerKey = _req$body10.bannerKey;
          console.log("🚀 ~ file: dashboardController.js ~ line 2794 ~ exports.saveEditSettingBanner= ~ req.body", req.body);

          if (!(bannerKey != '')) {
            _context66.next = 9;
            break;
          }

          _context66.next = 5;
          return regeneratorRuntime.awrap(DataBaseSq.EditSettingBanner(bannerText, status, colorBg, colorText, bannerKey));

        case 5:
          saveSys = _context66.sent;
          //SAVE IN SQL TABLE EDITED SETTINGS SYSTEM
          console.log("🚀 ~ file: dashboardController.js ~ line 2794 ~ exports.saveEditSettingBanner= ~ saveSys", saveSys);
          _context66.next = 13;
          break;

        case 9:
          _context66.next = 11;
          return regeneratorRuntime.awrap(DataBaseSq.saveSettingBanner(bannerText, 'banner', status, colorBg, colorText));

        case 11:
          saveSys = _context66.sent;
          //SAVE IN SQL TABLE EDITED SETTINGS SYSTEM
          console.log("🚀 ~ file: dashboardController.js ~ line 2794 ~ exports.saveEditSettingBanner= ~ saveSys", saveSys);

        case 13:
          return _context66.abrupt("return", res.sendStatus(200));

        case 14:
        case "end":
          return _context66.stop();
      }
    }
  });
};
/**FUNCTION TO GET INFO OF SETTINGS SYS TO EDIT */


exports.editSetting = function _callee65(req, res) {
  var sId, saveSys;
  return regeneratorRuntime.async(function _callee65$(_context67) {
    while (1) {
      switch (_context67.prev = _context67.next) {
        case 0:
          sId = req.body.sId;
          _context67.t0 = JSON;
          _context67.next = 4;
          return regeneratorRuntime.awrap(DataBaseSq.editSetting(sId));

        case 4:
          _context67.t1 = _context67.sent;
          saveSys = _context67.t0.parse.call(_context67.t0, _context67.t1);
          //GET INFO FROM SQL TABLE OF SETTING SYSTEM BY ID
          res.send({
            saveSys: saveSys
          }); //SEND TO AJAX

        case 7:
        case "end":
          return _context67.stop();
      }
    }
  });
};
/**FUNCTION TO PAYMENTS DETAIL PAGE */


exports.payments_detail = function _callee67(req, res) {
  var URI, user, pictureProfile, admin, SessionKeyLog, ip, count, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, pmtKey, payments_dt, where_filter_inv, inv_wofilter, i, payments_st, inv_wofilter_st, banner, activeBanner;
  return regeneratorRuntime.async(function _callee67$(_context69) {
    while (1) {
      switch (_context69.prev = _context69.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //USER INFO

          pictureProfile = res.locals.user["$resources"][1]["pic"]; //PIC PROFILE

          admin = false;

          if (user["ROLE"] == 4) {
            admin = true;
          } //SAVE SQL TABLE SYSTEMLOG


          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          count = 1000;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Init consulting payments details", Status = 1, Comment = "FUNCTION: payments_detail-line 1864";
          _context69.next = 11;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 11:
          SystemLogL = _context69.sent;
          //FIRTS GET PAYMENTS FROM SQL TABLE BY "PMTKEY"
          pmtKey = req.params.id;
          payments_dt = []; //USE THIS ARRAY TO STORE PAYMENTS

          _context69.next = 16;
          return regeneratorRuntime.awrap(DataBaseSq.Get_tPaymentsBypmtKey(pmtKey).then(function (response) {
            response = JSON.parse(response); //PUSH IN ARRAY PAYMENTS INFO

            payments_dt.push({
              pmtKey: response.pmtKey,
              CustID: response.CustID,
              TransactionID: response.TransactionID,
              TranAmount: response.TranAmount,
              ProcessorStatus: response.ProcessorStatus,
              ProcessorStatusDesc: response.ProcessorStatusDesc,
              DateProcessesed: response.DateProcessesed,
              tPaymentApplication: response.tPaymentApplication
            });
          }));

        case 16:
          inv_wofilter = []; //USE THIS ARRAY TO STORE INVOICES INFO
          //GET FROM X3, INVOICE IN PAYMENTS ARRAY INFO ONE BY ONE

          i = 0;

        case 18:
          if (!(i < payments_dt[0].tPaymentApplication.length)) {
            _context69.next = 29;
            break;
          }

          //THIS IS FOR GET INFO 
          console.log('search ayment invoice details');
          where_filter_inv = "&where=NUM eq '" + payments_dt[0].tPaymentApplication[i].INVOICENUM + "' "; //WHERE CLAUSE WITH INVNUM,FOR X3
          //STORE INFO INVOICE IN ARRAY

          _context69.t0 = inv_wofilter;
          _context69.next = 24;
          return regeneratorRuntime.awrap(request({
            uri: URI + "YPORTALINVD('".concat(payments_dt[0].tPaymentApplication[i].INVOICENUM, "')?representation=YPORTALINVD.$details"),
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee66(inv_wofilter2) {
            return regeneratorRuntime.async(function _callee66$(_context68) {
              while (1) {
                switch (_context68.prev = _context68.next) {
                  case 0:
                    console.log('inv_wofilter2'); // IF RESPONSE BLANK, SAVE IN SQL LOGSYSTEM ERROR AND RETURN

                    if (!(inv_wofilter2.length == 0)) {
                      _context68.next = 7;
                      break;
                    }

                    Description = "Error get invoice for pay", Status = 1, Comment = "Invoice query response blank or closed inv trying to pay. - Line 1915";
                    _context68.next = 5;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 5:
                    SystemLogL = _context68.sent;
                    return _context68.abrupt("return", false);

                  case 7:
                    return _context68.abrupt("return", inv_wofilter2);

                  case 8:
                  case "end":
                    return _context68.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 3024 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 3024";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 24:
          _context69.t1 = _context69.sent;

          _context69.t0.push.call(_context69.t0, _context69.t1);

        case 26:
          i++;
          _context69.next = 18;
          break;

        case 29:
          payments_st = JSON.stringify(payments_dt), inv_wofilter_st = JSON.stringify(inv_wofilter); //CONVERT ARRAY INVOICES INFO IN STRING FOR DATATABLE

          _context69.t2 = JSON;
          _context69.next = 33;
          return regeneratorRuntime.awrap(DataBaseSq.bannerSetting());

        case 33:
          _context69.t3 = _context69.sent;
          banner = _context69.t2.parse.call(_context69.t2, _context69.t3);
          activeBanner = false;

          if (banner.Status == 1) {
            activeBanner = true;
          } //RENDER PAGE


          res.render("detail_payments", {
            pageName: "Payments Details",
            dashboardPage: true,
            menu: true,
            payment_detail: true,
            user: user,
            pictureProfile: pictureProfile,
            payments_dt: payments_dt,
            admin: admin,
            inv_wofilter: inv_wofilter,
            payments_st: payments_st,
            inv_wofilter_st: inv_wofilter_st,
            banner: banner,
            activeBanner: activeBanner
          });

        case 38:
        case "end":
          return _context69.stop();
      }
    }
  });
};
/**FUNCTION TO STATUS PAYMENTS DETAIL PAGE */


exports.status_payments_detail = function _callee68(req, res) {
  var URI, user, pictureProfile, admin, SessionKeyLog, ip, count, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, pmtKey, payments_dt, where_filter_inv, inv_wofilter, i, searchLog, payments_st, banner, activeBanner;
  return regeneratorRuntime.async(function _callee68$(_context70) {
    while (1) {
      switch (_context70.prev = _context70.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //USER INFO

          pictureProfile = res.locals.user["$resources"][1]["pic"]; //PIC PROFILE

          admin = false;

          if (user["ROLE"] == 4) {
            admin = true;
          } //SAVE SQL TABLE SYSTEMLOG


          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          count = 1000;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Init consulting payments details", Status = 1, Comment = "FUNCTION: payments_detail-line 1864";
          _context70.next = 11;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 11:
          SystemLogL = _context70.sent;
          //FIRTS GET PAYMENTS FROM SQL TABLE BY "PMTKEY"
          pmtKey = req.params.id;
          payments_dt = []; //USE THIS ARRAY TO STORE PAYMENTS

          _context70.next = 16;
          return regeneratorRuntime.awrap(DataBaseSq.Get_tPaymentsBypmtKey(pmtKey).then(function (response) {
            response = JSON.parse(response); //PUSH IN ARRAY PAYMENTS INFO

            payments_dt.push({
              pmtKey: response.pmtKey,
              CustID: response.CustID,
              TransactionID: response.TransactionID,
              TranAmount: response.TranAmount,
              ProcessorStatus: response.ProcessorStatus,
              ProcessorStatusDesc: response.ProcessorStatusDesc,
              DateProcessesed: response.DateProcessesed,
              tPaymentApplication: response.tPaymentApplication
            });
          }));

        case 16:
          inv_wofilter = []; //USE THIS ARRAY TO STORE INVOICES INFO
          //GET FROM X3, INVOICE IN PAYMENTS ARRAY INFO ONE BY ONE

          i = 0;

        case 18:
          if (!(i < payments_dt[0].tPaymentApplication.length)) {
            _context70.next = 28;
            break;
          }

          console.log('searchLog'); //THIS IS FOR GET INFO OF CLOSED INVOICES WITH STATUS SOAP 1

          _context70.next = 22;
          return regeneratorRuntime.awrap(DataBasequerys.GetLogError(payments_dt[0].tPaymentApplication[i]['tlogKey']));

        case 22:
          searchLog = _context70.sent;
          console.log(searchLog);

          if (!searchLog) {
            payments_dt[0].tPaymentApplication[i].errorLog = 'N/A';
          } else {
            payments_dt[0].tPaymentApplication[i].errorLog = searchLog;
          }

        case 25:
          i++;
          _context70.next = 18;
          break;

        case 28:
          payments_st = JSON.stringify(payments_dt); //CONVERT ARRAY PAYMENTS IN STRING FOR DATATABLE

          _context70.t0 = JSON;
          _context70.next = 32;
          return regeneratorRuntime.awrap(DataBaseSq.bannerSetting());

        case 32:
          _context70.t1 = _context70.sent;
          banner = _context70.t0.parse.call(_context70.t0, _context70.t1);
          activeBanner = false;

          if (banner.Status == 1) {
            activeBanner = true;
          } //RENDER PAGE


          res.render("statusPayment", {
            pageName: "Status Payments Details",
            dashboardPage: true,
            menu: true,
            status_payment_detail: true,
            user: user,
            pictureProfile: pictureProfile,
            payments_dt: payments_dt,
            admin: admin,
            inv_wofilter: inv_wofilter,
            payments_st: payments_st,
            banner: banner,
            activeBanner: activeBanner
          });

        case 37:
        case "end":
          return _context70.stop();
      }
    }
  });
};
/**FUNCTION TO PRINT  PAYMENTS DETAIL PAGE */


exports.Print_payments_detail = function _callee71(req, res) {
  var URI, user, pictureProfile, admin, SessionKeyLog, ip, count, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, pmtKey, payments_dt, where_filter_inv, inv_wofilter, i, payments_st, inv_wofilter_st;
  return regeneratorRuntime.async(function _callee71$(_context73) {
    while (1) {
      switch (_context73.prev = _context73.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //USER INFO

          pictureProfile = res.locals.user["$resources"][1]["pic"]; //PIC PROFILE

          admin = false;

          if (user["ROLE"] == 4) {
            admin = true;
          } //SAVE SQL TABLE SYSTEMLOG


          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          count = 1000;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Init consulting payments details", Status = 1, Comment = "FUNCTION: payments_detail-line 1864";
          _context73.next = 11;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 11:
          SystemLogL = _context73.sent;
          //FIRTS GET PAYMENTS FROM SQL TABLE BY "PMTKEY"
          pmtKey = req.params.id;
          payments_dt = []; //USE THIS ARRAY TO STORE PAYMENTS

          _context73.next = 16;
          return regeneratorRuntime.awrap(DataBaseSq.Get_tPaymentsBypmtKey(pmtKey).then(function (response) {
            response = JSON.parse(response); //PUSH IN ARRAY PAYMENTS INFO

            payments_dt.push({
              pmtKey: response.pmtKey,
              CustID: response.CustID,
              TransactionID: response.TransactionID,
              TranAmount: response.TranAmount,
              ProcessorStatus: response.ProcessorStatus,
              ProcessorStatusDesc: response.ProcessorStatusDesc,
              DateProcessesed: response.DateProcessesed,
              tPaymentApplication: response.tPaymentApplication
            });
          }));

        case 16:
          inv_wofilter = []; //USE THIS ARRAY TO STORE INVOICES INFO
          //GET FROM X3, INVOICE IN PAYMENTS ARRAY INFO ONE BY ONE

          i = 0;

        case 18:
          if (!(i < payments_dt[0].tPaymentApplication.length)) {
            _context73.next = 37;
            break;
          }

          if (!(payments_dt[0].tPaymentApplication[i]["OpenAmount"] == payments_dt[0].tPaymentApplication[i]["AppliedAmount"] && payments_dt[0].tPaymentApplication[i]["Status"] == "1")) {
            _context73.next = 28;
            break;
          }

          where_filter_inv = "&where=NUM eq '" + payments_dt[0].tPaymentApplication[i].INVOICENUM + "' "; //WHERE CLAUSE WITH INVNUM,FOR X3
          //STORE INFO INVOICE IN ARRAY

          _context73.t0 = inv_wofilter;
          _context73.next = 24;
          return regeneratorRuntime.awrap(request({
            uri: URI + "YPORTALINV?representation=YPORTALINVC.$query&count=" + count + " " + where_filter_inv,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee69(inv_wofilter2) {
            return regeneratorRuntime.async(function _callee69$(_context71) {
              while (1) {
                switch (_context71.prev = _context71.next) {
                  case 0:
                    if (!(inv_wofilter2["$resources"].length == 0)) {
                      _context71.next = 6;
                      break;
                    }

                    Description = "Error get invoice for pay", Status = 1, Comment = "Invoice query response blank or closed inv trying to pay. - Line 1915";
                    _context71.next = 4;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 4:
                    SystemLogL = _context71.sent;
                    return _context71.abrupt("return", false);

                  case 6:
                    return _context71.abrupt("return", inv_wofilter2["$resources"][0]);

                  case 7:
                  case "end":
                    return _context71.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 3221 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 3221";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 24:
          _context73.t1 = _context73.sent;

          _context73.t0.push.call(_context73.t0, _context73.t1);

          _context73.next = 34;
          break;

        case 28:
          //GET INFO OPEN INVOICES OR WITH STATUS SOAP 0
          where_filter_inv = "&where=NUM eq '" + payments_dt[0].tPaymentApplication[i].INVOICENUM + "' "; //WHERE CLAUSE FOR X3
          //STORE INFO INVOICE IN ARRAY

          _context73.t2 = inv_wofilter;
          _context73.next = 32;
          return regeneratorRuntime.awrap(request({
            uri: URI + "YPORTALINV?representation=YPORTALINVO.$query&count=" + count + " " + where_filter_inv,
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee70(inv_wofilter2) {
            return regeneratorRuntime.async(function _callee70$(_context72) {
              while (1) {
                switch (_context72.prev = _context72.next) {
                  case 0:
                    if (!(inv_wofilter2["$resources"].length == 0)) {
                      _context72.next = 6;
                      break;
                    }

                    Description = "Error get invoice for pay", Status = 1, Comment = "Invoice query response blank or closed inv trying to pay. - Line 1957";
                    _context72.next = 4;
                    return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

                  case 4:
                    SystemLogL = _context72.sent;
                    return _context72.abrupt("return", false);

                  case 6:
                    return _context72.abrupt("return", inv_wofilter2["$resources"][0]);

                  case 7:
                  case "end":
                    return _context72.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 3271 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 3271";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 32:
          _context73.t3 = _context73.sent;

          _context73.t2.push.call(_context73.t2, _context73.t3);

        case 34:
          i++;
          _context73.next = 18;
          break;

        case 37:
          payments_st = JSON.stringify(payments_dt), inv_wofilter_st = JSON.stringify(inv_wofilter); //CONVERT ARRAY INVOICES INFO IN STRING FOR DATATABLE
          //RENDER PAGE

          res.render("print_details_payment", {
            pageName: "Payments Details",
            dashboardPage: true,
            menu: true,
            payment_detail_print: true,
            print_inv: true,
            user: user,
            pictureProfile: pictureProfile,
            payments_dt: payments_dt,
            admin: admin,
            inv_wofilter: inv_wofilter,
            payments_st: payments_st,
            inv_wofilter_st: inv_wofilter_st
          });

        case 39:
        case "end":
          return _context73.stop();
      }
    }
  });
};
/**FUNCTION TO PROCESS PAYMENT WITH WELLS FARGO */

/**FUNCTION TO PROCESS PAYMENT WITH WELLS FARGO */


exports.process_payment_WF = function _callee72(req, res) {
  var URI, user, ip, SessionKeyLog, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, apikey, modeEnv, gateaway, hostLink, WF_APIKey, _req$body11, bank_id, bank_account_number, totalAmountcard, inv, appliedAmount, reasonLessAmta, userIDInv, NamePayer_Bank, Payname, legalNameAccount, consult_paymentID, prepare_idWF, payment_id0, complete_seq, WF_TransactionID, back_side_res, payment_id, transactionDate, error, errorLogD, errorLogC, descp, comm, TranAmount, tPaymentSave, paymentKey;

  return regeneratorRuntime.async(function _callee72$(_context74) {
    while (1) {
      switch (_context74.prev = _context74.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //User info
          //Save SQL SYSTEMLOG

          ip = req.connection.remoteAddress;
          SessionKeyLog = req.session.SessionLog;
          UserID = user["EMAIL"].toString(), IPAddress = ip, LogTypeKey = 7, SessionKey = SessionKeyLog, Description = "Connecting process payment with wells fargo", Status = 1, Comment = "FUNCTION: process_payment_WF-LINE 2009";
          _context74.next = 7;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 7:
          SystemLogL = _context74.sent;
          _context74.t0 = JSON;
          _context74.next = 11;
          return regeneratorRuntime.awrap(DataBaseSq.settingsTableTypeEnvProduction());

        case 11:
          _context74.t1 = _context74.sent;
          modeEnv = _context74.t0.parse.call(_context74.t0, _context74.t1);

          if (!(req.cookies.wf && modeEnv.Status == 1)) {
            _context74.next = 17;
            break;
          }

          apikey = req.cookies.wf;
          _context74.next = 30;
          break;

        case 17:
          _context74.t2 = JSON;
          _context74.next = 20;
          return regeneratorRuntime.awrap(DataBaseSq.settingsgateway());

        case 20:
          _context74.t3 = _context74.sent;
          gateaway = _context74.t2.parse.call(_context74.t2, _context74.t3);
          hostLink = gateaway[4]["valueSett"];
          _context74.t4 = JSON;
          _context74.next = 26;
          return regeneratorRuntime.awrap(WFCCtrl.APYKeyGet(hostLink).then(function (response) {
            return JSON.stringify(response);
          }));

        case 26:
          _context74.t5 = _context74.sent;
          WF_APIKey = _context74.t4.parse.call(_context74.t4, _context74.t5);
          apikey = WF_APIKey["access_token"];

          if (modeEnv.Status == 1) {
            res.cookie("wf", WF_APIKey["access_token"], {
              maxAge: WF_APIKey["expires_in"]
            });
          }

        case 30:
          //START PROCCESS PAYMENT
          _req$body11 = req.body, bank_id = _req$body11.bank_id, bank_account_number = _req$body11.bank_account_number, totalAmountcard = _req$body11.totalAmountcard, inv = _req$body11.inv, appliedAmount = _req$body11.appliedAmount, reasonLessAmta = _req$body11.reasonLessAmta, userIDInv = _req$body11.userIDInv, NamePayer_Bank = _req$body11.NamePayer_Bank, Payname = _req$body11.Payname, legalNameAccount = _req$body11.legalNameAccount;
          console.log("🚀 ~ file: dashboardController.js ~ line 3158 ~ exports.process_payment_WF= ~ req.body", req.body);
          _context74.t6 = JSON;
          _context74.next = 35;
          return regeneratorRuntime.awrap(DataBaseSq.GetLastPaymenTIDWF());

        case 35:
          _context74.t7 = _context74.sent;
          consult_paymentID = _context74.t6.parse.call(_context74.t6, _context74.t7);
          //GET Last PaymentID WF to create next
          console.log(consult_paymentID);

          if (consult_paymentID.length == 0) {
            prepare_idWF = "POR000000000001";
          } else {
            payment_id0 = consult_paymentID[0]["TransactionID"]; // GET TRANSACTIONID FOR CREATE NEXT NUM

            prepare_idWF = payment_id0.replace("POR", ""); //

            prepare_idWF = parseInt(consult_paymentID[0]["pmtKey"]) + 1;
            complete_seq = prepare_idWF.toString().padStart(12, "0");
            prepare_idWF = "POR" + complete_seq;
          } //CREATE THE NEXT PAYMENT ID


          if (NamePayer_Bank == "" || NamePayer_Bank == null) {
            NamePayer_Bank = decrypt(Payname);
            console.log("NamePayer_Bank");
          }

          console.log(NamePayer_Bank); //SEND PAYMENT TO WF API

          _context74.t8 = JSON;
          _context74.next = 44;
          return regeneratorRuntime.awrap(WFCCtrl.WF(totalAmountcard, apikey, legalNameAccount, bank_id, bank_account_number, prepare_idWF).then(function (response) {
            console.log("🚀 ~ file: dashboardController.js ~ line 3177 ~ awaitWFCCtrl.WF ~ response", response);
            return JSON.stringify(response);
          }));

        case 44:
          _context74.t9 = _context74.sent;
          WF_TransactionID = _context74.t8.parse.call(_context74.t8, _context74.t9);
          console.log("🚀 ~ file: dashboardController.js ~ line 3181 ~ exports.process_payment_WF= ~ WF_TransactionID", WF_TransactionID);
          back_side_res = WF_TransactionID["x-backside-transport"], payment_id = WF_TransactionID["payment-id"];
          transactionDate = moment(WF_TransactionID["date"]).format("YYYY-MM-DD");
          error = "";

          if (!WF_TransactionID["errors"]) {
            _context74.next = 66;
            break;
          }

          console.log(WF_TransactionID["errors"][0]);
          error = WF_TransactionID["errors"]; //IF RESPONSE ERROR, SAVE IN LOGSYSTEM SQL THE ERROR

          console.log("\nError : " + JSON.stringify(error)); //SHOW IN CONSOLE THE ERROR

          errorLogD = "Error:" + WF_TransactionID["errors"][0]["error_code"] + "- process payment";
          console.log(errorLogD); //SHOW IN CONSOLE THE ERROR

          errorLogC = WF_TransactionID["errors"][0]["description"];
          console.log("🚀 ~ file: dashboardController.js ~ line 3198 ~ exports.process_payment_WF= ~ errorLogC", errorLogC); //SHOW IN CONSOLE THE ERROR

          Description = errorLogD, Status = 0, Comment = errorLogC;
          _context74.next = 61;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 61:
          SystemLogL = _context74.sent;
          SystemLogL = JSON.parse(SystemLogL);
          return _context74.abrupt("return", res.send({
            error: error,
            SystemLogL: SystemLogL
          }));

        case 66:
          if (!(back_side_res == "OK OK")) {
            _context74.next = 84;
            break;
          }

          //IF RESPONSE FINE, SAVE PAYMENT INFO IN SQL TABLE
          TranAmount = parseFloat(totalAmountcard);
          //ENCRYPT CREDIT CARD INFO FOR SAVE IN SQL TABLE
          bank_id = encrypt(bank_id);
          bank_account_number = encrypt(bank_account_number); //IF PAYMENT STATUS IS "AUTHORIZED" SAVE IN SQL TABLE LOG SYSTEM

          descp = "Process status res: " + back_side_res;
          comm = "Process payment success: OK-PENDDING";
          Description = descp, Status = 1, Comment = comm, SessionKey = SessionKeyLog;
          _context74.next = 75;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 75:
          SystemLogL = _context74.sent;
          _context74.next = 78;
          return regeneratorRuntime.awrap(DataBaseSq.RegtPaymentWF(1, SessionKey, UserID, payment_id, TranAmount, 0, transactionDate, 0, "PENDING", "PENDING", bank_id, bank_account_number, userIDInv));

        case 78:
          tPaymentSave = _context74.sent;
          paymentKey = JSON.parse(tPaymentSave).pmtKey; // THIS GET THE PAYMENT KEY ID
          //SHOW CONSOLE INFO ABOUT PAYMENT

          console.log("--Sucess in SQL: " + paymentKey);
          return _context74.abrupt("return", res.send({
            error: error,
            WF_TransactionID: WF_TransactionID,
            SystemLogL: SystemLogL,
            paymentKey: paymentKey
          }));

        case 84:
          Description = 'process_payment_WF:WF_TransactionID', Status = 0, Comment = 'Error lines 3187-3238/WF_TransactionID';
          _context74.next = 87;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 87:
          SystemLogL = _context74.sent;
          SystemLogL = JSON.parse(SystemLogL);
          return _context74.abrupt("return", res.send({
            WF_TransactionID_Error: 'Error: WF_TransactionID failed in process_payment_WF, please contact support.- ',
            SystemLogL: SystemLogL
          }));

        case 90:
        case "end":
          return _context74.stop();
      }
    }
  });
};
/**FUNCTION TO CHANGE CRON TASK SERVER (WF VERIFY) */


exports.changeCronServer = function _callee73(req, res) {
  var exec, child;
  return regeneratorRuntime.async(function _callee73$(_context75) {
    while (1) {
      switch (_context75.prev = _context75.next) {
        case 0:
          // var process = require('child_process');
          // process.exec('pm2 stop 1',function (error, stdout, stderr) {
          //   if (error !== null) {
          //       console.log('exec error: ' + error);
          //   }
          exec = require("child_process").exec; ///C:/Users/isaac/Documents/init_checkWF.bat

          child = exec("pm2 restart 2", function (error, stdout, stderr) {
            console.log("stdout: " + stdout);
            console.log("stderr: " + stderr);

            if (error !== null) {
              console.log("exec error: " + error);
            }
          });
          return _context75.abrupt("return", res.sendStatus(200));

        case 3:
        case "end":
          return _context75.stop();
      }
    }
  });
};
/**FUNCTION TO STATUS PAYMENTS DETAIL PAGE */


exports.resendX3 = function _callee77(req, res) {
  var URI, user, SessionKeyLog, ip, count, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, _req$body12, tPaymentPmtKey, INVOICENUM, AppliedAmount, ShortDescription, i_file, inv_detail, amountPayment, today, statusSOAP, parser, msgErroSOAP, inVError, Payment, bankAccount, Lastfour, reasonLeast, xmlB, SOAPP, newSystemLog, extraida, paymentAplication;

  return regeneratorRuntime.async(function _callee77$(_context79) {
    while (1) {
      switch (_context79.prev = _context79.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //USER INFO
          //SAVE SQL TABLE SYSTEMLOG

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          count = 1000;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Init resendX3", Status = 1, Comment = "FUNCTION: resendX3-line ";
          _context79.next = 8;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 8:
          SystemLogL = _context79.sent;
          console.log(req.body);
          _req$body12 = req.body, tPaymentPmtKey = _req$body12.tPaymentPmtKey, INVOICENUM = _req$body12.INVOICENUM, AppliedAmount = _req$body12.AppliedAmount, ShortDescription = _req$body12.ShortDescription;
          i_file = "";
          today = moment().format("YYYYMMDD"); //FORMAY DATE: 20220101

          statusSOAP = []; //ALMACENATE IN ARRAY SOAP STATUS RESPONSE

          parser = new xml2js.Parser({
            explicitArray: true
          }); //THIS FUNCTION IS FOR PARSER XML 

          msgErroSOAP = [], inVError = [];
          statusSOAP.pop();
          console.log('reSendX3');
          _context79.t0 = JSON;
          _context79.next = 21;
          return regeneratorRuntime.awrap(DataBaseSq.Get_tPaymentsBypmtKey(tPaymentPmtKey));

        case 21:
          _context79.t1 = _context79.sent;
          Payment = _context79.t0.parse.call(_context79.t0, _context79.t1);
          console.log(Payment); // FIRTS GET INVOICE DETAIL FROM X3

          _context79.t2 = JSON;
          _context79.next = 27;
          return regeneratorRuntime.awrap(request({
            uri: URI + "YPORTALINVD('".concat(INVOICENUM, "')?representation=YPORTALINVD.$details"),
            method: "GET",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "application/json",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW"
            },
            json: true
          }).then(function _callee74(invD) {
            return regeneratorRuntime.async(function _callee74$(_context76) {
              while (1) {
                switch (_context76.prev = _context76.next) {
                  case 0:
                    return _context76.abrupt("return", JSON.stringify(invD));

                  case 1:
                  case "end":
                    return _context76.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 3502 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 3502";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 27:
          _context79.t3 = _context79.sent;
          inv_detail = _context79.t2.parse.call(_context79.t2, _context79.t3);
          //GET AMOUNT APPLIED FOR INVOICE
          amountPayment = Number.parseFloat(AppliedAmount).toFixed(2);
          bankAccount = decrypt(Payment['bank_account_number']); //DECRYPT

          Lastfour = bankAccount.slice(-4); // GET LAST FOR NUMBER 

          reasonLeast = ShortDescription;
          i_file = "P;;RECPT;".concat(inv_detail.BPCINV, ";ENG;10501;S001;").concat(inv_detail.CUR, ";").concat(amountPayment, ";").concat(today, ";").concat(Payment['ProcessorTranID'], ";").concat(Payment['TransactionID'], ";ACH").concat(Lastfour, ";10204|D;PAYRC;").concat(inv_detail.GTE, ";").concat(inv_detail.NUM, ";").concat(inv_detail.CUR, ";").concat(amountPayment, ";").concat(reasonLeast.toUpperCase(), "|A;LOC;").concat(inv_detail.SIVSIHC_ANA[0].CCE, ";DPT;").concat(inv_detail.SIVSIHC_ANA[1].CCE, ";BRN;000;BSU;").concat(inv_detail.SIVSIHC_ANA[3].CCE, ";SBU;").concat(inv_detail.SIVSIHC_ANA[4].CCE, ";").concat(amountPayment, "|END"); //I_FILE

          console.log(i_file); //CHECK I_FILE
          //PREPARE THE XML FOR SAVE IN SOAP X3, ENTER THE I_FILE VARIABLE

          xmlB = "<soapenv:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:wss=\"http://www.adonix.com/WSS\">\n  <soapenv:Header/>\n  <soapenv:Body>\n  <wss:run soapenv:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\n  <callContext xsi:type=\"wss:CAdxCallContext\">\n  <codeLang xsi:type=\"xsd:string\">ENG</codeLang>\n  <poolAlias xsi:type=\"xsd:string\">".concat(req.session.queryFolder, "</poolAlias>\n  <poolId xsi:type=\"xsd:string\"></poolId>\n  <requestConfig xsi:type=\"xsd:string\">\n   <![CDATA[adxwss.optreturn=JSON&adxwss.beautify=true&adxwss.trace.on=off]]>\n  </requestConfig>\n  </callContext>\n  <publicName xsi:type=\"xsd:string\">AOWSIMPORT</publicName>\n  <inputXml xsi:type=\"xsd:string\">\n  <![CDATA[{\n   \"GRP1\": {\n     \"I_MODIMP\": \"YPORTALPAY\",\n     \"I_AOWSTA\": \"NO\",\n     \"I_EXEC\": \"REALTIME\",\n     \"I_RECORDSEP\": \"|\",\n     \"I_FILE\":\"").concat(i_file, "\"\n   }\n  }]]>\n  </inputXml>\n  </wss:run>\n  </soapenv:Body>\n  </soapenv:Envelope>"); //SEND TO SOAP X3 THE XML WIHT THE PAYMENT INFO, AND GET RESPONSE

          _context79.t4 = JSON;
          _context79.next = 39;
          return regeneratorRuntime.awrap(request({
            uri: "https://sawoffice.technolify.com:8443/soap-generic/syracuse/collaboration/syracuse/CAdxWebServiceXmlCC",
            method: "POST",
            insecure: true,
            rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json",
              Connection: 'close',
              Accept: "*/*",
              Authorization: "Basic U0Y6NHRwVyFFK2RXLVJmTTQwcWFW",
              soapaction: "*"
            },
            body: xmlB
          }).then(function _callee75(SOAP) {
            return regeneratorRuntime.async(function _callee75$(_context77) {
              while (1) {
                switch (_context77.prev = _context77.next) {
                  case 0:
                    return _context77.abrupt("return", JSON.stringify(SOAP));

                  case 1:
                  case "end":
                    return _context77.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log("🚀 ~ file: .js ~ line 3566 ~ = ~ err", err);
            var msg0 = "Please contact support, sageX3 response Error-line 3566";
            return res.redirect("/dashboard/".concat(msg0));
          }));

        case 39:
          _context79.t5 = _context79.sent;
          SOAPP = _context79.t4.parse.call(_context79.t4, _context79.t5);
          //PARSE XML RESPONSE FROM SOAP X3
          parser.parseString(SOAPP, function _callee76(err, result) {
            var i;
            return regeneratorRuntime.async(function _callee76$(_context78) {
              while (1) {
                switch (_context78.prev = _context78.next) {
                  case 0:
                    if (!(result["soapenv:Envelope"]["soapenv:Body"][0]["wss:runResponse"][0]["runReturn"][0]["status"][0]["_"] == "1")) {
                      _context78.next = 7;
                      break;
                    }

                    //IF STATUS RESPONSE IS 1, PUSH IN ARRAY STATUS FOR THAT INVOICE
                    statusSOAP.push({
                      status: result["soapenv:Envelope"]["soapenv:Body"][0]["wss:runResponse"][0]["runReturn"][0]["status"][0]["_"],
                      error: msgErroSOAP
                    });
                    console.log('Line 145');
                    console.log(statusSOAP);
                    return _context78.abrupt("return", statusSOAP);

                  case 7:
                    //IF STATUS RESPONSE IS 0, CHECK OUT THE MESSAGE RES FROM SOAP AND STORE IN ARRAY "msgErroSOAP"
                    for (i = 0; i < result["soapenv:Envelope"]["soapenv:Body"][0]["multiRef"].length; i++) {
                      msgErroSOAP.push(result["soapenv:Envelope"]["soapenv:Body"][0]["multiRef"][i]["message"][0]);
                    }

                    inVError.push(inv_detail.NUM); //STORE THE INVOICE IS IN ERROR

                    statusSOAP.push({
                      status: result["soapenv:Envelope"]["soapenv:Body"][0]["wss:runResponse"][0]["runReturn"][0]["status"][0]["_"],
                      error: msgErroSOAP,
                      invError: inVError
                    }); //STORE IN ARRAY: STATUS SOAP, MSG ERROR FROM X3, INVOICE NUM WITH ERROR

                    console.log(newSystemLog);
                    statusSOAP.push({
                      newSystemLog: newSystemLog
                    });

                  case 12:
                    return _context78.abrupt("return", statusSOAP);

                  case 13:
                  case "end":
                    return _context78.stop();
                }
              }
            });
          });
          console.log("ss : " + JSON.stringify(statusSOAP)); // IN CONSOLE CHECKOUT PAYMENT X3 SOAP STATUS RESPONSE

          console.log('--------------------');
          console.log(statusSOAP[0]['status']);
          extraida = JSON.stringify(statusSOAP[0]['error']).substring(0, 70); //SAVE IN SQL SYSTEM LOG, SOAP ERROR WITH THE MSG RESPONSE

          Description = "Resend SOAP ", Status = 1, Comment = extraida + "-Inv: " + INVOICENUM;
          _context79.next = 49;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 49:
          newSystemLog = _context79.sent;
          console.log(newSystemLog); //UPDATE INVOICE PAID IN SQL TABLE PAYMENT APPLICATION

          _context79.t6 = JSON;
          _context79.next = 54;
          return regeneratorRuntime.awrap(DataBaseSq.UpdPaymentApplication(inv_detail.NUM, tPaymentPmtKey, statusSOAP[0]['status'], newSystemLog));

        case 54:
          _context79.t7 = _context79.sent;
          paymentAplication = _context79.t6.parse.call(_context79.t6, _context79.t7);
          console.log(paymentAplication);
          res.send({
            statusx3: statusSOAP[0]['status'],
            error: statusSOAP[0]['error']
          });

        case 58:
        case "end":
          return _context79.stop();
      }
    }
  });
};
/**FUNCTION TO cancelPayment PAYMENTS DETAIL PAGE */


exports.cancelPayment = function _callee78(req, res) {
  var URI, user, SessionKeyLog, ip, count, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, _req$body13, tPaymentPmtKey, INVOICENUM, Payment, paymentAplication;

  return regeneratorRuntime.async(function _callee78$(_context80) {
    while (1) {
      switch (_context80.prev = _context80.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //USER INFO
          //SAVE SQL TABLE SYSTEMLOG

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          count = 1000;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Init cancelPayment", Status = 1, Comment = "FUNCTION: cancelPayment-line ";
          _context80.next = 8;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 8:
          SystemLogL = _context80.sent;
          console.log(req.body);
          _req$body13 = req.body, tPaymentPmtKey = _req$body13.tPaymentPmtKey, INVOICENUM = _req$body13.INVOICENUM;
          console.log('finalizePayment');
          _context80.t0 = JSON;
          _context80.next = 15;
          return regeneratorRuntime.awrap(DataBaseSq.Get_tPaymentsBypmtKey(tPaymentPmtKey));

        case 15:
          _context80.t1 = _context80.sent;
          Payment = _context80.t0.parse.call(_context80.t0, _context80.t1);
          console.log(Payment); //UPDATE INVOICE PAID IN SQL TABLE PAYMENT APPLICATION

          _context80.t2 = JSON;
          _context80.next = 21;
          return regeneratorRuntime.awrap(DataBaseSq.UpdPaymentApplication(INVOICENUM, tPaymentPmtKey, 2));

        case 21:
          _context80.t3 = _context80.sent;
          paymentAplication = _context80.t2.parse.call(_context80.t2, _context80.t3);
          console.log(paymentAplication);
          res.send({
            paymentAplication: paymentAplication
          });

        case 25:
        case "end":
          return _context80.stop();
      }
    }
  });
};
/**FUNCTION TO finalizePayment PAYMENTS DETAIL PAGE */


exports.finalizePayment = function _callee79(req, res) {
  var URI, user, SessionKeyLog, ip, count, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL, _req$body14, tPaymentPmtKey, INVOICENUM, Payment, newSystemLog, paymentAplication;

  return regeneratorRuntime.async(function _callee79$(_context81) {
    while (1) {
      switch (_context81.prev = _context81.next) {
        case 0:
          URI = URLHost + req.session.queryFolder + "/";
          user = res.locals.user["$resources"][0]; //USER INFO
          //SAVE SQL TABLE SYSTEMLOG

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          count = 1000;
          UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = "Init finalizePayment", Status = 1, Comment = "FUNCTION: finalizePayment-line ";
          _context81.next = 8;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 8:
          SystemLogL = _context81.sent;
          console.log(req.body);
          _req$body14 = req.body, tPaymentPmtKey = _req$body14.tPaymentPmtKey, INVOICENUM = _req$body14.INVOICENUM;
          console.log('finalizePayment');
          _context81.t0 = JSON;
          _context81.next = 15;
          return regeneratorRuntime.awrap(DataBaseSq.Get_tPaymentsBypmtKey(tPaymentPmtKey));

        case 15:
          _context81.t1 = _context81.sent;
          Payment = _context81.t0.parse.call(_context81.t0, _context81.t1);
          console.log(Payment);
          //SAVE IN SQL SYSTEM LOG, SOAP ERROR WITH THE MSG RESPONSE
          Description = "finalizePayment", Status = 1, Comment = "finalizePayment-Inv: " + INVOICENUM;
          _context81.next = 21;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 21:
          newSystemLog = _context81.sent;
          console.log(newSystemLog); //UPDATE INVOICE PAID IN SQL TABLE PAYMENT APPLICATION

          _context81.t2 = JSON;
          _context81.next = 26;
          return regeneratorRuntime.awrap(DataBaseSq.UpdPaymentApplication(INVOICENUM, tPaymentPmtKey, 1, newSystemLog));

        case 26:
          _context81.t3 = _context81.sent;
          paymentAplication = _context81.t2.parse.call(_context81.t2, _context81.t3);
          console.log(paymentAplication);
          res.send({
            paymentAplication: paymentAplication
          });

        case 30:
        case "end":
          return _context81.stop();
      }
    }
  });
};
/**FUNCTION TO save SystemLog */


exports.saveSystemLog = function _callee80(req, res) {
  var user, _req$body15, description, comment, SessionKeyLog, ip, UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment, SystemLogL;

  return regeneratorRuntime.async(function _callee80$(_context82) {
    while (1) {
      switch (_context82.prev = _context82.next) {
        case 0:
          user = res.locals.user["$resources"][0]; //USER INFO

          console.log('saveSystemLog line 3480:', req.body);
          _req$body15 = req.body, description = _req$body15.description, comment = _req$body15.comment;
          console.log("🚀 ~ file: dashboardController.js ~ line 3486 ~ exports.saveSystemLog= ~ comment", comment);
          console.log("🚀 ~ file: dashboardController.js ~ line 3486 ~ exports.saveSystemLog= ~ description", description); //SAVE SQL TABLE SYSTEMLOG

          SessionKeyLog = req.session.SessionLog;
          ip = req.connection.remoteAddress;
          UserID = user["EMAIL"].toString(), IPAddress = ip, LogTypeKey = 6, SessionKey = SessionKeyLog, Description = description, Status = 1, Comment = comment;
          _context82.next = 10;
          return regeneratorRuntime.awrap(DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment));

        case 10:
          SystemLogL = _context82.sent;
          console.log("🚀 ~ file: dashboardController.js ~ line 3486 ~ exports.saveSystemLog= ~ SystemLogL", SystemLogL);
          res.send({
            SystemLogL: SystemLogL
          });

        case 13:
        case "end":
          return _context82.stop();
      }
    }
  });
};