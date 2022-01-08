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
  
    if (user['ROLE'] == 3 || user['ROLE'] == 4) {
      count = 100
    } else {
      count = 1000
      const maping_login = JSON.parse(await request({
        uri: URI + 'YPORTALBPS?representation=YPORTALBPS.$query&count=10000'+ query_consulting,
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
        
        console.log(maping_login)
      where_filter_inv= "&where=BPCINV eq '"+maping_login['$resources'][0]['BPCNUM'] +"' "
    console.log(maping_login['$resources'].length)
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
    pageName: "Home",
    dashboardPage: true,
    menu:true,
    invoice:true,
    user,
    inv_wofilter,inv_filtering
  });


  });
  
};

