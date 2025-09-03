import db from '../../../database/db.js';
import sequelize from 'sequelize';
import ProductoAtributo from '../productos_atributos/productos_atributos.model.js';
import Valor from '../valores/valores.model.js';

let Termino = db.define('terminos', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  producto_atributo_id: {
    type: sequelize.INTEGER
  },
  valor_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Termino.belongsTo(ProductoAtributo, { foreignKey: 'producto_atributo_id', as: 'atributo' });
ProductoAtributo.hasMany(Termino, { foreignKey: 'producto_atributo_id', as: 'terminos' });

Termino.belongsTo(Valor, { foreignKey: 'valor_id', as: 'valor' });
Valor.hasMany(Termino, { foreignKey: 'valor_id', as: 'terminos' });

export default Termino;