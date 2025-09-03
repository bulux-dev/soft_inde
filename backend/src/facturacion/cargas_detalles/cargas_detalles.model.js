import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../../inventario/productos/productos.model.js';
import Carga from '../cargas/cargas.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';

let CargaDetalle = db.define('cargas_detalles', {
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
  equivalencia: {
    type: sequelize.DECIMAL
  },
  producto_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  medida_id: {
    type: sequelize.INTEGER,
  },
  lote_id: {
    type: sequelize.INTEGER
  },
  variacion_id: {
    type: sequelize.INTEGER
  },
  carga_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
}, {
  timestamps: false
});

CargaDetalle.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(CargaDetalle, { foreignKey: 'producto_id', as: 'cargas_detalles' });

CargaDetalle.belongsTo(Medida, { foreignKey: 'medida_id', as: 'medida' });
Medida.hasMany(CargaDetalle, { foreignKey: 'medida_id', as: 'cargas_detalles' });

CargaDetalle.belongsTo(Variacion, { foreignKey: 'variacion_id', as: 'variacion' });
Variacion.hasMany(CargaDetalle, { foreignKey: 'variacion_id', as: 'cargas_detalles' });

CargaDetalle.belongsTo(Lote, { foreignKey: 'lote_id', as: 'lote' });
Lote.hasMany(CargaDetalle, { foreignKey: 'lote_id', as: 'cargas_detalles' });

CargaDetalle.belongsTo(Carga, { foreignKey: 'carga_id', as: 'carga' });
Carga.hasMany(CargaDetalle, { foreignKey: 'carga_id', as: 'cargas_detalles' });

export default CargaDetalle;