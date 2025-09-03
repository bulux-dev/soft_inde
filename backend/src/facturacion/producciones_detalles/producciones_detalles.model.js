import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../../inventario/productos/productos.model.js';
import Produccion from '../producciones/producciones.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';

let ProduccionDetalle = db.define('producciones_detalles', {
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
  produccion_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
}, {
  timestamps: false
});

ProduccionDetalle.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(ProduccionDetalle, { foreignKey: 'producto_id', as: 'producciones_detalles' });

ProduccionDetalle.belongsTo(Medida, { foreignKey: 'medida_id', as: 'medida' });
Medida.hasMany(ProduccionDetalle, { foreignKey: 'medida_id', as: 'producciones_detalles' });

ProduccionDetalle.belongsTo(Variacion, { foreignKey: 'variacion_id', as: 'variacion' });
Variacion.hasMany(ProduccionDetalle, { foreignKey: 'variacion_id', as: 'producciones_detalles' });

ProduccionDetalle.belongsTo(Lote, { foreignKey: 'lote_id', as: 'lote' });
Lote.hasMany(ProduccionDetalle, { foreignKey: 'lote_id', as: 'producciones_detalles' });

ProduccionDetalle.belongsTo(Produccion, { foreignKey: 'produccion_id', as: 'produccion' });
Produccion.hasMany(ProduccionDetalle, { foreignKey: 'produccion_id', as: 'producciones_detalles' });

export default ProduccionDetalle;