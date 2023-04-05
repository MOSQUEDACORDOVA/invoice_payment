/**MODEL FOR CREATE AND MANIPULATE tPayment TABLE OF SQL */
const { DataTypes } = require('sequelize');
const db = require('../config/dbSequelize');

const tPaymentFraudProtection = db.define('tPaymentFraudProtection', {
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
		type: DataTypes.INTEGER(),
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
	PaymentMethodID:{
		type: DataTypes.INTEGER,
		allowNull: true
	},
	FundsReturned:{
		type: DataTypes.INTEGER,
		allowNull: true,
		defaultValue: 0
	},
	X3UUID:{
		type: DataTypes.STRING(500),
		allowNull: true
	},
	FundsMovement:{
		type: DataTypes.STRING(10),
		allowNull: true
	},
	Observation:{
		type: DataTypes.TEXT,
		allowNull: true
	}
});

module.exports = tPaymentFraudProtection;