import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Impresora from '../../soporte/impresoras/impresoras.model.js';

let Categoria = db.define('categorias', {
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
  nombre: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  color: {
    type: sequelize.STRING
  },
  impresora_id: {
    type: sequelize.INTEGER
  },
  categoria_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Categoria.belongsTo(Impresora, { foreignKey: 'impresora_id', as: 'impresora' });
Impresora.hasMany(Categoria, { foreignKey: 'impresora_id', as: 'categorias' });

Categoria.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria_padre' });
Categoria.hasMany(Categoria, { foreignKey: 'categoria_id', as: 'subcategorias' });

export default Categoria;