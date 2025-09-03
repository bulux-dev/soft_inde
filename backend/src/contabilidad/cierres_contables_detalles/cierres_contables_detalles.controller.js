import { Op } from "sequelize";
import fl from "../../../middleware/filtros.js";
import resp from "../../../middleware/resp.js";
import CierreContableDetalle from "./cierres_contables_detalles.model.js";

let getAllCierresContables = async(req,res)=>{
    try{
        let where = fl(req.query);
    where.cierre_contable_id = req.params.id={
        [Op.eq]:null
    };
    let cierres_contables_detalles = await CierreContableDetalle.findAll({
        where:where
    });
    await resp.success({mensaje:'Cierres Contables Detalles encontrados',data:cierres_contables_detalles},req,res,'Cierre Contable Detalle');
    }catch(err){
        await resp.error(err,req,res);
    }
}

let getOneCierreContableDetalle = async(req,res)=>{
    try {
        let cierres_contables_detalles = await CierreContableDetalle.findOne({
           where: { id: req.params.id } 
        });
        await resp.success({ mensaje: 'Cierre Contable Detalle encontrado', data: cierres_contables_detalles }, req, res, 'Cierre Contable Detalle');
    }catch(err){
        await resp.error(err,req,res);
    }   
}



let createCierreContableDetalle = async(req,res)=>{
    try{
        let cierres_contables_detalles = await CierreContableDetalle.create(req,body);
        await resp.success({mensaje: 'Cierre Contable Detalle creado',data:cierres_contables_detalles},req,res,'Cierre Contable Detalle');
    }catch(err){
        await resp.error(err,req,res);
    }
}

let updateCierreContableDetalle = async(req,res)=>{
    try{
        let cierres_contables_detalles = await CierreContableDetalle.update(req.body,{where:{id:req.params.id}});
        await resp.success({mensaje: 'Cierre Contable Detalle actualizado',data:cierres_contables_detalles},req,res,'Cierre Contable Detalle');
    }catch(err){
        await resp.error(err,req,res);
    }
}

let deleteCierreContableDetalle = async(req,res)=>{
    try{
        let cierres_contables_detalles = await CierreContableDetalle.destroy({where:{id:req.params.id}});
        await resp.success({mensaje: 'Cierre Contable Detalle eliminado',data:cierres_contables_detalles},req,res,'Cierre Contable Detalle');
    }catch(err){
        await resp.error(err,req,res);
    }
}

export default {
    getAllCierresContables,
    getOneCierreContableDetalle,
    createCierreContableDetalle,
    updateCierreContableDetalle,
    deleteCierreContableDetalle
}