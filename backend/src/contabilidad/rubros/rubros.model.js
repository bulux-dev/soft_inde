import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Presupuesto from '../presupuestos/presupuestos.model.js';

let Rubro = db.define('rubros', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: sequelize.STRING,
    allowNull: false
  },
  nombre: {
    type: sequelize.STRING,
    allowNull: false
  },
  nivel: {
    type: sequelize.STRING,
    allowNull: false
  },
  tipo: {
    type: sequelize.STRING,
    allowNull: false
  },
  monto: {
    type: sequelize.STRING,
    allowNull: false
  },
  presupuesto_id: {
    type: sequelize.INTEGER,
  },
  rubro_id: {
    type: sequelize.INTEGER
  }
});

Rubro.belongsTo(Rubro, { foreignKey: 'rubro_id', as: 'rubro_padre' });
Rubro.hasMany(Rubro, { foreignKey: 'rubro_id', as: 'rubros_hijos' });

Rubro.belongsTo(Presupuesto, { foreignKey: 'presupuesto_id', as: 'presupuesto' });
Presupuesto.hasMany(Rubro, { foreignKey: 'presupuesto_id', as: 'rubros' });

export default Rubro;
