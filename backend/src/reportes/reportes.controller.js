import fl from '../../middleware/filtros.js';
import resp from '../../middleware/resp.js';
import jwt from 'jsonwebtoken';
import key from '../../middleware/key.js';
import fs from 'fs';
import OrdenCompra from '../facturacion/ordenes_compras/ordenes_compras.model.js';
import Cotizacion from '../facturacion/cotizaciones/cotizaciones.model.js';
import Pedido from '../facturacion/pedidos/pedidos.model.js';
import Venta from '../facturacion/ventas/ventas.model.js';
import Compra from '../facturacion/compras/compras.model.js';
import Carga from '../facturacion/cargas/cargas.model.js';
import Descarga from '../facturacion/descargas/descargas.model.js';
import Traslado from '../facturacion/traslados/traslados.model.js';
import Recibo from '../facturacion/recibos/recibos.model.js';
import Cheque from '../finanzas/cheques/cheques.model.js';
import Deposito from '../finanzas/depositos/depositos.model.js';
import NotaDebito from '../finanzas/notas_debitos/notas_debitos.model.js';
import NotaCredito from '../finanzas/notas_creditos/notas_creditos.model.js';
import Envio from '../facturacion/envios/envios.model.js';
import { Op } from 'sequelize';
import Empresa from '../empresas/empresas.model.js';
import Cliente from '../personal/clientes/clientes.model.js';
import Proveedor from '../personal/proveedores/proveedores.model.js';
import moment from 'moment';
import Documento from '../facturacion/documentos/documentos.model.js';
import Empleado from '../personal/empleados/empleados.model.js';
import Sucursal from '../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../ubicaciones/bodegas/bodegas.model.js';
import NCCliente from '../facturacion/nc_clientes/nc_clientes.model.js';
import NDCliente from '../facturacion/nd_clientes/nd_clientes.model.js';
import CuentaBancaria from '../finanzas/cuentas_bancarias/cuentas_bancarias.model.js';
import Banco from '../finanzas/bancos/bancos.model.js';
import NCProveedor from '../facturacion/nc_proveedores/nc_proveedores.model.js';
import NDProveedor from '../facturacion/nd_proveedores/nd_proveedores.model.js';
import Importacion from '../facturacion/importaciones/importaciones.model.js';
import TipoDocumento from '../facturacion/tipos_documentos/tipos_documentos.model.js';
import Partida from '../contabilidad/partidas/partidas.model.js';
import PartidaDetalle from '../contabilidad/partidas_detalles/partidas_detalles.model.js';
import CuentaContable from '../contabilidad/cuentas_contables/cuentas_contables.model.js';
import CentroCosto from '../contabilidad/centros_costos/centros_costos.model.js';
import Rubro from '../contabilidad/rubros/rubros.model.js';

let reporteOrdenesCompras = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let ordenes_compras = await OrdenCompra.findAll({
      where: where,
      include: [
        {
          model: Proveedor, as: 'proveedor',
        },
        {
          model: Documento, as: 'documento',
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/ordenes_compras.html', 'utf8');
    file = file.replace('___ordenes_compras', JSON.stringify({
      data: ordenes_compras,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteCotizaciones = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let cotizaciones = await Cotizacion.findAll({
      where: where,
      include: [
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Documento, as: 'documento',
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/cotizaciones.html', 'utf8');
    file = file.replace('___cotizaciones', JSON.stringify({
      data: cotizaciones,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reportePedidos = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let pedidos = await Pedido.findAll({
      where: where,
      include: [
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Documento, as: 'documento',
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/pedidos.html', 'utf8');
    file = file.replace('___pedidos', JSON.stringify({
      data: pedidos,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteEnvios = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let envios = await Envio.findAll({
      where: where,
      include: [
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Documento, as: 'documento',
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/envios.html', 'utf8');
    file = file.replace('___envios', JSON.stringify({
      data: envios,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteCompras = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let compras = await Compra.findAll({
      where: where,
      include: [
        {
          model: Proveedor, as: 'proveedor',
        },
        {
          model: Documento, as: 'documento',
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/compras.html', 'utf8');
    file = file.replace('___compras', JSON.stringify({
      data: compras,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteVentas = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let ventas = await Venta.findAll({
      where: where,
      include: [
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Empleado, as: 'empleado',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: Documento, as: 'documento',
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/ventas.html', 'utf8');
    file = file.replace('___ventas', JSON.stringify({
      data: ventas,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteCargas = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let cargas = await Carga.findAll({
      where: where,
      include: [
        {
          model: Proveedor, as: 'proveedor',
        },
        {
          model: Documento, as: 'documento',
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/cargas.html', 'utf8');
    file = file.replace('___cargas', JSON.stringify({
      data: cargas,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteDescargas = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let descargas = await Descarga.findAll({
      where: where,
      include: [
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Documento, as: 'documento',
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/descargas.html', 'utf8');
    file = file.replace('___descargas', JSON.stringify({
      data: descargas,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteTraslados = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let traslados = await Traslado.findAll({
      where: where,
      include: [
        {
          model: Documento, as: 'documento',
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
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/traslados.html', 'utf8');
    file = file.replace('___traslados', JSON.stringify({
      data: traslados,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteImportaciones = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let importaciones = await Importacion.findAll({
      where: where,
      include: [
        {
          model: Proveedor, as: 'proveedor',
        },
        {
          model: Documento, as: 'documento',
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/importaciones.html', 'utf8');
    file = file.replace('___importaciones', JSON.stringify({
      data: importaciones,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteRecibos = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let recibos = await Recibo.findAll({
      where: where,
      include: [
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Documento, as: 'documento',
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/recibos.html', 'utf8');
    file = file.replace('___recibos', JSON.stringify({
      data: recibos,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteCheques = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let cheques = await Cheque.findAll({
      where: where,
      include: [
        {
          model: Proveedor, as: 'proveedor',
        },
        {
          model: Documento, as: 'documento',
        },
        {
          model: CuentaBancaria, as: 'cuenta_bancaria',
          include: [
            {
              model: Banco, as: 'banco',
            }
          ]
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/cheques.html', 'utf8');
    file = file.replace('___cheques', JSON.stringify({
      data: cheques,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteDepositos = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let depositos = await Deposito.findAll({
      where: where,
      include: [
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Documento, as: 'documento',
        },
        {
          model: CuentaBancaria, as: 'cuenta_bancaria',
          include: [
            {
              model: Banco, as: 'banco',
            }
          ]
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/depositos.html', 'utf8');
    file = file.replace('___depositos', JSON.stringify({
      data: depositos,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteNotasDebitos = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let notas_debitos = await NotaDebito.findAll({
      where: where,
      include: [
        {
          model: Proveedor, as: 'proveedor',
        },
        {
          model: Documento, as: 'documento',
        },
        {
          model: CuentaBancaria, as: 'cuenta_bancaria',
          include: [
            {
              model: Banco, as: 'banco',
            }
          ]
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/notas_debitos.html', 'utf8');
    file = file.replace('___notas_debitos', JSON.stringify({
      data: notas_debitos,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteNotasCreditos = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let notas_creditos = await NotaCredito.findAll({
      where: where,
      include: [
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Documento, as: 'documento',
        },
        {
          model: CuentaBancaria, as: 'cuenta_bancaria',
          include: [
            {
              model: Banco, as: 'banco',
            }
          ]
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/notas_creditos.html', 'utf8');
    file = file.replace('___notas_creditos', JSON.stringify({
      data: notas_creditos,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteNCClientes = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let nc_clientes = await NCCliente.findAll({
      where: where,
      include: [
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Documento, as: 'documento',
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/nc_clientes.html', 'utf8');
    file = file.replace('___nc_clientes', JSON.stringify({
      data: nc_clientes,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteNDClientes = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let nd_clientes = await NDCliente.findAll({
      where: where,
      include: [
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Documento, as: 'documento',
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/nd_clientes.html', 'utf8');
    file = file.replace('___nd_clientes', JSON.stringify({
      data: nd_clientes,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteNCProveedores = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let nc_proveedores = await NCProveedor.findAll({
      where: where,
      include: [
        {
          model: Proveedor, as: 'proveedor',
        },
        {
          model: Documento, as: 'documento',
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/nc_proveedores.html', 'utf8');
    file = file.replace('___nc_proveedores', JSON.stringify({
      data: nc_proveedores,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteNDProveedores = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    delete req.query.fecha_inicio;
    delete req.query.fecha_fin;
    delete req.query.token;

    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (fecha_inicio != 'null' && fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let nd_proveedores = await NDProveedor.findAll({
      where: where,
      include: [
        {
          model: Proveedor, as: 'proveedor',
        },
        {
          model: Documento, as: 'documento',
        }
      ]
    });

    let file = fs.readFileSync('./templates/reportes/nd_proveedores.html', 'utf8');
    file = file.replace('___nd_proveedores', JSON.stringify({
      data: nd_proveedores,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    }));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteLibroBancos = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let saldo_inicial = 5000;
    let saldo_final = 5000;

    let cuenta_bancaria = await CuentaBancaria.findOne({
      where: { id: req.query.cuenta_bancaria_id },
      include: [
        {
          model: Banco, as: 'banco',
        }
      ]
    });

    let cheques = await Cheque.findAll({ include: [{ model: Documento, as: 'documento', include: [{ model: TipoDocumento, as: 'tipo_documento' }] }] });
    let depositos = await Deposito.findAll({ include: [{ model: Documento, as: 'documento', include: [{ model: TipoDocumento, as: 'tipo_documento' }] }] });
    let notas_debitos = await NotaDebito.findAll({ include: [{ model: Documento, as: 'documento', include: [{ model: TipoDocumento, as: 'tipo_documento' }] }] });
    let notas_creditos = await NotaCredito.findAll({ include: [{ model: Documento, as: 'documento', include: [{ model: TipoDocumento, as: 'tipo_documento' }] }] });

    let documentos = [...cheques, ...depositos, ...notas_debitos, ...notas_creditos];
    documentos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    for (let d = 0; d < documentos.length; d++) {
      if (documentos[d].tipo_documento_id == 11) {
        saldo_final += documentos[d].monto;
        documentos[d].saldo = saldo_final;
      } else if (documentos[d].tipo_documento_id == 10) {
        saldo_final -= documentos[d].monto;
        documentos[d].saldo = saldo_final;
      } else if (documentos[d].tipo_documento_id == 12) {
        saldo_final -= documentos[d].monto;
        documentos[d].saldo = saldo_final;
      } else if (documentos[d].tipo_documento_id == 13) {
        saldo_final += documentos[d].monto;
        documentos[d].saldo = saldo_final;
      }
    }

    let file = fs.readFileSync('./templates/contabilidad/libro_bancos.html', 'utf8');
    file = file.replace('___cuenta_bancaria', JSON.stringify(cuenta_bancaria));
    file = file.replace('___documentos', JSON.stringify(documentos));
    file = file.replace('___saldo_inicial', JSON.stringify(saldo_inicial));
    file = file.replace('___saldo_final', JSON.stringify(saldo_final));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteVentasNew = async (req, res) => {
  try {    
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
          model: Cliente, as: 'cliente',
        },
        {
          model: Empleado, as: 'empleado',
          attributes: ['id', 'nombre', 'apellido']
        }
      ]
    });
    res.status(200).json(ventas);
  } catch (err) {
    res.status(200).json({ err: err });
  }
}

let libroDiario = async (req, res) => {
  try {    
    let where = fl(req.query, 'eq');
    if (req.params.fecha_inicio != 'null' && req.params.fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(req.params.fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }    
    let partidas = await Partida.findAll({
      where: where,
      include: [
        {
          model: PartidaDetalle, as: 'partidas_detalles',
          include: [
            {
              model: CuentaContable, as: 'cuenta_contable',
            },
            {
              model: CentroCosto, as: 'centro_costo',
            },
            {
              model: Rubro, as: 'rubro',
            }
          ]
        }
      ],
      order: [
        [['numero', 'ASC']],
        ['fecha', 'ASC'],
      ]
    });
    
    res.status(200).json(JSON.parse(JSON.stringify(partidas)));
  } catch (err) {
    res.status(200).json({ err: err });
  }
}

export default {
  reporteOrdenesCompras,
  reporteCotizaciones,
  reportePedidos,
  reporteEnvios,
  reporteCompras,
  reporteVentas,
  reporteCargas,
  reporteDescargas,
  reporteTraslados,
  reporteImportaciones,
  reporteRecibos,
  reporteCheques,
  reporteDepositos,
  reporteNotasDebitos,
  reporteNotasCreditos,
  reporteNCClientes,
  reporteNDClientes,
  reporteNCProveedores,
  reporteNDProveedores,
  reporteLibroBancos,
  reporteVentasNew,
  libroDiario
}