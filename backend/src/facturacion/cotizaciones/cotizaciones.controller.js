import fl from '../../../middleware/filtros.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import key from '../../../middleware/key.js';
import resp from '../../../middleware/resp.js';
import Empresa from '../../empresas/empresas.model.js';
import Cliente from '../../personal/clientes/clientes.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Documento from '../documentos/documentos.model.js';
import Producto from '../../inventario/productos/productos.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import TipoDocumento from '../tipos_documentos/tipos_documentos.model.js';
import CotizacionDetalle from '../cotizaciones_detalles/cotizaciones_detalles.model.js';
import Cotizacion from './cotizaciones.model.js';
import Moneda from '../monedas/monedas.model.js';
import { Op } from 'sequelize';
import moment from 'moment';
import Empleado from '../../personal/empleados/empleados.model.js';
import TipoProducto from '../../inventario/tipos_productos/tipos_productos.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';
import Equivalencia from '../../inventario/equivalencias/equivalencias.model.js';
import OperacionEtiqueta from '../../inventario/operaciones_etiquetas/operaciones_etiquetas.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';

let getAllCotizaciones = async (req, res) => {
  try {
    // let token = req.headers.authorization;
    // let data = jwt.decode(token, key);
    // if (data.data.rol_id !== 1) {
    //   if (!req.query.usuario_id) {
    //     req.query.usuario_id = data.data.usuario_id;
    //   }
    // }

    let where = fl(req.query, 'eq');
    if (req.params.fecha_inicio != 'null' && req.params.fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(req.params.fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let cotizaciones = await Cotizacion.findAll({
      where: where,
      include: [
        {
          model: Documento, as: 'documento',
          include: [
            {
              model: TipoDocumento, as: 'tipo_documento',
            },
            {
              model: Usuario, as: 'usuario',
              attributes: ['id', 'nombre', 'apellido']
            }
          ]
        },
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Sucursal, as: 'sucursal',
        },
        {
          model: Bodega, as: 'bodega',
        },
        {
          model: Moneda, as: 'moneda',
        },
        {
          model: Empleado, as: 'empleado',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: Usuario, as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: OperacionEtiqueta, as: 'operaciones_etiquetas',
        }
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Cotizaciones encontradas', data: cotizaciones }, req, res, 'Cotizacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getCotizacionDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let cotizacion = await Cotizacion.findOne({
      where: { id: req.params.cotizacion_id },
      include: [
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Sucursal, as: 'sucursal',
        },
        {
          model: Bodega, as: 'bodega',
        },
        {
          model: Moneda, as: 'moneda',
        },
        {
          model: Usuario, as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: Empleado, as: 'empleado',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: CotizacionDetalle, as: 'cotizaciones_detalles',
          include: [
            {
              model: Producto, as: 'producto',
            },
            {
              model: Variacion, as: 'variacion',
            },
            {
              model: Medida, as: 'medida'
            },
            {
              model: Lote, as: 'lote'
            }
          ]
        }
      ]
    })

    let file = fs.readFileSync('./templates/cotizacion.html', 'utf8');

    file = file.replace('___cotizacion', JSON.stringify(cotizacion));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCotizacion = async (req, res) => {
  try {
    let cotizacion = await Cotizacion.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Empleado, as: 'empleado',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: Sucursal, as: 'sucursal',
        },
        {
          model: Bodega, as: 'bodega',
        },
        {
          model: Moneda, as: 'moneda',
        },
        {
          model: CotizacionDetalle, as: 'cotizaciones_detalles',
          include: [
            {
              model: Producto, as: 'producto',
              include: [
                {
                  model: TipoProducto, as: 'tipo_producto',
                },
                {
                  model: Equivalencia, as: 'equivalencias',
                  include: [
                    {
                      model: Medida, as: 'medida'
                    }
                  ]
                },
                {
                  model: Medida, as: 'medida'
                }
              ]
            },
            {
              model: Variacion, as: 'variacion',
            },
            {
              model: Medida, as: 'medida'
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Cotizacion encontrada', data: cotizacion }, req, res, 'Cotizacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCotizacion = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let cotizacion = await Cotizacion.create(req.body);
    cotizacion.id = cotizacion.null;
    if (cotizacion) {

      let cotizaciones_detalles = req.body.cotizaciones_detalles;
      let operaciones_etiquetas = JSON.parse(JSON.stringify(req.body.operaciones_etiquetas || []));

      // Cotizaciones Detalles
      for (let c = 0; c < cotizaciones_detalles.length; c++) {
        cotizaciones_detalles[c].cotizacion_id = cotizacion.id
        await CotizacionDetalle.create(cotizaciones_detalles[c])
      }

      // Operaciones Etiquetas
      for (let p = 0; p < operaciones_etiquetas.length; p++) {
        await OperacionEtiqueta.create({
          etiqueta_id: operaciones_etiquetas[p].id,
          cotizacion_id: cotizacion.id
        });
      }

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

    }
    await resp.success({ mensaje: 'Cotizacion agregada', data: cotizacion }, req, res, 'Cotizacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCotizacion = async (req, res) => {
  try {
    let cotizacion = await Cotizacion.update(req.body, { where: { id: req.params.id } });

    await CotizacionDetalle.destroy({ where: { cotizacion_id: req.params.id } });
    if (req.body.cotizaciones_detalles && req.body.cotizaciones_detalles.length > 0) {      
      for (let c = 0; c < req.body.cotizaciones_detalles.length; c++) {
        delete req.body.cotizaciones_detalles[c].id;
        req.body.cotizaciones_detalles[c].cotizacion_id = req.params.id;
        await CotizacionDetalle.create(req.body.cotizaciones_detalles[c]);
      }
    }

    await resp.success({ mensaje: 'Cotizacion actualizada', data: cotizacion }, req, res, 'Cotizacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularCotizacion = async (req, res) => {
  try {
    let cotizacion = await Cotizacion.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cotizacion anulada', data: cotizacion }, req, res, 'Cotizacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCotizacion = async (req, res) => {
  try {
    let cotizacion = await Cotizacion.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cotizacion eliminada', data: cotizacion }, req, res, 'Cotizacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCotizaciones,
  getOneCotizacion,
  createCotizacion,
  updateCotizacion,
  anularCotizacion,
  deleteCotizacion,
  getCotizacionDoc
}

function getNextCorrelativo(correlativo) {
  let res = '';
  let oldC = correlativo;
  let newC = parseInt(correlativo) + 1;
  for (let i = 0; i < (oldC.length - newC.toString().length); i++) {
    res += '0';
  }
  res += newC.toString();
  return res;
}