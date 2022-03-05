                                                /**HERE ARE ALL ROUTES */                                                
const router = require('express').Router();//USE EXPRESS ROUTER
const userController = require('../controllers/userController');//LOGGIN AND REGISTER USER FUNCTIONS
const authController = require('../controllers/authController');//AUTH FUNCTIONS
const dashboardController = require('../controllers/dashboardController');//PRINCIPALS FUNCTIONS
const mailCtrl = require('../controllers/mailCtrl');//EMAIL FUNCTIONS (SEND EMAIL)
const FileController = require('../models/upload');//FUNCTION TO UPLOAD FILES
const fileController = new FileController();

// Landing Page LOGGIN
router.get('/', userController.formLogin);

// LOGGIN
router.get('/login', userController.formLogin);
router.get('/login/:token', userController.formLogin);
router.post('/login', userController.loginUser2);

// CLOSE SESSION
router.get('/close-session', userController.closeSesion);

// Set Password
router.get('/resetpassform/:email', userController.resetPasswordForm);
router.post('/resetpassform', userController.sendToken);
router.get('/forgot-pass', userController.formSearchAccount);
router.post('/new-pass-save', userController.updatePassword);
router.get('/send-token/:email/:token', mailCtrl.sendtokenResetPass)
router.get('/set-password/:token', userController.resetPasswordForm)

//OPEN INVOICES FUNCTIONS
router.get('/dashboard', dashboardController.dashboard);
router.get('/dashboard/:email', authController.authenticatedUser, dashboardController.dashboard);
router.get('/dashboard/:email/:msg', authController.authenticatedUser, dashboardController.dashboard);
router.get('/invoiceO_detail/:inv_num', authController.authenticatedUser, dashboardController.inoviceO_detail);

//CLOSED INVOICES FUNCTIONS
router.get('/close_invoices/:email', authController.authenticatedUser, dashboardController.close_invoices);
router.get('/invoiceC_detail/:inv_num', authController.authenticatedUser, dashboardController.inoviceC_detail);

//NEXT OR PREVIOUS FUNCTIONS
router.get('/open_invoices/p/:data', authController.authenticatedUser, dashboardController.next_pageIO)
router.get('/closed_invoices/p/:data', authController.authenticatedUser, dashboardController.next_pageIC)

//CONTACT US PAGE
router.get('/contactUs', authController.authenticatedUser, dashboardController.contactUs);

//PAYMENTS METHODS
router.get('/payments_methods/:email', authController.authenticatedUser, dashboardController.pay_methods);
router.post('/add_method_pay', authController.authenticatedUser, dashboardController.add_pay_methods);
router.post('/edit_apy_method', authController.authenticatedUser, dashboardController.edit_pay_methods);
router.get('/delete_payM/:IDPay', authController.authenticatedUser, dashboardController.delete_pay_methods);

//PAY INVOICES
router.post('/pay_invoices', authController.authenticatedUser, dashboardController.pay_invoices);
router.post('/process_payment', authController.authenticatedUser, dashboardController.process_payment);
router.post('/applied_amount', authController.authenticatedUser, dashboardController.applied_amount);
router.post('/process_paymentWF', authController.authenticatedUser, dashboardController.process_payment_WF);

//EDIT PROFILE -UPLOAD PIC PROFILE
router.post('/upload-file', fileController.uploadFile);
router.post('/save-pic-profile', authController.authenticatedUser, dashboardController.save_PicProfile);
router.post('/update-profile', authController.authenticatedUser, userController.UpdateUser);


//PRINTS
router.get('/print-invoice/:inv', authController.authenticatedUser, dashboardController.printInvoice);

//payments
router.get('/payments/:email', authController.authenticatedUser, dashboardController.payments);
router.get('/payment_view/:id', authController.authenticatedUser, dashboardController.payments_detail);

//Mails
router.get('/testmail', authController.authenticatedUser, mailCtrl.testSend);
router.post('/send_email_errorX3', authController.authenticatedUser, mailCtrl.errorPaymentX3);
router.post('/send_email_errorWF', authController.authenticatedUser, mailCtrl.errorPaymentWF);

//sysSettings
router.get('/sysSettings',authController.authenticatedUser, dashboardController.settingsPreview)
router.post('/saveSetting',authController.authenticatedUser, dashboardController.saveSetting)
router.post('/editSetting',authController.authenticatedUser, dashboardController.editSetting)
router.post('/saveEditSetting',authController.authenticatedUser, dashboardController.saveEditSetting)

module.exports = router;