import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Estacion from '../estaciones/estaciones.model.js';
import Venta from '../../facturacion/ventas/ventas.model.js';

let Cuenta = db.define('cuentas', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  nombre: {
    type: sequelize.STRING
  },
  estado: {
    type: sequelize.STRING
  },
  estacion_id: {
    type: sequelize.INTEGER
  },
  venta_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Cuenta.belongsTo(Estacion, { foreignKey: 'estacion_id', as: 'estacion' });
Estacion.hasMany(Cuenta, { foreignKey: 'estacion_id', as: 'cuentas' });

Cuenta.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Venta.hasMany(Cuenta, { foreignKey: 'venta_id', as: 'cuentas' });

export default Cuenta;