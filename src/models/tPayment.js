/**MODEL FOR CREATE AND MANIPULATE tPayment TABLE OF SQL */
const { DataTypes } = require('sequelize');
const db = require('../config/dbSequelize');
const tPaymentApplication = require ('./tPaymentApplication')

const tPayment = db.define('tPayment', {
	pmtKey: {
		type: DataTypes.INTEGER(),
		primaryKey: true,
		autoIncrement: true
	},
	PaymentStatus: {
		type: DataTypes.INTEGER(),
		allowNull: true,
	},
	CreateSessionKey: {
		type: DataTypes.INTEGER(),
		allowNull: true,
	},
	UserID: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	CustID: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	TransactionID: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	TranAmount: {
		type: DataTypes.FLOAT(),
		allowNull: true,
	},
	ProcessorKey: {
		type: DataTypes.INTEGER(),
		allowNull: true,
	},
	DateProcessesed: {
		type: DataTypes.DATEONLY(),
		allowNull: true,
	},
	ProcessorTranID: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	ProcessorStatus: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	ProcessorStatusDesc: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	CCNo: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	CCExpDate: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	CCCV2: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	BilltoName: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	BillAddressLine1: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	BillPostalCode: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	X3StatusCode: {
		type: DataTypes.INTEGER(),
		allowNull: true,
	},
	X3StatusDesc: {
		type: DataTypes.STRING(1000),
		allowNull: true,
	},
	X3PAYMENTNUM: {
		type: DataTypes.STRING(50),
		allowNull: true,
	},
});
//WHEN CONSULT TABLE GET THE "tPayment" TABLE INFO
tPayment.hasMany(tPaymentApplication, {as: 'tPaymentApplication'})//THIS IS FOR ASSOCIATE THIS TABLE WITH "tPayment" TABLE OF SQL (ONE PAYMENT HAS MANY PAYMENTS APPLICATION)

module.exports = tPayment;