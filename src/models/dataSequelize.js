/**---------- */
/** IN THIS MODULE CREATED THE FUNCTIONS FOR MANIPULATE THE SQL TABLES WITH SEQUELIZE (CREATE, UPDATE, CONSULT OR DELETE) REGISTERS*/
/**--------- */
const { Op, where, Sequelize } = require("sequelize");
const tPayment = require("../models/tPayment");//tPayment Model, represent the Table tPayment in SQL
const tPaymentApplication = require("../models/tPaymentApplication");//tPaymentApplication Model, represent the Table tPaymentApplication in SQL
const tSettings = require("../models/tSettings");//tSettings Model, represent the Table tSettings in SQL
const tPaymentFraudProtection = require("../models/tPaymentFraudProtection");//tSettings Model, represent the Table tSettings in SQL

module.exports = {
  /**FUNCTIONS FOR PAYMENTS TABLE*/
  RegtPayment(PaymentStatus, CreateSessionKey, UserID, TransactionID, TranAmount, ProcessorKey, DateProcessesed, ProcessorTranID, ProcessorStatus, ProcessorStatusDesc, CCNo, CCExpDate, CCCV2, BilltoName, BillAddressLine1, BillPostalCode,userIDInv) { // THIS FUNCTION INSERT THE NEW PAYMENT IN tPayment TABLE
    return new Promise((resolve, reject) => {
      tPayment.create(
        {
          PaymentStatus: PaymentStatus, CreateSessionKey: CreateSessionKey, UserID: UserID, CustID: userIDInv,TransactionID: TransactionID, TranAmount: TranAmount, ProcessorKey: ProcessorKey, DateProcessesed: DateProcessesed, ProcessorTranID: ProcessorTranID, ProcessorStatus: ProcessorStatus, ProcessorStatusDesc: ProcessorStatusDesc, CCNo: CCNo, CCExpDate: CCExpDate, CCCV2: CCCV2, BilltoName: BilltoName, BillAddressLine1: BillAddressLine1, BillPostalCode: BillPostalCode})
        .then((data) => {
          let data_set = JSON.stringify(data);
          resolve(data_set);
        })
        .catch((err) => {
          reject(err)
        });
    });
  },
  Get_tPayments(CustID){ // SELECT ALL PAYMENTS BY CUSTID AND GET HER ASSOCIATION WITH PAYMENTAPLICATION
    return new Promise((resolve, reject) => {
      tPayment.findAll({where:{CustID: {
        [Op.like]: `%${CustID}%`}}, include:[
        {model: tPaymentApplication , as:'tPaymentApplication'},
      ],
      })
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },  
  Get_tPaymentsByUser(UserID){// SELECT ALL PAYMENTS BY USERID AND GET HER ASSOCIATION WITH PAYMENTAPLICATION
    return new Promise((resolve, reject) => {
      tPayment.findAll({where:{UserID: {
        [Op.like]: `%${UserID}%`}}, include:[
        {model: tPaymentApplication , as:'tPaymentApplication'},
      ],
      })
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },  
  Get_tPaymentsBypmtKey(pmtKey){// SELECT ONE PAYMENT BY PMTKEY AND GET HER ASSOCIATION WITH PAYMENTAPLICATION
    return new Promise((resolve, reject) => {
      tPayment.findOne({where:{pmtKey:pmtKey}, include:[
        {model: tPaymentApplication , as:'tPaymentApplication'},
      ],
      })
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  GetLastPaymenTIDWF(){// SELECT PAYMENTID LAST, WF
    return new Promise((resolve, reject) => {
      tPayment.findAll({attributes:['TransactionID','pmtKey'],limit: 1, where: {TransactionID:{[Op.like]: '%POR%'} },order: [ [ 'createdAt', 'DESC' ]]})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, 
  RegtPaymentWF(PaymentStatus, CreateSessionKey, UserID, TransactionID, TranAmount, ProcessorKey, DateProcessesed, ProcessorTranID, ProcessorStatus, ProcessorStatusDesc,ABA_routing,
    bank_account_number, userIDInv) { // THIS FUNCTION INSERT THE NEW PAYMENT IN tPayment TABLE FOR WELLS FARGO API
    return new Promise((resolve, reject) => {
      tPayment.create(
        {
          PaymentStatus: PaymentStatus, CreateSessionKey: CreateSessionKey, UserID: UserID, CustID: userIDInv,TransactionID: TransactionID, TranAmount: TranAmount, ProcessorKey: ProcessorKey, DateProcessesed: DateProcessesed, ProcessorTranID: ProcessorTranID, ProcessorStatus: ProcessorStatus, ProcessorStatusDesc: ProcessorStatusDesc, ABA_routing:ABA_routing, bank_account_number:bank_account_number})
        .then((data) => {
          let data_set = JSON.stringify(data);
          resolve(data_set);
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        });
    });
  },

  /**FUNCTIONS FOR PAYMENTSAPPLICATION TABLE*/
  RegtPaymentApplication(inv, amount, shortDesc, appliedAmount,pmtKey,status) {// THIS FUNCTION INSERT THE NEW PAYMENT IN tPaymentApplication TABLE
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

  /**FUNCTIONS FOR SETTINGS TABLE */
  settingsTable(){
    return new Promise((resolve, reject) => {// SELECT ALL SETTINGS
      tSettings.findAll({where:{typeSett:'email-Support'}})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
    bannerSetting(){
    return new Promise((resolve, reject) => {// SELECT ALL SETTINGS
      tSettings.findOne({where:{typeSett:'banner'}})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  saveSettingBanner(sValue, sType, sTatus,colorBg, colorText){//INSERT SETTING IN THE SETTING TABLE
    return new Promise((resolve, reject) => {
      tSettings.create({valueSett:sValue,
        typeSett: sType,
        Status:   sTatus,colorBg:colorBg,colorText:colorText})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  EditSettingBanner(bannerText, status,colorBg, colorText, bannerKey){// SAVE SETTING EDITED
    return new Promise((resolve, reject) => {
      tSettings.update({valueSett:bannerText,
        Status:   status,colorBg:colorBg,colorText:colorText}, {where:{id:bannerKey}})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  settingsTableTypeEnvProduction(){
    return new Promise((resolve, reject) => {// SELECT ALL SETTINGS
      tSettings.findOne({where:{typeSett:'Env'}})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  settingsgateway(){
    return new Promise((resolve, reject) => {// SELECT ALL SETTINGS
      tSettings.findAll({where:{[Op.or]: [
        {typeSett:'gatewayCompanyId'},{typeSett:'gatewayEntity'},{typeSett:'consumerKey'},{typeSett:'consumerSecret'},{typeSett:'hostLink'},{typeSett:'bank_id'},{typeSett:'bank_account_number'},{typeSett:'bank_id_FP'},{typeSett:'bank_account_number_FP'},{typeSett:'PauseCustomerPaymentMethods'}
      ] },order: [ [ 'id', 'ASC' ]]})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  settingsqueryFolder(){
    return new Promise((resolve, reject) => {// SELECT ALL SETTINGS
      tSettings.findOne({attributes:['valueSett'],where:{typeSett:'queryFolder'} })
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  saveSetting(sValue, sType, sTatus){//INSERT SETTING IN THE SETTING TABLE
    return new Promise((resolve, reject) => {
      tSettings.create({valueSett:sValue,
        typeSett: sType,
        Status:   sTatus})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  editSetting(sId){//GET SETTING BY ID TO EDIT
    return new Promise((resolve, reject) => {
      tSettings.findOne({where: {id: sId}})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  saveEditSetting(sValue, sType, sStatus,sId){// SAVE SETTING EDITED
    return new Promise((resolve, reject) => {
      tSettings.update({valueSett:sValue,
        typeSett: sType,
        Status:   sStatus}, {where:{id:sId}})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  selectEnableEmail(){// SELECT ENABLED SETTING EMAIL, FOR EMAIL CONTROLLER
    return new Promise((resolve, reject) => {
      tSettings.findAll({attributes:['valueSett'], where: {typeSett: "email-Support"}})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },

  /**FUNCTIONS FOR FRAUD PROTECTION */

  tPaymentFraudProtectionSave(PaymentStatus, CreateSessionKey, UserID, TransactionID, TranAmount, ProcessorKey, DateProcessesed, ProcessorTranID, ProcessorStatus, ProcessorStatusDesc,PaymentMethodID,X3UUID,Observation,FundsMovement) { // THIS FUNCTION INSERT THE NEW PAYMENT IN tPayment TABLE FOR WELLS FARGO API
    return new Promise((resolve, reject) => {
      tPaymentFraudProtection.create(
        {
          PaymentStatus: PaymentStatus, CreateSessionKey: CreateSessionKey, UserID: UserID,TransactionID: TransactionID, TranAmount: TranAmount, ProcessorKey: ProcessorKey, DateProcessesed: DateProcessesed, ProcessorTranID: ProcessorTranID, ProcessorStatus: ProcessorStatus, ProcessorStatusDesc: ProcessorStatusDesc, PaymentMethodID:PaymentMethodID,X3UUID:X3UUID ,Observation:Observation,FundsMovement:FundsMovement})
        .then((data) => {
          let data_set = JSON.stringify(data);
          resolve(data_set);
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        });
    });
  },
  GetLastPaymenTIDFraudP(){// SELECT PAYMENTID LAST, WF
    return new Promise((resolve, reject) => {
      tPaymentFraudProtection.findAll({attributes:['TransactionID','pmtKey'],limit: 1, where: {TransactionID:{[Op.like]: '%FP%'} },order: [ [ 'createdAt', 'DESC' ]]})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, 
verifyPaymentMethodID(PaymentMethodID,UserID){// SELECT PAYMENTID LAST, WF
    return new Promise((resolve, reject) => {//{X3UUID:PaymentMethodID, UserID: UserID,PaymentStatus:1},
      tPaymentFraudProtection.findAll({where: {[Op.or]: [
        {PaymentMethodID:PaymentMethodID, UserID: UserID,PaymentStatus:1}
      ] },order: [ [ 'createdAt', 'ASC' ]]})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  verifyPaymentMethodIDProcess(PaymentMethodID,UserID){// SELECT PAYMENTID LAST, WF
    return new Promise((resolve, reject) => {
      tPaymentFraudProtection.findOne({where: {PaymentStatus:1,PaymentMethodID:PaymentMethodID, UserID: UserID,ProcessorStatus: 'PENDING'},order: [ [ 'createdAt', 'DESC' ]]})
        .then((response) => {
          let data_p = JSON.stringify(response);
          resolve(data_p);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
saveFraudProtectionSave(ProcessorTranID, ProcessorStatus, ProcessorStatusDesc,paymentKey, observation) { // THIS FUNCTION INSERT THE NEW PAYMENT IN tPayment TABLE FOR WELLS FARGO API
    return new Promise((resolve, reject) => {
      tPaymentFraudProtection.update(
        { ProcessorTranID: ProcessorTranID, ProcessorStatus: ProcessorStatus, ProcessorStatusDesc: ProcessorStatusDesc,Observation:observation},{where:{pmtKey:paymentKey}})
        .then((data) => {
          let data_set = JSON.stringify(data);
          resolve(data_set);
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        });
    });
  },
  saveFraudProtectionSaveFundsReturned(FundsReturned, Observation, paymentKey,FundsMovement) { // THIS FUNCTION INSERT THE NEW PAYMENT IN tPayment TABLE FOR WELLS FARGO API
    return new Promise((resolve, reject) => {
      tPaymentFraudProtection.update(
        { FundsReturned: FundsReturned, Observation:Observation,FundsMovement:FundsMovement},{where:{pmtKey:paymentKey}})
        .then((data) => {
          let data_set = JSON.stringify(data);
          resolve(data_set);
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        });
    });
  },
  deletePaymentMethod(PaymentMethodID,UserID) { // THIS FUNCTION INSERT THE NEW PAYMENT IN tPayment TABLE FOR WELLS FARGO API
    return new Promise((resolve, reject) => {
      tPaymentFraudProtection.update({ PaymentStatus: 0},{where:{PaymentMethodID:PaymentMethodID,UserID:UserID,PaymentStatus:1}})
        .then((data) => {
          let data_set = JSON.stringify(data);
          resolve(data_set);
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        });
    });
  },

    /**FUNCTION TO UPDATE PAYMENTSAPPLICATION TABLE*/
    UpdPaymentApplication(inv, pmtKey,status,SystemLogL) {// THIS FUNCTION INSERT THE NEW PAYMENT IN tPaymentApplication TABLE
      return new Promise((resolve, reject) => {
        tPaymentApplication.update(
          {Status: status,tlogKey:SystemLogL}, {where:{INVOICENUM:inv,tPaymentPmtKey: pmtKey}})
          .then((data) => {
            let data_set = JSON.stringify(data);
            resolve(data_set);
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          });
      });
    },
};
