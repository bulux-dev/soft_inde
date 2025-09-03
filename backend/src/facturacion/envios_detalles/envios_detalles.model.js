import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../../inventario/productos/productos.model.js';
import Envio from '../envios/envios.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';

let EnvioDetalle = db.define('envios_detalles', {
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
  precio_unitario: {
    type: sequelize.DECIMAL
  },
  precio: {
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
    type: sequelize.INTEGER,
  },
  producto_id: {
    type: sequelize.DECIMAL,
    allowNull: false,
    validate: { notEmpty: true }
  },
  medida_id: {
    type: sequelize.INTEGER,
  },
  lote_id: {
    type: sequelize.INTEGER,
  },
  variacion_id: {
    type: sequelize.INTEGER,
  },
  envio_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },

}, {
  timestamps: false
});

EnvioDetalle.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(EnvioDetalle, { foreignKey: 'producto_id', as: 'envios_detalles' });

EnvioDetalle.belongsTo(Medida, { foreignKey: 'medida_id', as: 'medida' });
Medida.hasMany(EnvioDetalle, { foreignKey: 'medida_id', as: 'envios_detalles' });

EnvioDetalle.belongsTo(Variacion, { foreignKey: 'variacion_id', as: 'variacion' });
Variacion.hasMany(EnvioDetalle, { foreignKey: 'variacion_id', as: 'envios_detalles' });

EnvioDetalle.belongsTo(Lote, { foreignKey: 'lote_id', as: 'lote' });
Lote.hasMany(EnvioDetalle, { foreignKey: 'lote_id', as: 'envios_detalles' });

EnvioDetalle.belongsTo(Envio, { foreignKey: 'envio_id', as: 'envio' });
Envio.hasMany(EnvioDetalle, { foreignKey: 'envio_id', as: 'envios_detalles' });

export default EnvioDetalle;