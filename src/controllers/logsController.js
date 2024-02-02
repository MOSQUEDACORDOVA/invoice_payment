const fs = require("fs");
const path = require("path");
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
var http = require("https");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const {
  v4: uuidv4
} = require("uuid");
const { parse} = require("path");
require("dotenv").config();

/**FUNCTION TO RENDER OPEN INVOICES PAGE */
exports.logsView = async (req, res) => {
  let msg = false;
  var admin = false;
  if (req.params.msg) {
    msg = req.params.msg;
  }
  const user = res.locals.user["$resources"][0]; //User info
  const pictureProfile = res.locals.user["$resources"][1]["pic"]; //Pic Profile

  const SessionKeyLog = req.session.SessionLog; // SessionKey from SQL Table
  var ip = user["ipAddress"];
  let query_consulting = "&where=ID eq " + user["ID"].toString() + ""; //Clause where with email
  let where_filter_inv = "", //Prepare the var for consulting invoices
    count = 0;
  if (user["ROLE"] == 4) {
    //If User Role is 4 the Settings page is enabled
    admin = true;
  }
  //Declare and send log to SystemLo
  let UserID = user["ID"].toString(), IPAddress = ip, LogTypeKey = 5, SessionKey = SessionKeyLog, Description = "Logs View", Status = 1, Comment = "Enter LogView";
  await DataBasequerys.tSystemLog(user["EMAIL"].toString(), IPAddress, LogTypeKey, SessionKey, Description, Status, Comment);
  let banner = JSON.parse(await DataBaseSq.bannerSetting());
  let activeBanner =false
  if (banner.Status == 1) {
    activeBanner = true
  }
  //HERE RENDER PAGE AND INTRO INFO
  res.render("logs", {
    pageName: "Logs View",
    logsPage: true,
    menu: true,
    user,
    msg,
    pictureProfile,
    admin,banner,activeBanner
  });
};
exports.getLogsDataTable = async (req, res) => {
  let msg = false;
  var admin = false;
  if (req.params.msg) {
    msg = req.params.msg;
  }
  const user = res.locals.user["$resources"][0]; //User info
  let draw = req.query.draw;
    var start = req.query.start;
    var length = req.query.length;
    var order_data = req.query.order;

    if (typeof order_data == 'undefined') {
        var column_name = 'tlogKey';
        var column_sort_order = 'desc';
    } else {
        var column_index = req.query.order[0]['column'];
        var column_name = req.query.columns[column_index]['data'];
        var column_sort_order = req.query.order[0]['dir'];
    }
    //search data
    let columns = req.query.columns;
    let search_value = req.query.search['value'];
    let search_query = `tlogKey LIKE '%${search_value}%'`;

    for (let i = 0; i < columns.length; i++) {
        search_value = columns[i]['search']['value'];
        if (search_value != '') {
            search_query = `${columns[i]['data']} LIKE '%${search_value}%'`;
        }
    }
//     [tlogKey]
//     ,[LogDate]
//     ,[UserID]
//     ,[IPAddress]
//     ,[LogTypeKey]
//     ,[SessionKey]
//     ,[Description]
//     ,[Status]
//     ,[Comment]
// FROM [X3Connect].[dbo].[tSystemLog]
    let counter = ((await DataBasequerys.countTable('tSystemLog')));
    console.log("🚀 ~ file: logsController.js:102 ~ exports.getLogsDataTable= ~ counter:", counter)
    let counterWfilter = ((await DataBasequerys.countTableWfilter('tSystemLog',search_query)));
    console.log("🚀 ~ file: logsController.js:102 ~ exports.getLogsDataTable= ~ counter:", counterWfilter)
    let options = `*`

    let innerJoin = ``
    //search_query = `logs.id LIKE '%${search_value}%'`;
    let query = `
  SELECT ${options} FROM tSystemLog
  WHERE ${search_query}
  ORDER BY tlogKey ${column_sort_order} 
  OFFSET ${start} ROWS FETCH NEXT ${length} ROWS ONLY
  `;
    console.log("🚀 ~ file: logger.js:80 ~ getLogsDataTable ~ query:", query)

    let data_arr = [];

    let data = ((await DataBasequerys.dtQuery(query)));    
    var output = {
        'draw': parseInt(draw),
        'iTotalRecords': counter['total_count'],
        'iTotalDisplayRecords': counterWfilter['total_count'],
        'aaData': data
    };

    return res.send(output);
};
exports.getLogType = async (req, res) => {
  let msg = false;
  var admin = false;
  if (req.params.msg) {
    msg = req.params.msg;
  }
  const user = res.locals.user["$resources"][0]; //User info

    let data = ((await DataBasequerys.getLogTypeTable()));    

    return res.send(data);
};

