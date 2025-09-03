import moment from 'moment';
import fl from '../../middleware/filtros.js';
import resp from '../../middleware/resp.js';
import jwt from 'jsonwebtoken';
import key from '../../middleware/key.js';
import Carga from '../facturacion/cargas/cargas.model.js';
import Compra from '../facturacion/compras/compras.model.js';
import Cotizacion from '../facturacion/cotizaciones/cotizaciones.model.js';
import Descarga from '../facturacion/descargas/descargas.model.js';
import OrdenCompra from '../facturacion/ordenes_compras/ordenes_compras.model.js';
import Pedido from '../facturacion/pedidos/pedidos.model.js';
import Traslado from '../facturacion/traslados/traslados.model.js';
import Venta from '../facturacion/ventas/ventas.model.js';
import sequelize from 'sequelize';
import Usuario from '../seguridad/usuarios/usuarios.model.js';
import Rol from '../seguridad/roles/roles.model.js';
import Permiso from '../seguridad/permisos/permisos.model.js';
import Empleado from '../personal/empleados/empleados.model.js';
import Cliente from '../personal/clientes/clientes.model.js';
import Proveedor from '../personal/proveedores/proveedores.model.js';

let seguridad = async (req, res) => {
  try {
    let where = fl(req.query);

    let usuarios = await Usuario.findAll({ where, group: ['id'] });
    let roles = await Rol.findAll({ where, group: ['id'] });
    let permisos = await Permiso.findAll({ where, group: ['id'] });

    await resp.success({
      mensaje: 'Operaciones encontradas', data: {
        usuarios: {
          count: usuarios.length,
        },
        roles: {
          count: roles.length,
        },
        permisos: {
          count: permisos.length,
        }
      },
    }, req, res, 'Dashboard');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let personal = async (req, res) => {
  try {
    let where = fl(req.query);

    let empleados = await Empleado.findAll({ where, group: ['id'] });
    let clientes = await Cliente.findAll({ where, group: ['id'] });
    let proveedores = await Proveedor.findAll({ where, group: ['id'] });

    await resp.success({
      mensaje: 'Operaciones encontradas', data: {
        empleados: {
          count: empleados.length,
        },
        clientes: {
          count: clientes.length,
        },
        proveedores: {
          count: proveedores.length,
        }
      },
    }, req, res, 'Dashboard');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let operaciones = async (req, res) => {
  try {
    let token = req.headers.authorization;
    let data = jwt.decode(token, key);
    let where = fl(req.query);

    if (data.data.rol_id != 1) {
      where.usuario_id = data.data.usuario_id
    }

    where.fecha = {
      [sequelize.Op.between]: [
        moment(req.params.fecha_inicio).format('YYYY-MM-DD HH:mm'),
        moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
      ],
    }
    let attributes = [
      [sequelize.fn('count', sequelize.col('id')), 'count'],
      [sequelize.fn('sum', sequelize.col('total')), 'total']
    ];
    let attributes2 = [
      [sequelize.fn('count', sequelize.col('id')), 'count'],
    ];

    let ventas = await Venta.findAll({ attributes, where, group: ['id'] });
    let compras = await Compra.findAll({ attributes, where, group: ['id'] });
    let cotizaciones = await Cotizacion.findAll({ attributes, where, group: ['id'] });
    let pedidos = await Pedido.findAll({ attributes, where, group: ['id'] });
    let ordenes_compras = await OrdenCompra.findAll({ attributes, where, group: ['id'] });
    let cargas = await Carga.findAll({ attributes: attributes2, where, group: ['id'] });
    let descargas = await Descarga.findAll({ attributes: attributes2, where, group: ['id'] });
    let traslados = await Traslado.findAll({ attributes: attributes2, where, group: ['id'] });

    await resp.success({
      mensaje: 'Operaciones encontradas', data: {
        ventas: {
          count: ventas.length,
          total: ventas.reduce((acum, item) => acum + parseFloat(item.dataValues.total), 0)
        },
        compras: {
          count: compras.length,
          total: compras.reduce((acum, item) => acum + parseFloat(item.dataValues.total), 0)
        },
        cotizaciones: {
          count: cotizaciones.length,
          total: cotizaciones.reduce((acum, item) => acum + parseFloat(item.dataValues.total), 0)
        },
        pedidos: {
          count: pedidos.length,
          total: pedidos.reduce((acum, item) => acum + parseFloat(item.dataValues.total), 0)
        },
        ordenes_compras: {
          count: ordenes_compras.length,
          total: ordenes_compras.reduce((acum, item) => acum + parseFloat(item.dataValues.total), 0)
        },
        cargas: {
          count: cargas.length,
          total: 0
        },
        descargas: {
          count: descargas.length,
          total: 0
        },
        traslados: {
          count: traslados.length,
          total: 0
        }
      }
    }, req, res, 'Dashboard');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let compras = async (req, res) => {
  try {
    let token = req.headers.authorization;    
    let data = jwt.decode(token, key);
    let where = {
      fecha: {
        [sequelize.Op.between]: [
          moment(req.params.fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      },
      estado: 'VIGENTE'
    }

    if (data.data.rol_id != 1) {
      where.usuario_id = data.data.usuario_id
    }

    let compras = await Compra.findAll({
      where: where
    });

    let diasDelMes = [];
    let fecha = moment(req.params.fecha_inicio).clone();
    while (fecha.isSameOrBefore(moment(req.params.fecha_fin))) {
      let fechaFormateada = fecha.format('YYYY-MM-DD');
      diasDelMes.push({
        fecha: fechaFormateada,
        total: 0,
        count: 0
      });
      fecha.add(1, 'days');
    }

    compras.forEach(item => {
      let fechaFormateada = moment(item.fecha).format('YYYY-MM-DD');
      let index = diasDelMes.findIndex(item => item.fecha === fechaFormateada);
      if (index !== -1) {
        diasDelMes[index].total += parseFloat(item.total);
        diasDelMes[index].count++;
      }
    });

    await resp.success({ mensaje: 'Operaciones encontradas', data: diasDelMes }, req, res, 'Dashboard');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let ventas = async (req, res) => {
  try {
    let token = req.headers.authorization;    
    let data = jwt.decode(token, key);
    let where = {
      fecha: {
        [sequelize.Op.between]: [
          moment(req.params.fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      },
      estado: 'VIGENTE'
    }

    if (data.data.rol_id != 1) {
      where.usuario_id = data.data.usuario_id
    }

    let ventas = await Venta.findAll({
      where: where
    });

    let diasDelMes = [];
    let fecha = moment(req.params.fecha_inicio).clone();
    while (fecha.isSameOrBefore(moment(req.params.fecha_fin))) {
      let fechaFormateada = fecha.format('YYYY-MM-DD');
      diasDelMes.push({
        fecha: fechaFormateada,
        total: 0,
        count: 0
      });
      fecha.add(1, 'days');
    }

    ventas.forEach(item => {
      let fechaFormateada = moment(item.fecha).format('YYYY-MM-DD');
      let index = diasDelMes.findIndex(item => item.fecha === fechaFormateada);
      if (index !== -1) {
        diasDelMes[index].total += parseFloat(item.total);
        diasDelMes[index].count++;
      }
    });

    await resp.success({ mensaje: 'Operaciones encontradas', data: diasDelMes }, req, res, 'Dashboard');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let cotizaciones = async (req, res) => {
  try {
    let token = req.headers.authorization;    
    let data = jwt.decode(token, key);
    let where = {
      fecha: {
        [sequelize.Op.between]: [
          moment(req.params.fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      },
      estado: 'VIGENTE'
    }

    if (data.data.rol_id != 1) {
      where.usuario_id = data.data.usuario_id
    }

    let cotizaciones = await Cotizacion.findAll({
      where: where
    });

    let diasDelMes = [];
    let fecha = moment(req.params.fecha_inicio).clone();
    while (fecha.isSameOrBefore(moment(req.params.fecha_fin))) {
      let fechaFormateada = fecha.format('YYYY-MM-DD');
      diasDelMes.push({
        fecha: fechaFormateada,
        total: 0,
        count: 0
      });
      fecha.add(1, 'days');
    }

    cotizaciones.forEach(item => {
      let fechaFormateada = moment(item.fecha).format('YYYY-MM-DD');
      let index = diasDelMes.findIndex(item => item.fecha === fechaFormateada);
      if (index !== -1) {
        diasDelMes[index].total += parseFloat(item.total);
        diasDelMes[index].count++;
      }
    });

    await resp.success({ mensaje: 'Operaciones encontradas', data: diasDelMes }, req, res, 'Dashboard');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let pedidos = async (req, res) => {
  try {
    let token = req.headers.authorization;    
    let data = jwt.decode(token, key);
    let where = {
      fecha: {
        [sequelize.Op.between]: [
          moment(req.params.fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      },
      estado: 'VIGENTE'
    }

    if (data.data.rol_id != 1) {
      where.usuario_id = data.data.usuario_id
    }

    let pedidos = await Pedido.findAll({
      where: where
    });

    let diasDelMes = [];
    let fecha = moment(req.params.fecha_inicio).clone();
    while (fecha.isSameOrBefore(moment(req.params.fecha_fin))) {
      let fechaFormateada = fecha.format('YYYY-MM-DD');
      diasDelMes.push({
        fecha: fechaFormateada,
        total: 0,
        count: 0
      });
      fecha.add(1, 'days');
    }

    pedidos.forEach(item => {
      let fechaFormateada = moment(item.fecha).format('YYYY-MM-DD');
      let index = diasDelMes.findIndex(item => item.fecha === fechaFormateada);
      if (index !== -1) {
        diasDelMes[index].total += parseFloat(item.total);
        diasDelMes[index].count++;
      }
    });

    await resp.success({ mensaje: 'Operaciones encontradas', data: diasDelMes }, req, res, 'Dashboard');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let ordenes_compras = async (req, res) => {
  try {
    let token = req.headers.authorization;    
    let data = jwt.decode(token, key);
    let where = {
      fecha: {
        [sequelize.Op.between]: [
          moment(req.params.fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      },
      estado: 'VIGENTE'
    }

    if (data.data.rol_id != 1) {
      where.usuario_id = data.data.usuario_id
    }

    let ordenes_compras = await OrdenCompra.findAll({
      where: where
    });

    let diasDelMes = [];
    let fecha = moment(req.params.fecha_inicio).clone();
    while (fecha.isSameOrBefore(moment(req.params.fecha_fin))) {
      let fechaFormateada = fecha.format('YYYY-MM-DD');
      diasDelMes.push({
        fecha: fechaFormateada,
        total: 0,
        count: 0
      });
      fecha.add(1, 'days');
    }

    ordenes_compras.forEach(item => {
      let fechaFormateada = moment(item.fecha).format('YYYY-MM-DD');
      let index = diasDelMes.findIndex(item => item.fecha === fechaFormateada);
      if (index !== -1) {
        diasDelMes[index].total += parseFloat(item.total);
        diasDelMes[index].count++;
      }
    });

    await resp.success({ mensaje: 'Operaciones encontradas', data: diasDelMes }, req, res, 'Dashboard');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  seguridad,
  personal,
  operaciones,
  compras,
  ventas,
  cotizaciones,
  pedidos,
  ordenes_compras
}