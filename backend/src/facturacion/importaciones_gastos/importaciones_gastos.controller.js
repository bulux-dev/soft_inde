import fl from '../../../middleware/filtros.js';
import fs from 'fs';
import resp from '../../../middleware/resp.js';
import jwt from 'jsonwebtoken';
import ImportacionGasto from './importaciones_gastos.model.js';
import key from '../../../middleware/key.js';
import Empresa from '../../empresas/empresas.model.js';
import { Op } from 'sequelize';
import moment from 'moment';
import Compra from '../compras/compras.model.js';
import Proveedor from '../../personal/proveedores/proveedores.model.js';
import Moneda from '../monedas/monedas.model.js';
import TipoGasto from '../tipos_gastos/tipos_gastos.model.js';

let getAllImportacionesGastos = async (req, res) => {
  try {
    let token = req.headers.authorization;
    let data = jwt.decode(token, key);
    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (req.params.fecha_inicio != 'null' && req.params.fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(req.params.fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }
    let importaciones_gastos = await ImportacionGasto.findAll({
      where: where,
      include: [
        {
          model: Compra, as: 'compra',
          include: [
            {
              model: Proveedor, as: 'proveedor',
            },
            {
              model: Moneda, as: 'moneda',
            },
          ]
        },
        {
          model: TipoGasto, as: 'tipo_gasto',
        }
      ],
      order: [
        ['fecha', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Importaciones Gastos encontradas', data: importaciones_gastos }, req, res, 'Importacion Gasto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getImportacionGastoDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let importacion_gasto = await ImportacionGasto.findOne({
      where: { id: req.params.importacion_gasto_id },
      include: [
        {
          model: Compra, as: 'compra',
          include: [
            {
              model: Proveedor, as: 'proveedor',
            },
            {
              model: Moneda, as: 'moneda',
            },
          ]
        },
        {
          model: TipoGasto, as: 'tipo_gasto',
        }
      ]
    });
    let file = fs.readFileSync(`./templates/importacion_gasto.html`, 'utf8');

    file = file.replace('___importacion_gasto', JSON.stringify(importacion_gasto));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneImportacionGasto = async (req, res) => {
  try {
    let importacion_gasto = await ImportacionGasto.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Importacion Gasto encontrada', data: importacion_gasto }, req, res, 'Importacion Gasto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createImportacionGasto = async (req, res) => {
  try {
    req.body.nombre = req.body.nombre.trim();
    let importacion_gasto = await ImportacionGasto.create(req.body);
    await resp.success({ mensaje: 'Tipo Gasto agregado', data: importacion_gasto }, req, res, 'Importacion Gasto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateImportacionGasto = async (req, res) => {
  try {
    let importacion_gasto = await ImportacionGasto.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Importacion Gasto actualizado', data: importacion_gasto }, req, res, 'Importacion Gasto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularImportacionGasto = async (req, res) => {
  try {
    let importacion_gasto = await ImportacionGasto.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Importacion Gasto eliminado', data: importacion_gasto }, req, res, 'Importacion Gasto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteImportacionGasto = async (req, res) => {
  try {
    let importacion_gasto = await ImportacionGasto.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Importacion Gasto eliminada', data: importacion_gasto }, req, res, 'Importacion Gasto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllImportacionesGastos,
  getOneImportacionGasto,
  createImportacionGasto,
  updateImportacionGasto,
  anularImportacionGasto,
  deleteImportacionGasto,
  getImportacionGastoDoc
}