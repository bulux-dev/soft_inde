import db from '../../../database/db.js';
import sequelize from 'sequelize';
import TipoProducto from '../tipos_productos/tipos_productos.model.js';
import Medida from '../medidas/medidas.model.js';
import ImporteProducto from '../importes_productos/importes_productos.model.js';

let Producto = db.define('productos', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  logo: {
    type: sequelize.TEXT
  },
  sku: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  nombre: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  descripcion: {
    type: sequelize.TEXT
  },
  costo: {
    type: sequelize.DECIMAL
  },
  precio: {
    type: sequelize.DECIMAL
  },
  stock: {
    type: sequelize.BOOLEAN
  },
  lote: {
    type: sequelize.BOOLEAN
  },
  produccion: {
    type: sequelize.BOOLEAN
  },
  combo: {
    type: sequelize.BOOLEAN
  },
  equivalencia: {
    type: sequelize.STRING
  },
  porciones: {
    type: sequelize.STRING
  },
  comision: {
    type: sequelize.STRING
  },
  arancel: {
    type: sequelize.DECIMAL
  },
  tipo_producto_id: {
    type: sequelize.INTEGER
  },
  medida_id: {
    type: sequelize.INTEGER
  },
  importe_producto_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Producto.belongsTo(TipoProducto, { foreignKey: 'tipo_producto_id', as: 'tipo_producto' });
TipoProducto.hasMany(Producto, { foreignKey: 'tipo_producto_id', as: 'productos' });

Producto.belongsTo(Medida, { foreignKey: 'medida_id', as: 'medida' });
Medida.hasMany(Producto, { foreignKey: 'medida_id', as: 'productos' });

Producto.belongsTo(ImporteProducto, { foreignKey: 'importe_producto_id', as: 'importe' });
ImporteProducto.hasMany(Producto, { foreignKey: 'importe_producto_id', as: 'productos' });

export default Producto;