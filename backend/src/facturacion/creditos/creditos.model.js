import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Venta from '../ventas/ventas.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Recibo from '../recibos/recibos.model.js';

let Credito = db.define('creditos', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  fecha: {
    type: sequelize.STRING
  },
  fecha_inicio: {
    type: sequelize.STRING,
  },
  fecha_fin: {
    type: sequelize.STRING,
  },
  dias: {
    type: sequelize.DECIMAL
  },
  interes_anual: {
    type: sequelize.DECIMAL,
  },
  interes_mensual: {
    type: sequelize.DECIMAL,
  },
  plazo_anos: {
    type: sequelize.DECIMAL
  },
  plazo_meses: {
    type: sequelize.DECIMAL
  },
  tipo_cuota: {
    type: sequelize.STRING
  },
  total: {
    type: sequelize.DECIMAL
  },
  descuento: {
    type: sequelize.DECIMAL
  },
  enganche: {
    type: sequelize.DECIMAL
  },
  reserva: {
    type: sequelize.DECIMAL
  },
  capital: {
    type: sequelize.DECIMAL
  },
  interes: {
    type: sequelize.DECIMAL
  },
  cuota: {
    type: sequelize.DECIMAL
  },
  estado: {
    type: sequelize.STRING
  },
  fecha_anulacion: {
    type: sequelize.STRING
  },
  motivo_anulacion: {
    type: sequelize.STRING
  },
  venta_id: {
    type: sequelize.INTEGER
  },
  usuario_id: {
    type: sequelize.INTEGER
  },
  recibo_reserva_id: {
    type: sequelize.INTEGER
  },
  recibo_enganche_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Credito.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Venta.hasMany(Credito, { foreignKey: 'venta_id', as: 'creditos' })

Credito.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Credito, { foreignKey: 'usuario_id', as: 'creditos' });

Credito.belongsTo(Recibo, { foreignKey: 'recibo_reserva_id', as: 'recibo_reserva' });
Recibo.hasMany(Credito, { foreignKey: 'recibo_reserva_id', as: 'creditos_reservas' });

Credito.belongsTo(Recibo, { foreignKey: 'recibo_enganche_id', as: 'recibo_enganche' });
Recibo.hasMany(Credito, { foreignKey: 'recibo_enganche_id', as: 'creditos_enganches' });


export default Credito;