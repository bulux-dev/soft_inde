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
import Compra from './compras.model.js';
import CompraDetalle from '../compras_detalles/compras_detalles.model.js';
import Pago from '../pagos/pagos.model.js';
import key from '../../../middleware/key.js';
import Producto from '../../inventario/productos/productos.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Empresa from '../../empresas/empresas.model.js';
import Moneda from '../monedas/monedas.model.js';
import moment from 'moment';
import Saldo from '../saldos/saldos.model.js';
import { Op, where } from 'sequelize';
import OrdenCompra from '../ordenes_compras/ordenes_compras.model.js';
import Existencia from '../../inventario/existencias/existencias.model.js';
import Receta from '../../inventario/recetas/recetas.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';
import ProductoCosto from '../../inventario/productos_costos/productos_costos.model.js';
import Variable from '../../variables/variables.model.js';
import Inventario from '../../inventario/inventarios/inventarios.model.js';
import OperacionEtiqueta from '../../inventario/operaciones_etiquetas/operaciones_etiquetas.model.js';
import productosController from '../../inventario/productos/productos.controller.js';
import Lote from '../../inventario/lotes/lotes.model.js';

let getAllCompras = async (req, res) => {
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

    let compras = await Compra.findAll({
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
    await resp.success({ mensaje: 'Compras encontradas', data: compras }, req, res, 'Compra');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllComprasSaldos = async (req, res) => {
  try {
    let proveedor = await Proveedor.findOne({ where: { id: req.query.proveedor_id } });

    let compras = await Compra.findAll({
      where: proveedor.tarjeta_credito ? {
        estado: 'VIGENTE',
        tipo_pago: 'CONTADO'
      } : {
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
          where: {
            saldo_final: { [Op.gte]: 0 }
          },
          required: true,
          order: [['id', 'DESC']],
        },
        proveedor.tarjeta_credito ?
          {
            model: Pago, as: 'pagos',
            where: {
              tarjeta_id: { [Op.gt]: 0 }
            }
          } :
          {
            model: Pago, as: 'pagos',
          }
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });

    await resp.success({ mensaje: 'Compras encontradas', data: compras }, req, res, 'Compra');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getCompraDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let compra = await Compra.findOne({
      where: { id: req.params.compra_id },
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
          model: CompraDetalle, as: 'compras_detalles',
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
    let file = fs.readFileSync(`./templates/compra.html`, 'utf8');

    file = file.replace('___compra', JSON.stringify(compra));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCompra = async (req, res) => {
  try {
    let compra = await Compra.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Compra encontrada', data: compra }, req, res, 'Compra');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCompra = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let compra = await Compra.create(req.body);
    compra.id = compra.null;
    if (compra) {

      let compras_detalles = req.body.compras_detalles;
      let pagos = req.body.pagos;
      let operaciones_etiquetas = JSON.parse(JSON.stringify(req.body.operaciones_etiquetas || []));

      let impuesto = await Variable.findOne({ where: { slug: 'impuesto' } });

      // Compras Detalles
      for (let c = 0; c < compras_detalles.length; c++) {
        compras_detalles[c].compra_id = compra.id
        await CompraDetalle.create(compras_detalles[c])
      }

      // Pagos
      for (let i = 0; i < pagos.length; i++) {
        let p = pagos[i];
        p.compra_id = compra.id;
        await Pago.create(p);


        // Saldos
        if (p.metodo == 'Tarjeta' && p.tarjeta_id) {
          let total = p.monto;
          let saldo_acumulado = total;

          let acum = await Saldo.findOne({
            where: { proveedor_id: p.tarjeta_id },
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
            compra_id: compra.id,
            proveedor_id: p.tarjeta_id
          });
        }

      };

      // Operaciones Etiquetas
      for (let p = 0; p < operaciones_etiquetas.length; p++) {
        await OperacionEtiqueta.create({
          etiqueta_id: operaciones_etiquetas[p].id,
          compra_id: compra.id
        });
      }

      // Saldos
      if (compra.tipo_pago == 'CREDITO') {
        let total = compra.total;
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
          compra_id: compra.id,
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
        for (let i = 0; i < compras_detalles.length; i++) {
          let d = compras_detalles[i];
          if (d.producto.stock) {

            if (!d.producto.combo) {
              let existencia = await Existencia.findOne({
                where: {
                  mes: moment(compra.fecha).format('YYYY-MM'),
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
                  mes: moment(compra.fecha).format('YYYY-MM'),
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
              let mes_com = moment(compra.fecha).format('YYYY-MM');
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
                let costo_com = parseFloat((parseFloat(d.costo_unitario) / parseFloat(d.equivalencia) / (1 + (parseFloat(impuesto.valor) / 100))).toFixed(2));
                if (!compra.gravable) {
                  costo_com = parseFloat((parseFloat(d.costo_unitario) / parseFloat(d.equivalencia)).toFixed(2));
                }
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
                  compra_id: compra.id,
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
                if (!compra.gravable) {
                  costo_com = parseFloat((parseFloat(d.costo_unitario) / parseFloat(d.equivalencia)).toFixed(2));
                }
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

      // Orden Compra
      if (req.body.orden_compra_id) {
        await OrdenCompra.update({ estado: 'VIGENTE', compra_id: compra.id }, { where: { id: req.body.orden_compra_id } });
      }
    }
    await resp.success({ mensaje: 'Compra agregada', data: compra }, req, res, 'Compra');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCompra = async (req, res) => {
  try {
    let compra = await Compra.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Compra actualizada', data: compra }, req, res, 'Compra');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularCompra = async (req, res) => {
  try {

    let compra = await Compra.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: CompraDetalle, as: 'compras_detalles',
          include: [
            { model: Producto, as: 'producto' }
          ]
        }
      ]
    });

    Compra.update(req.body, { where: { id: compra.id } });
    let documento = await Documento.findOne({ where: { id: compra.documento_id } });

    // Actualizar existencias
    if (documento.inventario) {

      for (let i = 0; i < compra.compras_detalles.length; i++) {
        let d = compra.compras_detalles[i];

        if (!d.producto.combo) {
          let existencia = await Existencia.findOne({
            where: {
              mes: moment(compra.fecha).format('YYYY-MM'),
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: compra.sucursal_id,
              bodega_id: compra.bodega_id
            }
          })

          let cantidad = parseFloat(d.cantidad) * parseFloat(d.equivalencia);

          if (existencia) {
            await Existencia.update({
              stock_final: parseFloat(existencia.stock_final) - cantidad
            }, { where: { id: existencia.id } })
          } else {
            await Existencia.create({
              mes: moment(compra.fecha).format('YYYY-MM'),
              stock_inicial: 0,
              stock_final: 0 - cantidad,
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: compra.sucursal_id,
              bodega_id: compra.bodega_id
            })
          }

          // Actualizar inventario retroactivo
          let inventario = await Inventario.findOne({ where: { estado: 'VIGENTE' } });
          let mes_com = moment(compra.fecha).format('YYYY-MM');
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
                  sucursal_id: compra.sucursal_id,
                  bodega_id: compra.bodega_id
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

    let saldos = await Saldo.findAll({ where: { compra_id: req.params.id } });
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
        compra_id: s.compra_id
      });
    }

    // Soltar Orden Compra
    await OrdenCompra.update({ estado: 'PENDIENTE', compra_id: null }, { where: { compra_id: req.params.id } });

    await resp.success({ mensaje: 'Compra anulada', data: compra }, req, res, 'Compra');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCompra = async (req, res) => {
  try {
    let compra = await Compra.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Compra eliminada', data: compra }, req, res, 'Compra');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCompras,
  getAllComprasSaldos,
  getOneCompra,
  createCompra,
  updateCompra,
  anularCompra,
  deleteCompra,
  getCompraDoc
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