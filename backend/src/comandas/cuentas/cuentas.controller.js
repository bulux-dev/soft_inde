import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Cuenta from './cuentas.model.js';
import Estacion from '../estaciones/estaciones.model.js';
import Comanda from '../comandas/comandas.model.js';
import Area from '../areas/areas.model.js';
import Comercio from '../comercios/comercios.model.js';
import ComandaDetalle from '../comandas_detalles/comandas_detalles.model.js';
import Producto from '../../inventario/productos/productos.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';
import { Op } from 'sequelize';

let getAllCuentas = async (req, res) => {
  try {
    let where = fl(req.query);
    let cuentas = await Cuenta.findAll({
      where: where,
      include: [
        {
          model: Comanda, as: 'comandas',
          include: [
            {
              model: ComandaDetalle, as: 'comandas_detalles',
              include: [
                {
                  model: Producto, as: 'producto',
                  include: [
                    {
                      model: Medida, as: 'medida',
                    }
                  ]
                },
                {
                  model: Medida, as: 'medida',
                }
              ]
            }
          ]
        },
        {
          model: Estacion, as: 'estacion',
          include: [
            {
              model: Area, as: 'area',
              include: [
                {
                  model: Comercio, as: 'comercio'
                }
              ]
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Cuentas encontradas', data: cuentas }, req, res, 'Cuenta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllCuentasDisplay = async (req, res) => {
  try {
    let cuentas = await Cuenta.findAll({
      where: { 
        estado: 'ABIERTA',
        id: { [Op.gt]: req.query.last }
      },
      include: [
        {
          model: Comanda, as: 'comandas',
          include: [
            {
              model: ComandaDetalle, as: 'comandas_detalles',
              include: [
                {
                  model: Producto, as: 'producto',
                  include: [
                    {
                      model: Medida, as: 'medida',
                    }
                  ]
                },
                {
                  model: Medida, as: 'medida',
                }
              ]
            }
          ]
        },
        {
          model: Estacion, as: 'estacion',
          include: [
            {
              model: Area, as: 'area',
              include: [
                {
                  model: Comercio, as: 'comercio'
                }
              ]
            }
          ]
        }
      ],
      order: [
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Cuentas encontradas', data: cuentas }, req, res, 'Cuenta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCuenta = async (req, res) => {
  try {
    let cuenta = await Cuenta.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Comanda, as: 'comandas',
          include: [
            {
              model: ComandaDetalle, as: 'comandas_detalles',
              include: [
                {
                  model: Producto, as: 'producto',
                  include: [
                    {
                      model: Medida, as: 'medida',
                    }
                  ]
                },
                {
                  model: Medida, as: 'medida',
                }
              ]
            }
          ]
        },
        {
          model: Estacion, as: 'estacion',
          include: [
            {
              model: Area, as: 'area',
              include: [
                {
                  model: Comercio, as: 'comercio'
                }
              ]
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Cuenta encontrada', data: cuenta }, req, res, 'Cuenta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCuenta = async (req, res) => {
  try {
    let cuenta = await Cuenta.create(req.body);
    await resp.success({ mensaje: 'Cuenta agregada', data: cuenta }, req, res, 'Cuenta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCuenta = async (req, res) => {
  try {
    let cuenta = await Cuenta.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cuenta actualizada', data: cuenta }, req, res, 'Cuenta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCuenta = async (req, res) => {
  try {
    let cuenta = await Cuenta.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cuenta eliminada', data: cuenta }, req, res, 'Cuenta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCuentas,
  getAllCuentasDisplay,
  getOneCuenta,
  createCuenta,
  updateCuenta,
  deleteCuenta
}