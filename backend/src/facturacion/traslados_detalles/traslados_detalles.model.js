import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../../inventario/productos/productos.model.js';
import Traslado from '../traslados/traslados.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';

let TrasladoDetalle = db.define('traslados_detalles', {
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
  traslado_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
}, {
  timestamps: false
});

TrasladoDetalle.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(TrasladoDetalle, { foreignKey: 'producto_id', as: 'traslados_detalles' });

TrasladoDetalle.belongsTo(Medida, { foreignKey: 'medida_id', as: 'medida' });
Medida.hasMany(TrasladoDetalle, { foreignKey: 'medida_id', as: 'traslados_detalles' });

TrasladoDetalle.belongsTo(Variacion, { foreignKey: 'variacion_id', as: 'variacion' });
Variacion.hasMany(TrasladoDetalle, { foreignKey: 'variacion_id', as: 'traslados_detalles' });

TrasladoDetalle.belongsTo(Lote, { foreignKey: 'lote_id', as: 'lote' });
Lote.hasMany(TrasladoDetalle, { foreignKey: 'lote_id', as: 'traslados_detalles' });

TrasladoDetalle.belongsTo(Traslado, { foreignKey: 'traslado_id', as: 'traslado' });
Traslado.hasMany(TrasladoDetalle, { foreignKey: 'traslado_id', as: 'traslados_detalles' });

export default TrasladoDetalle;