import { Op } from 'sequelize';
import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import CuentaContable from '../cuentas_contables/cuentas_contables.model.js';

let getAllCuentasContables = async (req, res) => {
  try {
    let where = fl(req.query);
    where.cuenta_contable_id = {
      [Op.eq]: null
    };
    let cuentas_contables = await CuentaContable.findAll({
      where: where,
      include: [
        {
          model: CuentaContable, as: 'cuentas_contables_hijas',
          include: [
            {
              model: CuentaContable, as: 'cuentas_contables_hijas',
              include: [
                {
                  model: CuentaContable, as: 'cuentas_contables_hijas',
                  include: [
                    {
                      model: CuentaContable, as: 'cuentas_contables_hijas',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    await resp.success({ mensaje: 'Cuentas Contables encontradas', data: cuentas_contables }, req, res, 'Cuenta Contable');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getCuentasJornalizacion = async (req, res) => {
  try {
    let cuentas_contables = await CuentaContable.findAll({
      where: {
        tipo: 'JORNALIZACION'
      }
    });
    await resp.success({ mensaje: 'Cuentas Contables encontradas', data: cuentas_contables }, req, res, 'Cuenta Contable');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCuentaContable = async (req, res) => {
  try {
    let cuenta_contable = await CuentaContable.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: CuentaContable, as: 'cuenta_contable_padre',
        },
        {
          model: CuentaContable, as: 'cuentas_contables_hijas',
        }
      ]
    });
    await resp.success({ mensaje: 'Cuenta Contable encontrada', data: cuenta_contable }, req, res, 'Cuenta Contable');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCuentaContable = async (req, res) => {
  try {
    let cuenta_contable = await CuentaContable.findOne({ where: { numero: req.body.numero } });
    if (cuenta_contable) {
      return resp.error('Cuenta Contable ya existente', req, res);
    }
    cuenta_contable = await CuentaContable.create(req.body);
    await resp.success({ mensaje: 'Cuenta Contable agregada', data: cuenta_contable }, req, res, 'Cuenta Contable');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCuentaContable = async (req, res) => {
  try {
    let cuenta_contable = await CuentaContable.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cuenta Contable actualizada', data: cuenta_contable }, req, res, 'Cuenta Contable');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCuentaContable = async (req, res) => {
  try {
    let cuenta_contable = await CuentaContable.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cuenta Contable eliminada', data: cuenta_contable }, req, res, 'Cuenta Contable');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getCuentasJornalizacion,
  getAllCuentasContables,
  getOneCuentaContable,
  createCuentaContable,
  updateCuentaContable,
  deleteCuentaContable
}