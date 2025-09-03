import fl from '../../../middleware/filtros.js';
import fs from 'fs';
import resp from '../../../middleware/resp.js';
import jwt from 'jsonwebtoken';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Documento from '../documentos/documentos.model.js';
import TipoDocumento from '../tipos_documentos/tipos_documentos.model.js';
import Traslado from './traslados.model.js';
import TrasladoDetalle from '../traslados_detalles/traslados_detalles.model.js';
import key from '../../../middleware/key.js';
import Producto from '../../inventario/productos/productos.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Existencia from '../../inventario/existencias/existencias.model.js';
import Empresa from '../../empresas/empresas.model.js';
import moment from 'moment';
import { Op } from 'sequelize';
import Receta from '../../inventario/recetas/recetas.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';
import Inventario from '../../inventario/inventarios/inventarios.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';

let getAllTraslados = async (req, res) => {
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
    let traslados = await Traslado.findAll({
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
          model: Sucursal, as: 'sucursal_salida',
        },
        {
          model: Bodega, as: 'bodega_salida',
        },
        {
          model: Sucursal, as: 'sucursal_entrada',
        },
        {
          model: Bodega, as: 'bodega_entrada',
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
    await resp.success({ mensaje: 'Traslados encontrados', data: traslados }, req, res, 'Traslado');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getTrasladoDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let traslado = await Traslado.findOne({
      where: { id: req.params.traslado_id },
      include: [
        {
          model: Sucursal, as: 'sucursal_salida',
        },
        {
          model: Bodega, as: 'bodega_salida',
        },
        {
          model: Sucursal, as: 'sucursal_entrada',
        },
        {
          model: Bodega, as: 'bodega_entrada',
        },
        {
          model: TrasladoDetalle, as: 'traslados_detalles',
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
            }
          ]
        }
      ]
    });
    let file = fs.readFileSync(`./templates/traslado.html`, 'utf8');

    file = file.replace('___traslado', JSON.stringify(traslado));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneTraslado = async (req, res) => {
  try {
    let traslado = await Traslado.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Traslado encontrado', data: traslado }, req, res, 'Traslado');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createTraslado = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let traslado = await Traslado.create(req.body);
    traslado.id = traslado.null;
    if (traslado) {

      let traslados_detalles = req.body.traslados_detalles;

      for (let t = 0; t < traslados_detalles.length; t++) {
        traslados_detalles[t].traslado_id = traslado.id
        await TrasladoDetalle.create(traslados_detalles[t])
      }

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

      // Actualizar existencias
      if (documento.inventario) {
        traslados_detalles.forEach(async d => {

          let existencia;

          // Salida
          if (!d.producto.combo) {
            existencia = await Existencia.findOne({
              where: {
                mes: moment(traslado.fecha).format('YYYY-MM'),
                producto_id: d.producto_id,
                variacion_id: d.variacion_id,
                lote_id: d.lote_id,
                sucursal_id: req.body.sucursal_salida_id,
                bodega_id: req.body.bodega_salida_id
              }
            });

            let cantidad = parseFloat(d.cantidad) * parseFloat(d.equivalencia);

            if (existencia) {
              await Existencia.update({
                stock_final: parseFloat(existencia.stock_final) - (cantidad)
              }, { where: { id: existencia.id } })
            } else {
              await Existencia.create({
                mes: moment(traslado.fecha).format('YYYY-MM'),
                stock_inicial: 0,
                stock_final: 0 - (cantidad),
                producto_id: d.producto_id,
                variacion_id: d.variacion_id,
                lote_id: d.lote_id,
                sucursal_id: req.body.sucursal_salida_id,
                bodega_id: req.body.bodega_salida_id,
              })
            }

            // Actualizar inventario retroactivo
            let inventario = await Inventario.findOne({ where: { estado: 'VIGENTE' } });
            let mes_com = moment(traslado.fecha).format('YYYY-MM');
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

            recetas.forEach(async r => {
              if (r.producto_receta.stock) {

                let existencia = await Existencia.findOne({
                  where: {
                    mes: moment(traslado.fecha).format('YYYY-MM'),
                    producto_id: r.producto_receta_id,
                    variacion_id: r.variacion_receta_id,
                    lote_id: r.lote_receta_id,
                    sucursal_id: req.body.sucursal_salida_id,
                    bodega_id: req.body.bodega_salida_id,
                  }
                })

                let cantidad = (parseFloat(r.cantidad) * (parseFloat(d.cantidad) * parseFloat(d.equivalencia)))

                if (existencia) {
                  await Existencia.update({
                    stock_final: parseFloat(existencia.stock_final) - (cantidad)
                  }, { where: { id: existencia.id } })
                } else {
                  await Existencia.create({
                    mes: moment(traslado.fecha).format('YYYY-MM'),
                    stock_inicial: 0,
                    stock_final: 0 - (cantidad),
                    producto_id: r.producto_receta_id,
                    variacion_id: r.variacion_receta_id,
                    lote_id: r.lote_receta_id,
                    sucursal_id: req.body.sucursal_salida_id,
                    bodega_id: req.body.bodega_salida_id,
                  })
                }
              }
            });
          }



          // Entrada
          if (!d.producto.combo) {
            existencia = await Existencia.findOne({
              where: {
                mes: moment(traslado.fecha).format('YYYY-MM'),
                producto_id: d.producto_id,
                variacion_id: d.variacion_id,
                lote_id: d.lote_id,
                sucursal_id: req.body.sucursal_entrada_id,
                bodega_id: req.body.bodega_entrada_id
              }
            });

            let cantidad = parseFloat(d.cantidad) * parseFloat(d.equivalencia);

            if (existencia) {
              await Existencia.update({
                stock_final: parseFloat(existencia.stock_final) + (cantidad)
              }, { where: { id: existencia.id } })
            } else {
              await Existencia.create({
                mes: moment(traslado.fecha).format('YYYY-MM'),
                stock_inicial: 0,
                stock_final: 0 + (cantidad),
                producto_id: d.producto_id,
                variacion_id: d.variacion_id,
                lote_id: d.lote_id,
                sucursal_id: req.body.sucursal_entrada_id,
                bodega_id: req.body.bodega_entrada_id
              })
            }

            // Actualizar inventario retroactivo
            let inventario = await Inventario.findOne({ where: { estado: 'VIGENTE' } });
            let mes_com = moment(traslado.fecha).format('YYYY-MM');
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
                    mes: moment(traslado.fecha).format('YYYY-MM'),
                    producto_id: r.producto_receta_id,
                    variacion_id: r.variacion_receta_id,
                    lote_id: r.lote_receta_id,
                    sucursal_id: req.body.sucursal_entrada_id,
                    bodega_id: req.body.bodega_entrada_id
                  }
                })

                let cantidad = (parseFloat(r.cantidad) * (parseFloat(d.cantidad) * parseFloat(d.equivalencia)))

                if (existencia) {
                  await Existencia.update({
                    stock_final: parseFloat(existencia.stock_final) + (cantidad)
                  }, { where: { id: existencia.id } })
                } else {
                  await Existencia.create({
                    mes: moment(traslado.fecha).format('YYYY-MM'),
                    stock_inicial: 0,
                    stock_final: 0 + (cantidad),
                    producto_id: r.producto_receta_id,
                    variacion_id: r.variacion_receta_id,
                    lote_id: r.lote_receta_id,
                    sucursal_id: req.body.sucursal_entrada_id,
                    bodega_id: req.body.bodega_entrada_id
                  })
                }
              }
            });
          }

        });
      }
    }
    await resp.success({ mensaje: 'Traslado agregado', data: traslado }, req, res, 'Traslado');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateTraslado = async (req, res) => {
  try {
    let traslado = await Traslado.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Traslado actualizado', data: traslado }, req, res, 'Traslado');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularTraslado = async (req, res) => {
  try {

    let traslado = await Traslado.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: TrasladoDetalle, as: 'traslados_detalles',
          include: [
            { model: Producto, as: 'producto' }
          ]
        }
      ]
    });

    await Traslado.update(req.body, { where: { id: traslado.id } });
    let documento = await Documento.findOne({ where: { id: traslado.documento_id } });

    // Actualizar existencias
    if (documento.inventario) {

      traslado.traslados_detalles.forEach(async d => {

        // Revertir Salida
        if (!d.producto.combo) {
          let existencia = await Existencia.findOne({
            where: {
              mes: moment(traslado.fecha).format('YYYY-MM'),
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: traslado.sucursal_salida_id,
              bodega_id: traslado.bodega_salida_id
            }
          })

          let cantidad = parseFloat(d.cantidad) * parseFloat(d.equivalencia);

          if (existencia) {
            await Existencia.update({
              stock_final: parseFloat(existencia.stock_final) + (cantidad)
            }, { where: { id: existencia.id } })
          } else {
            await Existencia.create({
              mes: moment(traslado.fecha).format('YYYY-MM'),
              stock_inicial: 0,
              stock_final: 0 + (cantidad),
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: traslado.sucursal_salida_id,
              bodega_id: traslado.bodega_salida_id
            })
          }

          // Actualizar inventario retroactivo
          let inventario = await Inventario.findOne({ where: { estado: 'VIGENTE' } });
          let mes_com = moment(traslado.fecha).format('YYYY-MM');
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
                  sucursal_id: traslado.sucursal_salida_id,
                  bodega_id: traslado.bodega_salida_id
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
                  mes: moment(traslado.fecha).format('YYYY-MM'),
                  producto_id: r.producto_receta_id,
                  variacion_id: r.variacion_receta_id,
                  lote_id: r.lote_receta_id,
                  sucursal_id: traslado.sucursal_salida_id,
                  bodega_id: traslado.bodega_salida_id
                }
              })

              let cantidad = (parseFloat(r.cantidad) * parseFloat(d.cantidad)) * parseFloat(d.equivalencia);

              if (existencia) {
                await Existencia.update({
                  stock_final: parseFloat(existencia.stock_final) + (cantidad)
                }, { where: { id: existencia.id } })
              } else {
                await Existencia.create({
                  mes: moment(traslado.fecha).format('YYYY-MM'),
                  stock_inicial: 0,
                  stock_final: 0 + (cantidad),
                  producto_id: r.producto_receta_id,
                  variacion_id: r.variacion_receta_id,
                  lote_id: r.lote_receta_id,
                  sucursal_id: traslado.sucursal_salida_id,
                  bodega_id: traslado.bodega_salida_id
                })
              }
            }
          });
        }

        // Revertir Entrada
        if (!d.producto.combo) {
          let existencia = await Existencia.findOne({
            where: {
              mes: moment(traslado.fecha).format('YYYY-MM'),
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: traslado.sucursal_entrada_id,
              bodega_id: traslado.bodega_entrada_id
            }
          })

          let cantidad = parseFloat(d.cantidad) * parseFloat(d.equivalencia);

          if (existencia) {
            await Existencia.update({
              stock_final: parseFloat(existencia.stock_final) - (cantidad)
            }, { where: { id: existencia.id } })
          } else {
            await Existencia.create({
              mes: moment(traslado.fecha).format('YYYY-MM'),
              stock_inicial: 0,
              stock_final: 0 - (cantidad),
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: traslado.sucursal_entrada_id,
              bodega_id: traslado.bodega_entrada_id
            })
          }

          // Actualizar inventario retroactivo
          let inventario = await Inventario.findOne({ where: { estado: 'VIGENTE' } });
          let mes_com = moment(traslado.fecha).format('YYYY-MM');
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
                  sucursal_id: traslado.sucursal_salida_id,
                  bodega_id: traslado.bodega_salida_id
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
                  mes: moment(traslado.fecha).format('YYYY-MM'),
                  producto_id: r.producto_receta_id,
                  variacion_id: r.variacion_receta_id,
                  lote_id: r.lote_receta_id,
                  sucursal_id: traslado.sucursal_entrada_id,
                  bodega_id: traslado.bodega_entrada_id
                }
              })

              let cantidad = (parseFloat(r.cantidad) * parseFloat(d.cantidad)) * parseFloat(d.equivalencia);

              if (existencia) {
                await Existencia.update({
                  stock_final: parseFloat(existencia.stock_final) - (cantidad)
                }, { where: { id: existencia.id } })
              } else {
                await Existencia.create({
                  mes: moment(traslado.fecha).format('YYYY-MM'),
                  stock_inicial: 0,
                  stock_final: 0 - (cantidad),
                  producto_id: r.producto_receta_id,
                  variacion_id: r.variacion_receta_id,
                  lote_id: r.lote_receta_id,
                  sucursal_id: traslado.sucursal_entrada_id,
                  bodega_id: traslado.bodega_entrada_id
                })
              }
            }
          });
        }
      });

    }

    await resp.success({ mensaje: 'Traslado anulado', data: traslado }, req, res, 'Traslado');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteTraslado = async (req, res) => {
  try {
    let traslado = await Traslado.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Traslado eliminado', data: traslado }, req, res, 'Traslado');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllTraslados,
  getOneTraslado,
  createTraslado,
  updateTraslado,
  anularTraslado,
  deleteTraslado,
  getTrasladoDoc
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