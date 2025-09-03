import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Venta from '../ventas/ventas.model.js';
import Empleado from '../../personal/empleados/empleados.model.js';
import Producto from '../../inventario/productos/productos.model.js';

let Comision = db.define('comisiones', {
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
  monto: {
    type: sequelize.DECIMAL
  },
  comision: {
    type: sequelize.DECIMAL
  },
  total: {
    type: sequelize.DECIMAL
  },
  empleado_id: {
    type: sequelize.INTEGER
  },
  venta_id: {
    type: sequelize.INTEGER
  },
  producto_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Comision.belongsTo(Empleado, { foreignKey: 'empleado_id', as: 'empleado' });
Empleado.hasMany(Comision, { foreignKey: 'empleado_id', as: 'comisiones' });

Comision.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Venta.hasMany(Comision, { foreignKey: 'venta_id', as: 'comisiones' });

Comision.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(Comision, { foreignKey: 'producto_id', as: 'comisiones' });

export default Comision;