var Connection = require('tedious').Connection;  
const db = require('../config/db')
  
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  
const bcrypt = require("bcrypt-nodejs");
var moment = require('moment-timezone');

module.exports = {
  //USER LOG
  tSessionLog( UserID, LogonTypeKey) {
    return new Promise((resolve, reject) => {
      var connection = new Connection(db);
      connection.on('connect', async function(err) {  
        // If no error, then good to proceed.
        var SessionKey
      var request = new Request("INSERT INTO tSessionLog ( UserID, StartDateTime, LogonTypeKey) VALUES (@UserID, CURRENT_TIMESTAMP, @LogonTypeKey) SELECT @@IDENTITY;", function(err, response) {  
        if (err) {  
           console.log(err);
          // reject(err)
          } 
       });  
       //request.addParameter('SessionKey', TYPES.Int, SessionKey);  
       request.addParameter('UserID', TYPES.NVarChar , UserID);  
       request.addParameter('LogonTypeKey', TYPES.Int, LogonTypeKey);
       request.on('row', function(columns) { 
        columns.forEach(function(column) {  
          if (column.value === null) {  
            console.log('NULL');  
          } else {  
            SessionKey = column.value

          }  
        });  
    });
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
          resolve (SessionKey) 
          connection.close();
      });
      connection.execSql(request); 
    });
    connection.connect();
  });
  },
  tSystemLog( UserID,  IPAddress, LogTypeKey,  SessionKey,  Description,  Status, Comment) {

    return new Promise((resolve, reject) => {
      var connection = new Connection(db);
      connection.on('connect', function(err) {  
        // If no error, then good to proceed.
        var SessionKey
      var request = new Request("INSERT INTO tSystemLog ( LogDate,IPAddress, UserID,  LogTypeKey,  SessionKey,  Description,  Status, Comment) VALUES (CURRENT_TIMESTAMP,@IPAddress,@UserID,@LogTypeKey, @SessionKey, @Description, @Status, @Comment) SELECT @@IDENTITY;;", function(err, response) {  
        if (err) {  
           console.log(err);}  
           //reject(err)
       });  
       //request.addParameter('tlogKey', TYPES.Int, tlogKey);  
       request.addParameter('UserID', TYPES.NVarChar , UserID);  
       request.addParameter('IPAddress', TYPES.NVarChar, IPAddress);
       request.addParameter('LogTypeKey', TYPES.Int, LogTypeKey);  
       request.addParameter('SessionKey', TYPES.Int , SessionKey);  
       request.addParameter('Description', TYPES.NVarChar, Description);
       request.addParameter('Status', TYPES.Int , Status);  
       request.addParameter('Comment', TYPES.NVarChar, Comment);
       request.on('row', function(columns) { 
        columns.forEach(function(column) {  
          if (column.value === null) {  
            console.log('NULL');  
          } else {  
            SessionKey = column.value

          }  
        });  
    });
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
          resolve (SessionKey) 
          connection.close();
      });
      connection.execSql(request); 
    });
    connection.connect();
  });
  },
  tPaymentApplication( inv, amount, shortDesc, appliedAmount) {

    return new Promise((resolve, reject) => {
      var connection = new Connection(db);
      var pmtKey
      connection.on('connect', function(err) {  
        // If no error, then good to proceed.
      var request = new Request("INSERT INTO tPaymentApplication ( INVOICENUM, OpenAmount, AppliedAmount,ShortDescription) VALUES (@INVOICENUM, @OpenAmount, @AppliedAmount,@ShortDescription) SELECT @@IDENTITY;", function(err, response) {  
        if (err) {  
           console.log(err);}  
           //reject(err)
       }); 
       //request.addParameter('tlogKey', TYPES.Int, tlogKey);  
       request.addParameter('INVOICENUM', TYPES.NVarChar , inv);  
       request.addParameter('OpenAmount', TYPES.Decimal, amount);
       request.addParameter('AppliedAmount', TYPES.Decimal, appliedAmount);  
       request.addParameter('ShortDescription', TYPES.NVarChar , shortDesc); 
       request.on('row', function(columns) { 
        columns.forEach(function(column) {  
          if (column.value === null) {  
            console.log('NULL');  
          } else {  
            pmtKey = column.value  
          }  
        });  
    }); 
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
          resolve (pmtKey) 
          connection.close();
      });
      connection.execSql(request); 
    });
    connection.connect();
  });
  },
  tPayment( PaymentStatus, CreateSessionKey, UserID, TransactionID, TranAmount, ProcessorKey, DateProcessesed, ProcessorTranID, ProcessorStatus, ProcessorStatusDesc, CCNo, CCExpDate, CCCV2, BilltoName, BillAddressLine1, BillPostalCode) {

    return new Promise((resolve, reject) => {
      var connection = new Connection(db);
      var pmtKey
      connection.on('connect', function(err) {  
        // If no error, then good to proceed.
      var request = new Request("INSERT INTO tPayment (PaymentStatus, CreateSessionKey, CreateDate, UserID, CustID, TransactionID, TranAmount, ProcessorKey, DateProcessesed, ProcessorTranID, ProcessorStatus, ProcessorStatusDesc, CCNo, CCExpDate, CCCV2, BilltoName, BillAddressLine1, BillPostalCode) VALUES (@PaymentStatus, @CreateSessionKey, CURRENT_TIMESTAMP, @UserID, @CustID, @TransactionID, @TranAmount, @ProcessorKey, @DateProcessesed, @ProcessorTranID, @ProcessorStatus, @ProcessorStatusDesc, @CCNo, @CCExpDate, @CCCV2, @BilltoName, @BillAddressLine1, @BillPostalCode) SELECT @@IDENTITY;", function(err, response) {  
        if (err) {  
           console.log(err);}  
           //reject(err)
       }); 
       //request.addParameter('tlogKey', TYPES.Int, tlogKey);  
       request.addParameter('PaymentStatus', TYPES.Int , PaymentStatus); 
       request.addParameter('CreateSessionKey', TYPES.Int , CreateSessionKey); 
       request.addParameter('UserID', TYPES.NVarChar , UserID); 
       request.addParameter('CustID', TYPES.NVarChar , null); 
       request.addParameter('TransactionID', TYPES.NVarChar , TransactionID); 
       request.addParameter('TranAmount', TYPES.Decimal , TranAmount); 
       request.addParameter('ProcessorKey', TYPES.Int , ProcessorKey); 
       request.addParameter('DateProcessesed', TYPES.Date , DateProcessesed); 
       request.addParameter('ProcessorTranID', TYPES.NVarChar , ProcessorTranID); 
       request.addParameter('ProcessorStatus', TYPES.NVarChar , ProcessorStatus);
        request.addParameter('ProcessorStatusDesc', TYPES.NVarChar , ProcessorStatusDesc);
       request.addParameter('CCNo', TYPES.NVarChar , CCNo); 
       request.addParameter('CCExpDate', TYPES.NVarChar , CCExpDate); 
       request.addParameter('CCCV2', TYPES.NVarChar , CCCV2); 
       request.addParameter('BilltoName', TYPES.NVarChar , BilltoName); 
       request.addParameter('BillAddressLine1', TYPES.NVarChar , BillAddressLine1); 
       request.addParameter('BillPostalCode', TYPES.NVarChar , BillPostalCode);

       request.on('row', function(columns) { 
        columns.forEach(function(column) {  
          if (column.value === null) {  
            console.log('NULL');  
          } else {  
            pmtKey = column.value
          }  
        });  
    }); 
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
          resolve (pmtKey) 
          connection.close();
      });
      connection.execSql(request); 
    });
    connection.connect();
  });
  },
  uploadPicProfile( email, picture, type) {
      return new Promise((resolve, reject) => {
        var connection = new Connection(db);
        var id
        connection.on('connect', function(err) {  
          // If no error, then good to proceed.
          var request
if (type == 'insert') {
  request = new Request("INSERT INTO tPicProfile (email, picture) VALUES (@email, @picture) SELECT @@IDENTITY;", function(err, response) {  
          if (err) {  
             console.log(err);}  
             //reject(err)
         }); 
} else {
  request = new Request("UPDATE tPicProfile SET picture = @picture WHERE email = @email;", function(err, response) {  
    if (err) {  
       console.log(err);}  
       //reject(err)
   }); 
}
        

         //request.addParameter('tlogKey', TYPES.Int, tlogKey);  
         request.addParameter('email', TYPES.VarChar , email); 
         request.addParameter('picture', TYPES.VarChar , picture);  
  
         request.on('row', function(columns) { 
          columns.forEach(function(column) {  
            if (column.value === null) {  
              console.log('NULL');  
            } else {  
              id = column.value 
            }  
          });  
      }); 
          // Close the connection after the final event emitted by the request, after the callback passes
          request.on("requestCompleted", function (rowCount, more) {
            resolve (id) 
            connection.close();
        });
        connection.execSql(request); 
      });
      connection.connect();
    });
    },
    consultingPicProfile( email) {
      return new Promise((resolve, reject) => {
        var connection = new Connection(db);
        var id
        connection.on('connect', function(err) {  
          // If no error, then good to proceed.
          
        var request = new Request(`SELECT [picture] FROM [X3Connect].[dbo].[tPicProfile] WHERE email = '${email}'`, function(err, response) {  
          if (err) {  
             console.log(err);}  
             //reject(err)
         }); 
         var result = "";  
         request.on('row', function(columns) {  
             columns.forEach(function(column) {  
               if (column.value === null) {  
                 console.log('NULL');  
               } else {  
                 result+= column.value + " ";  
               }  
             });   
             //result ="";  
         });  
   
         request.on('done', function(rowCount, more) {  
         });  
          // Close the connection after the final event emitted by the request, after the callback passes
          request.on("requestCompleted", function (rowCount, more) {
            resolve (result) 
            connection.close();
        });
        connection.execSql(request); 
      });
      connection.connect();
    });
    },
};
