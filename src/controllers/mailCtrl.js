/**This script is for send Email, use nodemailer librery */
const nodemailer = require("nodemailer");
var DataBaseSq = require('../models/dataSequelize')
let fs = require("fs");
//With this configurate the email server SMTP
var transporter = nodemailer.createTransport({
  host: '192.168.0.8',
  port: 25,
  secure: false,
  auth: {
    user: '',
    pass: '',
  }
});

/**FUNCTION TO TEST EMAIL SEND */
exports.testSend = async function (req, res) {

  // Definimos el email
  var mailOptions = {
    from: "portal@riboliwines.com",
    to: 'josearzolay287@gmail.com',
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
  //Send email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send(500, err.message);
    } else {
      console.log(info);
      console.log("Email sent fine");
      res.status(200).jsonp(info);
    }
  });
};

/**FUNCTION TO SEND EMAIL WHEN SOAP X3 RESPONSE ERROR */
exports.errorPaymentX3 = async function (req, res) {

  const { SystemLogNum, paymenKey, UserID, paymentx3SMessage, invError } = req.body;
  let email = JSON.parse(await DataBaseSq.selectEnableEmail())//Get emails of support, from setting system
  //Create array whit emails
  let mails = []
  for (let i = 0; i < email.length; i++) {
    mails.push(email[i]['valueSett'])
  }
  // Email options
  var mailOptions = {
    from: "portal@riboliwines.com",
    to: mails,
    subject: "Error Save Payment SOAP- UserID: " + UserID,
    text: `The user: ${UserID} made a successful payment, but the SOAP returned the following error: Error msg: ${paymentx3SMessage},Invoice Error: ${invError},tSystemLog Num: ${SystemLogNum},paymenKey: ${paymenKey}`,
    html: `
    <html>
      <head>	
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500;1,600" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"  /> 
      </head>
      <body style="font-family: 'Poppins', sans-serif; font-size: 1.4em;">      
      <p>The user: ${UserID} made a successful payment, but the SOAP returned the following error:</p>
      <p>Error msg: ${paymentx3SMessage},</p>
      <p>Invoice Error: ${invError},</p>
     <p> tSystemLog Num: ${SystemLogNum},</p>
      <p>paymenKey: ${paymenKey}</p>        
      </body>  
    </html>`
  };
  // Send email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send(500, err.message);
    } else {
      console.log("Email sent fine");
      res.status(200).jsonp(info);
    }
  });
};

/**FUNCTION TO SEND EMAIL WHEN WF API RESPONSE ERROR */
exports.errorPaymentWF = async function (req, res) {

  const { SystemLogNum, paymenKey, UserID, error_code, errorDesc } = req.body;
  let email = JSON.parse(await DataBaseSq.selectEnableEmail())//Get emails of support, from setting system
  //Create array whit emails
  let mails = []
  for (let i = 0; i < email.length; i++) {
    mails.push(email[i]['valueSett'])
  }
  // Email options
  var mailOptions = {
    from: "portal@riboliwines.com",
    to: mails,
    subject: "Error Save Payment SOAP- UserID: " + UserID,
    text: `The user: ${UserID} made a successful payment, but the API WELLS FARGO returned the following error: error_code: ${error_code},errorDesc: ${errorDesc},tSystemLog Num: ${SystemLogNum},paymenKey: ${paymenKey}`,
    html: `
    <html>
      <head>	
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500;1,600" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"  /> 
      </head>
      <body style="font-family: 'Poppins', sans-serif; font-size: 1.4em;">      
      <p>The user: ${UserID} made a successful payment, but the API WELLS FARGO  returned the following error:</p>
      <p>Error code: ${error_code},</p>
      <p>Error Description: ${errorDesc},</p>
     <p> tSystemLog Num: ${SystemLogNum},</p>
      <p>paymenKey: ${paymenKey}</p>        
      </body>  
    </html>`
  };
  // Send email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send(500, err.message);
    } else {
      console.log("Email sent fine");
      res.status(200).jsonp(info);
    }
  });
};

/**FUNCTION TO SEND TOKEN FOR RESET PASSWORD */
exports.sendtokenResetPass = async function (req, res) {
  var mail = req.params.email; //Email of form reset password page
  var token = req.params.token;// token generated by function "sendToken" in userController
  const resetUrl = `http://${req.headers.host}/set-password/${token}`;// URL for reset password


   // Email options
  var mailOptions = {
    from: "portal@riboliwines.com",
    to: mail,
    subject: "Reset Password",
    text: `There was a request to change your password!
      
    If you did not make this request then please ignore this email.
    
    Otherwise, please click this link to change your password: <a href="${resetUrl}">Click Here! `,
    html: `
    <html>
      <head>	
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500;1,600" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"  /> 
      </head>
      <body style="font-family: 'Poppins', sans-serif; font-size: 1.4em;">
      
      <p>Hi,

      There was a request to change your password!
      
      If you did not make this request then please ignore this email.
      
      Otherwise, please click this link to change your password: <a href="${resetUrl}">Click Here!</a></p>
        
      </body>
  
    </html>`
  };
  // Enviamos el email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send(500, error.message);
    } else {
      console.log(info);
      console.log("Email sent fine");
      res.status(200).jsonp(info);
    }
  });
};