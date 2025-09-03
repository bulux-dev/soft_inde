import db from '../../../database/db.js'
import sequelize from 'sequelize'
import Partida from '../partidas/partidas.model.js';
import CentroCosto from '../centros_costos/centros_costos.model.js';
import Rubro from '../rubros/rubros.model.js';
import CuentaContable from '../cuentas_contables/cuentas_contables.model.js';

let PartidaDetalle = db.define('partidas_detalles', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  debe: {
    type: sequelize.STRING
  },
  haber: {
    type: sequelize.STRING
  },
  cuenta_contable_id: {
    type: sequelize.INTEGER
  },
  centro_costo_id: {
    type: sequelize.INTEGER
  },
  rubro_id: {
    type: sequelize.INTEGER
  },
  partida_id: {
    type: sequelize.INTEGER
  }
});

PartidaDetalle.belongsTo(CuentaContable, { foreignKey: 'cuenta_contable_id', as: 'cuenta_contable' });
CuentaContable.hasMany(PartidaDetalle, { foreignKey: 'cuenta_contable_id', as: 'partidas_detalles' });

PartidaDetalle.belongsTo(CentroCosto, {  foreignKey: 'centro_costo_id',  as: 'centro_costo' });
CentroCosto.hasMany(PartidaDetalle, { foreignKey: 'centro_costo_id', as: 'partidas_detalles' });

PartidaDetalle.belongsTo(Rubro, { foreignKey: 'rubro_id', as: 'rubro' });
Rubro.hasMany(PartidaDetalle, { foreignKey: 'rubro_id', as: 'partidas_detalles' });

PartidaDetalle.belongsTo(Partida, { foreignKey: 'partida_id', as: 'partida' });
Partida.hasMany(PartidaDetalle, { foreignKey: 'partida_id', as: 'partidas_detalles' });


export default PartidaDetalle;
