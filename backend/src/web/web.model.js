import db from '../../database/db.js';
import sequelize from 'sequelize';
import WebSeccion from './web_secciones/web_secciones.model.js';

let Web = db.define('web', {
  id: {
    type: sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  nombre: {
    type: sequelize.STRING
  },
  valor: {
    type: sequelize.TEXT,
  },
  tipo: {
    type: sequelize.STRING
  },
  orden: {
    type: sequelize.STRING
  },
  opciones: {
    type: sequelize.STRING
  },
  col: {
    type: sequelize.STRING
  },
  web_seccion_id: {
    type: sequelize.INTEGER
  }
}, {
  freezeTableName: true,
  tableName: 'web',
  timestamps: false
});

Web.belongsTo(WebSeccion, { foreignKey: 'web_seccion_id', as: 'web_seccion' });
WebSeccion.hasMany(Web, { foreignKey: 'web_seccion_id', as: 'webs' });

export default Web;