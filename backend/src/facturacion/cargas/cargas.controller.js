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
import Carga from './cargas.model.js';
import CargaDetalle from '../cargas_detalles/cargas_detalles.model.js';
import key from '../../../middleware/key.js';
import Producto from '../../inventario/productos/productos.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Empresa from '../../empresas/empresas.model.js';
import moment from 'moment';
import { Op } from 'sequelize';
import Existencia from '../../inventario/existencias/existencias.model.js';
import Receta from '../../inventario/recetas/recetas.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';
import Inventario from '../../inventario/inventarios/inventarios.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';

let getAllCargas = async (req, res) => {
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

    let cargas = await Carga.findAll({
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
          model: Usuario, as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        },
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Cargas encontradas', data: cargas }, req, res, 'Carga');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getCargaDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let carga = await Carga.findOne({
      where: { id: req.params.carga_id },
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
          model: CargaDetalle, as: 'cargas_detalles',
          include: [
            {
              model: Producto, as: 'producto',
            },
            {
              model: Variacion, as: 'variacion',
            },
            {
              model: Medida, as: 'medida',
            },
            {
              model: Lote, as: 'lote',
            },
          ]
        }
      ]
    });
    let file = fs.readFileSync(`./templates/carga.html`, 'utf8');

    file = file.replace('___carga', JSON.stringify(carga));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCarga = async (req, res) => {
  try {
    let carga = await Carga.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Carga encontrada', data: carga }, req, res, 'Carga');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCarga = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let carga = await Carga.create(req.body);
    carga.id = carga.null;
    if (carga) {

      let cargas_detalles = req.body.cargas_detalles;

      for (let c = 0; c < cargas_detalles.length; c++) {
        cargas_detalles[c].carga_id = carga.id
        await CargaDetalle.create(cargas_detalles[c])
      }

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

      // Actualizar existencias
      if (documento.inventario) {
        cargas_detalles.forEach(async d => {

          if (d.producto.stock) {

            if (!d.producto.combo) {
              let existencia = await Existencia.findOne({
                where: {
                  mes: moment(carga.fecha).format('YYYY-MM'),
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
                  stock_final: parseFloat(existencia.stock_final) + cantidad,
                }, { where: { id: existencia.id } })
              } else {
                await Existencia.create({
                  mes: moment(carga.fecha).format('YYYY-MM'),
                  stock_inicial: 0,
                  stock_final: 0 + cantidad,
                  producto_id: d.producto_id,
                  variacion_id: d.variacion_id,
                  lote_id: d.lote_id,
                  sucursal_id: req.body.sucursal_id,
                  bodega_id: req.body.bodega_id
                })
              }

              // Actualizar inventario retroactivo
              let inventario = await Inventario.findOne({ where: { estado: 'VIGENTE' } });
              let mes_com = moment(carga.fecha).format('YYYY-MM');
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
                    stock_inicial: parseFloat(existencia_mes.stock_inicial) + cantidad,
                    stock_final: parseFloat(existencia_mes.stock_final) + cantidad
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

              recetas.forEach(async r => {
                if (r.producto_receta.stock) {

                  let existencia = await Existencia.findOne({
                    where: {
                      mes: moment(carga.fecha).format('YYYY-MM'),
                      producto_id: r.producto_receta_id,
                      variacion_id: r.variacion_receta_id,
                      lote_id: r.lote_receta_id,
                      sucursal_id: req.body.sucursal_id,
                      bodega_id: req.body.bodega_id
                    }
                  })

                  let cantidad = parseFloat(r.cantidad) * (parseFloat(d.cantidad) * parseFloat(d.equivalencia));

                  if (existencia) {
                    await Existencia.update({
                      stock_final: parseFloat(existencia.stock_final) + (cantidad)
                    }, { where: { id: existencia.id } })
                  } else {
                    await Existencia.create({
                      mes: moment(carga.fecha).format('YYYY-MM'),
                      stock_inicial: 0,
                      stock_final: 0 + (cantidad),
                      producto_id: r.producto_receta_id,
                      variacion_id: r.variacion_receta_id,
                      lote_id: r.lote_receta_id,
                      sucursal_id: req.body.sucursal_id,
                      bodega_id: req.body.bodega_id
                    })
                  }
                }
              });
            }

          }
        });
      }
    }
    await resp.success({ mensaje: 'Carga agregada', data: carga }, req, res, 'Carga');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCarga = async (req, res) => {
  try {
    let carga = await Carga.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Carga actualizada', data: carga }, req, res, 'Carga');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularCarga = async (req, res) => {
  try {

    let carga = await Carga.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: CargaDetalle, as: 'cargas_detalles',
          include: [
            { model: Producto, as: 'producto' }
          ]
        }
      ]
    });

    Carga.update(req.body, { where: { id: carga.id } });
    let documento = await Documento.findOne({ where: { id: carga.documento_id } });

    // Actualizar existencias
    if (documento.inventario) {

      carga.cargas_detalles.forEach(async d => {

        if (!d.producto.combo) {
          let existencia = await Existencia.findOne({
            where: {
              mes: moment(carga.fecha).format('YYYY-MM'),
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: carga.sucursal_id,
              bodega_id: carga.bodega_id
            }
          })

          let cantidad = parseFloat(d.cantidad) * parseFloat(d.equivalencia);

          if (existencia) {
            await Existencia.update({
              stock_final: parseFloat(existencia.stock_final) - cantidad
            }, { where: { id: existencia.id } })
          } else {
            await Existencia.create({
              mes: moment(carga.fecha).format('YYYY-MM'),
              stock_inicial: 0,
              stock_final: 0 - cantidad,
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: carga.sucursal_id,
              bodega_id: carga.bodega_id
            })
          }

          // Actualizar inventario retroactivo
          let inventario = await Inventario.findOne({ where: { estado: 'VIGENTE' } });
          let mes_com = moment(carga.fecha).format('YYYY-MM');
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
                  sucursal_id: carga.sucursal_id,
                  bodega_id: carga.bodega_id
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

          recetas.forEach(async r => {
            if (r.producto_receta.stock) {

              let existencia = await Existencia.findOne({
                where: {
                  mes: moment(carga.fecha).format('YYYY-MM'),
                  producto_id: r.producto_receta_id,
                  variacion_id: r.variacion_receta_id,
                  lote_id: r.lote_receta_id,
                  sucursal_id: carga.sucursal_id,
                  bodega_id: carga.bodega_id
                }
              })

              let cantidad = parseFloat(r.cantidad) * (parseFloat(d.cantidad) * parseFloat(d.equivalencia));

              if (existencia) {
                await Existencia.update({
                  stock_final: parseFloat(existencia.stock_final) - (cantidad)
                }, { where: { id: existencia.id } })
              } else {
                await Existencia.create({
                  mes: moment(carga.fecha).format('YYYY-MM'),
                  stock_inicial: 0,
                  stock_final: 0 - (cantidad),
                  producto_id: r.producto_receta_id,
                  variacion_id: r.variacion_receta_id,
                  lote_id: r.lote_receta_id,
                  sucursal_id: carga.sucursal_id,
                  bodega_id: carga.bodega_id
                })
              }
            }
          });
        }
      });

    }
    await resp.success({ mensaje: 'Carga anulada', data: carga }, req, res, 'Carga');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCarga = async (req, res) => {
  try {
    let carga = await Carga.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Carga eliminada', data: carga }, req, res, 'Carga');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCargas,
  getOneCarga,
  createCarga,
  updateCarga,
  anularCarga,
  deleteCarga,
  getCargaDoc
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