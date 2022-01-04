const fs = require("fs");
const path = require("path");
const request = require("request");
var moment = require('moment-timezone');
var pdf = require('html-pdf');

exports.dashboard = (req, res) => {
  const user = res.locals.user;

  console.log(user);
  res.render("dashboard", {
    pageName: "Home",
    dashboardPage: true,
    menu:true,
    user,
  });
};

