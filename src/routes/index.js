const router = require('express').Router();
const userController = require('../controllers/userController');
const landingController = require('../controllers/landingController');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const mailCtrl = require('../controllers/mailCtrl');
const FileController = require('../models/upload');
const fileController = new FileController();

// Landing Page
router.get('/', landingController.showLandingPage);
router.get('/testR', userController.pruebaR);
// Iniciar sesión
router.get('/login', userController.formLogin);
router.get('/login/:token', userController.formLogin);
router.post('/login', userController.loginUser2);

// Cerrar Sesión
router.get('/close-session', userController.closeSesion);

// Crear cuenta
router.get('/register', userController.formCreateUser);
router.post('/register', userController.createUser);

// Set Password
router.get('/resetpassform/:email', userController.resetPasswordForm);
router.post('/resetpassform', userController.sendToken);
router.get('/forgot-pass', userController.formSearchAccount);
router.post('/new-pass-save', userController.updatePassword);
router.get('/send-token/:email/:token', mailCtrl.sendtokenResetPass)
router.get('/set-password/:token', userController.resetPasswordForm)

//dash
router.get('/dashboard', dashboardController.dashboard);
router.get('/dashboard/:email', authController.authenticatedUser, dashboardController.dashboard);
router.get('/dashboard/:email/:msg', authController.authenticatedUser, dashboardController.dashboard);
router.get('/close_invoices/:email', authController.authenticatedUser, dashboardController.close_invoices);
router.get('/invoiceO_detail/:inv_num', authController.authenticatedUser, dashboardController.inoviceO_detail);
router.get('/invoiceC_detail/:inv_num', authController.authenticatedUser, dashboardController.inoviceC_detail);

router.get('/next-page/:data', authController.authenticatedUser, dashboardController.next_page)

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

//upload-file and edit profile
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

//sysSettings
router.get('/sysSettings',authController.authenticatedUser, dashboardController.settingsPreview)
router.post('/saveSetting',authController.authenticatedUser, dashboardController.saveSetting)
router.post('/editSetting',authController.authenticatedUser, dashboardController.editSetting)
router.post('/saveEditSetting',authController.authenticatedUser, dashboardController.saveEditSetting)

module.exports = router;