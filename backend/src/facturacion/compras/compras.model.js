import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Documento from '../documentos/documentos.model.js';
import Proveedor from '../../personal/proveedores/proveedores.model.js'
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Moneda from '../monedas/monedas.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import CajaChica from '../../finanzas/cajas_chicas/cajas_chicas.model.js';

let Compra = db.define('compras', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  serie: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  correlativo: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  no_doc: {
    type: sequelize.STRING
  },
  fecha: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  observaciones: {
    type: sequelize.TEXT
  },
  descuento: {
    type: sequelize.DECIMAL
  },
  total: {
    type: sequelize.DECIMAL
  },
  subtotal: {
    type: sequelize.DECIMAL
  },
  impuesto: {
    type: sequelize.DECIMAL
  },
  descuento_ext: {
    type: sequelize.DECIMAL
  },
  total_ext: {
    type: sequelize.DECIMAL
  },
  subtotal_ext: {
    type: sequelize.DECIMAL
  },
  impuesto_ext: {
    type: sequelize.DECIMAL
  },
  tipo_pago: {
    type: sequelize.STRING
  },
  tipo_cambio: {
    type: sequelize.STRING
  },
  dias_credito: {
    type: sequelize.STRING
  },
  estado: {
    type: sequelize.STRING
  },
  fecha_anulacion: {
    type: sequelize.STRING
  },
  motivo_anulacion: {
    type: sequelize.STRING
  },
  gravable: {
    type: sequelize.BOOLEAN
  },
  libro: {
    type: sequelize.BOOLEAN
  },
  documento_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  sucursal_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  bodega_id: {
    type: sequelize.INTEGER
  },
  proveedor_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  moneda_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  caja_chica_id: {
    type: sequelize.INTEGER
  },
  usuario_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  }
}, {
  timestamps: false
});

Compra.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(Compra, { foreignKey: 'documento_id', as: 'compras' });

Compra.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(Compra, { foreignKey: 'sucursal_id', as: 'compras' });

Compra.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(Compra, { foreignKey: 'bodega_id', as: 'compras' });

Compra.belongsTo(Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
Proveedor.hasMany(Compra, { foreignKey: 'proveedor_id', as: 'compras' });

Compra.belongsTo(Moneda, { foreignKey: 'moneda_id', as: 'moneda' });
Moneda.hasMany(Compra, { foreignKey: 'moneda_id', as: 'compras' });

Compra.belongsTo(CajaChica, { foreignKey: 'caja_chica_id', as: 'caja_chica' });
CajaChica.hasMany(Compra, { foreignKey: 'caja_chica_id', as: 'compras' });

Compra.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Compra, { foreignKey: 'usuario_id', as: 'compras' });

export default Compra;