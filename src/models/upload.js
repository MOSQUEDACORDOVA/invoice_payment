let fs = require("fs");
class FileController
{
  subirArchivo = async (req, res, next) =>
  {
  let fecha = new Date()
  
    const archivo = req.files.archivo;
    if (archivo == null) {
      
      fs.writeFile('./error'+Number(fecha)+'.txt', 'Error por archivo Null', error => {
        if (error)
          console.log(error);
        else
          console.log('El archivo fue creado');
      });
  
    }
    const fileName = archivo.name;
    const path = __dirname + '/../public/assets/uploads/' + fileName;


    try {
      archivo.mv(path, (error) => {
        
        if (error) {
          console.error(error);
          res.writeHead(500, {
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify({ status: 'error', message: error }));
            return;
          }
          console.log(req.body)
          console.log("ya se subio el archivo")
          if (req.body.fans_admin) {
            return res.status(200).send({ status: 'success', path:'assets/uploads/' + fileName });
          }else{
            return res.status(200).send({ status: 'success', path:'/../public/assets/uploads/' + fileName });
          }
          
       });
     } catch (e) {
      console.log("no" +e)
      let fecha = new Date()
  fs.writeFile('./error'+Number(fecha)+'.txt', e, error => {
    if (error)
      console.log(error);
    else
      console.log('El archivo fue creado');
  });
       res.status(500).json({
         error: true,
         message: e.toString()
       });
     }


  }
}

module.exports = FileController;
