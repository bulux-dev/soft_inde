import { Op } from "sequelize";
import { fl } from "../../../middleware/filtros.js";
import { resp } from "../../../middleware/resp.js";
import { CierreContable } from "./cierres_contables.model.js";

let getAllCierresContables = async (req, res) => {
    try{
        let where = fl(req.query);
        let cierres_contables = await CierreContable.findAll({
            where: where
        });
        await resp.sucess ({ mensaje: 'Cierres Contables encontrados', data: cierres_contables }, req, res, 'Cierre Contable');

    }catch(err){
        await resp.error(err, req, res);
    }
}


let getOneCierreContable = async (req, res) => {
    try{
        let cierre_contable = await CierreContable.findOne({
            where: { id: req.params.id }
        });
        await resp.success({ mensaje: 'Cierre Contable encontrado', data: cierre_contable }, req, res, 'Cierre Contable');
    }catch(err){
        await resp.error(err, req, res);
    }
}


let createCierreContable = async (req, res) => {
    try{
        let cierre_contable = await CierreContable.findOne({where: {numero: req.body.numero}});
        if(cierre_contable){
            return resp.error('Cierre Contable ya existente', req, res);
        }
            cierre_contable = await CierreContable.create(req.body);
            await resp.success({mensaje: 'Cierre Contable creado', data: cierre_contable}, req, res, 'Cierre Contable');
    }catch(err){
        await resp.error(err, req, res);
    }
}

let updateCierreContable = async (req,res)=>{
    try {
        let cierre_contable = await CierreContable.update(req.body, {where: {id: req.params.id}});
        await resp.success({mensaje: 'Cierre Contable actualizado', data: cierre_contable}, req, res, 'Cierre Contable');
    }catch(err){
        await resp.error(err, req, res);
    }
}

let deleteCierreContable = async (req, res) => {
    try{
        let cierre_contable = await CierreContable.destroy({where: {id: req.params.id}});
        await resp.success({mensaje: 'Cierre Contable eliminado', data: cierre_contable}, req, res, 'Cierre Contable');
    }catch(err){
        await resp.error(err, req, res);
    }
}


export default {
    getAllCierresContables,
    getOneCierreContable,
    createCierreContable,
    updateCierreContable,
    deleteCierreContable
}
