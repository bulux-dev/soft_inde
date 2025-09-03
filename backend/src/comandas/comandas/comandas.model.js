import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Documento from '../../facturacion/documentos/documentos.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Cuenta from '../cuentas/cuentas.model.js';

let Comanda = db.define('comandas', {
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
  fecha: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  observaciones: {
    type: sequelize.TEXT
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
  cuenta_id: {
    type: sequelize.INTEGER
  },
  documento_id: {
    type: sequelize.INTEGER
  },
  sucursal_id: {
    type: sequelize.INTEGER
  },
  bodega_id: {
    type: sequelize.INTEGER
  },
  usuario_id: {
    type: sequelize.INTEGER
  },
}, {
  timestamps: false
});

Comanda.belongsTo(Cuenta, { foreignKey: 'cuenta_id', as: 'cuenta' });
Cuenta.hasMany(Comanda, { foreignKey: 'cuenta_id', as: 'comandas' });

Comanda.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(Comanda, { foreignKey: 'documento_id', as: 'comandas' });

Comanda.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(Comanda, { foreignKey: 'sucursal_id', as: 'comandas' });

Comanda.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(Comanda, { foreignKey: 'bodega_id', as: 'comandas' });

Comanda.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Comanda, { foreignKey: 'usuario_id', as: 'comandas' });

export default Comanda;