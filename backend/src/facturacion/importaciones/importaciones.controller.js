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
import Importacion from './importaciones.model.js';
import ImportacionDetalle from '../importaciones_detalles/importaciones_detalles.model.js';
import Pago from '../pagos/pagos.model.js';
import key from '../../../middleware/key.js';
import Producto from '../../inventario/productos/productos.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Empresa from '../../empresas/empresas.model.js';
import Moneda from '../monedas/monedas.model.js';
import moment from 'moment';
import Saldo from '../saldos/saldos.model.js';
import { Op, where } from 'sequelize';
import OrdenesCompra from '../ordenes_compras/ordenes_compras.model.js';
import Existencia from '../../inventario/existencias/existencias.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';
import ProductoCosto from '../../inventario/productos_costos/productos_costos.model.js';
import Variable from '../../variables/variables.model.js';
import Inventario from '../../inventario/inventarios/inventarios.model.js';
import OperacionEtiqueta from '../../inventario/operaciones_etiquetas/operaciones_etiquetas.model.js';
import productosController from '../../inventario/productos/productos.controller.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import ImportacionGasto from '../importaciones_gastos/importaciones_gastos.model.js';
import TipoGasto from '../tipos_gastos/tipos_gastos.model.js';
import Compra from '../compras/compras.model.js';

let getAllImportaciones = async (req, res) => {
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

    let importaciones = await Importacion.findAll({
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
          model: Saldo, as: 'saldos',
          limit: 1,
          order: [['id', 'DESC']],
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
    await resp.success({ mensaje: 'Importaciones encontradas', data: importaciones }, req, res, 'Importacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllImportacionesSaldos = async (req, res) => {
  try {
    let importaciones = await Importacion.findAll({
      where: {
        estado: 'VIGENTE',
        tipo_pago: 'CREDITO',
        proveedor_id: req.query.proveedor_id
      },
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
          model: Saldo, as: 'saldos',
          limit: 1,
          order: [['id', 'DESC']],
        }
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Importaciones encontradas', data: importaciones }, req, res, 'Importacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getImportacionDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let importacion = await Importacion.findOne({
      where: { id: req.params.importacion_id },
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
          model: ImportacionDetalle, as: 'importaciones_detalles',
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
        },
        {
          model: Saldo, as: 'saldos',
          limit: 1,
          order: [['id', 'DESC']],
        }
      ]
    });
    if (importacion.moneda_id != 1) {
      importacion.descuento = parseFloat(importacion.descuento_ext);
      importacion.total = parseFloat(importacion.total_ext);
      importacion.subtotal = parseFloat(importacion.subtotal_ext);
      importacion.impuesto = parseFloat(importacion.impuesto_ext);
      importacion.factor = parseFloat(importacion.factor_ext);
      importacion.importaciones_detalles.map(d => {
        d.costo_unitario = parseFloat(d.costo_unitario_ext);
        d.costo = parseFloat(d.costo_ext);
        d.descuento = parseFloat(d.descuento_ext);
        d.total = parseFloat(d.total_ext);
        d.subtotal = parseFloat(d.subtotal_ext);
        d.impuesto = parseFloat(d.impuesto_ext);
        d.costo_unitario_cif = parseFloat(d.costo_unitario_cif_ext);
        d.costo_cif = parseFloat(d.costo_cif_ext);
        return d;
      });
    }
    let file = fs.readFileSync(`./templates/importacion.html`, 'utf8');

    file = file.replace('___importacion', JSON.stringify(importacion));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneImportacion = async (req, res) => {
  try {
    let importacion = await Importacion.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: ImportacionGasto, as: 'importaciones_gastos',
          include: [
            {
              model: Compra, as: 'compra',
              include: [
                {
                  model: Proveedor, as: 'proveedor',
                },
                {
                  model: Moneda, as: 'moneda',
                }
              ]
            },
            {
              model: TipoGasto, as: 'tipo_gasto',
            }
          ]
        },
        {
          model: ImportacionDetalle, as: 'importaciones_detalles',
        },
        {
          model: Moneda, as: 'moneda',
        }
      ]
    });
    await resp.success({ mensaje: 'Importacion encontrada', data: importacion }, req, res, 'Importacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createImportacion = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let importacion = await Importacion.create(req.body);
    importacion.id = importacion.null;
    if (importacion) {

      let importaciones_detalles = req.body.importaciones_detalles;
      let pagos = req.body.pagos;
      let operaciones_etiquetas = JSON.parse(JSON.stringify(req.body.operaciones_etiquetas || []));

      let impuesto = await Variable.findOne({ where: { slug: 'impuesto' } });

      // Importaciones Detalles
      for (let c = 0; c < importaciones_detalles.length; c++) {
        importaciones_detalles[c].importacion_id = importacion.id
        await ImportacionDetalle.create(importaciones_detalles[c])
      }

      // Pagos
      for (let i = 0; i < pagos.length; i++) {
        let p = pagos[i];
        p.importacion_id = importacion.id;
        await Pago.create(p);
      };

      // Operaciones Etiquetas
      for (let p = 0; p < operaciones_etiquetas.length; p++) {
        await OperacionEtiqueta.create({
          etiqueta_id: operaciones_etiquetas[p].id,
          importacion_id: importacion.id
        });
      }

      // Saldos
      if (importacion.tipo_pago == 'CREDITO') {
        let total = importacion.total;
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
          importacion_id: importacion.id,
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
        for (let i = 0; i < importaciones_detalles.length; i++) {
          let d = importaciones_detalles[i];
          if (d.producto.stock) {

            if (!d.producto.combo) {
              let existencia = await Existencia.findOne({
                where: {
                  mes: moment(importacion.fecha).format('YYYY-MM'),
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
                  mes: moment(importacion.fecha).format('YYYY-MM'),
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
              let mes_com = moment(importacion.fecha).format('YYYY-MM');
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

              // Costo promedio / ultimo
              let tipo_costo = await Variable.findOne({ where: { slug: 'costo' } });
              if (tipo_costo.valor == 'Promedio') {

                let stock_inv = parseFloat(existencia ? existencia.stock_final : 0);
                let costo_inv = parseFloat(d.producto.costo);
                let total_inv = parseFloat((stock_inv * costo_inv).toFixed(2));
                let stock_com = parseFloat(cantidad);
                let costo_com = parseFloat((parseFloat(d.costo_unitario) / parseFloat(d.equivalencia)).toFixed(2));
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
                  importacion_id: importacion.id,
                });

                await Producto.update({ costo: costo_promedio }, { where: { id: d.producto_id } });

                // Actualizar costos combos
                await productosController.updateCostoProducto(d.producto_id);

              }

              if (tipo_costo.valor == 'Ultimo') {

                let stock_inv = parseFloat(existencia ? existencia.stock_final : 0);
                let costo_inv = parseFloat(d.producto.costo);
                let total_inv = parseFloat((stock_inv * costo_inv).toFixed(2));
                let stock_com = parseFloat(cantidad);
                let costo_com = parseFloat((parseFloat(d.costo_unitario) / parseFloat(d.equivalencia)).toFixed(2));
                let total_com = parseFloat((stock_com * costo_com).toFixed(2));
                let costo_promedio = parseFloat((costo_com).toFixed(2));

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
                  compra_id: compra.id,
                });

                await Producto.update({ costo: costo_promedio }, { where: { id: d.producto_id } });

                // Actualizar costos combos
                await productosController.updateCostoProducto(d.producto_id);

              }

            }

          }
        };
      }

      // Orden Importacion
      if (req.body.orden_compra_id) {
        await OrdenesCompra.update({ estado: 'VIGENTE', importacion_id: importacion.id }, { where: { id: req.body.orden_compra_id } });
      }
    }
    await resp.success({ mensaje: 'Importacion agregada', data: importacion }, req, res, 'Importacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateImportacion = async (req, res) => {
  try {
    req.body.estado = 'VIGENTE';
    let importacion = await Importacion.update(req.body, { where: { id: req.params.id } });

    importacion = await Importacion.findOne({ where: { id: req.params.id } });

    let importaciones_gastos = req.body.importaciones_gastos;
    let importaciones_detalles = req.body.importaciones_detalles;

    let impuesto = await Variable.findOne({ where: { slug: 'impuesto' } });

    // Importaciones Gastos
    await ImportacionGasto.destroy({ where: { importacion_id: req.params.id } });
    for (let c = 0; c < importaciones_gastos.length; c++) {
      delete importaciones_gastos[c].id;
      importaciones_gastos[c].importacion_id = req.params.id
      await ImportacionGasto.create(importaciones_gastos[c])
    }

    // Importaciones Detalles
    for (let c = 0; c < importaciones_detalles.length; c++) {

      let producto = await Producto.findOne({ where: { id: importaciones_detalles[c].producto_id } });
      importaciones_detalles[c].producto = producto;
      let d = importaciones_detalles[c];

      d.importacion_id = req.params.id
      await ImportacionDetalle.update({
        porc_gasto: d.porc_gasto,
        costo_unitario_cif: d.costo_unitario_cif,
        costo_cif: d.costo_cif,
        costo_unitario_cif_ext: d.costo_unitario_cif_ext,
        costo_cif_ext: d.costo_cif_ext
      }, { where: { id: d.id } })

      let existencia = await Existencia.findOne({
        where: {
          mes: moment(importacion.fecha).format('YYYY-MM'),
          producto_id: d.producto_id,
          variacion_id: d.variacion_id,
          lote_id: d.lote_id,
          sucursal_id: importacion.sucursal_id,
          bodega_id: importacion.bodega_id
        }
      })

      // Costo promedio / ultimo      
      let tipo_costo = await Variable.findOne({ where: { slug: 'costo' } });
      if (tipo_costo.valor == 'Promedio') {

        let stock_inv = parseFloat(existencia ? existencia.stock_final : 0);
        let costo_inv = parseFloat(d.producto.costo);
        let total_inv = parseFloat((stock_inv * costo_inv).toFixed(2));
        let stock_com = parseFloat(d.cantidad);
        let costo_com = parseFloat((parseFloat(d.costo_unitario_cif) / parseFloat(d.equivalencia)).toFixed(2));
        let total_com = parseFloat((stock_com * costo_com).toFixed(2));
        let costo_promedio = parseFloat(((total_com + total_inv) / (stock_com + stock_inv)).toFixed(2));

        await ProductoCosto.update({
          stock_inv,
          costo_inv,
          total_inv,
          stock_com,
          costo_com,
          total_com,
          costo_promedio: costo_promedio,
          producto_id: d.producto_id,
          lote_id: d.lote_id,
          importacion_id: importacion.id,
        }, {
          where: { importacion_id: req.params.id }
        });

        await Producto.update({ costo: costo_promedio }, { where: { id: d.producto_id } });

        // Actualizar costos combos
        await productosController.updateCostoProducto(d.producto_id);

      }

      if (tipo_costo.valor == 'Ultimo') {

        let stock_inv = parseFloat(existencia ? existencia.stock_final : 0);
        let costo_inv = parseFloat(d.producto.costo);
        let total_inv = parseFloat((stock_inv * costo_inv).toFixed(2));
        let stock_com = parseFloat(cantidad);
        let costo_com = parseFloat((parseFloat(d.costo_unitario) / parseFloat(d.equivalencia) / (1 + (parseFloat(impuesto.valor) / 100))).toFixed(2));
        let total_com = parseFloat((stock_com * costo_com).toFixed(2));
        let costo_promedio = parseFloat((costo_com).toFixed(2));

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
          compra_id: compra.id,
        });

        await Producto.update({ costo: costo_promedio }, { where: { id: d.producto_id } });

        // Actualizar costos combos
        await productosController.updateCostoProducto(d.producto_id);

      }

    }

    await resp.success({ mensaje: 'Importacion actualizada', data: importacion }, req, res, 'Importacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularImportacion = async (req, res) => {
  try {

    let importacion = await Importacion.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: ImportacionDetalle, as: 'importaciones_detalles',
          include: [
            { model: Producto, as: 'producto' }
          ]
        }
      ]
    });

    Importacion.update(req.body, { where: { id: importacion.id } });
    let documento = await Documento.findOne({ where: { id: importacion.documento_id } });

    // Actualizar existencias
    if (documento.inventario) {

      for (let i = 0; i < importacion.importaciones_detalles.length; i++) {
        let d = importacion.importaciones_detalles[i];

        if (!d.producto.combo) {
          let existencia = await Existencia.findOne({
            where: {
              mes: moment(importacion.fecha).format('YYYY-MM'),
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: importacion.sucursal_id,
              bodega_id: importacion.bodega_id
            }
          })

          let cantidad = parseFloat(d.cantidad) * parseFloat(d.equivalencia);

          if (existencia) {
            await Existencia.update({
              stock_final: parseFloat(existencia.stock_final) - cantidad
            }, { where: { id: existencia.id } })
          } else {
            await Existencia.create({
              mes: moment(importacion.fecha).format('YYYY-MM'),
              stock_inicial: 0,
              stock_final: 0 - cantidad,
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: importacion.sucursal_id,
              bodega_id: importacion.bodega_id
            })
          }

          // Actualizar inventario retroactivo
          let inventario = await Inventario.findOne({ where: { estado: 'VIGENTE' } });
          let mes_com = moment(importacion.fecha).format('YYYY-MM');
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
                  sucursal_id: importacion.sucursal_id,
                  bodega_id: importacion.bodega_id
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

      };
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

    let saldos = await Saldo.findAll({ where: { importacion_id: req.params.id } });
    for (let i = 0; i < saldos.length; i++) {
      let s = saldos[i];

      acumulado = parseFloat(acumulado) - parseFloat(s.total);
      await Saldo.create({
        saldo_inicial: s.saldo_final,
        tipo: 'abono',
        total: s.total,
        saldo_final: parseFloat(s.saldo_final) - parseFloat(s.total),
        saldo_acumulado: acumulado,
        estado: 'ANULADA',
        proveedor_id: s.proveedor_id,
        importacion_id: s.importacion_id
      });
    }

    // Soltar Orden Importacion
    await OrdenesCompra.update({ estado: 'PENDIENTE', importacion_id: null }, { where: { importacion_id: req.params.id } });

    await resp.success({ mensaje: 'Importacion anulada', data: importacion }, req, res, 'Importacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteImportacion = async (req, res) => {
  try {
    let importacion = await Importacion.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Importacion eliminada', data: importacion }, req, res, 'Importacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllImportaciones,
  getAllImportacionesSaldos,
  getOneImportacion,
  createImportacion,
  updateImportacion,
  anularImportacion,
  deleteImportacion,
  getImportacionDoc
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