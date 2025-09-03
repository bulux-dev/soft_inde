import db from '../../../database/db.js';
import sequelize from 'sequelize';
import PartidaAutomatica from '../partidas_automaticas/partidas_automaticas.model.js';
import CuentaContable from '../cuentas_contables/cuentas_contables.model.js';
import CentroCosto from '../centros_costos/centros_costos.model.js';
import Rubro from '../rubros/rubros.model.js';

let PartidaDetalleAutomatica = db.define('partidas_detalles_automaticas', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  debe: {
    type: sequelize.STRING,
    allowNull: false
  },
  haber: {
    type: sequelize.STRING,
    allowNull: false
  },
  cuenta_contable_id: {
    type: sequelize.INTEGER
  },
  partida_automatica_id: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  centro_costo_id: {
    type: sequelize.INTEGER
  },
  rubro_id: {
    type: sequelize.INTEGER
  }
});

PartidaDetalleAutomatica.belongsTo(CuentaContable, { foreignKey: 'cuenta_contable_id', as: 'cuenta_contable' });
CuentaContable.hasMany(PartidaDetalleAutomatica, { foreignKey: 'cuenta_contable_id', as: 'partidas_detalles_automaticas' });

PartidaDetalleAutomatica.belongsTo(PartidaAutomatica, { foreignKey: 'partida_automatica_id', as: 'partida_automatica' });
PartidaAutomatica.hasMany(PartidaDetalleAutomatica, { foreignKey: 'partida_automatica_id', as: 'partidas_detalles_automaticas' });

PartidaDetalleAutomatica.belongsTo(CentroCosto, { foreignKey: 'centro_costo_id', as: 'centro_costo' });
CentroCosto.hasMany(PartidaDetalleAutomatica, { foreignKey: 'centro_costo_id', as: 'partidas_detalles_automaticas' });

PartidaDetalleAutomatica.belongsTo(Rubro, { foreignKey: 'rubro_id', as: 'rubro' });
Rubro.hasMany(PartidaDetalleAutomatica, { foreignKey: 'rubro_id', as: 'partidas_detalles_automaticas' });

export default PartidaDetalleAutomatica;