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
import PedidoDetalle from '../pedidos_detalles/pedidos_detalles.model.js';
import Pedido from './pedidos.model.js';
import Moneda from '../monedas/monedas.model.js';
import { Op } from 'sequelize';
import moment from 'moment';
import TipoProducto from '../../inventario/tipos_productos/tipos_productos.model.js';
import Empleado from '../../personal/empleados/empleados.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';
import Equivalencia from '../../inventario/equivalencias/equivalencias.model.js';
import OperacionEtiqueta from '../../inventario/operaciones_etiquetas/operaciones_etiquetas.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';

let getAllPedidos = async (req, res) => {
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

    let pedidos = await Pedido.findAll({
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
    await resp.success({ mensaje: 'Pedidos encontrados', data: pedidos }, req, res, 'Pedido');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getPedidoDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let pedido = await Pedido.findOne({
      where: { id: req.params.pedido_id },
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
          model: Documento, as: 'documento',
        },
        {
          model: PedidoDetalle, as: 'pedidos_detalles',
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
    })

    let file;
    if (req.query.tipo == 'pdf') {
      file = fs.readFileSync('./templates/pedido.html', 'utf8');
    }
    if (req.query.tipo == 'ticket') {
      file = fs.readFileSync('./templates/tickets/pedido.html', 'utf8');
    }

    file = file.replace('___pedido', JSON.stringify(pedido));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOnePedido = async (req, res) => {
  try {
    let pedido = await Pedido.findOne({
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
          model: PedidoDetalle, as: 'pedidos_detalles',
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
    await resp.success({ mensaje: 'Pedido encontrado', data: pedido }, req, res, 'Pedido');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createPedido = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let pedido = await Pedido.create(req.body);
    pedido.id = pedido.null;
    if (pedido) {

      let pedidos_detalles = req.body.pedidos_detalles;
      let operaciones_etiquetas = JSON.parse(JSON.stringify(req.body.operaciones_etiquetas || []));

      // Pedidos Detalles
      for (let p = 0; p < pedidos_detalles.length; p++) {
        pedidos_detalles[p].pedido_id = pedido.id
        await PedidoDetalle.create(pedidos_detalles[p])
      }

      // Operaciones Etiquetas
      for (let p = 0; p < operaciones_etiquetas.length; p++) {
        await OperacionEtiqueta.create({
          etiqueta_id: operaciones_etiquetas[p].id,
          pedido_id: pedido.id
        });
      }

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

    }
    await resp.success({ mensaje: 'Pedido agregado', data: pedido }, req, res, 'Pedido');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updatePedido = async (req, res) => {
  try {
    let pedido = await Pedido.update(req.body, { where: { id: req.params.id } });

    await PedidoDetalle.destroy({ where: { pedido_id: req.params.id } });
    if (req.body.pedidos_detalles && req.body.pedidos_detalles.length > 0) {
      for (let c = 0; c < req.body.pedidos_detalles.length; c++) {
        delete req.body.pedidos_detalles[c].id;
        req.body.pedidos_detalles[c].pedido_id = req.params.id;
        await PedidoDetalle.create(req.body.pedidos_detalles[c]);
      }
    }

    await resp.success({ mensaje: 'Pedido actualizado', data: pedido }, req, res, 'Pedido');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularPedido = async (req, res) => {
  try {
    let pedido = await Pedido.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Pedido anulado', data: pedido }, req, res, 'Pedido');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deletePedido = async (req, res) => {
  try {
    let pedido = await Pedido.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Pedido eliminado', data: pedido }, req, res, 'Pedido');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllPedidos,
  getOnePedido,
  createPedido,
  updatePedido,
  anularPedido,
  deletePedido,
  getPedidoDoc
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