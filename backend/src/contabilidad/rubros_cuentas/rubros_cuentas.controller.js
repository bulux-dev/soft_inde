import { Op } from "sequelize";
import fl from "../../../middleware/filtros.js";
import resp from "../../../middleware/resp.js";
import RubroCuenta from "./rubros_cuentas.model.js";

let getAllRubrosCuentas = async (req, res) => {
  try {
    let where = fl(req.query);
   
    let rubros_cuentas = await RubroCuenta.findAll({
      where: where
    });
    await resp.success({ mensaje: 'Rubros Cuentas encontrados', data: rubros_cuentas }, req, res, 'Rubros Cuentas');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneRubroCuenta = async (req, res) => {
  try {
    let rubros_cuentas = await RubroCuenta.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Rubro cuenta encontrado', data: rubros_cuentas }, req, res, 'Rubro Cuenta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createRubroCuenta = async (req, res) => {
  try {
    let rubros_cuentas = await RubroCuenta.findOne({ 
      where: { id: req.params

       } });
       for(let c = 0; c < rubros_cuentas.length; c++){
         rubros_cuentas[c].id = rubros_cuentas[c].null
         await RubroCuenta.create(rubros_cuentas[c])
       }
    if (rubros_cuentas) {
      return resp.error('Rubro Cuenta ya existente', req, res);
    }
    rubros_cuentas = await RubroCuenta.create(req.body);
    await resp.success({ mensaje: 'Rubro Cuenta agregado', data: rubros_cuentas }, req, res, 'Rubro Cuenta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}


let updateRubroCuenta = async (req, res) => {
  try {
    let rubros_cuentas = await RubroCuenta.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Rubro Cuenta actualizado', data: rubros_cuentas }, req, res, 'Rubro Cuenta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}



let deleteRubroCuenta = async (req, res) => {
  try {
    let rubros_cuentas = await RubroCuenta.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Rubro Cuenta eliminado', data: rubros_cuentas }, req, res, 'Rubro Cuenta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}





export default {
  getAllRubrosCuentas,
  getOneRubroCuenta,
  createRubroCuenta,
  updateRubroCuenta,
  deleteRubroCuenta
}

