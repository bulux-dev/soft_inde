import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../productos/productos.model.js';
import Variacion from '../variaciones/variaciones.model.js';
import Lote from '../lotes/lotes.model.js';

let Receta = db.define('recetas', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  cantidad: {
    type: sequelize.DECIMAL,
  },
  costo: {
    type: sequelize.DECIMAL
  },
  producto_id: {
    type: sequelize.INTEGER
  },
  producto_receta_id: {
    type: sequelize.INTEGER
  },
  variacion_receta_id: {
    type: sequelize.INTEGER
  },
  lote_receta_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Receta.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(Receta, { foreignKey: 'producto_id', as: 'recetas' });

Receta.belongsTo(Producto, { foreignKey: 'producto_receta_id', as: 'producto_receta' });
Producto.hasMany(Receta, { foreignKey: 'producto_receta_id', as: 'productos_recetas' });

Receta.belongsTo(Variacion, { foreignKey: 'variacion_receta_id', as: 'variacion_receta' });
Variacion.hasMany(Receta, { foreignKey: 'variacion_receta_id', as: 'recetas' });

Receta.belongsTo(Lote, { foreignKey: 'lote_receta_id', as: 'lote_receta' });
Lote.hasMany(Receta, { foreignKey: 'lote_receta_id', as: 'recetas' });

export default Receta;