const passport = require("passport");//THIS MODULE USE FOR AUTHENTICATE SESSION
const crypto = require("crypto");//THIS MODULE USE TO ENCRYPT OR DECRYPT
const request = require("request-promise");
var queryFolder = 'SAWTEST1' //Name the query folder X3
var URLHost = `https://sawoffice.technolify.com:8443/api1/x3/erp/`; //URI query link 
var DataBasequerys = require('../models/data');// Functions for X3 querys
var DataBaseSq = require("../models/dataSequelize"); // Functions for SQL querys with sequelize
const { encrypt, decrypt } = require('./crypto');
const ecoSys = require('../../ecosystem.config');
const axios = require('axios');

/** FUNCTION TO RENDER LOGGIN PAGE */
exports.formLogin = async (req, res) => {
  let error = false
  if (req.session.errorLogin) {
    error = req.session.errorLogin;
  }
  console.log(ecoSys.apps[0].env)
  res.render("login", {
    pageName: "Login",
    layout: "page-form",
    login: true,
    error,
    messages: error
  });
};
/**FUNCTION TO RENDER verify_email US PAGE */
exports.verify_email = async (req, res) => {
  var mail = req.params.email; //Email of form reset password page
  res.render("verify-email", {
    pageName: "Thanks",
    layout: "page-form",
    verify_email: true,
    mail
  });
};
/**FUNCTION TO RENDER CONTACT US PAGE */
exports.resetPassFine = async (req, res) => {
  //var mail = req.params.email; //Email of form reset password page
  res.render("post-reset-pass", {
    pageName: "Reset Pass Fine",
    layout: "page-form",
    postResetPass: true,
    // mail
  });
};
/**FUNCTION TO LOGGIN USER */
exports.loginUser2 = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  //USE PASSPORT TO AUTHENTICATE
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {

      req.flash("error", info.message)
      req.session.errorLogin = req.flash();
      return res.redirect("/login");
    }
    req.logIn(user, async function (err) {
      if (err) {
        return next(err);
      }
      // user['$resources'] = [{ EMAIL: 'cescarsega1@gmail.com', ROLE: 1 }] //ONLY FOR TEST, ERASER LATER
      //CONSULTING PIC PROFILE FROM SQL TABLE
      var consultingPic = await DataBasequerys.consultingPicProfile(user['$resources'][0]['EMAIL'])
      const response = await axios.get('https://api.ipify.org?format=json');
      const data = response.data;
      const ipAddress = data.ip;
      if (consultingPic) {
        user['$resources'].push({ pic: consultingPic })
      } else {
        user['$resources'].push({ pic: 'pic_pr.png' })//THIS IS GENERIC PICTURE
      }

      var ip = ipAddress;
      if (user['$resources'] == "") {
        //IF USER DON'T EXIST RETURN TO LOGGIN AND SHOW MSG
        req.flash("error", `User don't exist`)
        req.session.errorLogin = req.flash()
        return res.redirect('/login')
      }

      console.log('userlinea 79', user['$resources'][0]);
      //SAVE SQL TABLE SESSIONLOG
      const SessionLog = await DataBasequerys.tSessionLog(user['$resources'][0]['EMAIL'], user['$resources'][0]['ROLE'])

      req.session.SessionLog = SessionLog //STORE IN SESSION THE SESSION LOG ID TO USE IN SYSTEMLOG SQL
      console.log(SessionLog)
      //SAVE SQL LOGSYSTEM
      let UserID = user['$resources'][0]['EMAIL'], IPAddress = ip, LogTypeKey = 1, SessionKey = SessionLog, Description = "LOGGIN", Status = 1, Comment = "Success";
      const SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)

      //Checkout menu option state
      const PauseCustomerPaymentMethods = JSON.parse(await DataBaseSq.settingsgateway());
      console.log('line 92 user constroller login', PauseCustomerPaymentMethods[9]['valueSett'])
      user['$resources'][0].PauseCustomerPMethods = PauseCustomerPaymentMethods[9]['valueSett']
      user['$resources'][0].ipAddress = ipAddress
      res.redirect('/dashboard')//REDIRECT TO OPEN INVOICES PAGE
    });
  })(req, res);
};


/**FUNCTION TO RENDER SEARCH ACCOUNT PAGE */
exports.formSearchAccount = (req, res) => {
  res.render("search-account", {
    pageName: "Buscar Cuenta",
    layout: "page-form",
  });

};

/**FUNCTION SEND TOKEN BY EMAIL IF USER INFOR IS OK */
exports.sendToken = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  // CHECK OUT IF USER EXIST
  const { email } = req.body;

  const User = JSON.parse(await request({
    uri: URI + `YPORTALUSR?representation=YPORTALUSR.$query&count=10000&where=EMAIL eq '${email}'`,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      Connection: 'close',
      'Accept': 'application/json',
      'Authorization': "Basic " +req.session.Authorization_X3,
    },
    json: true,
  }).then((response) => {
    return JSON.stringify(response)
  }))

  //IF USER DON'T EXIST, RETURN AND SHOW MSG
  if (!User['$resources'][0]) {
    req.session.errorLogin = req.flash("error", "Account does not exist");
    return res.redirect("/forgot-pass");
  }

  // IF USER EXIST , CREATE TOKEN AND SAVE IN X3
  let token = crypto.randomBytes(20).toString("hex");
  let expiration = Date.now() + 3600000;

  query_consulting = `YPORTALUSR('${email}')?representation=YPORTALUSR.$edit`

  let save_token = JSON.parse(await request({
    uri: URI + query_consulting,
    method: 'PUT',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      Connection: 'close',
      'Accept': '*/*',
      'Authorization': "Basic " +req.session.Authorization_X3,
    },
    body: {
      "TOKEN": token,
    },
    json: true,
  }).then(saved => {
    return JSON.stringify(saved)
  }))

  //CREATE THE URL WITH TOKEN AND SEND BY EMAIL
  const resetUrl = `https://${req.headers.host}/set-password/${token}`;
  console.log(resetUrl)
  res.redirect(`/send-token/${email}/${token}`);

};

/**FUNCTION TO RENDER RESET PASS PAGE- CHECK OUT TOKEN */
exports.resetPasswordForm = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  let token = req.params.token
  //Check out if token is validate in X3 Loggin query
  const usuario = await request({
    uri: URI + `YPORTALUSR?representation=YPORTALUSR.$query&count=10000&where=TOKEN eq '${token}'`,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      Connection: 'close',
      'Accept': 'application/json',
      'Authorization': "Basic " +req.session.Authorization_X3,
    },
    json: true,
  })

  if (!usuario['$resources'][0]) {
    //if token not exist
    req.session.errorLogin = req.flash("error", "Account not exist or token is not validate");
    return res.redirect("/forgot-pass");
  }
  let email = usuario['$resources'][0]['EMAIL']
  // Render reset password page
  res.render("reset-password", {
    pageName: "Set Password",
    layout: "page-form",
    email
  });
};

/**FUNCTION TO SAVE NEW PASSWORD */
exports.updatePassword = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";
  let password_new, email, token, query_consulting
  if (req.body.currentpassword) {
    let currentpassword = req.body.currentpassword
    let user = res.locals.user["$resources"][0];
    const getuser = await request({
      uri: URI + "YPORTALUSR?representation=YPORTALUSR.$query&count=10000&where=EMAIL eq '" + user.EMAIL + "'",
      method: 'GET',
      insecure: true,
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/json',
        Connection: 'close',
        'Accept': 'application/json',
        'Authorization': "Basic " +req.session.Authorization_X3,
      },
      json: true,
    })
    let decryptPass = decrypt(getuser['$resources'][0]['PASS'])
    if (currentpassword !== decryptPass) {
      return res.send({ status: 0, message: 'Current Password wrong' });
    }
  }
  password_new = encrypt(req.body.password);// Encrypt password
  if (req.body.currentpassword) {
    let user = res.locals.user["$resources"][0];
    email = user.EMAIL
  } else {
    email = req.body.email
  }

  query_consulting = `YPORTALUSR('${email}')?representation=YPORTALUSR.$edit`
  // Save new password
  let save_pass = JSON.parse(await request({
    uri: URI + query_consulting,
    method: 'PUT',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      Connection: 'close',
      'Accept': '*/*',
      'Authorization': "Basic " +req.session.Authorization_X3,
    },
    body: {
      "PASS": password_new,
      "TOKEN": "",
    },
    json: true,
  }).then(saved => {
    return JSON.stringify(saved)
  }))
  console.log(save_pass)
  if (req.body.currentpassword) {
    return res.send({ status: 1, message: 'Current Password was changed, please loggin again with the new password' });
  } else {
    req.session.errorLogin = req.flash("error", "Your password changed successfully");
    return res.redirect("/reset-pass-fine");
  }

};

/**FUNCTION TO CLOSE SESSION */
exports.closeSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

/** FUNCTION TO UPDATER USER INFO */
exports.UpdateUser = async (req, res) => {
  let URI = URLHost + req.session.queryFolder + "/";

  const user = res.locals.user['$resources'][0]
  email = user.EMAIL
  query_consulting = `YPORTALUSR('${email}')?representation=YPORTALUSR.$edit`

  const { lastName_edit_profile, firstName_edit_profile } = req.body
  //SAVE FNAME AND LNAME IN X3
  let user_info = JSON.parse(await request({
    uri: URI + query_consulting,
    method: 'PUT',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      Connection: 'close',
      'Accept': '*/*',
      'Authorization': "Basic " +req.session.Authorization_X3,
    },
    body: {
      "FNAME": firstName_edit_profile,
      "LNAME": lastName_edit_profile
    },
    json: true,
  }).then(saved => {
    return JSON.stringify(saved)
  }))
  //UPDATE CURRENT SESSION INFO
  res.locals.user['$resources'][0]['FNAME'] = firstName_edit_profile
  res.locals.user['$resources'][0]['LNAME'] = lastName_edit_profile

  res.send({ user_info })
};

