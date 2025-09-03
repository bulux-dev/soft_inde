import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';

let Caja = db.define('cajas', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  fecha_apertura: {
    type: sequelize.DECIMAL
  },
  fecha_cierre: {
    type: sequelize.STRING
  },
  monto_apertura: {
    type: sequelize.STRING
  },
  monto_cierre: {
    type: sequelize.STRING
  },
  total: {
    type: sequelize.STRING
  },
  m1: {
    type: sequelize.STRING
  },
  m5: {
    type: sequelize.STRING
  },
  m10: {
    type: sequelize.STRING
  },
  m25: {
    type: sequelize.STRING
  },
  m50: {
    type: sequelize.STRING
  },
  m100: {
    type: sequelize.STRING
  },
  b1: {
    type: sequelize.STRING
  },
  b5: {
    type: sequelize.STRING
  },
  b10: {
    type: sequelize.STRING
  },
  b20: {
    type: sequelize.STRING
  },
  b50: {
    type: sequelize.STRING
  },
  b100: {
    type: sequelize.STRING
  },
  b200: {
    type: sequelize.STRING
  },
  visa: {
    type: sequelize.STRING
  },
  credomatic: {
    type: sequelize.STRING
  },
  efectivo: {
    type: sequelize.STRING
  },
  tarjeta: {
    type: sequelize.STRING
  },
  transferencia: {
    type: sequelize.STRING
  },
  cheque: {
    type: sequelize.STRING
  },
  deposito: {
    type: sequelize.STRING
  },
  vale: {
    type: sequelize.STRING
  },
  estado: {
    type: sequelize.STRING
  },
  usuario_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Caja.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Caja, { foreignKey: 'usuario_id', as: 'cajas' });

export default Caja;