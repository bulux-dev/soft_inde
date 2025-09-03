import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Compra from '../compras/compras.model.js';
import TipoGasto from '../tipos_gastos/tipos_gastos.model.js';
import Importacion from '../importaciones/importaciones.model.js';

let ImportacionGasto = db.define('importaciones_gastos', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  compra_id: {
    type: sequelize.INTEGER
  },
  tipo_gasto_id: {
    type: sequelize.INTEGER
  },
  importacion_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  }
}, {
  timestamps: false
});

ImportacionGasto.belongsTo(Compra, { foreignKey: 'compra_id', as: 'compra' });
Compra.hasMany(ImportacionGasto, { foreignKey: 'compra_id', as: 'importaciones_gastos' });

ImportacionGasto.belongsTo(TipoGasto, { foreignKey: 'tipo_gasto_id', as: 'tipo_gasto' });
TipoGasto.hasMany(ImportacionGasto, { foreignKey: 'tipo_gasto_id', as: 'importaciones_gastos' });

ImportacionGasto.belongsTo(Importacion, { foreignKey: 'importacion_id', as: 'importacion' });
Importacion.hasMany(ImportacionGasto, { foreignKey: 'importacion_id', as: 'importaciones_gastos' });


export default ImportacionGasto;