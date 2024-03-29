/**MODEL FOR CREATE AND MANIPULATE tSettings TABLE OF SQL */
const { DataTypes } = require('sequelize');
const db = require('../config/dbSequelize');
const tSettings = db.define('tSettings', {
	id: {
		type: DataTypes.INTEGER(),
		primaryKey: true,
		autoIncrement: true
	},
valueSett: {
		type: DataTypes.STRING(),
		allowNull: true,
	}, 
	colorBg: {
		type: DataTypes.STRING(150),
		allowNull: true,
	},
	colorText: {
		type: DataTypes.STRING(150),
		allowNull: true,
	},
	typeSett: {
		type: DataTypes.STRING(50),
		allowNull: true,
	},
  Status: {
		type: DataTypes.INTEGER(),
		allowNull: true,
	},
});
module.exports = tSettings;