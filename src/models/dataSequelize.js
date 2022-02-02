const { Op, where, Sequelize } = require("sequelize");
const db = require("../config/dbSequelize");
const tPayment = require("../models/tPayment");
const tPaymentApplication = require("../models/tPaymentApplication");
const tSettings = require("../models/tSettings");
var moment = require('moment-timezone');

module.exports = {
  //USUARIO
  RegtPayment(PaymentStatus, CreateSessionKey, UserID, TransactionID, TranAmount, ProcessorKey, DateProcessesed, ProcessorTranID, ProcessorStatus, ProcessorStatusDesc, CCNo, CCExpDate, CCCV2, BilltoName, BillAddressLine1, BillPostalCode) {
    return new Promise((resolve, reject) => {
      tPayment.create(
        {
          PaymentStatus: PaymentStatus, CreateSessionKey: CreateSessionKey, UserID: UserID, TransactionID: TransactionID, TranAmount: TranAmount, ProcessorKey: ProcessorKey, DateProcessesed: DateProcessesed, ProcessorTranID: ProcessorTranID, ProcessorStatus: ProcessorStatus, ProcessorStatusDesc: ProcessorStatusDesc, CCNo: CCNo, CCExpDate: CCExpDate, CCCV2: CCCV2, BilltoName: BilltoName, BillAddressLine1: BillAddressLine1, BillPostalCode: BillPostalCode})
        .then((data) => {
          let data_set = JSON.stringify(data);
          resolve(data_set);
          //console.log(planes);
        })
        .catch((err) => {
          reject(err)
        });
    });
  },
  Get_tPayments(email){
    return new Promise((resolve, reject) => {
      tPayment.findAll({where:{UserID:email}, include:[
        {model: tPaymentApplication , as:'tPaymentApplication'},
      ],
      })
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
          ////console.log(id_usuario);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },  

  RegtPaymentApplication(inv, amount, shortDesc, appliedAmount,pmtKey,status) {
    return new Promise((resolve, reject) => {
      tPaymentApplication.create(
        {
          INVOICENUM:inv, OpenAmount:amount, AppliedAmount:appliedAmount,ShortDescription:shortDesc, tPaymentPmtKey: pmtKey, Status: status})
        .then((data) => {
          let data_set = JSON.stringify(data);
          resolve(data_set);
        })
        .catch((err) => {
          console.log(error)
          reject(err)
        });
    });
  },

  //settings
  settingsTable(){
    return new Promise((resolve, reject) => {
      tSettings.findAll({})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
          ////console.log(id_usuario);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  saveSetting(sValue, sType, sTatus){
    return new Promise((resolve, reject) => {
      tSettings.create({valueSett:sValue,
        typeSett: sType,
        Status:   sTatus})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
          ////console.log(id_usuario);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  editSetting(sId){
    return new Promise((resolve, reject) => {
      tSettings.findOne({where: {id: sId}})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
          ////console.log(id_usuario);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  saveEditSetting(sValue, sType, sStatus,sId){
    return new Promise((resolve, reject) => {
      tSettings.update({valueSett:sValue,
        typeSett: sType,
        Status:   sStatus}, {where:{id:sId}})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
          ////console.log(id_usuario);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  selectEnableEmail(){
    return new Promise((resolve, reject) => {
      tSettings.findAll({attributes:['valueSett'], where: {typeSett: "email-Support"}})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
          ////console.log(id_usuario);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
};
