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
import Pago from '../pagos/pagos.model.js';
import Producto from '../../inventario/productos/productos.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import TipoDocumento from '../tipos_documentos/tipos_documentos.model.js';
import VentaDetalle from '../ventas_detalles/ventas_detalles.model.js';
import Venta from './ventas.model.js';
import Moneda from '../monedas/monedas.model.js';
import moment from 'moment';
import Saldo from '../saldos/saldos.model.js';
import Comision from '../comisiones/comisiones.model.js';
import Variable from '../../variables/variables.model.js';
import Empleado from '../../personal/empleados/empleados.model.js';
import { Op } from 'sequelize';
import Cotizacion from '../cotizaciones/cotizaciones.model.js';
import Pedido from '../pedidos/pedidos.model.js';
import Abono from '../abonos/abonos.model.js';
import Receta from '../../inventario/recetas/recetas.model.js';
import Existencia from '../../inventario/existencias/existencias.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';
import Inventario from '../../inventario/inventarios/inventarios.model.js';
import OperacionEtiqueta from '../../inventario/operaciones_etiquetas/operaciones_etiquetas.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import Cuenta from '../../comandas/cuentas/cuentas.model.js';

let getAllVentas = async (req, res) => {
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

    let ventas = await Venta.findAll({
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
          model: Pago, as: 'pagos',
        },
        {
          model: Abono, as: 'abonos',
        },
        {
          model: Saldo, as: 'saldos',
          limit: 1,
          order: [['id', 'DESC']],
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
    await resp.success({ mensaje: 'Ventas encontradas', data: ventas }, req, res, 'Venta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllVentasSaldos = async (req, res) => {
  try {
    let ventas = await Venta.findAll({
      where: {
        estado: 'VIGENTE',
        tipo_pago: 'CREDITO',
        cliente_id: req.query.cliente_id
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
          model: Saldo, as: 'saldos',
          limit: 1,
          where: {
            saldo_final: { [Op.gte]: 0 }
          },
          required: true,
          order: [['id', 'DESC']],
        }
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Ventas encontradas', data: ventas }, req, res, 'Venta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getVentaDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let venta = await Venta.findOne({
      where: { id: req.params.venta_id },
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
          model: VentaDetalle, as: 'ventas_detalles',
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
        },
        {
          model: Saldo, as: 'saldos',
          limit: 1,
          order: [['id', 'DESC']],
        },
        {
          model: Pago, as: 'pagos'
        },
        {
          model: Abono, as: 'abonos'
        }
      ]
    })

    let file;
    if (req.query.tipo == 'pdf') {
      file = fs.readFileSync('./templates/venta.html', 'utf8');
    }
    if (req.query.tipo == 'new') {
      file = fs.readFileSync('./templates/venta_new.html', 'utf8');
    }
    if (req.query.tipo == 'ticket') {
      file = fs.readFileSync('./templates/tickets/venta.html', 'utf8');
    }
    if (req.query.tipo == 'envio') {
      file = fs.readFileSync('./templates/envio.html', 'utf8');
    }

    file = file.replace('___venta', JSON.stringify(venta));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneVenta = async (req, res) => {
  try {
    let venta = await Venta.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: VentaDetalle, as: 'ventas_detalles',
        }
      ]
    });
    await resp.success({ mensaje: 'Venta encontrada', data: venta }, req, res, 'Venta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createVenta = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let venta = await Venta.create(req.body);
    venta.id = venta.null;
    if (venta) {

      let ventas_detalles = req.body.ventas_detalles;
      let pagos = req.body.pagos;
      let abonos = req.body.abonos;
      let operaciones_etiquetas = JSON.parse(JSON.stringify(req.body.operaciones_etiquetas || []));

      // Ventas Detalles
      for (let d = 0; d < ventas_detalles.length; d++) {
        ventas_detalles[d].venta_id = venta.id
        await VentaDetalle.create(ventas_detalles[d])
      }

      // Pagos
      for (let i = 0; i < pagos.length; i++) {
        let p = pagos[i];
        p.venta_id = venta.id
        await Pago.create(p)
      }

      // Abonos
      for (let i = 0; i < abonos.length; i++) {
        let a = abonos[i];
        a.venta_id = venta.id
        await Abono.create(a)
      }

      // Operaciones Etiquetas
      for (let p = 0; p < operaciones_etiquetas.length; p++) {
        await OperacionEtiqueta.create({
          etiqueta_id: operaciones_etiquetas[p].id,
          venta_id: venta.id
        });
      }

      // Saldos
      if (venta.tipo_pago == 'CREDITO') {
        let total = venta.total;
        let saldo_acumulado = total;

        let acum = await Saldo.findOne({
          where: { cliente_id: req.body.cliente_id },
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
          venta_id: venta.id,
          cliente_id: req.body.cliente_id
        });
      }

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

      // Actualizar existencias
      if (documento.inventario) {
        for (let i = 0; i < ventas_detalles.length; i++) {
          let d = ventas_detalles[i];

          if (d.producto.stock) {

            if (!d.producto.combo) {
              let existencia = await Existencia.findOne({
                where: {
                  mes: moment(venta.fecha).format('YYYY-MM'),
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
                  mes: moment(venta.fecha).format('YYYY-MM'),
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
              let mes_com = moment(venta.fecha).format('YYYY-MM');
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
                      mes: moment(venta.fecha).format('YYYY-MM'),
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
                      mes: moment(venta.fecha).format('YYYY-MM'),
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

      // Cotizacion
      if (req.body.cotizacion_id) {
        await Cotizacion.update({ estado: 'VIGENTE', venta_id: venta.id }, { where: { id: req.body.cotizacion_id } });
      }

      // Pedido
      if (req.body.pedido_id) {
        await Pedido.update({ estado: 'VIGENTE', venta_id: venta.id }, { where: { id: req.body.pedido_id } });
      }

      if (req.body.cuenta_id) {
        await Cuenta.update({ estado: 'CERRADA', venta_id: venta.id }, { where: { id: req.body.cuenta_id } });
      }

    }
    await resp.success({ mensaje: 'Venta agregada', data: venta }, req, res, 'Venta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateVenta = async (req, res) => {
  try {
    let venta = await Venta.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Venta actualizada', data: venta }, req, res, 'Venta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularVenta = async (req, res) => {
  try {

    let venta = await Venta.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: VentaDetalle, as: 'ventas_detalles',
          include: [
            { model: Producto, as: 'producto' }
          ]
        }
      ]
    });

    await Venta.update(req.body, { where: { id: venta.id } });
    let documento = await Documento.findOne({ where: { id: venta.documento_id } });

    // Actualizar existencias
    if (documento.inventario) {

      for (let i = 0; i < venta.ventas_detalles.length; i++) {
        let d = venta.ventas_detalles[i];

        if (!d.producto.combo) {
          let existencia = await Existencia.findOne({
            where: {
              mes: moment(venta.fecha).format('YYYY-MM'),
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: venta.sucursal_id,
              bodega_id: venta.bodega_id
            }
          })

          let cantidad = parseFloat(d.cantidad) * parseFloat(d.equivalencia);

          if (existencia) {
            await Existencia.update({
              stock_final: parseFloat(existencia.stock_final) + (cantidad)
            }, { where: { id: existencia.id } })
          } else {
            await Existencia.create({
              mes: moment(venta.fecha).format('YYYY-MM'),
              stock_inicial: 0,
              stock_final: 0 + (cantidad),
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: venta.sucursal_id,
              bodega_id: venta.bodega_id
            })
          }

          // Actualizar inventario retroactivo
          let inventario = await Inventario.findOne({ where: { estado: 'VIGENTE' } });
          let mes_com = moment(venta.fecha).format('YYYY-MM');
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
                  sucursal_id: venta.sucursal_id,
                  bodega_id: venta.bodega_id
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

          for (let i = 0; i < recetas.length; i++) {
            let r = recetas[i];

            if (r.producto_receta.stock) {

              let existencia = await Existencia.findOne({
                where: {
                  mes: moment(venta.fecha).format('YYYY-MM'),
                  producto_id: r.producto_receta_id,
                  variacion_id: r.variacion_receta_id,
                  lote_id: r.lote_receta_id,
                  sucursal_id: venta.sucursal_id,
                  bodega_id: venta.bodega_id
                }
              })

              let cantidad = (parseFloat(r.cantidad) * parseFloat(d.cantidad)) * parseFloat(d.equivalencia);

              if (existencia) {
                await Existencia.update({
                  stock_final: parseFloat(existencia.stock_final) + (cantidad)
                }, { where: { id: existencia.id } })
              } else {
                await Existencia.create({
                  mes: moment(venta.fecha).format('YYYY-MM'),
                  stock_inicial: 0,
                  stock_final: 0 + (cantidad),
                  producto_id: r.producto_receta_id,
                  variacion_id: r.variacion_receta_id,
                  lote_id: r.lote_receta_id,
                  sucursal_id: venta.sucursal_id,
                  bodega_id: venta.bodega_id
                })
              }
            }
          }
        }
      }

    }

    // Saldos
    let acumulado = 0;
    let acum = await Saldo.findOne({
      where: { cliente_id: req.body.cliente_id },
      limit: 1,
      order: [['id', 'DESC']]
    });
    if (acum && acum.saldo_acumulado) {
      acumulado = parseFloat(acum.saldo_acumulado);
    }

    let saldos = await Saldo.findAll({ where: { venta_id: req.params.id } });
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
        cliente_id: s.cliente_id,
        venta_id: s.venta_id
      });
    }

    // Soltar Pedido
    await Pedido.update({ estado: 'PENDIENTE', venta_id: null }, { where: { venta_id: req.params.id } });

    // Soltar Cotizacion
    await Cotizacion.update({ estado: 'PENDIENTE', venta_id: null }, { where: { venta_id: req.params.id } });

    await resp.success({ mensaje: 'Venta anulada', data: venta }, req, res, 'Venta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteVenta = async (req, res) => {
  try {
    let venta = await Venta.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Venta eliminada', data: venta }, req, res, 'Venta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllVentas,
  getAllVentasSaldos,
  getOneVenta,
  createVenta,
  updateVenta,
  anularVenta,
  deleteVenta,
  getVentaDoc
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