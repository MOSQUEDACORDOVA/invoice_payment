                                                /**HERE ARE ALL ROUTES */                                                
const router = require('express').Router();//USE EXPRESS ROUTER
const userController = require('../controllers/userController');//LOGGIN AND REGISTER USER FUNCTIONS
const authController = require('../controllers/authController');//AUTH FUNCTIONS
const dashboardController = require('../controllers/dashboardController');//PRINCIPALS FUNCTIONS
const logsController = require('../controllers/logsController');//PRINCIPALS FUNCTIONS
const mailCtrl = require('../controllers/mailCtrl');//EMAIL FUNCTIONS (SEND EMAIL)
const FileController = require('../models/upload');//FUNCTION TO UPLOAD FILES
const fileController = new FileController();
const certificateController = require('../controllers/certificateController')
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
router.get('/verify-email/:email', userController.verify_email);
router.get('/reset-pass-fine', userController.resetPassFine);

//OPEN INVOICES FUNCTIONS
router.get('/dashboard', authController.authenticatedUser, dashboardController.dashboard);
router.get('/dashboard/:msg', authController.authenticatedUser, dashboardController.dashboard);
router.get('/invoiceO_detail/:inv_num', authController.authenticatedUser, dashboardController.inoviceO_detail);
router.get('/open-invNext50', authController.authenticatedUser, dashboardController.openInvMore);
router.get('/searchOpenAPI/:filter/:search', authController.authenticatedUser, dashboardController.searchOpenInvO);
router.get('/searchCloseAPI/:filter/:search', authController.authenticatedUser, dashboardController.searchCloseInvC);

//PAYMENTS CONSULTING
router.get('/paymentsL', authController.authenticatedUser, dashboardController.paymentsL);

//CLOSED INVOICES FUNCTIONS
router.get('/close_invoices', authController.authenticatedUser, dashboardController.close_invoices);
router.get('/invoiceC_detail/:inv_num', authController.authenticatedUser, dashboardController.inoviceC_detail);

//NEXT OR PREVIOUS FUNCTIONS
router.get('/open_invoices/p/:data', authController.authenticatedUser, dashboardController.next_pageIO2)
router.get('/closed_invoices/p/:data', authController.authenticatedUser, dashboardController.next_pageIC2)

//CONTACT US PAGE
router.get('/contactUs', authController.authenticatedUser, dashboardController.contactUs);

//PAYMENTS METHODS
router.get('/payments_methods', authController.authenticatedUser, dashboardController.pay_methods);
router.post('/add_method_pay', authController.authenticatedUser, dashboardController.add_pay_methods);
router.post('/edit_apy_method', authController.authenticatedUser, dashboardController.edit_pay_methods);
router.get('/delete_payM/:IDPay', authController.authenticatedUser, dashboardController.delete_pay_methods);
router.get('/delete_payM/:IDPay/:IUUD', authController.authenticatedUser, dashboardController.delete_pay_methods);
router.get('/verify_PM/:IDPay/:amount1/:amount2', authController.authenticatedUser, dashboardController.verify_PM);

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
router.get('/print-paymentDetail/:id', authController.authenticatedUser, dashboardController.Print_payments_detail);

//payments
router.get('/payments', authController.authenticatedUser, dashboardController.payments);
router.get('/payment_view/:id', authController.authenticatedUser, dashboardController.payments_detail);
router.get('/status_payment_view/:id', authController.authenticatedUser, dashboardController.status_payments_detail);
router.post('/resendX3', authController.authenticatedUser, dashboardController.resendX3);
router.post('/finalizePayment', authController.authenticatedUser, dashboardController.finalizePayment);
router.post('/cancelPayment', authController.authenticatedUser, dashboardController.cancelPayment);

//Mails
router.get('/testmail', authController.authenticatedUser, mailCtrl.testSend);
router.post('/send_email_errorX3', authController.authenticatedUser, mailCtrl.errorPaymentX3);
router.post('/send_email_errorWF', authController.authenticatedUser, mailCtrl.errorPaymentWF);


//sysSettings
router.get('/sysSettings',authController.authenticatedUser, dashboardController.settingsPreview);
router.post('/saveSetting',authController.authenticatedUser, dashboardController.saveSetting);
router.post('/editSetting',authController.authenticatedUser, dashboardController.editSetting);
router.post('/saveEditSetting',authController.authenticatedUser, dashboardController.saveEditSetting);
router.post('/saveCert', authController.authenticatedUser, certificateController.saveCert);
router.post('/testValidate', authController.authenticatedUser, certificateController.testValidate);
router.post('/saveSystemLog', authController.authenticatedUser, dashboardController.saveSystemLog);

router.post('/saveEditBanner', authController.authenticatedUser, dashboardController.saveEditSettingBanner);

router.get('/changeCronServer',authController.authenticatedUser, dashboardController.changeCronServer);
router.get('/statusWFCheckAPI/:idp',authController.authenticatedUser, dashboardController.statusWFCheckAPI);
router.get('/PauseCustomerPaymentMethods',authController.authenticatedUser, dashboardController.PauseCustomerPaymentMethods);


//LogsView
router.get('/logsView',authController.authenticatedUser, logsController.logsView);
router.get('/getLogType',authController.authenticatedUser, logsController.getLogType);
router.get('/getLogsDataTable',authController.authenticatedUser, logsController.getLogsDataTable);


module.exports = router;