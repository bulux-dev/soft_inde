import fl from '../../../middleware/filtros.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import key from '../../../middleware/key.js';
import resp from '../../../middleware/resp.js';
import Empresa from '../../empresas/empresas.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Documento from '../../facturacion/documentos/documentos.model.js';
import Producto from '../../inventario/productos/productos.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import TipoDocumento from '../../facturacion/tipos_documentos/tipos_documentos.model.js';
import ComandaDetalle from '../comandas_detalles/comandas_detalles.model.js';
import Comanda from './comandas.model.js';
import { Op, where } from 'sequelize';
import moment from 'moment';
import TipoProducto from '../../inventario/tipos_productos/tipos_productos.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';
import Equivalencia from '../../inventario/equivalencias/equivalencias.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import Existencia from '../../inventario/existencias/existencias.model.js';
import Inventario from '../../inventario/inventarios/inventarios.model.js';
import Receta from '../../inventario/recetas/recetas.model.js';
import Cuenta from '../cuentas/cuentas.model.js';
import Estacion from '../estaciones/estaciones.model.js';
import Area from '../areas/areas.model.js';
import Comercio from '../comercios/comercios.model.js';

let getAllComandas = async (req, res) => {
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

    let comandas = await Comanda.findAll({
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
          model: Sucursal, as: 'sucursal',
        },
        {
          model: Bodega, as: 'bodega',
        },
        {
          model: Usuario, as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        }
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Comandas encontradas', data: comandas }, req, res, 'Comanda');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllComandasDisplay = async (req, res) => {
  try {
    let comandas = await Comanda.findAll({
      where: { 
        id: { [Op.gt]: req.query.last }
       },
      include: [
        {
          model: Cuenta, as: 'cuenta',
          where: { estado: 'ABIERTA' },
          include: [
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
        },
        {
          model: ComandaDetalle, as: 'comandas_detalles',
          where: { finalizado: false },
        }
      ],
      order: [
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Comandas encontradas', data: comandas }, req, res, 'Comanda');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getComandaDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let comanda = await Comanda.findOne({
      where: { id: req.params.comanda_id },
      include: [
        {
          model: Sucursal, as: 'sucursal',
        },
        {
          model: Bodega, as: 'bodega',
        },
        {
          model: Usuario, as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: ComandaDetalle, as: 'comandas_detalles',
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

    let file = fs.readFileSync('./templates/comanda.html', 'utf8');

    file = file.replace('___comanda', JSON.stringify(comanda));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneComanda = async (req, res) => {
  try {
    let comanda = await Comanda.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Sucursal, as: 'sucursal',
        },
        {
          model: Bodega, as: 'bodega',
        },
        {
          model: ComandaDetalle, as: 'comandas_detalles',
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
    await resp.success({ mensaje: 'Comanda encontrada', data: comanda }, req, res, 'Comanda');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createComanda = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let comanda = await Comanda.create(req.body);
    comanda.id = comanda.null;
    if (comanda) {

      let comandas_detalles = req.body.comandas_detalles;

      // Comandas Detalles
      for (let c = 0; c < comandas_detalles.length; c++) {
        comandas_detalles[c].comanda_id = comanda.id
        await ComandaDetalle.create(comandas_detalles[c])
      }

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

      // Actualizar existencias
      for (let i = 0; i < comandas_detalles.length; i++) {
        let d = comandas_detalles[i];

        if (d.producto.stock) {

          if (!d.producto.combo) {
            let existencia = await Existencia.findOne({
              where: {
                mes: moment(comanda.fecha).format('YYYY-MM'),
                producto_id: d.producto_id,
                variacion_id: d.variacion_id,
                lote_id: d.lote_id,
                sucursal_id: req.body.sucursal_id,
                bodega_id: req.body.bodega_id
              }
            })

            let cantidad = parseFloat(d.cantidad) * parseFloat(d.equivalencia);

            if (existencia) {
              await Existencia.update({
                stock_final: parseFloat(existencia.stock_final) - (cantidad)
              }, { where: { id: existencia.id } })
            } else {
              await Existencia.create({
                mes: moment(comanda.fecha).format('YYYY-MM'),
                stock_inicial: 0,
                stock_final: 0 - (cantidad),
                producto_id: d.producto_id,
                variacion_id: d.variacion_id,
                lote_id: d.lote_id,
                sucursal_id: req.body.sucursal_id,
                bodega_id: req.body.bodega_id
              })
            }

            // Actualizar inventario retroactivo
            let inventario = await Inventario.findOne({ where: { estado: 'VIGENTE' } });
            let mes_com = moment(comanda.fecha).format('YYYY-MM');
            let mes_inv_actual = moment(inventario.mes).format('YYYY-MM');
            let meses_diff = moment(mes_inv_actual).diff(moment(mes_com), 'months');
            if (meses_diff) {
              for (let m = 0; m < meses_diff; m++) {
                let existencia_mes = await Existencia.findOne({
                  where: {
                    mes: moment(mes_com).add(m + 1, 'month').format('YYYY-MM'),
                    producto_id: d.producto_id,
                    variacion_id: d.variacion_id,
                    lote_id: d.lote_id,
                    sucursal_id: req.body.sucursal_id,
                    bodega_id: req.body.bodega_id
                  }
                });

                await Existencia.update({
                  stock_inicial: parseFloat(existencia_mes.stock_inicial) - cantidad,
                  stock_final: parseFloat(existencia_mes.stock_final) - cantidad
                }, {
                  where: { id: existencia_mes.id }
                })
              }
            }
          }

          if (d.producto.combo) {
            let recetas = await Receta.findAll({
              where: { producto_id: d.producto_id },
              include: [{ model: Producto, as: 'producto_receta' }]
            });

            for (let i = 0; i < recetas.length; i++) {
              let r = recetas[i];

              if (r.producto_receta.stock) {

                let existencia = await Existencia.findOne({
                  where: {
                    mes: moment(comanda.fecha).format('YYYY-MM'),
                    producto_id: r.producto_receta_id,
                    variacion_id: r.variacion_receta_id,
                    lote_id: r.lote_receta_id,
                    sucursal_id: req.body.sucursal_id,
                    bodega_id: req.body.bodega_id
                  }
                })

                let cantidad = (parseFloat(r.cantidad) * (parseFloat(d.cantidad) * parseFloat(d.equivalencia)))

                if (existencia) {
                  await Existencia.update({
                    stock_final: parseFloat(existencia.stock_final) - (cantidad)
                  }, { where: { id: existencia.id } })
                } else {
                  await Existencia.create({
                    mes: moment(comanda.fecha).format('YYYY-MM'),
                    stock_inicial: 0,
                    stock_final: 0 - (cantidad),
                    producto_id: r.producto_receta_id,
                    variacion_id: r.variacion_receta_id,
                    lote_id: r.lote_receta_id,
                    sucursal_id: req.body.sucursal_id,
                    bodega_id: req.body.bodega_id
                  })
                }
              }
            }
          }

        }
      }

    }
    await resp.success({ mensaje: 'Comanda agregada', data: comanda }, req, res, 'Comanda');
  } catch (err) {
    await resp.error(err, req, res);
  }
}


let updateComanda = async (req, res) => {
  try {
    let comanda = await Comanda.update(req.body, { where: { id: req.params.id } });

    if (req.body.comandas_detalles && req.body.comandas_detalles.length > 0) {
      await ComandaDetalle.destroy({ where: { comanda_id: req.params.id } });
      for (let c = 0; c < req.body.comandas_detalles.length; c++) {
        req.body.comandas_detalles[c].comanda_id = req.params.id;
        await ComandaDetalle.create(req.body.comandas_detalles[c]);
      }
    }

    await resp.success({ mensaje: 'Comanda actualizada', data: comanda }, req, res, 'Comanda');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularComanda = async (req, res) => {
  try {
    let comanda = await Comanda.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Comanda anulada', data: comanda }, req, res, 'Comanda');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteComanda = async (req, res) => {
  try {
    let comanda = await Comanda.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Comanda eliminada', data: comanda }, req, res, 'Comanda');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllComandas,
  getAllComandasDisplay,
  getOneComanda,
  createComanda,
  updateComanda,
  anularComanda,
  deleteComanda,
  getComandaDoc
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