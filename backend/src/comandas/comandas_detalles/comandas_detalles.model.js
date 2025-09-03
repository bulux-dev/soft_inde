import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../../inventario/productos/productos.model.js';
import Comanda from '../comandas/comandas.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';

let ComandaDetalle = db.define('comandas_detalles', {
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
    type: sequelize.DECIMAL,
  },
  comentario: {
    type: sequelize.STRING
  },
  finalizado: {
    type: sequelize.BOOLEAN
  },
  producto_id: {
    type: sequelize.DECIMAL,
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
  usuario_id: {
    type: sequelize.INTEGER
  },
  comanda_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },

}, {
  timestamps: false
});

ComandaDetalle.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(ComandaDetalle, { foreignKey: 'producto_id', as: 'comandas_detalles' });

ComandaDetalle.belongsTo(Medida, { foreignKey: 'medida_id', as: 'medida' });
Medida.hasMany(ComandaDetalle, { foreignKey: 'medida_id', as: 'comandas_detalles' });

ComandaDetalle.belongsTo(Variacion, { foreignKey: 'variacion_id', as: 'variacion' });
Variacion.hasMany(ComandaDetalle, { foreignKey: 'variacion_id', as: 'comandas_detalles' });

ComandaDetalle.belongsTo(Lote, { foreignKey: 'lote_id', as: 'lote' });
Lote.hasMany(ComandaDetalle, { foreignKey: 'lote_id', as: 'comandas_detalles' });

ComandaDetalle.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(ComandaDetalle, { foreignKey: 'usuario_id', as: 'comandas_detalles' });

ComandaDetalle.belongsTo(Comanda, { foreignKey: 'comanda_id', as: 'comanda' });
Comanda.hasMany(ComandaDetalle, { foreignKey: 'comanda_id', as: 'comandas_detalles' });

export default ComandaDetalle;