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
import EnvioDetalle from '../envios_detalles/envios_detalles.model.js';
import Envio from './envios.model.js';
import Moneda from '../monedas/monedas.model.js';
import { Op } from 'sequelize';
import moment from 'moment';
import TipoProducto from '../../inventario/tipos_productos/tipos_productos.model.js';
import Empleado from '../../personal/empleados/empleados.model.js';
import Existencia from '../../inventario/existencias/existencias.model.js';
import Receta from '../../inventario/recetas/recetas.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';
import Equivalencia from '../../inventario/equivalencias/equivalencias.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';

let getAllEnvios = async (req, res) => {
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
    let envios = await Envio.findAll({
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
          model: Usuario, as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: Empleado, as: 'empleado',
          attributes: ['id', 'nombre', 'apellido']
        },
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Envios encontrados', data: envios }, req, res, 'Envio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getEnvioDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let envio = await Envio.findOne({
      where: { id: req.params.envio_id },
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
          model: EnvioDetalle, as: 'envios_detalles',
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
    })

    let file;
    if (req.query.tipo == 'pdf') {
      file = fs.readFileSync('./templates/envio.html', 'utf8');
    }
    if (req.query.tipo == 'ticket') {
      file = fs.readFileSync('./templates/tickets/envio.html', 'utf8');
    }

    file = file.replace('___envio', JSON.stringify(envio));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneEnvio = async (req, res) => {
  try {
    let envio = await Envio.findOne({
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
          model: EnvioDetalle, as: 'envios_detalles',
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
                      model: Medida, as: 'medida',
                    }
                  ]
                },
                {
                  model: Medida, as: 'medida',
                }
              ]
            },
            {
              model: Variacion, as: 'variacion',
            },
            {
              model: Medida, as: 'medida',
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Envio encontrado', data: envio }, req, res, 'Envio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createEnvio = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let envio = await Envio.create(req.body);
    envio.id = envio.null;
    if (envio) {

      let envios_detalles = req.body.envios_detalles;

      // Envios Detalles
      for (let e = 0; e < envios_detalles.length; e++) {
        envios_detalles[e].envio_id = envio.id
        await EnvioDetalle.create(envios_detalles[e])
      }

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

      // Actualizar existencias
      if (documento.inventario) {
        envios_detalles.forEach(async d => {
          if (d.producto.stock) {

            if (!d.producto.combo) {
              let existencia = await Existencia.findOne({
                where: {
                  mes: moment(envio.fecha).format('YYYY-MM'),
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
                  mes: moment(envio.fecha).format('YYYY-MM'),
                  stock_inicial: 0,
                  stock_final: 0 - (cantidad),
                  producto_id: d.producto_id,
                  variacion_id: d.variacion_id,
                  lote_id: d.lote_id,
                  sucursal_id: req.body.sucursal_id,
                  bodega_id: req.body.bodega_id
                })
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
                      mes: moment(envio.fecha).format('YYYY-MM'),
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
                      stock_final: parseFloat(existencia.stock_final) - (cantidad)
                    }, { where: { id: existencia.id } })
                  } else {
                    await Existencia.create({
                      mes: moment(envio.fecha).format('YYYY-MM'),
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
              });
            }

          }
        });
      }

    }
    await resp.success({ mensaje: 'Envio agregado', data: envio }, req, res, 'Envio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateEnvio = async (req, res) => {
  try {

    let envio = await Envio.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: EnvioDetalle, as: 'envios_detalles',
          include: [
            { model: Producto, as: 'producto' }
          ]
        }
      ]
    });

    Envio.update(req.body, { where: { id: envio.id } });
    let documento = await Documento.findOne({ where: { id: envio.documento_id } });

    if (req.body.envios_detalles && req.body.envios_detalles.length > 0) {
      await EnvioDetalle.destroy({ where: { envio_id: req.params.id } });
      for (let c = 0; c < req.body.envios_detalles.length; c++) {
        req.body.envios_detalles[c].envio_id = req.params.id;
        await EnvioDetalle.create(req.body.envios_detalles[c]);
      }
    }

    // Actualizar existencias
    if (documento.inventario) {

      // Revertir existencias
      envio.envios_detalles.forEach(async d => {

        if (!d.producto.combo) {
          let existencia = await Existencia.findOne({
            where: {
              mes: moment(envio.fecha).format('YYYY-MM'),
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: envio.sucursal_id,
              bodega_id: envio.bodega_id
            }
          })

          let cantidad = parseFloat(d.cantidad) * parseFloat(d.equivalencia);

          if (existencia) {
            await Existencia.update({
              stock_final: parseFloat(existencia.stock_final) + (cantidad)
            }, { where: { id: existencia.id } })
          } else {
            await Existencia.create({
              mes: moment(envio.fecha).format('YYYY-MM'),
              stock_inicial: 0,
              stock_final: 0 + (cantidad),
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: envio.sucursal_id,
              bodega_id: envio.bodega_id
            })
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
                  mes: moment(envio.fecha).format('YYYY-MM'),
                  producto_id: r.producto_receta_id,
                  variacion_id: r.variacion_receta_id,
                  lote_id: r.lote_receta_id,
                  sucursal_id: envio.sucursal_id,
                  bodega_id: envio.bodega_id
                }
              })

              let cantidad = parseFloat(r.cantidad) * (parseFloat(d.cantidad) * parseFloat(d.equivalencia));

              if (existencia) {
                await Existencia.update({
                  stock_final: parseFloat(existencia.stock_final) + (cantidad)
                }, { where: { id: existencia.id } })
              } else {
                await Existencia.create({
                  mes: moment(envio.fecha).format('YYYY-MM'),
                  stock_inicial: 0,
                  stock_final: 0 + (cantidad),
                  producto_id: r.producto_receta_id,
                  variacion_id: r.variacion_receta_id,
                  lote_id: r.lote_receta_id,
                  sucursal_id: envio.sucursal_id,
                  bodega_id: envio.bodega_id
                })
              }
            }
          });
        }

      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Recalcular existencias
      if (req.body.envios_detalles && req.body.envios_detalles.length > 0) {

        req.body.envios_detalles.forEach(async d => {

          if (!d.producto.combo) {
            let existencia = await Existencia.findOne({
              where: {
                mes: moment(envio.fecha).format('YYYY-MM'),
                producto_id: d.producto_id,
                variacion_id: d.variacion_id,
                lote_id: d.lote_id,
                sucursal_id: envio.sucursal_id,
                bodega_id: envio.bodega_id
              }
            })

            let cantidad = parseFloat(d.cantidad) * parseFloat(d.equivalencia);

            if (existencia) {
              await Existencia.update({
                stock_final: parseFloat(existencia.stock_final) - (cantidad)
              }, { where: { id: existencia.id } })
            } else {
              await Existencia.create({
                mes: moment(envio.fecha).format('YYYY-MM'),
                stock_inicial: 0,
                stock_final: 0 - (cantidad),
                producto_id: d.producto_id,
                variacion_id: d.variacion_id,
                lote_id: d.lote_id,
                sucursal_id: envio.sucursal_id,
                bodega_id: envio.bodega_id
              })
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
                    mes: moment(envio.fecha).format('YYYY-MM'),
                    producto_id: r.producto_receta_id,
                    variacion_id: r.variacion_receta_id,
                    lote_id: r.lote_receta_id,
                    sucursal_id: envio.sucursal_id,
                    bodega_id: envio.bodega_id
                  }
                })

                let cantidad = parseFloat(r.cantidad) * (parseFloat(d.cantidad) * parseFloat(d.equivalencia));

                if (existencia) {
                  await Existencia.update({
                    stock_final: parseFloat(existencia.stock_final) - (cantidad)
                  }, { where: { id: existencia.id } })
                } else {
                  await Existencia.create({
                    mes: moment(envio.fecha).format('YYYY-MM'),
                    stock_inicial: 0,
                    stock_final: 0 - (cantidad),
                    producto_id: r.producto_receta_id,
                    variacion_id: r.variacion_receta_id,
                    lote_id: r.lote_receta_id,
                    sucursal_id: envio.sucursal_id,
                    bodega_id: envio.bodega_id
                  })
                }
              }
            });
          }

        });

      }


    }

    await resp.success({ mensaje: 'Envio actualizado', data: envio }, req, res, 'Envio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularEnvio = async (req, res) => {
  try {

    let envio = await Envio.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: EnvioDetalle, as: 'envios_detalles',
          include: [
            { model: Producto, as: 'producto' }
          ]
        }
      ]
    });

    Envio.update(req.body, { where: { id: envio.id } });
    let documento = await Documento.findOne({ where: { id: envio.documento_id } });

    // Actualizar existencias
    if (documento.inventario) {

      envio.envios_detalles.forEach(async d => {

        if (!d.producto.combo) {
          let existencia = await Existencia.findOne({
            where: {
              mes: moment(envio.fecha).format('YYYY-MM'),
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: envio.sucursal_id,
              bodega_id: envio.bodega_id
            }
          })

          let cantidad = parseFloat(d.cantidad) * parseFloat(d.equivalencia);

          if (existencia) {
            await Existencia.update({
              stock_final: parseFloat(existencia.stock_final) + (cantidad)
            }, { where: { id: existencia.id } })
          } else {
            await Existencia.create({
              mes: moment(envio.fecha).format('YYYY-MM'),
              stock_inicial: 0,
              stock_final: 0 + (cantidad),
              producto_id: d.producto_id,
              variacion_id: d.variacion_id,
              lote_id: d.lote_id,
              sucursal_id: envio.sucursal_id,
              bodega_id: envio.bodega_id
            })
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
                  mes: moment(envio.fecha).format('YYYY-MM'),
                  producto_id: r.producto_receta_id,
                  variacion_id: r.variacion_receta_id,
                  lote_id: r.lote_receta_id,
                  sucursal_id: envio.sucursal_id,
                  bodega_id: envio.bodega_id
                }
              })

              let cantidad = parseFloat(r.cantidad) * (parseFloat(d.cantidad) * parseFloat(d.equivalencia));

              if (existencia) {
                await Existencia.update({
                  stock_final: parseFloat(existencia.stock_final) + (cantidad)
                }, { where: { id: existencia.id } })
              } else {
                await Existencia.create({
                  mes: moment(envio.fecha).format('YYYY-MM'),
                  stock_inicial: 0,
                  stock_final: 0 + (cantidad),
                  producto_id: r.producto_receta_id,
                  variacion_id: r.variacion_receta_id,
                  lote_id: r.lote_receta_id,
                  sucursal_id: envio.sucursal_id,
                  bodega_id: envio.bodega_id
                })
              }
            }
          });
        }
      });

    }

    await resp.success({ mensaje: 'Envio anulado', data: envio }, req, res, 'Envio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteEnvio = async (req, res) => {
  try {
    let envio = await Envio.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Envio eliminado', data: envio }, req, res, 'Envio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllEnvios,
  getOneEnvio,
  createEnvio,
  updateEnvio,
  anularEnvio,
  deleteEnvio,
  getEnvioDoc
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