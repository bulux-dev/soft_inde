import moment from 'moment';
import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Atributo from '../atributos/atributos.model.js';
import Producto from '../productos/productos.model.js';
import Lote from '../lotes/lotes.model.js';
import Termino from '../terminos/terminos.model.js';
import Valor from '../valores/valores.model.js';
import Variacion from '../variaciones/variaciones.model.js';
import VariacionDetalle from '../variaciones_detalles/variaciones_detalles.model.js';
import Existencia from './existencias.model.js';
import { Op } from 'sequelize';
import Documento from '../../facturacion/documentos/documentos.model.js';
import CompraDetalle from '../../facturacion/compras_detalles/compras_detalles.model.js';
import Compra from '../../facturacion/compras/compras.model.js';
import VentaDetalle from '../../facturacion/ventas_detalles/ventas_detalles.model.js';
import Venta from '../../facturacion/ventas/ventas.model.js';
import CargaDetalle from '../../facturacion/cargas_detalles/cargas_detalles.model.js';
import Carga from '../../facturacion/cargas/cargas.model.js';
import DescargaDetalle from '../../facturacion/descargas_detalles/descargas_detalles.model.js';
import Descarga from '../../facturacion/descargas/descargas.model.js';
import TrasladoDetalle from '../../facturacion/traslados_detalles/traslados_detalles.model.js';
import Traslado from '../../facturacion/traslados/traslados.model.js';
import Importacion from '../../facturacion/importaciones/importaciones.model.js';
import ImportacionDetalle from '../../facturacion/importaciones_detalles/importaciones_detalles.model.js';
import Medida from '../medidas/medidas.model.js';
import Comanda from '../../comandas/comandas/comandas.model.js';
import ComandaDetalle from '../../comandas/comandas_detalles/comandas_detalles.model.js';
import Envio from '../../facturacion/envios/envios.model.js';
import EnvioDetalle from '../../facturacion/envios_detalles/envios_detalles.model.js';

let getAllExistencias = async (req, res) => {
  try {
    let where = fl(req.query);
    let existencias = await Existencia.findAll({
      where: where,
      order: [
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Existencias encontradas', data: existencias }, req, res, 'Existencia');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllExistenciaStock = async (req, res) => {
  try {
    let where = fl(req.query);
    let existencia = await Existencia.findOne({
      where: where,
      include: [
        {
          model: Producto, as: 'producto',
          include: [
            {
              model: Medida, as: 'medida'
            },
          ]
        },
        {
          model: Variacion, as: 'variacion',
          include: [
            {
              model: VariacionDetalle, as: 'variaciones_detalles',
              include: [
                {
                  model: Atributo, as: 'atributo'
                },
                {
                  model: Termino, as: 'termino',
                  include: [
                    { model: Valor, as: 'valor' }
                  ]
                }
              ]
            }
          ]
        },
        {
          model: Lote, as: 'lote'
        },
      ]
    });
    await resp.success({ mensaje: 'Existencia encontrada', data: existencia }, req, res, 'Existencia');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllExistenciasKardex = async (req, res) => {
  try {

    let where = {
      fecha: {
        [Op.between]: [
          moment(req.params.fecha_inicio).startOf('month').format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ],
      },
      estado: {
        [Op.or]: ['VIGENTE', 'PENDIENTE']
      },
      sucursal_id: req.query.sucursal_id,
      bodega_id: req.query.bodega_id,
    }

    let where_traslado_entrada = {
      fecha: {
        [Op.between]: [
          moment(req.params.fecha_inicio).startOf('month').format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ],
      },
      estado: 'VIGENTE',
      sucursal_entrada_id: req.query.sucursal_id,
      bodega_entrada_id: req.query.bodega_id,
    }

    let where_traslado_salida = {
      fecha: {
        [Op.between]: [
          moment(req.params.fecha_inicio).startOf('month').format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ],
      },
      estado: 'VIGENTE',
      sucursal_salida_id: req.query.sucursal_id,
      bodega_salida_id: req.query.bodega_id,
    }

    let attributes = ['id', 'cantidad', 'equivalencia'];

    let where_detalle = {
      producto_id: req.query.producto_id,
      variacion_id: req.query.variacion_id != 'null' ? req.query.variacion_id : null,
      lote_id: req.query.lote_id != 'null' ? req.query.lote_id : null
    }

    let compras_detalles = await CompraDetalle.findAll({
      where: where_detalle,
      attributes: attributes,
      include: [
        {
          model: Medida, as: 'medida'
        },
        {
          model: Compra, as: 'compra',
          where: where,
          include: [
            {
              model: Documento, as: 'documento',
            }
          ]
        }
      ],
    });

    let cargas_detalles = await CargaDetalle.findAll({
      where: where_detalle,
      attributes: attributes,
      include: [
        {
          model: Medida, as: 'medida'
        },
        {
          model: Carga, as: 'carga',
          where: where,
          include: [
            {
              model: Documento, as: 'documento',
            }
          ]
        }
      ],
    });

    let ventas_detalles = await VentaDetalle.findAll({
      where: where_detalle,
      attributes: attributes,
      include: [
        {
          model: Medida, as: 'medida'
        },
        {
          model: Venta, as: 'venta',
          where: where,
          include: [
            {
              model: Documento, as: 'documento',
              where: {
                inventario: true
              }
            }
          ]
        }
      ],
    });

    let descargas_detalles = await DescargaDetalle.findAll({
      where: where_detalle,
      attributes: attributes,
      include: [
        {
          model: Medida, as: 'medida'
        },
        {
          model: Descarga, as: 'descarga',
          where: where,
          include: [
            {
              model: Documento, as: 'documento',
              where: {
                inventario: true
              }
            }
          ]
        }
      ],
    });

    let envios_detalles = await EnvioDetalle.findAll({
      where: where_detalle,
      attributes: attributes,
      include: [
        {
          model: Medida, as: 'medida'
        },
        {
          model: Envio, as: 'envio',
          where: where,
          include: [
            {
              model: Documento, as: 'documento',
              where: {
                inventario: true
              }
            }
          ]
        }
      ],
    });

    let traslados_entradas_detalles = await TrasladoDetalle.findAll({
      where: where_detalle,
      attributes: attributes,
      include: [
        {
          model: Medida, as: 'medida'
        },
        {
          model: Traslado, as: 'traslado',
          where: where_traslado_entrada,
          include: [
            {
              model: Documento, as: 'documento',
              where: {
                inventario: true
              }
            }
          ]
        }
      ],
    });

    let traslados_salidas_detalles = await TrasladoDetalle.findAll({
      where: where_detalle,
      attributes: attributes,
      include: [
        {
          model: Medida, as: 'medida'
        },
        {
          model: Traslado, as: 'traslado',
          where: where_traslado_salida,
          include: [
            {
              model: Documento, as: 'documento',
              where: {
                inventario: true
              }
            }
          ]
        }
      ],
    });

    let importaciones_detalles = await ImportacionDetalle.findAll({
      where: where_detalle,
      attributes: attributes,
      include: [
        {
          model: Medida, as: 'medida'
        },
        {
          model: Importacion, as: 'importacion',
          where: where,
          include: [
            {
              model: Documento, as: 'documento',
              where: {
                inventario: true
              }
            }
          ]
        }
      ],
    });

    let comandas_detalles = await ComandaDetalle.findAll({
      where: where_detalle,
      attributes: attributes,
      include: [
        {
          model: Medida, as: 'medida'
        },
        {
          model: Comanda, as: 'comanda',
          where: where,
          include: [
            {
              model: Documento, as: 'documento',
              where: {
                inventario: true
              }
            }
          ]
        }
      ],
    });

    compras_detalles = JSON.parse(JSON.stringify(compras_detalles));
    cargas_detalles = JSON.parse(JSON.stringify(cargas_detalles));
    ventas_detalles = JSON.parse(JSON.stringify(ventas_detalles));
    descargas_detalles = JSON.parse(JSON.stringify(descargas_detalles));
    envios_detalles = JSON.parse(JSON.stringify(envios_detalles));
    traslados_entradas_detalles = JSON.parse(JSON.stringify(traslados_entradas_detalles));
    traslados_salidas_detalles = JSON.parse(JSON.stringify(traslados_salidas_detalles));
    importaciones_detalles = JSON.parse(JSON.stringify(importaciones_detalles));
    comandas_detalles = JSON.parse(JSON.stringify(comandas_detalles));

    for (let i = 0; i < compras_detalles.length; i++) {
      compras_detalles[i].compra_id = compras_detalles[i].compra.id
    }

    for (let i = 0; i < cargas_detalles.length; i++) {
      cargas_detalles[i].carga_id = cargas_detalles[i].carga.id
    }

    for (let i = 0; i < ventas_detalles.length; i++) {
      ventas_detalles[i].venta_id = ventas_detalles[i].venta.id
    }

    for (let i = 0; i < descargas_detalles.length; i++) {
      descargas_detalles[i].descarga_id = descargas_detalles[i].descarga.id
    }

    for (let i = 0; i < envios_detalles.length; i++) {
      envios_detalles[i].envio_id = envios_detalles[i].envio.id
    }

    for (let i = 0; i < traslados_entradas_detalles.length; i++) {
      traslados_entradas_detalles[i].traslado_entrada_id = traslados_entradas_detalles[i].traslado.id
    }

    for (let i = 0; i < traslados_salidas_detalles.length; i++) {
      traslados_salidas_detalles[i].traslado_salida_id = traslados_salidas_detalles[i].traslado.id
    }

    for (let i = 0; i < importaciones_detalles.length; i++) {
      importaciones_detalles[i].importacion_id = importaciones_detalles[i].importacion.id
    }

    for (let i = 0; i < comandas_detalles.length; i++) {
      comandas_detalles[i].comanda_id = comandas_detalles[i].comanda.id
    }

    let kardex = [];

    kardex = [...compras_detalles, ...ventas_detalles, ...cargas_detalles, ...descargas_detalles, ...envios_detalles, ...traslados_entradas_detalles, ...traslados_salidas_detalles, ...importaciones_detalles, ...comandas_detalles];
    kardex.sort((a, b) => {
      const fechaA = a.compra?.fecha || a.carga?.fecha || a.venta?.fecha || a.descarga?.fecha || a.envio?.fecha || a.traslado?.fecha || a.importacion?.fecha || a.comanda?.fecha || null;
      const fechaB = b.compra?.fecha || b.carga?.fecha || b.venta?.fecha || b.descarga?.fecha || b.envio?.fecha || b.traslado?.fecha || b.importacion?.fecha || b.comanda?.fecha || null;
      return moment(fechaA).diff(moment(fechaB));
    });

    let existencia = await Existencia.findOne({
      where: {
        mes: moment(req.params.fecha_inicio).format('YYYY-MM'),
        producto_id: req.query.producto_id,
        variacion_id: req.query.variacion_id != 'null' ? req.query.variacion_id : null,
        lote_id: req.query.lote_id != 'null' ? req.query.lote_id : null,
        sucursal_id: req.query.sucursal_id,
        bodega_id: req.query.bodega_id
      }
    });

    let stock_inicial = existencia ? parseFloat(existencia.stock_inicial) : 0;

    for (let k = 0; k < kardex.length; k++) {
      if (kardex[k].compra_id) {
        kardex[k].tipo = 'entrada';
        kardex[k].fecha = kardex[k].compra.fecha;
        kardex[k].documento = kardex[k].compra;
      }
      if (kardex[k].venta_id) {
        kardex[k].tipo = 'salida';
        kardex[k].fecha = kardex[k].venta.fecha;
        kardex[k].documento = kardex[k].venta;
      }
      if (kardex[k].carga_id) {
        kardex[k].tipo = 'entrada';
        kardex[k].fecha = kardex[k].carga.fecha;
        kardex[k].documento = kardex[k].carga;
      }
      if (kardex[k].descarga_id) {
        kardex[k].tipo = 'salida';
        kardex[k].fecha = kardex[k].descarga.fecha;
        kardex[k].documento = kardex[k].descarga;
      }
      if (kardex[k].envio_id) {
        kardex[k].tipo = 'salida';
        kardex[k].fecha = kardex[k].envio.fecha;
        kardex[k].documento = kardex[k].envio;
      }
      if (kardex[k].traslado_entrada_id) {
        kardex[k].tipo = 'entrada';
        kardex[k].fecha = kardex[k].traslado.fecha;
        kardex[k].documento = kardex[k].traslado;
      }
      if (kardex[k].traslado_salida_id) {
        kardex[k].tipo = 'salida';
        kardex[k].fecha = kardex[k].traslado.fecha;
        kardex[k].documento = kardex[k].traslado;
      }
      if (kardex[k].importacion_id) {
        kardex[k].tipo = 'entrada';
        kardex[k].fecha = kardex[k].importacion.fecha;
        kardex[k].documento = kardex[k].importacion;
      }
      if (kardex[k].comanda_id) {
        kardex[k].tipo = 'comanda';
        kardex[k].fecha = kardex[k].comanda.fecha;
        kardex[k].documento = kardex[k].comanda;
      }
    }

    let fi = moment(req.params.fecha_inicio);
    let kardex_bloque1 = kardex.filter(k => moment(k.fecha).isBefore(fi));
    let kardex_bloque2 = kardex.filter(k => moment(k.fecha).isSameOrAfter(fi));

    for (let k = 0; k < kardex_bloque1.length; k++) {
      if (kardex_bloque1[k].compra_id) {
        stock_inicial += parseFloat(kardex_bloque1[k].cantidad * kardex_bloque1[k].equivalencia);
      }
      if (kardex_bloque1[k].venta_id) {
        stock_inicial -= parseFloat(kardex_bloque1[k].cantidad * kardex_bloque1[k].equivalencia);
      }
      if (kardex_bloque1[k].carga_id) {
        stock_inicial += parseFloat(kardex_bloque1[k].cantidad * kardex_bloque1[k].equivalencia);
      }
      if (kardex_bloque1[k].descarga_id) {
        stock_inicial -= parseFloat(kardex_bloque1[k].cantidad * kardex_bloque1[k].equivalencia);
      }
      if (kardex_bloque1[k].envio_id) {
        stock_inicial -= parseFloat(kardex_bloque1[k].cantidad * kardex_bloque1[k].equivalencia);
      }
      if (kardex_bloque1[k].traslado_entrada_id) {
        stock_inicial += parseFloat(kardex_bloque1[k].cantidad * kardex_bloque1[k].equivalencia);
      }
      if (kardex_bloque1[k].traslado_salida_id) {
        stock_inicial -= parseFloat(kardex_bloque1[k].cantidad * kardex_bloque1[k].equivalencia);
      }
      if (kardex_bloque1[k].importacion_id) {
        stock_inicial += parseFloat(kardex_bloque1[k].cantidad * kardex_bloque1[k].equivalencia);
      }
      if (kardex_bloque1[k].comanda_id) {
        stock_inicial -= parseFloat(kardex_bloque1[k].cantidad * kardex_bloque1[k].equivalencia);
      }
    }

    let stock_final = stock_inicial;

    for (let k = 0; k < kardex_bloque2.length; k++) {
      if (kardex_bloque2[k].compra_id) {
        stock_final += parseFloat(kardex_bloque2[k].cantidad) * kardex_bloque2[k].equivalencia;
        kardex_bloque2[k].stock_final = stock_final;
        kardex_bloque2[k].tipo = 'entrada';
        kardex_bloque2[k].fecha = kardex_bloque2[k].compra.fecha;
      }
      if (kardex_bloque2[k].venta_id) {
        stock_final -= parseFloat(kardex_bloque2[k].cantidad) * kardex_bloque2[k].equivalencia;
        kardex_bloque2[k].stock_final = stock_final;
        kardex_bloque2[k].tipo = 'salida';
        kardex_bloque2[k].fecha = kardex_bloque2[k].venta.fecha;
      }
      if (kardex_bloque2[k].carga_id) {
        stock_final += parseFloat(kardex_bloque2[k].cantidad) * kardex_bloque2[k].equivalencia;
        kardex_bloque2[k].stock_final = stock_final;
        kardex_bloque2[k].tipo = 'entrada';
        kardex_bloque2[k].fecha = kardex_bloque2[k].carga.fecha;
      }
      if (kardex_bloque2[k].descarga_id) {
        stock_final -= parseFloat(kardex_bloque2[k].cantidad) * kardex_bloque2[k].equivalencia;
        kardex_bloque2[k].stock_final = stock_final;
        kardex_bloque2[k].tipo = 'salida';
        kardex_bloque2[k].fecha = kardex_bloque2[k].descarga.fecha;
      }
      if (kardex_bloque2[k].envio_id) {
        stock_final -= parseFloat(kardex_bloque2[k].cantidad) * kardex_bloque2[k].equivalencia;
        kardex_bloque2[k].stock_final = stock_final;
        kardex_bloque2[k].tipo = 'salida';
        kardex_bloque2[k].fecha = kardex_bloque2[k].envio.fecha;
      }
      if (kardex_bloque2[k].traslado_entrada_id) {
        stock_final += parseFloat(kardex_bloque2[k].cantidad) * kardex_bloque2[k].equivalencia;
        kardex_bloque2[k].stock_final = stock_final;
        kardex_bloque2[k].tipo = 'entrada';
        kardex_bloque2[k].fecha = kardex_bloque2[k].traslado.fecha;
      }
      if (kardex_bloque2[k].traslado_salida_id) {
        stock_final -= parseFloat(kardex_bloque2[k].cantidad) * kardex_bloque2[k].equivalencia;
        kardex_bloque2[k].stock_final = stock_final;
        kardex_bloque2[k].tipo = 'salida';
        kardex_bloque2[k].fecha = kardex_bloque2[k].traslado.fecha;
      }
      if (kardex_bloque2[k].importacion_id) {
        stock_final += parseFloat(kardex_bloque2[k].cantidad) * kardex_bloque2[k].equivalencia;
        kardex_bloque2[k].stock_final = stock_final;
        kardex_bloque2[k].tipo = 'entrada';
        kardex_bloque2[k].fecha = kardex_bloque2[k].importacion.fecha;
      }
      if (kardex_bloque2[k].comanda_id) {
        stock_final -= parseFloat(kardex_bloque2[k].cantidad) * kardex_bloque2[k].equivalencia;
        kardex_bloque2[k].stock_final = stock_final;
        kardex_bloque2[k].tipo = 'salida';
        kardex_bloque2[k].fecha = kardex_bloque2[k].comanda.fecha;
      }
    }

    kardex_bloque2.reverse();

    await resp.success({
      mensaje: 'Existencias encontradas', data: {
        stock_inicial,
        stock_final,
        kardex: kardex_bloque2,
      }
    }, req, res, 'Existencia');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getExistenciaStock = async (req, res) => {
  try {
    let where = fl(req.query);
    let existencia = await Existencia.findOne({ where: where });
    await resp.success({ mensaje: 'Existencia encontrada', data: existencia }, req, res, 'Existencia');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneExistencia = async (req, res) => {
  try {
    let existencia = await Existencia.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Existencia encontrada', data: existencia }, req, res, 'Existencia');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createExistencia = async (req, res) => {
  try {
    let existencia = await Existencia.create(req.body);
    existencia.id = existencia.null;
    await resp.success({ mensaje: 'Existencia agregada', data: existencia }, req, res, 'Existencia');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateExistencia = async (req, res) => {
  try {
    Object.keys(req.body).forEach(key => {
      !req.body[key] ? req.body[key] = null : null;
    });
    let existencia = await Existencia.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Existencia actualizada', data: existencia }, req, res, 'Existencia');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteExistencia = async (req, res) => {
  try {
    let existencia = await Existencia.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Existencia eliminada', data: existencia }, req, res, 'Existencia');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllExistencias,
  getAllExistenciaStock,
  getAllExistenciasKardex,
  getExistenciaStock,
  getOneExistencia,
  createExistencia,
  updateExistencia,
  deleteExistencia
}