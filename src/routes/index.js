const router = require('express').Router();
const userController = require('../controllers/userController');
const landingController = require('../controllers/landingController');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
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
router.post('/new-pass-save', userController.updatePassword);

//dash
router.get('/dashboard', dashboardController.dashboard);
router.get('/dashboard/:email',authController.authenticatedUser, dashboardController.dashboard);
router.get('/close_invoices/:email',authController.authenticatedUser, dashboardController.close_invoices);
router.get('/invoiceO_detail/:inv_num',authController.authenticatedUser, dashboardController.inoviceO_detail);
router.get('/invoiceC_detail/:inv_num',authController.authenticatedUser, dashboardController.inoviceC_detail);

//PAYMENTS METHODS
router.get('/payments_methods/:email',authController.authenticatedUser, dashboardController.pay_methods);


module.exports = router;