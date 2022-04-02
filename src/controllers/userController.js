const passport = require("passport");//THIS MODULE USE FOR AUTHENTICATE SESSION
const crypto = require("crypto");//THIS MODULE USE TO ENCRYPT OR DECRYPT
const request = require("request-promise");
var queryFolder = 'SAWTEST1' //Name the query folder X3
var URI = `https://sawoffice.technolify.com:8443/api1/x3/erp/${queryFolder}/`; //URI query link 
var DataBasequerys = require('../models/data');// Functions for X3 querys
const { encrypt, decrypt } = require('./crypto');

/** FUNCTION TO RENDER LOGGIN PAGE */
exports.formLogin = async (req, res) => {
  let error = false
  if (req.session.errorLogin) {
    error = req.session.errorLogin;
  }
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
  //USE PASSPORT TO AUTHENTICATE
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      
      req.flash("error", info.message)
      req.session.errorLogin = req.flash()
      return res.redirect("/login");
    }
    req.logIn(user, async function (err) {
      if (err) {
        return next(err);
      }
      // user['$resources'] = [{ EMAIL: 'cescarsega1@gmail.com', ROLE: 1 }] //ONLY FOR TEST, ERASER LATER
      //CONSULTING PIC PROFILE FROM SQL TABLE
      var consultingPic = await DataBasequerys.consultingPicProfile(user['$resources'][0]['EMAIL'])
      if (consultingPic) {
        user['$resources'].push({ pic: consultingPic })
      } else {
        user['$resources'].push({ pic: 'pic_pr.png' })//THIS IS GENERIC PICTURE
      }

      var ip = req.connection.remoteAddress;
      if (user['$resources'] == "") {
        //IF USER DON'T EXIST RETURN TO LOGGIN AND SHOW MSG
        req.flash("error", `User don't exist`)
        req.session.errorLogin = req.flash()
        return res.redirect('/login')
      }

      //SAVE SQL TABLE SESSIONLOG
      const SessionLog = await DataBasequerys.tSessionLog(user['$resources'][0]['EMAIL'], user['$resources'][0]['ROLE'])

      req.session.SessionLog = SessionLog //STORE IN SESSION THE SESSION LOG ID TO USE IN SYSTEMLOG SQL

      //SAVE SQL LOGSYSTEM
      let UserID = user['$resources'][0]['EMAIL'], IPAddress = ip, LogTypeKey = 1, SessionKey = SessionLog, Description = "LOGGIN SUCCESS", Status = 1, Comment = "Function: loginUser2- line 64";
      const SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)   
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
  // CHECK OUT IF USER EXIST
  const { email } = req.body;

  const User = JSON.parse(await request({
    uri: URI + `YPORTALUSR?representation=YPORTALUSR.$query&count=10000&where=EMAIL eq '${email}'`,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
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
      'Accept': '*/*',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
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
  let token = req.params.token
  //Check out if token is validate in X3 Loggin query
  const usuario = await request({
    uri: URI + `YPORTALUSR?representation=YPORTALUSR.$query&count=10000&where=TOKEN eq '${token}'`,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
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

  let password_new, email, token, query_consulting

  password_new = encrypt(req.body.password);// Encrypt password
  email = req.body.email
  query_consulting = `YPORTALUSR('${email}')?representation=YPORTALUSR.$edit`
  // Save new password
  let save_pass = JSON.parse(await request({
    uri: URI + query_consulting,
    method: 'PUT',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
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
  req.session.errorLogin = req.flash("error", "Your password changed successfully");
  return res.redirect("/reset-pass-fine");
};

/**FUNCTION TO CLOSE SESSION */
exports.closeSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

/** FUNCTION TO UPDATER USER INFO */
exports.UpdateUser = async (req, res) => {
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
      'Accept': '*/*',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
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

