import fl from '../../../middleware/filtros.js';
import fs from 'fs';
import resp from '../../../middleware/resp.js';
import jwt from 'jsonwebtoken';
import Proveedor from '../../personal/proveedores/proveedores.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Documento from '../documentos/documentos.model.js';
import TipoDocumento from '../tipos_documentos/tipos_documentos.model.js';
import OrdenCompra from './ordenes_compras.model.js';
import OrdenCompraDetalle from '../ordenes_compras_detalles/ordenes_compras_detalles.model.js';
import key from '../../../middleware/key.js';
import Producto from '../../inventario/productos/productos.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Empresa from '../../empresas/empresas.model.js';
import Moneda from '../monedas/monedas.model.js';
import moment from 'moment';
import { Op } from 'sequelize';
import TipoProducto from '../../inventario/tipos_productos/tipos_productos.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';
import Equivalencia from '../../inventario/equivalencias/equivalencias.model.js';
import OperacionEtiqueta from '../../inventario/operaciones_etiquetas/operaciones_etiquetas.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';

let getAllOrdenesCompras = async (req, res) => {
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

    let ordenes_compras = await OrdenCompra.findAll({
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
            },
          ]
        },
        {
          model: Proveedor, as: 'proveedor',
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
          model: OperacionEtiqueta, as: 'operaciones_etiquetas',
        }
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Ordenes de Compras encontradas', data: ordenes_compras }, req, res, 'Orden Compra');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOrdenCompraDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let orden_compra = await OrdenCompra.findOne({
      where: { id: req.params.orden_compra_id },
      include: [
        {
          model: Proveedor, as: 'proveedor',
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
          model: OrdenCompraDetalle, as: 'ordenes_compras_detalles',
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
              model: Lote, as: 'lote',
            },
          ]
        }
      ]
    });
    let file = fs.readFileSync(`./templates/orden_compra.html`, 'utf8');

    file = file.replace('___orden_compra', JSON.stringify(orden_compra));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneOrdenCompra = async (req, res) => {
  try {
    let orden_compra = await OrdenCompra.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Proveedor, as: 'proveedor',
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
          model: OrdenCompraDetalle, as: 'ordenes_compras_detalles',
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
    await resp.success({ mensaje: 'Orden de Compra encontrada', data: orden_compra }, req, res, 'Orden Compra');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createOrdenCompra = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let orden_compra = await OrdenCompra.create(req.body);
    orden_compra.id = orden_compra.null;
    if (orden_compra) {

      let ordenes_compras_detalles = req.body.ordenes_compras_detalles;
      let operaciones_etiquetas = JSON.parse(JSON.stringify(req.body.operaciones_etiquetas || []));

      // Detalles
      for (let o = 0; o < ordenes_compras_detalles.length; o++) {
        ordenes_compras_detalles[o].orden_compra_id = orden_compra.id
        await OrdenCompraDetalle.create(ordenes_compras_detalles[o])
      }

      // Operaciones Etiquetas
      for (let p = 0; p < operaciones_etiquetas.length; p++) {
        await OperacionEtiqueta.create({
          etiqueta_id: operaciones_etiquetas[p].id,
          orden_compra_id: orden_compra.id
        });
      }

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

    }
    await resp.success({ mensaje: 'Orden de Compra agregada', data: orden_compra }, req, res, 'Orden Compra');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateOrdenCompra = async (req, res) => {
  try {
    let orden_compra = await OrdenCompra.update(req.body, { where: { id: req.params.id } });

    await OrdenCompraDetalle.destroy({ where: { orden_compra_id: req.params.id } });
    if (req.body.ordenes_compras_detalles && req.body.ordenes_compras_detalles.length > 0) {
      for (let c = 0; c < req.body.ordenes_compras_detalles.length; c++) {
        delete req.body.ordenes_compras_detalles[c].id;
        req.body.ordenes_compras_detalles[c].orden_compra_id = req.params.id;
        await OrdenCompraDetalle.create(req.body.ordenes_compras_detalles[c]);
      }
    }

    await resp.success({ mensaje: 'Orden de Compra actualizada', data: orden_compra }, req, res, 'Orden Compra');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularOrdenCompra = async (req, res) => {
  try {
    let orden_compra = await OrdenCompra.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Orden de Compra anulada', data: orden_compra }, req, res, 'Orden Compra');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteOrdenCompra = async (req, res) => {
  try {
    let orden_compra = await OrdenCompra.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Orden de Compra eliminada', data: orden_compra }, req, res, 'Orden Compra');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllOrdenesCompras,
  getOneOrdenCompra,
  createOrdenCompra,
  updateOrdenCompra,
  anularOrdenCompra,
  deleteOrdenCompra,
  getOrdenCompraDoc
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