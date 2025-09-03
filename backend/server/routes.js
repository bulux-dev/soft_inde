import express from 'express';
import authRoute from '../src/auth/auth.route.js';
import variablesRoute from '../src/variables/variables.route.js';
import rolesRoute from '../src/seguridad/roles/roles.route.js';
import usuariosRoute from '../src/seguridad/usuarios/usuarios.route.js';
import permisosRoute from '../src/seguridad/permisos/permisos.route.js';
import empleadosRoute from '../src/personal/empleados/empleados.route.js';
import clientesRoute from '../src/personal/clientes/clientes.route.js';
import tiposProductosRoute from '../src/inventario/tipos_productos/tipos_productos.route.js';
import importesProductosRoute from '../src/inventario/importes_productos/importes_productos.route.js';
import tiposDocumentosRoute from '../src/facturacion/tipos_documentos/tipos_documentos.route.js'
import proveedorRoute from '../src/personal/proveedores/proveedores.route.js';
import categoriasRoute from '../src/inventario/categorias/categorias.route.js';
import categoriasSucursalesRoute from '../src/inventario/categorias_sucursales/categorias_sucursales.route.js';
import marcasRoute from '../src/inventario/marcas/marcas.route.js';
import medidasRoute from '../src/inventario/medidas/medidas.route.js';
import atributosRoute from '../src/inventario/atributos/atributos.route.js';
import valoresRoute from '../src/inventario/valores/valores.route.js';
import productosRoute from '../src/inventario/productos/productos.route.js';
import equivalenciasRoute from '../src/inventario/equivalencias/equivalencias.route.js';
import productosCategoriasRoute from '../src/inventario/productos_categorias/productos_categorias.route.js';
import productosFotosRoute from '../src/inventario/productos_fotos/productos_fotos.route.js';
import productosMarcasRoute from '../src/inventario/productos_marcas/productos_marcas.route.js';
import productosMedidasRoute from '../src/inventario/productos_medidas/productos_medidas.route.js';
import productosAtributosRoute from '../src/inventario/productos_atributos/productos_atributos.route.js';
import productosCostosRoute from '../src/inventario/productos_costos/productos_costos.route.js';
import productosPreciosRoute from '../src/inventario/productos_precios/productos_precios.route.js';
import terminosRoute from '../src/inventario/terminos/terminos.route.js';
import variacionesRoute from '../src/inventario/variaciones/variaciones.route.js';
import variacionesDetallesRoute from '../src/inventario/variaciones_detalles/variaciones_detalles.route.js';
import lotesRoute from '../src/inventario/lotes/lotes.route.js';
import sucursalesRoute from '../src/ubicaciones/sucursales/sucursales.route.js';
import bodegasRoute from '../src/ubicaciones/bodegas/bodegas.route.js';
import sucursalesBodegasRoute from '../src/ubicaciones/sucursales_bodegas/sucursales_bodegas.route.js';
import bancosRoute from '../src/finanzas/bancos/bancos.route.js';
import cuentasBancariasRoute from '../src/finanzas/cuentas_bancarias/cuentas_bancarias.route.js';
import CajasChicasRoute from '../src/finanzas/cajas_chicas/cajas_chicas.route.js';
import DocumentosRoute from '../src/facturacion/documentos/documentos.route.js';
import OrdenesComprasRoute from '../src/facturacion/ordenes_compras/ordenes_compras.route.js';
import OrdenesComprasDetallesRoute from '../src/facturacion/ordenes_compras_detalles/ordenes_compras_detalles.route.js';
import CotizacionesRoute from '../src/facturacion/cotizaciones/cotizaciones.route.js';
import CotizacionesDetallesRoute from '../src/facturacion/cotizaciones_detalles/cotizaciones_detalles.route.js';
import PedidosRoute from '../src/facturacion/pedidos/pedidos.route.js';
import PedidosDetallesRoute from '../src/facturacion/pedidos_detalles/pedidos_detalles.route.js';
import enviosRoute from '../src/facturacion/envios/envios.route.js';
import enviosDetallesRoute from '../src/facturacion/envios_detalles/envios_detalles.route.js';
import ComprasRoute from '../src/facturacion/compras/compras.route.js';
import VentasRoute from '../src/facturacion/ventas/ventas.route.js';
import ComprasDetallesRoute from '../src/facturacion/compras_detalles/compras_detalles.route.js';
import VentasDetallesRoute from '../src/facturacion/ventas_detalles/ventas_detalles.route.js';
import MonedasRoute from '../src/facturacion/monedas/monedas.route.js';
import CreditosRoute from '../src/facturacion/creditos/creditos.route.js';
import CreditosDetallesRoute from '../src/facturacion/creditos_detalles/creditos_detalles.route.js';
import CuotasRoute from '../src/facturacion/cuotas/cuotas.route.js';
import AmortizacionesRoute from '../src/facturacion/amortizaciones/amortizaciones.route.js';
import InventariosRoute from '../src/inventario/inventarios/inventarios.route.js';
import ExistenciasRoute from '../src/inventario/existencias/existencias.route.js';
import RecetasRoute from '../src/inventario/recetas/recetas.route.js';
import SaldosRoute from '../src/facturacion/saldos/saldos.route.js';
import CargasRoute from '../src/facturacion/cargas/cargas.route.js';
import CargasDetallesRoute from '../src/facturacion/cargas_detalles/cargas_detalles.route.js';
import DescargasRoute from '../src/facturacion/descargas/descargas.route.js';
import DescargasDetallesRoute from '../src/facturacion/descargas_detalles/descargas_detalles.route.js';
import TrasladosRoute from '../src/facturacion/traslados/traslados.route.js';
import TrasladosDetallesRoute from '../src/facturacion/traslados_detalles/traslados_detalles.route.js';
import ImportacionesRoute from '../src/facturacion/importaciones/importaciones.route.js';
import ImportacionesDetallesRoute from '../src/facturacion/importaciones_detalles/importaciones_detalles.route.js';
import tiposGastosRoute from '../src/facturacion/tipos_gastos/tipos_gastos.route.js';
import importacionesGastosRoute from '../src/facturacion/importaciones_gastos/importaciones_gastos.route.js';
import ProduccionesRoute from '../src/facturacion/producciones/producciones.route.js';
import ProduccionesDetallesRoute from '../src/facturacion/producciones_detalles/producciones_detalles.route.js';
import RecibosRoute from '../src/facturacion/recibos/recibos.route.js';
import RecibosDetallesRoute from '../src/facturacion/recibos_detalles/recibos_detalles.route.js';
import NCClientesRoute from '../src/facturacion/nc_clientes/nc_clientes.route.js';
import NDClientesRoute from '../src/facturacion/nd_clientes/nd_clientes.route.js';
import NCProveedoresRoute from '../src/facturacion/nc_proveedores/nc_proveedores.route.js';
import NDProveedoresRoute from '../src/facturacion/nd_proveedores/nd_proveedores.route.js';
import PagosRoute from '../src/facturacion/pagos/pagos.route.js';
import AbonosRoute from '../src/facturacion/abonos/abonos.route.js';
import ComisionesRoute from '../src/facturacion/comisiones/comisiones.route.js';
import CajasRoute from '../src/facturacion/cajas/cajas.route.js';
import EtiquetasRoute from '../src/inventario/etiquetas/etiquetas.route.js';
import OperacionesEtiquetasRoute from '../src/inventario/operaciones_etiquetas/operaciones_etiquetas.route.js';
import DigifactRoute from '../src/facturacion/digifact/digifact.route.js';
import reportesRoute from '../src/reportes/reportes.route.js';
import ErroresRoute from '../src/soporte/errores/errores.route.js';
import TicketsRoute from '../src/soporte/tickets/tickets.route.js';
import DashboardRoute from '../src/dashboard/dashboard.route.js';
import ticketsMensajesRoute from '../src/soporte/tickets_mensajes/tickets_mensajes.route.js';
import webRoute from '../src/web/web.route.js';
import webMenusRoute from '../src/web/web_menus/web_menus.route.js';
import webSeccionesRoute from '../src/web/web_secciones/web_secciones.route.js';
import webSlidersRoute from '../src/web/web_sliders/web_sliders.route.js';
import ImpresorasRoute from '../src/soporte/impresoras/impresoras.route.js';

import ChequesRoute from '../src/finanzas/cheques/cheques.route.js';
import DepositosRoute from '../src/finanzas/depositos/depositos.route.js';
import NotasDebitosRoute from '../src/finanzas/notas_debitos/notas_debitos.route.js';
import NotasCreditosRoute from '../src/finanzas/notas_creditos/notas_creditos.route.js';

import ComerciosRoute from '../src/comandas/comercios/comercios.route.js';
import AreasRoute from '../src/comandas/areas/areas.route.js';
import EstacionesRoute from '../src/comandas/estaciones/estaciones.route.js';
import CuentasRoute from '../src/comandas/cuentas/cuentas.route.js';
import ComandasRoute from '../src/comandas/comandas/comandas.route.js';
import ComandasDetallesRoute from '../src/comandas/comandas_detalles/comandas_detalles.route.js';

import CuentasContablesRoute from '../src/contabilidad/cuentas_contables/cuentas_contables.route.js';
import CentrosCostosRoute from '../src/contabilidad/centros_costos/centros_costos.route.js';
import PresupuestosRoute from '../src/contabilidad/presupuestos/presupuestos.route.js';
import RubrosRoute from '../src/contabilidad/rubros/rubros.route.js';
import RubrosCuentasRoute from '../src/contabilidad/rubros_cuentas/rubros_cuentas.route.js';
import PartidasRoute from '../src/contabilidad/partidas/partidas.route.js';
import PartidasDetallesRoute from '../src/contabilidad/partidas_detalles/partidas_detalles.route.js';
import PartidasAutomaticasRoute from '../src/contabilidad/partidas_automaticas/partidas_automaticas.route.js';
import PartidasDetallesAutomaticasRoute from '../src/contabilidad/partidas_detalles_automaticas/partidas_detalles_automaticas.route.js';

let router = express.Router();

// Seguridad
router.use('/auth', authRoute);
router.use('/roles', rolesRoute);
router.use('/usuarios', usuariosRoute);
router.use('/permisos', permisosRoute);
router.use('/variables', variablesRoute);

// // Personal
router.use('/empleados', empleadosRoute);
router.use('/clientes', clientesRoute);
router.use('/proveedores', proveedorRoute);

// // Inventario
router.use('/categorias', categoriasRoute);
router.use('/categorias_sucursales', categoriasSucursalesRoute);
router.use('/marcas', marcasRoute);
router.use('/medidas', medidasRoute);
router.use('/atributos', atributosRoute);
router.use('/valores', valoresRoute);
router.use('/tipos_productos', tiposProductosRoute);
router.use('/importes_productos', importesProductosRoute);
router.use('/productos', productosRoute);
router.use('/equivalencias', equivalenciasRoute);
router.use('/productos_fotos', productosFotosRoute);
router.use('/productos_categorias', productosCategoriasRoute);
router.use('/productos_marcas', productosMarcasRoute);
router.use('/productos_medidas', productosMedidasRoute);
router.use('/productos_atributos', productosAtributosRoute);
router.use('/productos_costos', productosCostosRoute);
router.use('/productos_precios', productosPreciosRoute);
router.use('/terminos', terminosRoute);
router.use('/variaciones', variacionesRoute);
router.use('/variaciones_detalles', variacionesDetallesRoute);
router.use('/lotes', lotesRoute);
router.use('/inventarios', InventariosRoute);
router.use('/existencias', ExistenciasRoute);
router.use('/recetas', RecetasRoute);

//Ubicaciones
router.use('/sucursales', sucursalesRoute);
router.use('/bodegas', bodegasRoute);
router.use('/sucursales_bodegas', sucursalesBodegasRoute);

// Bancos
router.use('/bancos', bancosRoute);
router.use('/cuentas_bancarias', cuentasBancariasRoute);
router.use('/cajas_chicas', CajasChicasRoute);

//Facturacion
router.use('/tipos_documentos', tiposDocumentosRoute);
router.use('/documentos', DocumentosRoute);
router.use('/monedas', MonedasRoute);

router.use('/ordenes_compras', OrdenesComprasRoute);
router.use('/ordenes_compras_detalles', OrdenesComprasDetallesRoute);
router.use('/cotizaciones', CotizacionesRoute);
router.use('/cotizaciones_detalles', CotizacionesDetallesRoute);
router.use('/pedidos', PedidosRoute);
router.use('/pedidos_detalles', PedidosDetallesRoute);
router.use('/envios', enviosRoute);
router.use('/envios_detalles', enviosDetallesRoute);
router.use('/compras', ComprasRoute);
router.use('/compras_detalles', ComprasDetallesRoute);
router.use('/ventas', VentasRoute);
router.use('/ventas_detalles', VentasDetallesRoute);
router.use('/cargas', CargasRoute);
router.use('/cargas_detalles', CargasDetallesRoute);
router.use('/descargas', DescargasRoute);
router.use('/descargas_detalles', DescargasDetallesRoute);
router.use('/traslados', TrasladosRoute);
router.use('/traslados_detalles', TrasladosDetallesRoute);
router.use('/importaciones', ImportacionesRoute)
router.use('/importaciones_detalles', ImportacionesDetallesRoute);
router.use('/tipos_gastos', tiposGastosRoute);
router.use('/importaciones_gastos', importacionesGastosRoute);
router.use('/producciones', ProduccionesRoute);
router.use('/producciones_detalles', ProduccionesDetallesRoute);
router.use('/recibos', RecibosRoute);
router.use('/recibos_detalles', RecibosDetallesRoute);
router.use('/cheques', ChequesRoute);
router.use('/depositos', DepositosRoute)
router.use('/notas_debitos', NotasDebitosRoute);
router.use('/notas_creditos', NotasCreditosRoute);
router.use('/nc_clientes', NCClientesRoute);
router.use('/nd_clientes', NDClientesRoute);
router.use('/nc_proveedores', NCProveedoresRoute);
router.use('/nd_proveedores', NDProveedoresRoute);

router.use('/pagos', PagosRoute);
router.use('/abonos', AbonosRoute);
router.use('/comisiones', ComisionesRoute);
router.use('/saldos', SaldosRoute);
router.use('/cajas', CajasRoute);
router.use('/etiquetas', EtiquetasRoute);
router.use('/operaciones_etiquetas', OperacionesEtiquetasRoute);

router.use('/digifact', DigifactRoute);

//Comandas
router.use('/comercios', ComerciosRoute);
router.use('/areas', AreasRoute);
router.use('/estaciones', EstacionesRoute);
router.use('/cuentas', CuentasRoute);
router.use('/comandas', ComandasRoute);
router.use('/comandas_detalles', ComandasDetallesRoute);

// Creditos
router.use('/creditos', CreditosRoute);
router.use('/creditos_detalles', CreditosDetallesRoute);
router.use('/cuotas', CuotasRoute);
router.use('/amortizaciones', AmortizacionesRoute);

// Contabilidad
router.use('/cuentas_contables', CuentasContablesRoute);
router.use('/centros_costos', CentrosCostosRoute);
router.use('/presupuestos', PresupuestosRoute);
router.use('/rubros', RubrosRoute);
router.use('/rubros_cuentas', RubrosCuentasRoute);
router.use('/partidas', PartidasRoute);
router.use('/partidas_detalles', PartidasDetallesRoute);
router.use('/partidas_automaticas', PartidasAutomaticasRoute);
router.use('/partidas_detalles_automaticas', PartidasDetallesAutomaticasRoute);

// Reportes
router.use('/reportes', reportesRoute);

// Soporte
router.use('/impresoras', ImpresorasRoute)
router.use('/errores', ErroresRoute);
router.use('/tickets', TicketsRoute);
router.use('/tickets_mensajes', ticketsMensajesRoute);
router.use('/web', webRoute);
router.use('/web_menus', webMenusRoute);
router.use('/web_secciones', webSeccionesRoute);
router.use('/web_sliders', webSlidersRoute);

// Dashboard
router.use('/dashboard', DashboardRoute);

export default router;