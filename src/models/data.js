/** CONNECT  SQL SERVER WITH TEDIOS MODULE */
/** THIS MODULE IS FOR EXISTING TABLES */
var Connection = require('tedious').Connection;
const db = require('../config/db')// DATABASE CONFIGURATION CREDENTIAL AND CONNECT  
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;  //TYPES OF SQL

module.exports = {
  //INSERT USER LOG SESSION TABLE
  tSessionLog(UserID, LogonTypeKey) {
    return new Promise((resolve, reject) => {
      var connection = new Connection(db);
      connection.on('connect', async function (err) {
        // If no error, then good to proceed.
        var SessionKey
        var request = new Request("INSERT INTO tSessionLog ( UserID, StartDateTime, LogonTypeKey) VALUES (@UserID, CURRENT_TIMESTAMP, @LogonTypeKey) SELECT @@IDENTITY;", function (err, response) {
          if (err) {
            console.log(err);
          }
        });
        request.addParameter('UserID', TYPES.NVarChar, UserID);
        request.addParameter('LogonTypeKey', TYPES.Int, LogonTypeKey);
        request.on('row', function (columns) {
          columns.forEach(function (column) {
            if (column.value === null) {
              console.log('NULL');
            } else {
              SessionKey = column.value

            }
          });
        });
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
          resolve(SessionKey) //RETURN SESSION KEY GENERATED
          connection.close();
        });
        connection.execSql(request);
      });
      connection.connect();
    });
  },
  //INSERT INTO SYSTEM LOG TABLE
  tSystemLog(UserID, IPAddress, LogTypeKey, SessionKey, Description, Status, Comment) {

    return new Promise((resolve, reject) => {
      var connection = new Connection(db);
      connection.on('connect', function (err) {
        // If no error, then good to proceed.
        var KeyLog
        var request = new Request("INSERT INTO tSystemLog ( LogDate,IPAddress, UserID,  LogTypeKey,  SessionKey,  Description,  Status, Comment) VALUES (CURRENT_TIMESTAMP,@IPAddress,@UserID,@LogTypeKey, @SessionKey, @Description, @Status, @Comment) SELECT @@IDENTITY;;", function (err, response) {
          if (err) {
            console.log(err);
          }
        });
        request.addParameter('UserID', TYPES.NVarChar, UserID);
        request.addParameter('IPAddress', TYPES.NVarChar, IPAddress);
        request.addParameter('LogTypeKey', TYPES.Int, LogTypeKey);
        request.addParameter('SessionKey', TYPES.Int, SessionKey);
        request.addParameter('Description', TYPES.NVarChar, Description);
        request.addParameter('Status', TYPES.Int, Status);
        request.addParameter('Comment', TYPES.NVarChar, Comment);
        request.on('row', function (columns) {
          columns.forEach(function (column) {
            if (column.value === null) {
              console.log('NULL');
            } else {
              KeyLog = column.value

            }
          });
        });
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
          resolve(KeyLog)
          connection.close();
        });
        connection.execSql(request);
      });
      connection.connect();
    });
  },
    //SELECT GetLogError
    GetLogError(tlogKey) {

      return new Promise((resolve, reject) => {
        var connection = new Connection(db);
        connection.on('connect', function (err) {
          // If no error, then good to proceed.
          var KeyLog
          var request = new Request(`SELECT TOP (1000) [tlogKey]
          ,[LogDate]
          ,[UserID]
          ,[IPAddress]
          ,[LogTypeKey]
          ,[SessionKey]
          ,[Description]
          ,[Status]
          ,[Comment]
      FROM tSystemLog WHERE tlogKey = @tlogKey`, function (err, response) {
            if (err) {
              console.log(err);
            }
          });
          request.addParameter('tlogKey', TYPES.Int, tlogKey);
          request.on('row', function (columns) {
            columns.forEach(function (column) {
              if (column.value === null) {
                console.log('NULL');
              } else {
                KeyLog = column.value
  
              }
            });
          });
          // Close the connection after the final event emitted by the request, after the callback passes
          request.on("requestCompleted", function (rowCount, more) {
            resolve(KeyLog)
            connection.close();
          });
          connection.execSql(request);
        });
        connection.connect();
      });
    },
    Get_YPORTALINAOs(bpcnum,filter,search) {

      return new Promise((resolve, reject) => {
        var connection = new Connection(db);
        connection.on('connect', function (err) {
          // If no error, then good to proceed.
          var KeyLog
          var request = new Request(`SELECT * FROM YPORTALINA WHERE BPCINV_0 = @BPCINV_0 AND INVTYP_0 = @INVTYP_0 AND OPENLOC_0 <>  @OPENLOC_0 AND INVSTA_0=@INVSTA_0 AND ${filter} like '%${search}%'`, function (err, response) {
            if (err) {
              console.log(err);
            }
          });
          var result = [];
          request.addParameter('BPCINV_0', TYPES.NVarChar, bpcnum);
          request.addParameter('INVTYP_0', TYPES.NVarChar, '1');
          request.addParameter('OPENLOC_0', TYPES.NVarChar, '0');
          request.addParameter('INVSTA_0', TYPES.NVarChar, '3');
          request.addParameter(`${filter}`, TYPES.NVarChar, search);
          request.on('row', function (columns) {
            var rowObject = {};
            columns.forEach(function (column) {
              rowObject[column.metadata.colName] = column.value;
            });
            result.push(rowObject);
          });
          request.on('done', function (rowCount, more) {
          });
          // Close the connection after the final event emitted by the request, after the callback passes
          request.on("requestCompleted", function (rowCount, more) {
            resolve(result)
            connection.close();
          });
          connection.execSql(request);
        });
        connection.connect();
      });
    },
    Get_YPORTALINAO(bpcnum) {

      return new Promise((resolve, reject) => {
        var connection = new Connection(db);
        connection.on('connect', function (err) {
          // If no error, then good to proceed.
          var KeyLog
          var request = new Request(`SELECT * FROM YPORTALINA WHERE BPCINV_0 = @BPCINV_0 AND INVTYP_0 = @INVTYP_0 AND OPENLOC_0 <>  @OPENLOC_0 AND INVSTA_0=@INVSTA_0`, function (err, response) {
            if (err) {
              console.log(err);
            }
          });
          var result = [];
          request.addParameter('BPCINV_0', TYPES.NVarChar, bpcnum);
          request.addParameter('INVTYP_0', TYPES.NVarChar, '1');
          request.addParameter('OPENLOC_0', TYPES.NVarChar, '0');
          request.addParameter('INVSTA_0', TYPES.NVarChar, '3');
          request.on('row', function (columns) {
            var rowObject = {};
            columns.forEach(function (column) {
              rowObject[column.metadata.colName] = column.value;
            });
            result.push(rowObject);
          });
          request.on('done', function (rowCount, more) {
          });
          // Close the connection after the final event emitted by the request, after the callback passes
          request.on("requestCompleted", function (rowCount, more) {
            resolve(result)
            connection.close();
          });
          connection.execSql(request);
        });
        connection.connect();
      });
    },
    Get_YPORTALINACs(bpcnum,filter,search) {

      return new Promise((resolve, reject) => {
        var connection = new Connection(db);
        connection.on('connect', function (err) {
          // If no error, then good to proceed.
          var KeyLog
          var request = new Request(`SELECT * FROM YPORTALINA WHERE BPCINV_0 = @BPCINV_0 AND INVTYP_0 = @INVTYP_0 AND OPENLOC_0 =  @OPENLOC_0 AND INVSTA_0=@INVSTA_0 AND ${filter} like '%${search}%'`, function (err, response) {
            if (err) {
              console.log(err);
            }
          });
          var result = [];
          request.addParameter('BPCINV_0', TYPES.NVarChar, bpcnum);
          request.addParameter('INVTYP_0', TYPES.NVarChar, '1');
          request.addParameter('OPENLOC_0', TYPES.NVarChar, '0');
          request.addParameter('INVSTA_0', TYPES.NVarChar, '3');
          request.addParameter(`${filter}`, TYPES.NVarChar, search);
          request.on('row', function (columns) {
            var rowObject = {};
            columns.forEach(function (column) {
              rowObject[column.metadata.colName] = column.value;
            });
            result.push(rowObject);
          });
          request.on('done', function (rowCount, more) {
          });
          // Close the connection after the final event emitted by the request, after the callback passes
          request.on("requestCompleted", function (rowCount, more) {
            resolve(result)
            connection.close();
          });
          connection.execSql(request);
        });
        connection.connect();
      });
    },
    Get_YPORTALINAC(bpcnum) {

      return new Promise((resolve, reject) => {
        var connection = new Connection(db);
        connection.on('connect', function (err) {
          // If no error, then good to proceed.
          var KeyLog
          var request = new Request(`SELECT * FROM YPORTALINA WHERE BPCINV_0 = @BPCINV_0 AND INVTYP_0 = @INVTYP_0 AND OPENLOC_0 =  @OPENLOC_0 AND INVSTA_0=@INVSTA_0`, function (err, response) {
            if (err) {
              console.log(err);
            }
          });
          var result = [];
          request.addParameter('BPCINV_0', TYPES.NVarChar, bpcnum);
          request.addParameter('INVTYP_0', TYPES.NVarChar, '1');
          request.addParameter('OPENLOC_0', TYPES.NVarChar, '0');
          request.addParameter('INVSTA_0', TYPES.NVarChar, '3');
          request.on('row', function (columns) {
            var rowObject = {};
            columns.forEach(function (column) {
              rowObject[column.metadata.colName] = column.value;
            });
            result.push(rowObject);
          });
          request.on('done', function (rowCount, more) {
          });
          // Close the connection after the final event emitted by the request, after the callback passes
          request.on("requestCompleted", function (rowCount, more) {
            resolve(result)
            connection.close();
          });
          connection.execSql(request);
        });
        connection.connect();
      });
    },
    getLogTypeTable() {

      return new Promise((resolve, reject) => {
        var connection = new Connection(db);
        connection.on('connect', function (err) {
          // If no error, then good to proceed.
          var KeyLog
          var request = new Request(`SELECT * FROM [tLogType] W`, function (err, response) {
            if (err) {
              console.log(err);
            }
          });
          var result = [];
          request.on('row', function (columns) {
            var rowObject = {};
            columns.forEach(function (column) {
              rowObject[column.metadata.colName] = column.value;
            });
            result.push(rowObject);
          });
          request.on('done', function (rowCount, more) {
          });
          // Close the connection after the final event emitted by the request, after the callback passes
          request.on("requestCompleted", function (rowCount, more) {
            resolve(result)
            connection.close();
          });
          connection.execSql(request);
        });
        connection.connect();
      });
    },

  //INSERT OR UPDATE PIC PROFILE 
  uploadPicProfile(email, picture, type) {
    return new Promise((resolve, reject) => {
      var connection = new Connection(db);
      var id
      connection.on('connect', function (err) {
        // If no error, then good to proceed.
        var request
        if (type == 'insert') {
          request = new Request("INSERT INTO tPicProfile (email, picture) VALUES (@email, @picture) SELECT @@IDENTITY;", function (err, response) {
            if (err) {
              console.log(err);
            }
          });
        } else {
          request = new Request("UPDATE tPicProfile SET picture = @picture WHERE email = @email;", function (err, response) {
            if (err) {
              console.log(err);
            }
          });
        }
        request.addParameter('email', TYPES.VarChar, email);
        request.addParameter('picture', TYPES.VarChar, picture);
        request.on('row', function (columns) {
          columns.forEach(function (column) {
            if (column.value === null) {
              console.log('NULL');
            } else {
              id = column.value
            }
          });
        });
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
          resolve(id)
          connection.close();
        });
        connection.execSql(request);
      });
      connection.connect();
    });
  },
  //CONSULT PIC PROLE BY EMAIL
  consultingPicProfile(email) {
    return new Promise((resolve, reject) => {
      var connection = new Connection(db);
      var id
      connection.on('connect', function (err) {
        // If no error, then good to proceed.
        var request = new Request(`SELECT [picture] FROM tPicProfile WHERE email = '${email}'`, function (err, response) {
          if (err) {
            console.log(err);
          }
        });
        var result = "";
        request.on('row', function (columns) {
          columns.forEach(function (column) {
            if (column.value === null) {
              console.log('NULL');
            } else {
              result += column.value + " ";
            }
          }); 
        });
        request.on('done', function (rowCount, more) {
        });
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
          resolve(result)
          connection.close();
        });
        connection.execSql(request);
      });
      connection.connect();
    });
  },

  dtQuery(query) {
    return new Promise((resolve, reject) => {
      var connection = new Connection(db);
      var id
      connection.on('connect', function (err) {
        // If no error, then good to proceed.
        let data = [];
        var request = new Request(query, function (err, rowCount,rows) {
          if (err) {
            console.log(err);
          }
        });
        
        request.on('row', function (columns) {
          var rowObject = {};
          columns.forEach(function (column) {
            rowObject[column.metadata.colName] = column.value;
          }); 
          data.push(rowObject);

        });

        request.on('done', function (rowCount, more) {
        });
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
          resolve(data)
          connection.close();
        });
        connection.execSql(request);
      });
      connection.connect();
    });
  },
  countTableWfilter(table, search) {
    return new Promise((resolve, reject) => {
      var connection = new Connection(db);
      var id
      connection.on('connect', function (err) {
        // If no error, then good to proceed.
        let data =[]
        var request = new Request(`SELECT COUNT(*) AS total_count FROM ${table} where ${search}`, (err, rowCount) => {
          if (err) {
            console.log(err);
          }
      
        });
        request.on('row', function (columns) {
          columns.forEach(function (column) {
            var rowObject = {};
            columns.forEach(function (column) {
              rowObject[column.metadata.colName] = column.value;
            });
            data.push(rowObject);
          }); 
        });
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
          resolve(data[0])
          connection.close();
        });
        connection.execSql(request);
      });
      connection.connect();
    });
  },
  countTable(table) {
    return new Promise((resolve, reject) => {
      var connection = new Connection(db);
      var id
      connection.on('connect', function (err) {
        // If no error, then good to proceed.
        let data =[]
        var request = new Request(`SELECT COUNT(*) AS total_count FROM ${table}`, (err, rowCount) => {
          if (err) {
            console.log(err);
          }
      
        });
        request.on('row', function (columns) {
          columns.forEach(function (column) {
            var rowObject = {};
            columns.forEach(function (column) {
              rowObject[column.metadata.colName] = column.value;
            });
            data.push(rowObject);
          }); 
        });
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
          resolve(data[0])
          connection.close();
        });
        connection.execSql(request);
      });
      connection.connect();
    });
  },
  
};
