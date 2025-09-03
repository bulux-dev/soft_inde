import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Empresa from '../../empresas/empresas.model.js';
import Cuota from '../cuotas/cuotas.model.js';
import Venta from '../ventas/ventas.model.js';
import Credito from './creditos.model.js';
import key from '../../../middleware/key.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import Amortizaciones from '../amortizaciones/amortizaciones.model.js';
import CreditoDetalle from '../creditos_detalles/creditos_detalles.model.js';
import Recibo from '../recibos/recibos.model.js';
import { Op } from 'sequelize';
import moment from 'moment';
import Categoria from '../../inventario/categorias/categorias.model.js';
import Producto from '../../inventario/productos/productos.model.js';
import Empleado from '../../personal/empleados/empleados.model.js';

let getAllCreditos = async (req, res) => {
  try {
    let where = fl(req.query);
    if (req.params.fecha_inicio != 'null' && req.params.fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(req.params.fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }
    let creditos = await Credito.findAll({
      where: where,
      include: [
        {
          model: CreditoDetalle, as: 'credito_detalle',
          include: [
            {
              model: Categoria, as: 'categoria',
            },
            {
              model: Producto, as: 'producto',
            },
            {
              model: Empleado, as: 'empleado',
              attributes: ['id', 'nombre', 'apellido']
            },
          ]
        }
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Creditos encontrados', data: creditos }, req, res, 'Credito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getCreditoDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let credito = await Credito.findOne({
      where: { id: req.params.credito_id },
      include: [
        {
          model: CreditoDetalle, as: 'credito_detalle',
          include: [
            {
              model: Categoria, as: 'categoria',
            },
            {
              model: Producto, as: 'producto',
            },
            {
              model: Empleado, as: 'empleado',
              attributes: ['id', 'nombre', 'apellido']
            }
          ]
        },
        {
          model: Venta, as: 'venta',
        },
        {
          model: Cuota, as: 'cuotas',
        },
      ]
    })

    let file = fs.readFileSync('./templates/creditos/credito.html', 'utf8');

    file = file.replace('___credito', JSON.stringify(credito));
    file = file.replace('___cuotas', JSON.stringify(credito.cuotas));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getCreditoCotizacion = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let credito = await Credito.findOne({
      where: { id: req.params.credito_id },
      include: [
        {
          model: CreditoDetalle, as: 'credito_detalle',
          include: [
            {
              model: Categoria, as: 'categoria',
            },
            {
              model: Producto, as: 'producto',
            },
            {
              model: Empleado, as: 'empleado',
              attributes: ['id', 'nombre', 'apellido']
            }
          ]
        },
        {
          model: Venta, as: 'venta',
        },
        {
          model: Cuota, as: 'cuotas',
        },
      ]
    })

    let file = fs.readFileSync('./templates/creditos/cotizacion.html', 'utf8');

    file = file.replace('___credito', JSON.stringify(credito));
    file = file.replace('___cuotas', JSON.stringify(credito.cuotas));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getCreditoSolicitud = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let credito = await Credito.findOne({
      where: { id: req.params.credito_id },
      include: [
        {
          model: CreditoDetalle, as: 'credito_detalle',
          include: [
            {
              model: Categoria, as: 'categoria',
            },
            {
              model: Producto, as: 'producto',
            },
            {
              model: Empleado, as: 'empleado',
              attributes: ['id', 'nombre', 'apellido']
            }
          ]
        },
        {
          model: Venta, as: 'venta',
        },
        {
          model: Cuota, as: 'cuotas',
        }
      ]
    })

    let file = fs.readFileSync('./templates/creditos/solicitud.html', 'utf8');

    file = file.replace('___credito', JSON.stringify(credito));
    file = file.replace('___cuotas', JSON.stringify(credito.cuotas));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getCreditoEstadoCuenta = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let fecha_fin = moment(req.params.fecha_fin).endOf('month').format('YYYY-MM-DD');
    let credito = await Credito.findOne({
      where: { id: req.params.credito_id },
      include: [
        {
          model: CreditoDetalle, as: 'credito_detalle',
          include: [
            {
              model: Categoria, as: 'categoria',
            },
            {
              model: Producto, as: 'producto',
            },
            {
              model: Empleado, as: 'empleado',
              attributes: ['id', 'nombre', 'apellido']
            }
          ]
        },
        {
          model: Amortizaciones, as: 'amortizaciones',
          where: {
            fecha_fin: { [Op.lte]: fecha_fin }
          },
          include: [
            {
              model: Recibo, as: 'recibo',
            }
          ]
        }
      ]
    });

    let ultima_amortizacion = credito.amortizaciones[credito.amortizaciones.length - 1];

    let file = fs.readFileSync('./templates/creditos/estado-cuenta.html', 'utf8');

    file = file.replace('___credito', JSON.stringify(credito));
    file = file.replace('___ultima_amortizacion', JSON.stringify(ultima_amortizacion));
    file = file.replace('___fecha_fin', JSON.stringify(fecha_fin));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCredito = async (req, res) => {
  try {
    let credito = await Credito.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: CreditoDetalle, as: 'credito_detalle',
          include: [
            {
              model: Categoria, as: 'categoria',
            },
            {
              model: Producto, as: 'producto',
            },
            {
              model: Empleado, as: 'empleado',
              attributes: ['id', 'nombre', 'apellido']
            }
          ]
        },
        {
          model: Venta, as: 'venta',
        },
        {
          model: Cuota, as: 'cuotas',
        },
        {
          model: Amortizaciones, as: 'amortizaciones',
          include: [
            {
              model: Recibo, as: 'recibo',
            }
          ]
        },
      ]
    });
    await resp.success({ mensaje: 'Credito encontrado', data: credito }, req, res, 'Credito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCredito = async (req, res) => {
  try {
    let credito = await Credito.create(req.body);
    if (credito) {
      credito.id = credito.null;
      req.body.cuotas.forEach(async c => {
        c.credito_id = credito.id;
        await Cuota.create(c);
      });
    }
    await resp.success({ mensaje: 'Credito agregado', data: credito }, req, res, 'Credito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCredito = async (req, res) => {
  try {
    let credito = await Credito.update(req.body, { where: { id: req.params.id } });

    if (req.body.cuotas && req.body.cuotas.length > 0) {
      await Cuota.destroy({ where: { credito_id: req.params.id } });

      for (let c = 0; c < req.body.cuotas.length; c++) {
        req.body.cuotas[c].credito_id = req.params.id;
        await Cuota.create(req.body.cuotas[c]);
      }
    }

    await resp.success({ mensaje: 'Credito actualizado', data: credito }, req, res, 'Credito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularCredito = async (req, res) => {
  try {
    let credito = await Credito.update(req.body, { where: { id: req.params.id } })
    await resp.success({ mensaje: 'Credito anulado', data: credito }, req, res, 'Credito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCredito = async (req, res) => {
  try {
    let credito = await Credito.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Credito eliminado', data: credito }, req, res, 'Credito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCreditos,
  getOneCredito,
  createCredito,
  updateCredito,
  deleteCredito,
  getCreditoDoc,
  getCreditoCotizacion,
  getCreditoSolicitud,
  getCreditoEstadoCuenta,
  anularCredito
}