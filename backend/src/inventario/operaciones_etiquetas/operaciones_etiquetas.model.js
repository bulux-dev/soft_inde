import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Etiqueta from '../etiquetas/etiquetas.model.js';
import Compra from '../../facturacion/compras/compras.model.js';
import Venta from '../../facturacion/ventas/ventas.model.js';
import OrdenCompra from '../../facturacion/ordenes_compras/ordenes_compras.model.js';
import Cotizacion from '../../facturacion/cotizaciones/cotizaciones.model.js';
import Pedido from '../../facturacion/pedidos/pedidos.model.js';
import Envio from '../../facturacion/envios/envios.model.js';
import Carga from '../../facturacion/cargas/cargas.model.js';
import Descarga from '../../facturacion/descargas/descargas.model.js';
import Traslado from '../../facturacion/traslados/traslados.model.js';
import NCCliente from '../../facturacion/nc_clientes/nc_clientes.model.js';
import NDCliente from '../../facturacion/nd_clientes/nd_clientes.model.js';
import NCProveedor from '../../facturacion/nc_proveedores/nc_proveedores.model.js';
import NDProveedor from '../../facturacion/nd_proveedores/nd_proveedores.model.js';
import Recibo from '../../facturacion/recibos/recibos.model.js';
import Cheque from '../../finanzas/cheques/cheques.model.js';
import Deposito from '../../finanzas/depositos/depositos.model.js';
import NotaDebito from '../../finanzas/notas_debitos/notas_debitos.model.js';
import NotaCredito from '../../finanzas/notas_creditos/notas_creditos.model.js';
import Produccion from '../../facturacion/producciones/producciones.model.js';
import Importacion from '../../facturacion/importaciones/importaciones.model.js';

let OperacionEtiqueta = db.define('operaciones_etiquetas', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  etiqueta_id: {
    type: sequelize.INTEGER,
  },
  compra_id: {
    type: sequelize.INTEGER,
  },
  venta_id: {
    type: sequelize.INTEGER,
  },
  orden_compra_id: {
    type: sequelize.INTEGER,
  },
  cotizacion_id: {
    type: sequelize.INTEGER,
  },
  pedido_id: {
    type: sequelize.INTEGER,
  },
  envio_id: {
    type: sequelize.INTEGER,
  },
  carga_id: {
    type: sequelize.INTEGER,
  },
  descarga_id: {
    type: sequelize.INTEGER,
  },
  traslado_id: {
    type: sequelize.INTEGER,
  },
  produccion_id: {
    type: sequelize.INTEGER,
  },
  nc_cliente_id: {
    type: sequelize.INTEGER,
  },
  nd_cliente_id: {
    type: sequelize.INTEGER,
  },
  nc_proveedor_id: {
    type: sequelize.INTEGER,
  },
  nd_proveedor_id: {
    type: sequelize.INTEGER,
  },
  recibo_id: {
    type: sequelize.INTEGER,
  },
  cheque_id: {
    type: sequelize.INTEGER,
  },
  deposito_id: {
    type: sequelize.INTEGER,
  },
  nota_credito_id: {
    type: sequelize.INTEGER,
  },
  nota_debito_id: {
    type: sequelize.INTEGER,
  },
  importacion_id: {
    type: sequelize.INTEGER,
  }
}, {
  timestamps: false
});

OperacionEtiqueta.belongsTo(Etiqueta, { foreignKey: 'etiqueta_id', as: 'etiqueta' });
Etiqueta.hasMany(OperacionEtiqueta, { foreignKey: 'etiqueta_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(Compra, { foreignKey: 'compra_id', as: 'compra' });
Compra.hasMany(OperacionEtiqueta, { foreignKey: 'compra_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Venta.hasMany(OperacionEtiqueta, { foreignKey: 'venta_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(OrdenCompra, { foreignKey: 'orden_compra_id', as: 'orden_compra' });
OrdenCompra.hasMany(OperacionEtiqueta, { foreignKey: 'orden_compra_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(Cotizacion, { foreignKey: 'cotizacion_id', as: 'cotizacion' });
Cotizacion.hasMany(OperacionEtiqueta, { foreignKey: 'cotizacion_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(Pedido, { foreignKey: 'pedido_id', as: 'pedido' });
Pedido.hasMany(OperacionEtiqueta, { foreignKey: 'pedido_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(Envio, { foreignKey: 'envio_id', as: 'envio' });
Envio.hasMany(OperacionEtiqueta, { foreignKey: 'envio_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(Carga, { foreignKey: 'carga_id', as: 'carga' });
Carga.hasMany(OperacionEtiqueta, { foreignKey: 'carga_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(Descarga, { foreignKey: 'descarga_id', as: 'descarga' });
Descarga.hasMany(OperacionEtiqueta, { foreignKey: 'descarga_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(Traslado, { foreignKey: 'traslado_id', as: 'traslado' });
Traslado.hasMany(OperacionEtiqueta, { foreignKey: 'traslado_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(Produccion, { foreignKey: 'produccion_id', as: 'produccion' });
Produccion.hasMany(OperacionEtiqueta, { foreignKey: 'produccion_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(NCCliente, { foreignKey: 'nc_cliente_id', as: 'nc_cliente' });
NCCliente.hasMany(OperacionEtiqueta, { foreignKey: 'nc_cliente_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(NDCliente, { foreignKey: 'nd_cliente_id', as: 'nd_cliente' });
NDCliente.hasMany(OperacionEtiqueta, { foreignKey: 'nd_cliente_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(NCProveedor, { foreignKey: 'nc_proveedor_id', as: 'nc_proveedor' });
NCProveedor.hasMany(OperacionEtiqueta, { foreignKey: 'nc_proveedor_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(NDProveedor, { foreignKey: 'nd_proveedor_id', as: 'nd_proveedor' });
NDProveedor.hasMany(OperacionEtiqueta, { foreignKey: 'nd_proveedor_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(Recibo, { foreignKey: 'recibo_id', as: 'recibo' });
Recibo.hasMany(OperacionEtiqueta, { foreignKey: 'recibo_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(Cheque, { foreignKey: 'cheque_id', as: 'cheque' });
Cheque.hasMany(OperacionEtiqueta, { foreignKey: 'cheque_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(Deposito, { foreignKey: 'deposito_id', as: 'deposito' });
Deposito.hasMany(OperacionEtiqueta, { foreignKey: 'deposito_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(NotaCredito, { foreignKey: 'nota_credito_id', as: 'nota_credito' }); 
NotaCredito.hasMany(OperacionEtiqueta, { foreignKey: 'nota_credito_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(NotaDebito, { foreignKey: 'nota_debito_id', as: 'nota_debito' }); 
NotaDebito.hasMany(OperacionEtiqueta, { foreignKey: 'nota_debito_id', as: 'operaciones_etiquetas' });

OperacionEtiqueta.belongsTo(Importacion, { foreignKey: 'importacion_id', as: 'importacion'});
Importacion.hasMany(OperacionEtiqueta, { foreignKey: 'importacion_id', as: 'operaciones_etiquetas'});

export default OperacionEtiqueta;