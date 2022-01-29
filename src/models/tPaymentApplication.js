const { DataTypes } = require('sequelize');
const db = require('../config/dbSequelize');
const tPaymentApplication = db.define('tPaymentApplication', {
	pmtKey: {
		type: DataTypes.INTEGER(),
		primaryKey: true,
		autoIncrement: true
	},
	INVOICENUM: {
		type: DataTypes.STRING(50),
		allowNull: true,
	},
	OpenAmount: {
		type: DataTypes.FLOAT(),
		allowNull: true,
	},
	AppliedAmount: {
		type: DataTypes.FLOAT(),
		allowNull: true,
	},
	ShortDescription: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
  Status: {
		type: DataTypes.STRING(50),
		allowNull: true,
	},
});
module.exports = tPaymentApplication;