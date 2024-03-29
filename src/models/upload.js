/**SCRIPT UPLOAD FILES (IMG) TO SERVER */

let fs = require("fs");
class FileController
{
  uploadFile = async (req, res, next) =>
  {
  let date = new Date()
  
    const file = req.files.file;
    if (file == null) {      
      fs.writeFile('./error'+Number(date)+'.txt', 'error file Null', error => {
        if (error)
          console.log(error);
        else
          console.log('File created');
      });
  
    }
    var fileName0 = file.name;
    console.log('fileName')
    console.log(fileName0)
    var split = fileName0.split('.')
    var timestamp =  new Date().toISOString().replace(/[-:.]/g,"");
    console.log(timestamp);
    var fileName = timestamp +'.'+ split[1];
    console.log(fileName);
    const path = __dirname + '/../public/assets/uploads/' + fileName;// DIR WHERE UPLOAD FILE

    try {
      file.mv(path, (error) => {
        
        if (error) {
          console.error(error);
          res.writeHead(500, {
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify({ status: 'error', message: error }));
            return;
          }
            return res.status(200).send({ status: 'success', path:'/../public/assets/uploads/' + fileName, fileName: fileName });// RETURN SUCCESS AND UBICATION DIRFILE
          
       });
     } catch (e) {
      let date = new Date()
  fs.writeFile('./error'+Number(date)+'.txt', e, error => {
    if (error)
      console.log(error);
    else
      console.log('Files success 2');
  });
       res.status(500).json({
         error: true,
         message: e.toString()
       });
     }


  }
}

module.exports = FileController;
