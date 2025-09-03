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
import Produccion from './producciones.model.js';
import ProduccionDetalle from '../producciones_detalles/producciones_detalles.model.js';
import Pago from '../pagos/pagos.model.js';
import key from '../../../middleware/key.js';
import Producto from '../../inventario/productos/productos.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Empresa from '../../empresas/empresas.model.js';
import Moneda from '../monedas/monedas.model.js';
import moment from 'moment';
import Saldo from '../saldos/saldos.model.js';
import { Op } from 'sequelize';
import Existencia from '../../inventario/existencias/existencias.model.js';
import Receta from '../../inventario/recetas/recetas.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';
import ProductoCosto from '../../inventario/productos_costos/productos_costos.model.js';
import Variable from '../../variables/variables.model.js';
import Inventario from '../../inventario/inventarios/inventarios.model.js';
import OperacionEtiqueta from '../../inventario/operaciones_etiquetas/operaciones_etiquetas.model.js';
import productosController from '../../inventario/productos/productos.controller.js';

let getAllProducciones = async (req, res) => {
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

    let producciones = await Produccion.findAll({
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
          model: OperacionEtiqueta, as: 'operaciones_etiquetas',
        }
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Producciones encontradas', data: producciones }, req, res, 'Produccion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getProduccionDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let produccion = await Produccion.findOne({
      where: { id: req.params.produccion_id },
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
          model: ProduccionDetalle, as: 'producciones_detalles',
          include: [
            {
              model: Producto, as: 'producto',
            },
            {
              model: Variacion, as: 'variacion',
            },
            {
              model: Medida, as: 'medida',
            }
          ]
        },
        {
          model: Saldo, as: 'saldos',
          limit: 1,
          order: [['id', 'DESC']],
        }
      ]
    });
    let file = fs.readFileSync(`./templates/produccion.html`, 'utf8');

    file = file.replace('___produccion', JSON.stringify(produccion));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneProduccion = async (req, res) => {
  try {
    let produccion = await Produccion.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Produccion encontrada', data: produccion }, req, res, 'Produccion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createProduccion = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let produccion = await Produccion.create(req.body);
    produccion.id = produccion.null;
    if (produccion) {

      let producciones_detalles = req.body.producciones_detalles;
      let pagos = req.body.pagos;
      let operaciones_etiquetas = JSON.parse(JSON.stringify(req.body.operaciones_etiquetas || []));

      // Producciones Detalles
      for (let c = 0; c < producciones_detalles.length; c++) {
        producciones_detalles[c].produccion_id = produccion.id
        await ProduccionDetalle.create(producciones_detalles[c])
      }

      // Pagos
      pagos.forEach(async p => {
        p.produccion_id = produccion.id
        await Pago.create(p)
      });

      // Operaciones Etiquetas
      for (let p = 0; p < operaciones_etiquetas.length; p++) {
        await OperacionEtiqueta.create({
          etiqueta_id: operaciones_etiquetas[p].id,
          produccion_id: produccion.id
        });
      }

      // Saldos
      if (produccion.tipo_pago == 'CREDITO') {
        let total = produccion.total;
        let saldo_acumulado = total;

        let acum = await Saldo.findOne({
          where: { proveedor_id: req.body.proveedor_id },
          limit: 1,
          order: [['id', 'DESC']]
        });
        if (acum && acum.saldo_acumulado) {
          saldo_acumulado = saldo_acumulado + parseFloat(acum.saldo_acumulado);
        }
        await Saldo.create({
          saldo_inicial: 0,
          tipo: 'cargo',
          total: total,
          saldo_final: total,
          saldo_acumulado: saldo_acumulado,
          produccion_id: produccion.id,
          proveedor_id: req.body.proveedor_id
        });
      }

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

      // Actualizar existencias
      if (documento.inventario) {
        producciones_detalles.forEach(async d => {
          if (d.producto.stock) {

            if (!d.producto.combo) {
              let existencia = await Existencia.findOne({
                where: {
                  mes: moment(produccion.fecha).format('YYYY-MM'),
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
                  stock_final: parseFloat(existencia.stock_final) + cantidad
                }, { where: { id: existencia.id } })
              } else {
                await Existencia.create({
                  mes: moment(produccion.fecha).format('YYYY-MM'),
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
              let mes_com = moment(produccion.fecha).format('YYYY-MM');
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

              // Costo promedio
              let tipo_costo = await Variable.findOne({ where: { slug: 'costo' } });
              if (tipo_costo.valor == 'Ultimo') {

              }
              if (tipo_costo.valor == 'Promedio') {
                let stock_inv = parseFloat(existencia ? existencia.stock_final : 0);
                let costo_inv = parseFloat(d.producto.costo);
                let total_inv = parseFloat((stock_inv * costo_inv).toFixed(2));
                let stock_com = parseFloat(cantidad);
                let costo_com = parseFloat((parseFloat(d.costo_unitario) / parseFloat(d.equivalencia) / 1.12).toFixed(2));
                let total_com = parseFloat((stock_com * costo_com).toFixed(2));
                let costo_promedio = parseFloat(((total_com + total_inv) / (stock_com + stock_inv)).toFixed(2));

                await ProductoCosto.create({
                  stock_inv,
                  costo_inv,
                  total_inv,
                  stock_com,
                  costo_com,
                  total_com,
                  costo_promedio: costo_promedio,
                  producto_id: d.producto_id,
                  lote_id: d.lote_id,
                  produccion_id: produccion.id,
                });

                await Producto.update({ costo: costo_promedio }, { where: { id: d.producto_id } });

                // Actualizar costos combos
                await productosController.updateCostoProducto(d.producto_id);

                // let recetas = await Receta.findAll({
                //   where: { producto_receta_id: d.producto_id },
                //   include: [
                //     {
                //       model: Producto, as: 'producto'
                //     }
                //   ]
                // });

                // recetas = JSON.parse(JSON.stringify(recetas));
                // for (let r = 0; r < recetas.length; r++) {
                //   let rec = recetas[r];

                //   let resta_costo = costo_inv * parseFloat(rec.cantidad).toFixed(2);
                //   let suma_costo = costo_promedio * parseFloat(rec.cantidad).toFixed(2);
                //   let costo = (parseFloat(rec.producto.costo) - parseFloat(resta_costo) + parseFloat(suma_costo)).toFixed(2);

                //   await Producto.update({ costo }, { where: { id: rec.producto_id } });

                //   let recetas2 = await Receta.findAll({
                //     where: { producto_receta_id: rec.producto_id },
                //     include: [
                //       {
                //         model: Producto, as: 'producto'
                //       }
                //     ]
                //   });

                //   recetas2 = JSON.parse(JSON.stringify(recetas2));
                //   r = JSON.parse(JSON.stringify(r));

                //   recetas2.forEach(async r2 => {
                //     let costo_inv2 = parseFloat(rec.producto.costo);
                //     let resta_costo2 = costo_inv2 * parseFloat(r2.cantidad).toFixed(2);
                //     let suma_costo2 = costo * parseFloat(r2.cantidad).toFixed(2);
                //     let costo2 = (parseFloat(r2.producto.costo) - parseFloat(resta_costo2) + parseFloat(suma_costo2)).toFixed(2);
                //     await Producto.update({ costo: costo2 }, { where: { id: r2.producto_id } });
                //   });
                // }
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
                      mes: moment(produccion.fecha).format('YYYY-MM'),
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
                      mes: moment(produccion.fecha).format('YYYY-MM'),
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
    await resp.success({ mensaje: 'Produccion agregada', data: produccion }, req, res, 'Produccion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateProduccion = async (req, res) => {
  try {
    let produccion = await Produccion.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Produccion actualizada', data: produccion }, req, res, 'Produccion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularProduccion = async (req, res) => {
  try {

    let produccion = await Produccion.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: ProduccionDetalle, as: 'producciones_detalles',
          include: [
            { model: Producto, as: 'producto' }
          ]
        }
      ]
    });

    Produccion.update(req.body, { where: { id: produccion.id } });
    let documento = await Documento.findOne({ where: { id: produccion.documento_id } });

    // Actualizar existencias
    if (documento.inventario) {

      produccion.producciones_detalles.forEach(async d => {

        if (!d.producto.combo) {
          let existencia = await Existencia.findOne({
            where: {
              mes: moment(produccion.fecha).format('YYYY-MM'),
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: produccion.sucursal_id,
              bodega_id: produccion.bodega_id
            }
          })

          let cantidad = parseFloat(d.cantidad) * parseFloat(d.equivalencia);

          if (existencia) {
            await Existencia.update({
              stock_final: parseFloat(existencia.stock_final) - cantidad
            }, { where: { id: existencia.id } })
          } else {
            await Existencia.create({
              mes: moment(produccion.fecha).format('YYYY-MM'),
              stock_inicial: 0,
              stock_final: 0 - cantidad,
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: produccion.sucursal_id,
              bodega_id: produccion.bodega_id
            })
          }

          // Actualizar inventario retroactivo
          let inventario = await Inventario.findOne({ where: { estado: 'VIGENTE' } });
          let mes_com = moment(produccion.fecha).format('YYYY-MM');
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
                  sucursal_id: produccion.sucursal_id,
                  bodega_id: produccion.bodega_id
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
                  mes: moment(produccion.fecha).format('YYYY-MM'),
                  producto_id: r.producto_receta_id,
                  variacion_id: r.variacion_receta_id,
                  lote_id: r.lote_receta_id,
                  sucursal_id: produccion.sucursal_id,
                  bodega_id: produccion.bodega_id
                }
              })

              let cantidad = parseFloat(r.cantidad) * (parseFloat(d.cantidad) * parseFloat(d.equivalencia));

              if (existencia) {
                await Existencia.update({
                  stock_final: parseFloat(existencia.stock_final) - (cantidad)
                }, { where: { id: existencia.id } })
              } else {
                await Existencia.create({
                  mes: moment(produccion.fecha).format('YYYY-MM'),
                  stock_inicial: 0,
                  stock_final: 0 - (cantidad),
                  producto_id: r.producto_receta_id,
                  variacion_id: r.variacion_receta_id,
                  lote_id: r.lote_receta_id,
                  sucursal_id: produccion.sucursal_id,
                  bodega_id: produccion.bodega_id
                })
              }
            }
          });
        }

      });
    }

    // Saldos
    let acumulado = 0;
    let acum = await Saldo.findOne({
      where: { proveedor_id: req.body.proveedor_id },
      limit: 1,
      order: [['id', 'DESC']]
    });
    if (acum && acum.saldo_acumulado) {
      acumulado = parseFloat(acum.saldo_acumulado);
    }

    let saldos = await Saldo.findAll({ where: { produccion_id: req.params.id } });
    saldos.forEach(async s => {
      acumulado = parseFloat(acumulado) - parseFloat(s.total);
      await Saldo.create({
        saldo_inicial: s.saldo_final,
        tipo: 'abono',
        total: s.total,
        saldo_final: parseFloat(s.saldo_final) - parseFloat(s.total),
        saldo_acumulado: acumulado,
        estado: 'ANULADA',
        proveedor_id: s.proveedor_id,
        produccion_id: s.produccion_id
      });
    });

    await resp.success({ mensaje: 'Produccion anulada', data: produccion }, req, res, 'Produccion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteProduccion = async (req, res) => {
  try {
    let produccion = await Produccion.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Produccion eliminada', data: produccion }, req, res, 'Produccion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllProducciones,
  getOneProduccion,
  createProduccion,
  updateProduccion,
  anularProduccion,
  deleteProduccion,
  getProduccionDoc
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