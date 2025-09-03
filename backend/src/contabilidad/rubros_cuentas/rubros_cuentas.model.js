import db from '../../../database/db.js'
import sequelize from 'sequelize';
import Rubro from '../rubros/rubros.model.js';
import CuentaContable from '../cuentas_contables/cuentas_contables.model.js';

let RubroCuenta = db.define('rubros_cuentas', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rubro_id: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  cuenta_contable_id: {
    type: sequelize.INTEGER,
    allowNull: false
  }
});

RubroCuenta.belongsTo(Rubro, { foreignKey: 'rubro_id', as: 'rubro' });
Rubro.hasMany(RubroCuenta, { foreignKey: 'rubro_id', as: 'rubros_cuentas' });

RubroCuenta.belongsTo(CuentaContable, { foreignKey: 'cuenta_contable_id', as: 'cuenta_contable' });
CuentaContable.hasMany(RubroCuenta, { foreignKey: 'cuenta_contable_id', as: 'rubros_cuentas' });


export default RubroCuenta;