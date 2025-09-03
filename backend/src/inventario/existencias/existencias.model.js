import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../productos/productos.model.js';
import Variacion from '../variaciones/variaciones.model.js';
import Lote from '../lotes/lotes.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Compra from '../../facturacion/compras/compras.model.js';
import Venta from '../../facturacion/ventas/ventas.model.js';
import Carga from '../../facturacion/cargas/cargas.model.js';
import Descarga from '../../facturacion/descargas/descargas.model.js';
import Traslado from '../../facturacion/traslados/traslados.model.js';
import Envio from '../../facturacion/envios/envios.model.js';

let Existencia = db.define('existencias', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  mes: {
    type: sequelize.STRING
  },
  stock_inicial: {
    type: sequelize.DECIMAL
  },
  stock_final: {
    type: sequelize.DECIMAL
  },
  producto_id: {
    type: sequelize.INTEGER
  },
  lote_id: {
    type: sequelize.INTEGER
  },
  variacion_id: {
    type: sequelize.INTEGER
  },
  sucursal_id: {
    type: sequelize.INTEGER
  },
  bodega_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Existencia.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(Existencia, { foreignKey: 'producto_id', as: 'existencias' });

Existencia.belongsTo(Variacion, { foreignKey: 'variacion_id', as: 'variacion' });
Variacion.hasMany(Existencia, { foreignKey: 'variacion_id', as: 'existencias' });

Existencia.belongsTo(Lote, { foreignKey: 'lote_id', as: 'lote' });
Lote.hasMany(Existencia, { foreignKey: 'lote_id', as: 'existencias' });

Existencia.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(Existencia, { foreignKey: 'sucursal_id', as: 'existencias' });

Existencia.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(Existencia, { foreignKey: 'bodega_id', as: 'existencias' });

export default Existencia;