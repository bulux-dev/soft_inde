import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Documento from '../documentos/documentos.model.js';
import Proveedor from '../../personal/proveedores/proveedores.model.js'
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';

let Traslado = db.define('traslados', {
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
  documento_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  sucursal_salida_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  bodega_salida_id: {
    type: sequelize.INTEGER
  },
  sucursal_entrada_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  bodega_entrada_id: {
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

Traslado.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(Traslado, { foreignKey: 'documento_id', as: 'traslados' });

Traslado.belongsTo(Sucursal, { foreignKey: 'sucursal_salida_id', as: 'sucursal_salida' });
Sucursal.hasMany(Traslado, { foreignKey: 'sucursal_salida_id', as: 'traslados_salidas' });

Traslado.belongsTo(Bodega, { foreignKey: 'bodega_salida_id', as: 'bodega_salida' });
Bodega.hasMany(Traslado, { foreignKey: 'bodega_salida_id', as: 'traslados_salidas' });

Traslado.belongsTo(Sucursal, { foreignKey: 'sucursal_entrada_id', as: 'sucursal_entrada' });
Sucursal.hasMany(Traslado, { foreignKey: 'sucursal_entrada_id', as: 'traslados_entradas' });

Traslado.belongsTo(Bodega, { foreignKey: 'bodega_entrada_id', as: 'bodega_entrada' });
Bodega.hasMany(Traslado, { foreignKey: 'bodega_entrada_id', as: 'traslados_entradas' });

Traslado.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Traslado, { foreignKey: 'usuario_id', as: 'traslados' });

export default Traslado;