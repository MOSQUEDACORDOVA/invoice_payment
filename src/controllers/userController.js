const passport = require("passport");
const router = require("express").Router();
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt-nodejs");
const Op = Sequelize.Op;
const crypto = require("crypto");
const moment = require('moment-timezone');
const request = require("request-promise");
const URI = 'https://sawoffice.technolify.com:8443/api1/x3/erp/SAWTEST1/'
var DataBasequerys = require('../models/data');
const { encrypt, decrypt } = require('./crypto');
// Formulario de inicio de sesión
exports.formLogin = async (req, res) => {
  let error = false

  if (req.session.errorLogin) {
    error = req.session.errorLogin;
    console.log(error)
  }
  console.log(error)
  res.render("login", {
    pageName: "Login",
    layout: "page-form",
    login: true,
    error,
    messages: error
  });
};


// Iniciar sesión
exports.loginUser = passport.authenticate("local", {
  successRedirect: "/home",
  // successRedirect: "/dashboard",
  failureRedirect: "/login",
  failureFlash: true,
  badRequestMessage: "Testing",
});

exports.loginUser2 = async (req, res) => {
  console.log(req.body);
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log(info.message)
      req.flash("error", info.message)
      req.session.errorLogin = req.flash()
      return res.redirect("/login");
    }
    req.logIn(user, async function (err) {
      if (err) {
        return next(err);
      }
     // user['$resources'] = [{ EMAIL: 'cescarsega1@gmail.com', ROLE: 1 }] //ONLY FOR TEST, ERASER LATER
     var consultingPic = await  DataBasequerys.consultingPicProfile(user['$resources'][0]['EMAIL'])
     if (consultingPic) {
      user['$resources'].push({pic: consultingPic})
    }else{
      user['$resources'].push({pic: 'pic_pr.png'})
    }
     
      var ip = req.connection.remoteAddress;
      if (user['$resources'] == "") {
        req.flash("error", `User don't exist`)
        req.session.errorLogin = req.flash()
        return res.redirect('/login')
      }

      const SessionLog = await DataBasequerys.tSessionLog(user['$resources'][0]['EMAIL'], user['$resources'][0]['ROLE'])

      req.session.SessionLog = SessionLog
      let UserID = user['$resources'][0]['EMAIL'], IPAddress = ip, LogTypeKey = 1, SessionKey = SessionLog, Description = "Hello World", Status = 1, Comment = "test comment";
      const SystemLogLogin = await DataBasequerys.tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment)
      //console.log(SystemLogLogin)      

      res.redirect('/dashboard/' + req.body.email)
    });
  })(req, res);
};

// Formulario de registro
exports.formCreateUser = (req, res) => {
  res.render("register", {
    pageName: "Registrate",
    layout: "page-form",
  });
};

// Crear usuario en la base de datos
exports.createUser = async (req, res) => {
  const { name, lastName, email, password, confirmPassword } = req.body;
  var hoy = moment()
  // La contraseña y cofirmar contraseña no son iguales
  if (password !== confirmPassword) {
    req.flash("error", "Las contraseñas no son iguales");

    return res.render("register", {
      pageName: "Registrate",
      layout: "page-form",
      messages: req.flash(),
    });
  }
  try {
    await Usuarios.create({
      name,
      lastName,
      email,
      password,
      desde: hoy,
      hasta: hoy
    });

    // res.redirect("/mailBienvenida/"+email);
  } catch (err) {
    console.log(err);
    if (err.errors) {
      req.flash(
        "error",
        err.errors.map((error) => error.message)
      );
    } else {
      req.flash("error", "Error desconocido");
    }
    res.render("register", {
      pageName: "Registrate",
      layout: "page-form",
      messages: req.flash(),
    });
  }

  const usuario = await Usuarios.findOne({ where: { email } });

  if (!usuario) {

    req.flash("error", "No existe esa cuenta");
    console.log("error")
    //res.redirect("/search-account");
  }

  // Usuario existe
  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiration = Date.now() + 3600000;

  // Guardarlos en la BD
  await usuario.save();
  const resetUrl = `https://${req.headers.host}/login/${usuario.token}`;
  res.redirect("/mailBienvenida/" + email + "/" + usuario.token);
  console.log(resetUrl);
  //res.redirect("/resetpass/" + usuario.token + "/" + email);
};

// Formulario de buscar cuenta
exports.formSearchAccount = (req, res) => {

  res.render("search-account", {
    pageName: "Buscar Cuenta",
    layout: "page-form",
  });

};
exports.formSearchAccountToken = (req, res) => {

  res.render("search-account", {
    pageName: "Buscar Cuenta",
    layout: "page-form",
    token: true
  });

};


// Enviar token si el usuario es valido
exports.sendToken = async (req, res) => {
  // verificar si el usuario existe
  const { email } = req.body;
  
  const usuario = JSON.parse(await request({
    uri: URI + `YPORTALUSR?representation=YPORTALUSR.$query&count=10000&where=EMAIL eq '${email}'`,
    method:'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
      },
    json: true, // Para que lo decodifique automáticamente 
    }).then((response)=>{
console.log(response)
return JSON.stringify(response)
    })
    )
console.log(usuario['$resources'][0])

  if (!usuario['$resources'][0]) {
    req.session.errorLogin = req.flash("error", "Account does not exist");
  return  res.redirect("/forgot-pass");
  }

  // Usuario existe
  let token = crypto.randomBytes(20).toString("hex");
  let expiration = Date.now() + 3600000;

  query_consulting = `YPORTALUSR('${email}')?representation=YPORTALUSR.$edit`
  // usuario.token = null;
  // usuario.expiration = null;

  
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
       "TOKEN": token,
     },
     json: true,  //Para que lo decodifique automáticamente 
   }).then(saved => {//
     console.log(saved.body)
     return JSON.stringify(saved)
   }))
  

  const resetUrl = `https://${req.headers.host}/set-password/${token}`;
  console.log(resetUrl);
  //res.redirect("/resetpassform/"+ email);
  res.redirect(`/send-token/${email}/${token}`);
  
};


exports.resetPasswordForm = async (req, res) => {
  let token = req.params.token
  const usuario = await request({
    uri: URI + `YPORTALUSR?representation=YPORTALUSR.$query&count=10000&where=TOKEN eq '${token}'`,
    method:'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
      },
    json: true, // Para que lo decodifique automáticamente 
    })
console.log(usuario['$resources'][0])
  if (!usuario['$resources'][0]) {
    req.session.errorLogin = req.flash("error", "Account not exist or token is not validate");
   return res.redirect("/forgot-pass");
  }
  //let email = req.params.email
  let email = usuario['$resources'][0]['EMAIL']
  // Formulario para generar password
  res.render("reset-password", {
    pageName: "Set Password",
    layout: "page-form",
    email
  });
};

// change password
exports.updatePassword = async (req, res) => {
  // Verifica token y fecha de expiracion-
  // const usuario = await Usuarios.findOne({
  //   where: {
  //     token: req.params.token,
  //     expiration: {
  //       [Op.gte]: Date.now(),
  //     },
  //   },
  // });

  // if (!usuario) {
  //   req.flash("error", "No valido");
  //   res.redirect("search-account");
  // }
  let password_new, email, token, query_consulting
  // Hashear el password
  password_new =encrypt(req.body.password);
  email = req.body.email
  query_consulting = `YPORTALUSR('${email}')?representation=YPORTALUSR.$edit`
  // usuario.token = null;
  // usuario.expiration = null;

  // Guardamos el nuevo password
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
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(saved => { //Get the mapping loggin
    return JSON.stringify(saved)
  }))
  console.log(save_pass)
  req.session.errorLogin = req.flash("error", "Your password changed successfully");
 return res.redirect("/login");
};

// Cerrar sesión
exports.closeSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

// Update user profile
exports.UpdateUser = async (req, res) => {
  const user = res.locals.user['$resources'][0]
  email = user.EMAIL
  query_consulting = `YPORTALUSR('${email}')?representation=YPORTALUSR.$edit`
  
  const {lastName_edit_profile, firstName_edit_profile} = req.body
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
      "FNAME": firstName_edit_profile,
      "LNAME": lastName_edit_profile
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(saved => { //Get the mapping loggin
    return JSON.stringify(saved)
  }))
  console.log(save_pass)
  console.log(user)
  res.locals.user['$resources'][0]['FNAME']=firstName_edit_profile
  res.locals.user['$resources'][0]['LNAME']=lastName_edit_profile
  res.send({save_pass})
};

exports.upload = function (req, res) {
  res.render("upload", {
    title: "ejemplo de subida de imagen por HispaBigData",
  });
};

exports.pruebaR = (req, res) => {

  //const {nombre,  telefono, email, descripcion} = req.body
  const options = {
    hostname: 'https://sawoffice.technolify.com:8443/api1/x3/erp/{{FOLDER}}/YPORTALUSR?representation=YPORTALUSR.$query&count=10000',
    method: 'GET'
  }
  let query_consulting = "&where=EMAIL eq 'cescarsega1@gmail.com'"
  request({
    uri: URI + 'YPORTALUSR?representation=YPORTALUSR.$query&count=10000' + query_consulting,
    method: 'GET',
    insecure: true,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic UE9SVEFMREVWOns1SEE3dmYsTkFqUW8zKWY=',
    },
    json: true, // Para que lo decodifique automáticamente 
  }).then(usuarios => {
    console.log(usuarios)
    res.send(usuarios)
  });

};
