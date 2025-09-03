import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Credito from '../creditos/creditos.model.js';
import Categoria from '../../inventario/categorias/categorias.model.js';
import Empleado from '../../personal/empleados/empleados.model.js';
import Producto from '../../inventario/productos/productos.model.js';

let CreditoDetalle = db.define('creditos_detalles', {
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
  departamento: {
    type: sequelize.STRING
  },
  municipio: {
    type: sequelize.STRING
  },
  proyecto_direccion: {
    type: sequelize.STRING
  },
  proyecto_celular: {
    type: sequelize.STRING
  },
  coordinador: {
    type: sequelize.STRING
  },
  coordinador_celular: {
    type: sequelize.STRING
  },
  compr_nombre: {
    type: sequelize.STRING
  },
  compr_nit: {
    type: sequelize.STRING
  },
  compr_profesion: {
    type: sequelize.STRING
  },
  compr_estado_civil: {
    type: sequelize.STRING
  },
  compr_direccion: {
    type: sequelize.STRING
  },
  compr_celular: {
    type: sequelize.STRING
  },
  compr_edad: {
    type: sequelize.STRING
  },
  compr_dpi: {
    type: sequelize.STRING
  },
  compr_nacionalidad: {
    type: sequelize.STRING
  },
  compr_institucion: {
    type: sequelize.STRING
  },
  compr_inst_direccion: {
    type: sequelize.STRING
  },
  compr_inst_celular: {
    type: sequelize.STRING
  },
  compr_inst_puesto: {
    type: sequelize.STRING
  },
  otros_ingresos: {
    type: sequelize.STRING
  },
  repre_nombre: {
    type: sequelize.STRING
  },
  repre_dpi: {
    type: sequelize.STRING
  },
  repre_cargo: {
    type: sequelize.STRING
  },
  ref1_nombre: {
    type: sequelize.STRING
  },
  ref1_parentesco: {
    type: sequelize.STRING
  },
  ref1_celular: {
    type: sequelize.STRING
  },
  ref2_nombre: {
    type: sequelize.STRING
  },
  ref2_parentesco: {
    type: sequelize.STRING
  },
  ref2_celular: {
    type: sequelize.STRING
  },
  sector: {
    type: sequelize.STRING
  },
  metros2: {
    type: sequelize.STRING
  },
  valor_metros2: {
    type: sequelize.STRING
  },
  finca_no: {
    type: sequelize.STRING
  },
  folio_no: {
    type: sequelize.STRING
  },
  libro_no: {
    type: sequelize.STRING
  },
  lote_direccion: {
    type: sequelize.STRING
  },
  reserva_fecha: {
    type: sequelize.STRING
  },
  reserva_monto: {
    type: sequelize.STRING
  },
  reserva_recibo: {
    type: sequelize.STRING
  },
  enganche_fecha: {
    type: sequelize.STRING
  },
  enganche_monto: {
    type: sequelize.STRING
  },
  enganche_recibo: {
    type: sequelize.STRING
  },
  categoria_id: {
    type: sequelize.INTEGER
  },
  producto_id: {
    type: sequelize.INTEGER
  },
  empleado_id: {
    type: sequelize.INTEGER
  },
  credito_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

CreditoDetalle.belongsTo(Credito, { foreignKey: 'credito_id', as: 'credito' });
Credito.hasOne(CreditoDetalle, { foreignKey: 'credito_id', as: 'credito_detalle' })

CreditoDetalle.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
Categoria.hasMany(CreditoDetalle, { foreignKey: 'categoria_id', as: 'creditos' });

CreditoDetalle.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(CreditoDetalle, { foreignKey: 'producto_id', as: 'creditos' });

CreditoDetalle.belongsTo(Empleado, { foreignKey: 'empleado_id', as: 'empleado' });
Empleado.hasMany(CreditoDetalle, { foreignKey: 'empleado_id', as: 'creditos' });

export default CreditoDetalle;