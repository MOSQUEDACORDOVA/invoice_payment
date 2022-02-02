const nodemailer = require("nodemailer");
var DataBaseSq = require('../models/dataSequelize')
let fs = require("fs");
// email sender function

exports.testSend = async function (req, res) {
    //const {email} = req.body;
    //var token = req.params.mail;
   // var mail = req.params.mail;
   // var token = req.params.token;
   // const resetUrl = `http://${req.headers.host}/loginverify27/${token}`;
   let email = JSON.parse(await DataBaseSq.selectEnableEmail())

   console.log(email)
   let mails =[]
   for (let i = 0; i < email.length; i++) {
     mails.push(email[i]['valueSett'])
   }
   console.log(mails)
   return
    // Definimos el transporter
    var transporter = nodemailer.createTransport({
      host: '192.168.0.8',
      port: 25,
      secure: false,
      auth: {
          user: '',
          pass: '',
      }
    });
    // Definimos el email
    var mailOptions = {
      from: "portal@riboliwines.com",
      to: 'christian@aciconsulting.com; josearzolay287@gmail.com',
      subject: "Welcome to ",
      text: "Welcome to  ",
      html: `
      <html>
        <head>	
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500;1,600" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"  /> 
        </head>
        <body style="font-family: 'Poppins', sans-serif; font-size: 1.4em;">
        Welcome to
          
        </body>
    
      </html>`
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        let msg = "Error al enviar Mensaje";
        console.log(msg)
        //res.redirect("/error404/PYT-27");
        res.send(500, err.message);
      } else {
console.log(info);
        console.log("Email sent fine");
        let msg =
          "Se envio un email, para validar y confirmar su cuenta";
        //res.redirect("/emailregsend/PYT-27/"+emailUser);
  
        res.status(200).jsonp(info);
      }
    });
};

exports.errorPaymentX3 = async function (req, res) {
  console.log(req.body)
  const {SystemLogNum, paymenKey, UserID,paymentx3SMessage} = req.body;
  //var token = req.params.mail;
 // var mail = req.params.mail;
 // var token = req.params.token;
 // const resetUrl = `http://${req.headers.host}/loginverify27/${token}`;
 let email = JSON.parse(await DataBaseSq.selectEnableEmail())

 console.log(email)
 let mails =[]
 for (let i = 0; i < email.length; i++) {
   mails.push(email[i]['valueSett'])
 }
 console.log(mails)
  // Transporter
  var transporter = nodemailer.createTransport({
    host: '192.168.0.8',
    port: 25,
    secure: false,
    auth: {
        user: '',
        pass: '',
    }
  });
  // Email options
  var mailOptions = {
    from: "portal@riboliwines.com",
    to: mails,
    subject: "Error Save Payment SOAP- UserID: " + UserID,
    text: "Welcome to  ",
    html: `
    <html>
      <head>	
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500;1,600" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"  /> 
      </head>
      <body style="font-family: 'Poppins', sans-serif; font-size: 1.4em;">
      
      <p>The user: ${UserID} made a successful payment, but the SOAP returned the following error:</p>
      <p>Error msg: ${paymentx3SMessage},</p>
     <p> tSystemLog Num: ${SystemLogNum},</p>
      <p>paymenKey: ${paymenKey}</p>
        
      </body>
  
    </html>`
  };
  // Enviamos el email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      let msg = "Error al enviar Mensaje";
      console.log(msg)
      //res.redirect("/error404/PYT-27");
      res.send(500, err.message);
    } else {
console.log(info);
      console.log("Email sent fine");
      let msg =
        "Se envio un email, para validar y confirmar su cuenta";
      //res.redirect("/emailregsend/PYT-27/"+emailUser);

      res.status(200).jsonp(info);
    }
  });
};