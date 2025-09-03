import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../../inventario/productos/productos.model.js';
import Descarga from '../descargas/descargas.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';

let DescargaDetalle = db.define('descargas_detalles', {
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
  descarga_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
}, {
  timestamps: false
});

DescargaDetalle.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(DescargaDetalle, { foreignKey: 'producto_id', as: 'descargas_detalles' });

DescargaDetalle.belongsTo(Medida, { foreignKey: 'medida_id', as: 'medida' });
Medida.hasMany(DescargaDetalle, { foreignKey: 'medida_id', as: 'descargas_detalles' });

DescargaDetalle.belongsTo(Variacion, { foreignKey: 'variacion_id', as: 'variacion' });
Variacion.hasMany(DescargaDetalle, { foreignKey: 'variacion_id', as: 'descargas_detalles' });

DescargaDetalle.belongsTo(Lote, { foreignKey: 'lote_id', as: 'lote' });
Lote.hasMany(DescargaDetalle, { foreignKey: 'lote_id', as: 'descargas_detalles' });

DescargaDetalle.belongsTo(Descarga, { foreignKey: 'descarga_id', as: 'descarga' });
Descarga.hasMany(DescargaDetalle, { foreignKey: 'descarga_id', as: 'descargas_detalles' });

export default DescargaDetalle;