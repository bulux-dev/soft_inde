import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../../inventario/productos/productos.model.js';
import Importacion from '../importaciones/importaciones.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';

let ImportacionDetalle = db.define('importaciones_detalles', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  descripcion: {
    type: sequelize.TEXT
  },
  cantidad: {
    type: sequelize.DECIMAL
  },
  costo_unitario: {
    type: sequelize.DECIMAL
  },
  costo: {
    type: sequelize.DECIMAL,
  },
  descuento: {
    type: sequelize.DECIMAL,
  },
  total: {
    type: sequelize.DECIMAL,
  },
  subtotal: {
    type: sequelize.DECIMAL,
  },
  impuesto: {
    type: sequelize.DECIMAL,
  },
  costo_unitario_ext: {
    type: sequelize.DECIMAL
  },
  costo_ext: {
    type: sequelize.DECIMAL,
  },
  descuento_ext: {
    type: sequelize.DECIMAL,
  },
  total_ext: {
    type: sequelize.DECIMAL,
  },
  subtotal_ext: {
    type: sequelize.DECIMAL,
  },
  impuesto_ext: {
    type: sequelize.DECIMAL,
  },
  arancel: {
    type: sequelize.DECIMAL,
  },
  peso: {
    type: sequelize.DECIMAL,
  },
  porc_gasto: {
    type: sequelize.DECIMAL,
  },
  costo_unitario_cif: {
    type: sequelize.DECIMAL,
  },
  costo_cif: {
    type: sequelize.DECIMAL,
  },
  costo_unitario_cif_ext: {
    type: sequelize.DECIMAL,
  },
  costo_cif_ext: {
    type: sequelize.DECIMAL,
  },
  equivalencia: {
    type: sequelize.DECIMAL,
  },
  producto_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  medida_id: {
    type: sequelize.INTEGER
  },
  lote_id: {
    type: sequelize.INTEGER
  },
  variacion_id: {
    type: sequelize.INTEGER
  },
  importacion_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
}, {
  timestamps: false
});

ImportacionDetalle.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(ImportacionDetalle, { foreignKey: 'producto_id', as: 'importaciones_detalles' });

ImportacionDetalle.belongsTo(Medida, { foreignKey: 'medida_id', as: 'medida' });
Medida.hasMany(ImportacionDetalle, { foreignKey: 'medida_id', as: 'importaciones_detalles' });

ImportacionDetalle.belongsTo(Variacion, { foreignKey: 'variacion_id', as: 'variacion' });
Variacion.hasMany(ImportacionDetalle, { foreignKey: 'variacion_id', as: 'importaciones_detalles' });

ImportacionDetalle.belongsTo(Lote, { foreignKey: 'lote_id', as: 'lote' });
Lote.hasMany(ImportacionDetalle, { foreignKey: 'lote_id', as: 'importaciones_detalles' });

ImportacionDetalle.belongsTo(Importacion, { foreignKey: 'importacion_id', as: 'importacion' });
Importacion.hasMany(ImportacionDetalle, { foreignKey: 'importacion_id', as: 'importaciones_detalles' });

export default ImportacionDetalle;