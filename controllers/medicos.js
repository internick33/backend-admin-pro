const { response } = require("express");
const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find().populate('usuario', 'nombre img').populate('hospital', 'nombre img')

    res.status(200).json({
        ok: true,
        medicos
    });
}

const crearMedico = async(req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.status(201).json({
            ok: true,
            medico: medicoDB
        });    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    
}

const actualizarMedico = (req, res = response) => {
    res.status(201).json({
        ok: true,
        msg: 'actualizar Medicos'
    });
}

const borrarMedico = (req, res = response) => {
    res.status(200).json({
        ok: true,
        msg: 'borrar Medicos'
    });
}

module.exports = { getMedicos, crearMedico, actualizarMedico, borrarMedico }