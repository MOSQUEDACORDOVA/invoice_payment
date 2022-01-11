const fs = require("fs");
const path = require("path");
const request = require("request-promise");
const URI = 'https://sawoffice.technolify.com:8443/api1/x3/erp/SAWTEST1/'
var moment = require('moment-timezone');

exports.dashboard = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  console.log(user)
  let query_consulting= "&where=EMAIL eq '"+ req.params.email +"'"
  let where_filter_inv= "", count =0

    if (user['ROLE'] == 4) {
      count = 100
    } else {
      count = 1000
      const maping_login = JSON.parse(await request({
        uri: URI + 'YPORTALBPS?representation=YPORTALBPS.$query&count=1000'+ query_consulting,
        method:'GET',
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
        
      where_filter_inv= "&where=BPCINV eq '"+maping_login['$resources'][0]['BPCNUM'] +"' "
  
    for (let i = 1; i < maping_login['$resources'].length; i++) {
        where_filter_inv +="or BPCINV eq '" + maping_login['$resources'][i]['BPCNUM']+ "' "      
      }
    }
    request({
      uri: URI + 'YPORTALINV?representation=YPORTALINVO.$query&count='+count+" "+ where_filter_inv,
      method:'GET',
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
        },
      json: true, // Para que lo decodifique automáticamente 
    }).then(inv_wofilter => {// GET INVOICES
    let  inv_filtering = JSON.stringify(inv_wofilter['$resources'])
    inv_wofilter = inv_wofilter['$resources']

    //HERE RENDER PAGE AND INTRO INFO
  res.render("open_invoices", {
    pageName: "Open Invoices",
    dashboardPage: true,
    menu:true,
    invoiceO:true,
    user,
    inv_wofilter,inv_filtering
  });


  });
  
};

exports.close_invoices = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  console.log(user)
  let query_consulting= "&where=EMAIL eq '"+ req.params.email +"'"
  let where_filter_inv= "", count =0

    if (user['ROLE'] == 3 || user['ROLE'] == 4) {
      count = 100
    } else {
      count = 1000
      const maping_login = JSON.parse(await request({
        uri: URI + `YPORTALBPS?representation=YPORTALBPS.$query&count=10000`+ query_consulting,
        method:'GET',
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
        
      where_filter_inv= "&where=BPCINV eq '"+maping_login['$resources'][0]['BPCNUM'] +"' "
    for (let i = 1; i < maping_login['$resources'].length; i++) {
        where_filter_inv +="or BPCINV eq '" + maping_login['$resources'][i]['BPCNUM']+ "' "      
      }
    }

    request({
      uri: URI + 'YPORTALINV?representation=YPORTALINVC.$query&count='+count+" "+ where_filter_inv,
      method:'GET',
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
        },
      json: true, // Para que lo decodifique automáticamente 
    }).then(inv_wofilter => {// GET INVOICES
    let  inv_filtering = JSON.stringify(inv_wofilter['$resources'])
    inv_wofilter = inv_wofilter['$resources']

    //HERE RENDER PAGE AND INTRO INFO
  res.render("open_invoices", {
    pageName: "Closed Invoices",
    dashboardPage: true,
    menu:true,
    invoiceC:true,
    user,
    inv_wofilter,inv_filtering
  });


  });
  
};

exports.inoviceO_detail = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  console.log(user)
  let inv_num= req.params.inv_num

    request({
      uri: URI + `YPORTALINVD('${inv_num}')?representation=YPORTALINVD.$details`,
      method:'GET',
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
        },
      json: true, // Para que lo decodifique automáticamente 
    }).then(inv_detail => {// GET INVOICES

    //HERE RENDER PAGE AND INTRO INFO
  res.render("detail_invoice", {
    pageName: "Details " + inv_num,
    dashboardPage: true,
    menu:true,
    invoiceO:true,
    user,inv_detail
  });


  });
  
};
exports.inoviceC_detail = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  console.log(user)
  let inv_num= req.params.inv_num

    request({
      uri: URI + `YPORTALINVD('${inv_num}')?representation=YPORTALINVD.$details`,
      method:'GET',
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
        },
      json: true, // Para que lo decodifique automáticamente 
    }).then(inv_detail => {// GET INVOICES
    console.log(inv_detail)

    //HERE RENDER PAGE AND INTRO INFO
  res.render("detail_invoice", {
    pageName: "Details " + inv_num,
    dashboardPage: true,
    menu:true,
    invoiceC:true,
    user,inv_detail
  });


  });
  
};

exports.pay_methods = async (req, res) => {
  const user = res.locals.user['$resources'][0];
  console.log(user)
  let query_consulting= "&where=EMAIL eq '"+ req.params.email +"'"
  let count =1000

    request({
      uri: URI + 'YPORTALPAY?representation=YPORTALPAY.$query&count='+count+" "+ query_consulting,
      method:'GET',
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
        },
      json: true, // Para que lo decodifique automáticamente 
    }).then(pay_methods => {// GET INVOICES

     pay_methods = pay_methods['$resources']
console.log(pay_methods)

    //HERE RENDER PAGE AND INTRO INFO
  res.render("payments_methods", {
    pageName: "Payments Methods",
    dashboardPage: true,
    menu:true,
    pay_methods:true,
    user,
    pay_methods,
  });


  });
  
};