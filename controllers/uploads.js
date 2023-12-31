const fs = require('fs');
const path =  require('path');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload = (req, res=response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if(!tiposValidos.includes(tipo)){
        return res.status(400).json({
            ok: false,
            msg: 'No es un usuario, medico u hospital'
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        });
      }
    
      //Procesar la imagen
      const file = req.files.imagen;
      const nombreCoratdo = file.name.split('.');
      const extensionArchivo = nombreCoratdo[nombreCoratdo.length - 1];

      //validar extension
      const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
      if(!extensionesValidas.includes(extensionArchivo)){
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension valida'
        });
      }

      //Generar el nombre del archivo
      const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

      //Path par guardar imagen
      const path = `./uploads/${tipo}/${nombreArchivo}`;

      //Mover la imagen
      file.mv(path, (err) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        //update db
        actualizarImagen( tipo, id, nombreArchivo );

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });  

      });
}

const retornaImagen = (req, res = response ) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    if(fs.existsSync(pathImg)) {
        res.sendFile( pathImg );
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.png`);
        res.sendFile(pathImg);
    }

    
}

module.exports = { fileUpload, retornaImagen }