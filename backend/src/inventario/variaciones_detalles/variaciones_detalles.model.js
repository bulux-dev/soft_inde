import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Termino from '../terminos/terminos.model.js';
import Variacion from '../variaciones/variaciones.model.js';
import Atributo from '../atributos/atributos.model.js';

let VariacionDetalle = db.define('variaciones_detalles', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  termino_id: {
    type: sequelize.INTEGER
  },
  atributo_id: {
    type: sequelize.INTEGER
  },
  variacion_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

VariacionDetalle.belongsTo(Termino, { foreignKey: 'termino_id', as: 'termino' });
Termino.hasMany(VariacionDetalle, { foreignKey: 'termino_id', as: 'variaciones_detalles' });

VariacionDetalle.belongsTo(Atributo, { foreignKey: 'atributo_id', as: 'atributo' });
Atributo.hasMany(VariacionDetalle, { foreignKey: 'atributo_id', as: 'variaciones_detalles' });

VariacionDetalle.belongsTo(Variacion, { foreignKey: 'variacion_id', as: 'variacion' });
Variacion.hasMany(VariacionDetalle, { foreignKey: 'variacion_id', as: 'variaciones_detalles' });

export default VariacionDetalle;