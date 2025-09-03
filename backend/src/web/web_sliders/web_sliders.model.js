import db from '../../../database/db.js';
import sequelize from 'sequelize';

let WebSlider = db.define('web_sliders', {
  titulo: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  subtitulo: {
    type: sequelize.STRING
  },
  descripcion: {
    type: sequelize.STRING
  },
  imagen: {
    type: sequelize.TEXT
  },
  button1: {
    type: sequelize.STRING
  },
  link1: {
    type: sequelize.STRING
  },
  button2: {
    type: sequelize.STRING
  },
  link2: {
    type: sequelize.STRING
  }
});

export default WebSlider;