import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { PermisoDirective } from '../utils/permiso.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';
import { UsuariosComponent } from './seguridad/usuarios/usuarios.component';
import { AdminGuard } from './admin.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { AjustesComponent } from './ajustes/ajustes.component';
import { AgregarUsuarioComponent } from './seguridad/usuarios/agregar-usuario/agregar-usuario.component';
import { EditarUsuarioComponent } from './seguridad/usuarios/editar-usuario/editar-usuario.component';
import { RolesComponent } from './seguridad/roles/roles.component';
import { AgregarRolComponent } from './seguridad/roles/agregar-rol/agregar-rol.component';
import { EditarRolComponent } from './seguridad/roles/editar-rol/editar-rol.component';
import { ProductosComponent } from './inventario/productos/productos.component';
import { AgregarProductoComponent } from './inventario/productos/agregar-producto/agregar-producto.component';
import { EditarProductoComponent } from './inventario/productos/editar-producto/editar-producto.component';
import { CategoriasComponent } from './inventario/categorias/categorias.component';
import { AgregarCategoriaComponent } from './inventario/categorias/agregar-categoria/agregar-categoria.component';
import { EditarCategoriaComponent } from './inventario/categorias/editar-categoria/editar-categoria.component';
import { EmpleadosComponent } from './personal/empleados/empleados.component';
import { AgregarEmpleadoComponent } from './personal/empleados/agregar-empleado/agregar-empleado.component';
import { EditarEmpleadoComponent } from './personal/empleados/editar-empleado/editar-empleado.component';
import { ClientesComponent } from './personal/clientes/clientes.component';
import { AgregarClienteComponent } from './personal/clientes/agregar-cliente/agregar-cliente.component';
import { EditarClienteComponent } from './personal/clientes/editar-cliente/editar-cliente.component';
import { ProveedoresComponent } from './personal/proveedores/proveedores.component';
import { AgregarProveedorComponent } from './personal/proveedores/agregar-proveedor/agregar-proveedor.component';
import { EditarProveedorComponent } from './personal/proveedores/editar-proveedor/editar-proveedor.component';
import { MarcasComponent } from './inventario/marcas/marcas.component';
import { AgregarMarcaComponent } from './inventario/marcas/agregar-marca/agregar-marca.component';
import { EditarMarcaComponent } from './inventario/marcas/editar-marca/editar-marca.component';
import { MedidasComponent } from './inventario/medidas/medidas.component';
import { AgregarMedidaComponent } from './inventario/medidas/agregar-medida/agregar-medida.component';
import { EditarMedidaComponent } from './inventario/medidas/editar-medida/editar-medida.component';
import { PermisosComponent } from './seguridad/permisos/permisos.component';
import { AtributosComponent } from './inventario/atributos/atributos.component';
import { AgregarAtributoComponent } from './inventario/atributos/agregar-atributo/agregar-atributo.component';
import { EditarAtributoComponent } from './inventario/atributos/editar-atributo/editar-atributo.component';
import { SucursalesComponent } from './ubicaciones/sucursales/sucursales.component';
import { BodegasComponent } from './ubicaciones/bodegas/bodegas.component';
import { AgregarSucursalComponent } from './ubicaciones/sucursales/agregar-sucursal/agregar-sucursal.component';
import { EditarSucursalComponent } from './ubicaciones/sucursales/editar-sucursal/editar-sucursal.component';
import { AgregarBodegaComponent } from './ubicaciones/bodegas/agregar-bodega/agregar-bodega.component';
import { EditarBodegaComponent } from './ubicaciones/bodegas/editar-bodega/editar-bodega.component';
import { ComprasComponent } from './facturacion/compras/compras.component';
import { AgregarCompraComponent } from './facturacion/compras/agregar-compra/agregar-compra.component';
import { VentasComponent } from './facturacion/ventas/ventas.component';
import { AgregarVentaComponent } from './facturacion/ventas/agregar-venta/agregar-venta.component';
import { DocumentosComponent } from './facturacion/documentos/documentos.component';
import { AgregarDocumentoComponent } from './facturacion/documentos/agregar-documento/agregar-documento.component';
import { EditarDocumentoComponent } from './facturacion/documentos/editar-documento/editar-documento.component';
import { MonedasComponent } from './facturacion/monedas/monedas.component';
import { AgregarMonedaComponent } from './facturacion/monedas/agregar-moneda/agregar-moneda.component';
import { EditarMonedaComponent } from './facturacion/monedas/editar-moneda/editar-moneda.component';
import { ExistenciasComponent } from './inventario/existencias/existencias.component';
import { CreditosComponent } from './facturacion/creditos/creditos.component';
import { AgregarCreditoComponent } from './facturacion/creditos/agregar-credito/agregar-credito.component';
import { EditarCreditoComponent } from './facturacion/creditos/editar-credito/editar-credito.component';
import { AmortizacionesComponent } from './facturacion/creditos/amortizaciones/amortizaciones.component';
import { RecibosComponent } from './facturacion/recibos/recibos.component';
import { AgregarReciboComponent } from './facturacion/recibos/agregar-recibo/agregar-recibo.component';
import { CargasComponent } from './facturacion/cargas/cargas.component';
import { DescargasComponent } from './facturacion/descargas/descargas.component';
import { AgregarCargaComponent } from './facturacion/cargas/agregar-carga/agregar-carga.component';
import { AgregarDescargaComponent } from './facturacion/descargas/agregar-descarga/agregar-descarga.component';
import { TrasladosComponent } from './facturacion/traslados/traslados.component';
import { AgregarTrasladoComponent } from './facturacion/traslados/agregar-traslado/agregar-traslado.component';
import { BancosComponent } from './finanzas/bancos/bancos.component';
import { AgregarBancoComponent } from './finanzas/bancos/agregar-banco/agregar-banco.component';
import { CuentasBancariasComponent } from './finanzas/cuentas-bancarias/cuentas-bancarias.component';
import { AgregarCuentaBancariaComponent } from './finanzas/cuentas-bancarias/agregar-cuenta-bancaria/agregar-cuenta-bancaria.component';
import { EditarBancoComponent } from './finanzas/bancos/editar-banco/editar-banco.component';
import { EditarCuentaBancariaComponent } from './finanzas/cuentas-bancarias/editar-cuenta-bancaria/editar-cuenta-bancaria.component';
import { ChequesComponent } from './finanzas/cheques/cheques.component';
import { AgregarChequeComponent } from './finanzas/cheques/agregar-cheque/agregar-cheque.component';
import { DepositosComponent } from './finanzas/depositos/depositos.component';
import { AgregarDepositoComponent } from './finanzas/depositos/agregar-deposito/agregar-deposito.component';
import { NotasCreditosComponent } from './finanzas/notas-creditos/notas-creditos.component';
import { AgregarNotaCreditoComponent } from './finanzas/notas-creditos/agregar-nota-credito/agregar-nota-credito.component';
import { AgregarNotaDebitoComponent } from './finanzas/notas-debitos/agregar-nota-debito/agregar-nota-debito.component';
import { NotasDebitosComponent } from './finanzas/notas-debitos/notas-debitos.component';
import { NCClientesComponent } from './facturacion/nc-clientes/nc-clientes.component';
import { AgregarNCClienteComponent } from './facturacion/nc-clientes/agregar-nc-cliente/agregar-nc-cliente.component';
import { NDClientesComponent } from './facturacion/nd-clientes/nd-clientes.component';
import { AgregarNDClienteComponent, } from './facturacion/nd-clientes/agregar-nd-cliente/agregar-nd-cliente.component';
import { NCProveedoresComponent } from './facturacion/nc-proveedores/nc-proveedores.component';
import { AgregarNCProveedorComponent } from './facturacion/nc-proveedores/agregar-nc-proveedor/agregar-nc-proveedor.component';
import { NDProveedoresComponent } from './facturacion/nd-proveedores/nd-proveedores.component';
import { AgregarNDProveedorComponent } from './facturacion/nd-proveedores/agregar-nd-proveedor/agregar-nd-proveedor.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ComisionesComponent } from './facturacion/comisiones/comisiones.component';
import { MonedaPipe } from '../utils/moneda.pipe';
import { FechaPipe } from '../utils/fecha.pipe';
import { HacePipe } from '../utils/hace.pipe';
import { TruncatePipe } from '../utils/truncate.pipe';
import { OrdenesComprasComponent } from './facturacion/ordenes-compras/ordenes-compras.component';
import { AgregarOrdenCompraComponent } from './facturacion/ordenes-compras/agregar-orden-compra/agregar-orden-compra.component';
import { PedidosComponent } from './facturacion/pedidos/pedidos.component';
import { AgregarPedidoComponent } from './facturacion/pedidos/agregar-pedido/agregar-pedido.component';
import { CotizacionesComponent } from './facturacion/cotizaciones/cotizaciones.component';
import { AgregarCotizacionComponent } from './facturacion/cotizaciones/agregar-cotizacion/agregar-cotizacion.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ReportesComponent } from './dashboard/reportes/reportes.component';
import { CajasComponent } from './facturacion/cajas/cajas.component';
import { GuiasComponent } from './guias/guias.component';
import { EditarCotizacionComponent } from './facturacion/cotizaciones/editar-cotizacion/editar-cotizacion.component';
import { EnviosComponent } from './facturacion/envios/envios.component';
import { AgregarEnvioComponent } from './facturacion/envios/agregar-envio/agregar-envio.component';
import { EditarEnvioComponent } from './facturacion/envios/editar-envio/editar-envio.component';
import { EditarPedidoComponent } from './facturacion/pedidos/editar-pedido/editar-pedido.component';
import { EditarOrdenCompraComponent } from './facturacion/ordenes-compras/editar-orden-compra/editar-orden-compra.component';
import { TicketsComponent } from './soporte/tickets/tickets.component';
import { CuentasContablesComponent } from './contabilidad/cuentas-contables/cuentas-contables.component';
import { AgregarCuentaContableComponent } from './contabilidad/cuentas-contables/agregar-cuenta-contable/agregar-cuenta-contable.component';
import { EditarCuentaContableComponent } from './contabilidad/cuentas-contables/editar-cuenta-contable/editar-cuenta-contable.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ComplementosComponent } from './complementos/complementos.component';
import { PartidasComponent } from './contabilidad/partidas/partidas.component';
import { EtiquetasComponent } from './inventario/etiquetas/etiquetas.component';
import { AgregarEtiquetaComponent } from './inventario/etiquetas/agregar-etiqueta/agregar-etiqueta.component';
import { EditarEtiquetaComponent } from './inventario/etiquetas/editar-etiqueta/editar-etiqueta.component';
import { ProduccionesComponent } from './facturacion/producciones/producciones.component';
import { AgregarProduccionComponent } from './facturacion/producciones/agregar-produccion/agregar-produccion.component';
import { CarritoComponent } from './carrito/carrito.component';
import { CentrosCostosComponent } from './contabilidad/centros-costos/centros-costos.component';
import { PresupuestosComponent } from './contabilidad/presupuestos/presupuestos.component';
import { AgregarPartidaComponent } from './contabilidad/partidas/agregar-partida/agregar-partida.component';
import { EditarPartidaComponent } from './contabilidad/partidas/editar-partida/editar-partida.component';
import { AgregarCentroCostoComponent } from './contabilidad/centros-costos/agregar-centro-costo/agregar-centro-costo.component';
import { EditarCentroCostoComponent } from './contabilidad/centros-costos/editar-centro-costo/editar-centro-costo.component';
import { AgregarPresupuestoComponent } from './contabilidad/presupuestos/agregar-presupuesto/agregar-presupuesto.component';
import { EditarPresupuestoComponent } from './contabilidad/presupuestos/editar-presupuesto/editar-presupuesto.component';
import { ComerciosComponent } from './comandas/comercios/comercios.component';
import { AreasComponent } from './comandas/comercios/areas/areas.component';
import { EstacionesComponent } from './comandas/comercios/areas/estaciones/estaciones.component';
import { CuentasComponent } from './comandas/comercios/areas/estaciones/cuentas/cuentas.component';
import { ComandasComponent } from './comandas/comercios/areas/estaciones/cuentas/comandas/comandas.component';
import { RubrosComponent } from './contabilidad/rubros/rubros.component';
import { EditarRubroComponent } from './contabilidad/rubros/editar-rubro/editar-rubro.component';
import { AgregarRubroComponent } from './contabilidad/rubros/agregar-rubro/agregar-rubro.component';
import { RubrosCuentasComponent } from './contabilidad/rubros-cuentas/rubros-cuentas.component';

import { ImpresorasComponent } from './soporte/impresoras/impresoras.component';
import { AgregarImpresoraComponent } from './soporte/impresoras/agregar-impresora/agregar-impresora.component';
import { EditarImpresoraComponent } from './soporte/impresoras/editar-impresora/editar-impresora.component';
import { DisplayComponent } from './comandas/display/display.component';
import { ImportacionesComponent } from './facturacion/importaciones/importaciones.component';
import { AgregarImportacionComponent } from './facturacion/importaciones/agregar-importacion/agregar-importacion.component';
import { AgregarRubroCuentaComponent } from './contabilidad/rubros-cuentas/agregar-rubro-cuenta/agregar-rubro-cuenta.component';
import { EditarRubroCuentaComponent } from './contabilidad/rubros-cuentas/editar-rubro-cuenta/editar-rubro-cuenta.component';
import { CajasChicasComponent } from './finanzas/cajas_chicas/cajas-chicas.component';
import { AgregarCajaChicaComponent } from './finanzas/cajas_chicas/agregar-caja-chica/agregar-caja-chica.component';
import { EditarCajaChicaComponent } from './finanzas/cajas_chicas/editar-caja-chica/editar-caja-chica.component';
import { CierresContablesComponent } from './contabilidad/cierres-contables/cierres-contables.component';
import { GastoImportacionComponent } from './facturacion/importaciones/gasto-importacion/gasto-importacion.component';

let routes: Routes = [
  {
    path: '', title: 'Admin', component: AdminComponent, canMatch: [AdminGuard],
    children: [
      {
        path: '', redirectTo: 'perfil', pathMatch: 'full'
      },
      {
        path: 'perfil', title: 'Perfil', component: PerfilComponent
      },
      {
        path: 'ajustes', title: 'Ajustes', component: AjustesComponent
      },
      {
        path: 'dashboard', children: [
          {
            path: 'dashboard', title: 'Dashboard', component: DashboardComponent
          },
          {
            path: 'reportes', title: 'Reportes', component: ReportesComponent
          }
        ]
      },
      {
        path: 'facturacion', children: [
          {
            path: 'documentos', children: [
              {
                path: '', title: 'Documentos', component: DocumentosComponent
              },
              {
                path: 'agregar', title: 'Agregar Documento', component: AgregarDocumentoComponent
              },
              {
                path: 'editar/:documento_id', title: 'Editar Documento', component: EditarDocumentoComponent
              }
            ]
          },
          {
            path: 'cajas', children: [
              {
                path: '', title: 'Cajas', component: CajasComponent
              }
            ]
          },
          {
            path: 'ordenes-compras', children: [
              {
                path: '', title: 'Ordenes de Compra', component: OrdenesComprasComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Orden Compra', component: AgregarOrdenCompraComponent
              },
              {
                path: 'editar/:orden_compra_id', title: 'Editar Orden Compra', component: EditarOrdenCompraComponent
              }
            ]
          },
          {
            path: 'cotizaciones', children: [
              {
                path: '', title: 'Cotizaciones', component: CotizacionesComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Cotización', component: AgregarCotizacionComponent
              },
              {
                path: 'editar/:cotizacion_id', title: 'Editar Cotización', component: EditarCotizacionComponent
              }
            ]
          },
          {
            path: 'pedidos', children: [
              {
                path: '', title: 'Pedidos', component: PedidosComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Pedido', component: AgregarPedidoComponent
              },
              {
                path: 'editar/:pedido_id', title: 'Editar Pedido', component: EditarPedidoComponent
              }
            ]
          },
          {
            path: 'envios', children: [
              {
                path: '', title: 'Envios', component: EnviosComponent,
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Envio', component: AgregarEnvioComponent,
              },
              {
                path: 'editar/:envio_id', title: 'Editar Envio', component: EditarEnvioComponent,
              }
            ]
          },
          {
            path: 'compras', children: [
              {
                path: '', title: 'Compras', component: ComprasComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Compra', component: AgregarCompraComponent
              }
            ]
          },
          {
            path: 'ventas', children: [
              {
                path: '', title: 'Ventas', component: VentasComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Venta', component: AgregarVentaComponent
              },
              {
                path: 'agregar/:documento_id/cuenta/:cuenta_id', title: 'Agregar Cuenta (Cuenta)', component: AgregarVentaComponent
              },
              {
                path: 'agregar/:documento_id/credito/:credito_id', title: 'Agregar Venta (Credito)', component: AgregarVentaComponent
              }
            ]
          },
          {
            path: 'cargas', children: [
              {
                path: '', title: 'Cargas', component: CargasComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Carga', component: AgregarCargaComponent
              }
            ]
          },
          {
            path: 'descargas', children: [
              {
                path: '', title: 'Descargas', component: DescargasComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Descarga', component: AgregarDescargaComponent
              }
            ]
          },
          {
            path: 'traslados', children: [
              {
                path: '', title: 'Traslados', component: TrasladosComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Traslado', component: AgregarTrasladoComponent
              }
            ]
          },
          {
            path: 'importaciones', children: [
              {
                path: '', title: 'Importaciones', component: ImportacionesComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Importacion', component: AgregarImportacionComponent
              },
              {
                path: 'gastos/:importacion_id', title: 'Gastos Importacion', component: GastoImportacionComponent
              }
            ]
          },
          {
            path: 'producciones', children: [
              {
                path: '', title: 'Producciones', component: ProduccionesComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Produccion', component: AgregarProduccionComponent
              }
            ]
          },
          {
            path: 'recibos', children: [
              {
                path: '', title: 'Recibos', component: RecibosComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Recibo', component: AgregarReciboComponent
              },
              {
                path: 'agregar/:documento_id/credito/:credito_id/:tipo', title: 'Agregar Recibo (Credito)', component: AgregarReciboComponent
              },
              {
                path: 'agregar/:documento_id/credito/:credito_id/amortizacion/:amortizacion_id', title: 'Agregar Recibo (Amortizacion)', component: AgregarReciboComponent
              }
            ]
          },
          {
            path: 'notas-creditos-proveedores', children: [
              {
                path: '', title: 'Notas Creditos', component: NCProveedoresComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Nota Credito', component: AgregarNCProveedorComponent
              }
            ]
          },
          {
            path: 'notas-debitos-proveedores', children: [
              {
                path: '', title: 'Notas Debitos', component: NDProveedoresComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Nota Debito', component: AgregarNDProveedorComponent
              }
            ]
          },
          {
            path: 'notas-creditos-clientes', children: [
              {
                path: '', title: 'Notas Creditos', component: NCClientesComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Nota Credito', component: AgregarNCClienteComponent
              }
            ]
          },
          {
            path: 'notas-debitos-clientes', children: [
              {
                path: '', title: 'Notas Debitos', component: NDClientesComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Nota Debito', component: AgregarNDClienteComponent
              }
            ]
          },
          {
            path: 'monedas', children: [
              {
                path: '', title: 'Monedas', component: MonedasComponent
              },
              {
                path: 'agregar', title: 'Agregar Moneda', component: AgregarMonedaComponent
              },
              {
                path: 'editar/:moneda_id', title: 'Editar Moneda', component: EditarMonedaComponent
              }
            ]
          },
          {
            path: 'comisiones', children: [
              {
                path: '', title: 'Comisiones', component: ComisionesComponent
              },
              // {
              //   path: 'agregar', title: 'Agregar Comision', component: AgregarComisionComponent
              // },
              // {
              //   path: 'editar/:comision_id', title: 'Editar Comision', component: EditarComisionComponent
              // }
            ]
          }
        ]
      },
      {
        path: 'comandas', children: [
          {
            path: 'comercios', children: [
              {
                path: '', title: 'Comercios', component: ComerciosComponent
              },
              {
                path: ':comercio_id', title: 'Comercio', component: AreasComponent
              },
              {
                path: ':comercio_id/area/:area_id', title: 'Area', component: EstacionesComponent
              },
              {
                path: ':comercio_id/area/:area_id/estacion/:estacion_id', title: 'Estacion', component: CuentasComponent
              },
              {
                path: ':comercio_id/area/:area_id/estacion/:estacion_id/cuenta/:cuenta_id', title: 'Cuenta', component: ComandasComponent
              }
            ]
          },
          {
            path: 'display', component: DisplayComponent
          }
        ]
      },
      {
        path: 'personal', children: [
          {
            path: 'empleados', children: [
              {
                path: '', title: 'Empleados', component: EmpleadosComponent
              },
              {
                path: 'agregar', title: 'Agregar Empleado', component: AgregarEmpleadoComponent
              },
              {
                path: 'editar/:empleado_id', title: 'Editar Empleado', component: EditarEmpleadoComponent
              }
            ]
          },
          {
            path: 'clientes', children: [
              {
                path: '', title: 'Clientes', component: ClientesComponent
              },
              {
                path: 'agregar', title: 'Agregar Cliente', component: AgregarClienteComponent
              },
              {
                path: 'editar/:cliente_id', title: 'Editar Cliente', component: EditarClienteComponent
              },
            ]
          },
          {
            path: 'proveedores', children: [
              {
                path: '', title: 'Proveedores', component: ProveedoresComponent
              },
              {
                path: 'agregar', title: 'Agregar Proveedor', component: AgregarProveedorComponent
              },
              {
                path: 'editar/:proveedor_id', title: 'Editar Proveedor', component: EditarProveedorComponent
              },
            ]
          }
        ]
      },
      {
        path: 'inventario', children: [
          {
            path: 'productos', children: [
              {
                path: '', title: 'Productos', component: ProductosComponent
              },
              {
                path: 'agregar', title: 'Agregar Producto', component: AgregarProductoComponent
              },
              {
                path: 'editar/:producto_id', title: 'Editar Producto', component: EditarProductoComponent
              }
            ]
          },
          {
            path: 'categorias', children: [
              {
                path: '', title: 'Categorías', component: CategoriasComponent
              },
              {
                path: 'agregar', title: 'Agregar Categoría', component: AgregarCategoriaComponent,
              },
              {
                path: 'agregar/:categoria_id', title: 'Agregar Categoría', component: AgregarCategoriaComponent,
              },
              {
                path: 'editar/:categoria_id', title: 'Editar Categoría', component: EditarCategoriaComponent
              }
            ]
          },
          {
            path: 'marcas', children: [
              {
                path: '', title: 'Marcas', component: MarcasComponent
              },
              {
                path: 'agregar', title: 'Agregar Marca', component: AgregarMarcaComponent,
              },
              {
                path: 'editar/:marca_id', title: 'Editar Marca', component: EditarMarcaComponent
              }
            ]
          },
          {
            path: 'medidas', children: [
              {
                path: '', title: 'Medidas', component: MedidasComponent
              },
              {
                path: 'agregar', title: 'Agregar Medida', component: AgregarMedidaComponent,
              },
              {
                path: 'editar/:medida_id', title: 'Editar Medida', component: EditarMedidaComponent
              }
            ]
          },
          {
            path: 'etiquetas', children: [
              {
                path: '', title: 'Etiquetas', component: EtiquetasComponent
              },
              {
                path: 'agregar', title: 'Agregar Etiqueta', component: AgregarEtiquetaComponent,
              },
              {
                path: 'editar/:etiqueta_id', title: 'Editar Etiqueta', component: EditarEtiquetaComponent
              }
            ]
          },
          {
            path: 'atributos', children: [
              {
                path: '', title: 'Atributos', component: AtributosComponent
              },
              {
                path: 'agregar', title: 'Agregar Atributo', component: AgregarAtributoComponent,
              },
              {
                path: 'editar/:atributo_id', title: 'Editar Atributo', component: EditarAtributoComponent
              }
            ]
          },
          {
            path: 'existencias', children: [
              {
                path: '', title: 'Existencias', component: ExistenciasComponent
              }
            ]
          }
        ]
      },
      {
        path: 'ubicaciones', children: [
          {
            path: 'sucursales', children: [
              {
                path: '', title: 'Sucursales', component: SucursalesComponent
              },
              {
                path: 'agregar', title: 'Agregar Sucursal', component: AgregarSucursalComponent
              },
              {
                path: 'editar/:sucursal_id', title: 'Editar Sucursal', component: EditarSucursalComponent
              }
            ]
          },
          {
            path: 'bodegas', children: [
              {
                path: '', title: 'Bodegas', component: BodegasComponent
              },
              {
                path: 'agregar', title: 'Agregar Bodega', component: AgregarBodegaComponent
              },
              {
                path: 'editar/:bodega_id', title: 'Editar Bodega', component: EditarBodegaComponent
              },
            ]
          },
        ]
      },
      {
        path: 'contabilidad', children: [
          {
            path: 'cuentas-contables', children: [
              {
                path: '', title: 'Cuentas Contables', component: CuentasContablesComponent
              },
              {
                path: 'agregar', title: 'Agregar Cuenta Contable', component: AgregarCuentaContableComponent
              },
              {
                path: 'agregar/:cuenta_contable_id', title: 'Agregar Cuenta Hija', component: AgregarCuentaContableComponent
              },
              {
                path: 'editar/:cuenta_contable_id', title: 'Editar Cuenta Contable', component: EditarCuentaContableComponent
              }
            ]
          },
          {
            path: 'rubros', children: [
              {
                path: '', title: 'Rubros', component: RubrosComponent
              },
              {
                path: 'agregar', title: 'Agregar Rubro', component: AgregarRubroComponent
              },
              {
                path: 'agregar/:rubro_id', title: 'Agregar Rubro Hijo', component: AgregarRubroComponent
              },
              {
                path: 'editar/:rubro_id', title: 'Editar Rubro', component: EditarRubroComponent
              }

            ]
          },
          {
            path: 'rubros-cuentas', children: [
              {
                path: '', title: 'Rubros Cuentas', component: RubrosCuentasComponent
              },
              {
                path: 'agregar/:rubro_id', title: 'Agregar Rubro Cuenta', component: AgregarRubroCuentaComponent
              },
              {
                path: 'editar/:rubro_id', title: 'Editar Rubro Cuenta', component: EditarRubroCuentaComponent
              },

            ]
          },
          {
            path: 'partidas', children: [
              {
                path: '', title: 'Partidas', component: PartidasComponent
              },
              {
                path: 'agregar', title: 'Agregar Partida', component: AgregarPartidaComponent
              },
              {
                path: 'editar/:partida_id', title: 'Editar Partida', component: EditarPartidaComponent
              }
            ]
          },
          {
            path: 'centros-costos', children: [
              {
                path: '', title: 'Centros de Costos', component: CentrosCostosComponent
              },
              {
                path: 'agregar', title: 'Agregar Centro Costo', component: AgregarCentroCostoComponent
              },
              {
                path: 'agregar/:centro_costo_id', title: 'Agregar Centro Costo Hijo', component: AgregarCentroCostoComponent
              },
              {
                path: 'editar/:centro_costo_id', title: 'Editar Centro Costo', component: EditarCentroCostoComponent
              }
            ]
          },
          {
            path: 'presupuestos', children: [
              {
                path: '', title: 'Presupuestos', component: PresupuestosComponent
              },
              {
                path: 'agregar', title: 'Agregar Presupuesto', component: AgregarPresupuestoComponent
              },
              {
                path: 'editar/:presupuesto_id', title: 'Editar Presupuesto', component: EditarPresupuestoComponent
              },
              {
                path: 'rubros', title: 'Rubros', component: RubrosComponent
              },
              {
                path: 'rubros-cuentas', title: 'Rubros Cuentas', component: RubrosCuentasComponent
              }, {
                path: 'editar/:rubro_id', title: 'Editar Rubro Cuenta', component: EditarRubroCuentaComponent
              },
            ]
          },
          {
            path: 'cierres-contables', children: [
              {
                path: '', title: 'Cierres Contables', component: CierresContablesComponent
              }
            ]
          },
        ]
      },
      {
        path: 'finanzas', children: [
          {
            path: 'bancos', children: [
              {
                path: '', title: 'Bancos', component: BancosComponent
              },
              {
                path: 'agregar', title: 'Agregar Banco', component: AgregarBancoComponent
              },
              {
                path: 'editar/:banco_id', title: 'Editar Banco', component: EditarBancoComponent
              }
            ]
          },
          {
            path: 'cuentas-bancarias', children: [
              {
                path: '', title: 'Cuentas Bancarias', component: CuentasBancariasComponent
              },
              {
                path: 'agregar', title: 'Agregar Cuenta Bancaria', component: AgregarCuentaBancariaComponent
              },
              {
                path: 'editar/:cuenta_bancaria_id', title: 'Editar Cuenta Bancaria', component: EditarCuentaBancariaComponent
              }
            ]
          },
          {
            path: 'cheques', children: [
              {
                path: '', title: 'Cheques', component: ChequesComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Cheque', component: AgregarChequeComponent
              }
            ]
          },
          {
            path: 'depositos', children: [
              {
                path: '', title: 'Deposito', component: DepositosComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Deposito', component: AgregarDepositoComponent
              }
            ]
          },
          {
            path: 'notas-creditos', children: [
              {
                path: '', title: 'Notas Creditos', component: NotasCreditosComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Nota Credito', component: AgregarNotaCreditoComponent
              }
            ]
          },
          {
            path: 'notas-debitos', children: [
              {
                path: '', title: 'Notas Debitos', component: NotasDebitosComponent
              },
              {
                path: 'agregar/:documento_id', title: 'Agregar Nota Debito', component: AgregarNotaDebitoComponent
              }
            ]
          },
          {
            path: 'cajas-chicas', children: [
              {
                path: '', title: 'Cajas Chicas', component: CajasChicasComponent
              },
              {
                path: 'agregar', title: 'Agregar Caja Chica', component: AgregarCajaChicaComponent
              },
              {
                path: 'editar/:caja_chica_id', title: 'Caja Chica', component: EditarCajaChicaComponent
              }
            ]
          }
        ]
      },
      {
        path: 'creditos', children: [
          {
            path: 'creditos', children: [
              {
                path: '', title: 'Creditos', component: CreditosComponent
              },
              {
                path: 'agregar', title: 'Agregar Credito', component: AgregarCreditoComponent
              },
              {
                path: 'editar/:credito_id', title: 'Editar Credito', component: EditarCreditoComponent
              },
              {
                path: 'amortizaciones/:credito_id', title: 'Amortizaciones', component: AmortizacionesComponent
              }
            ]
          }
        ]
      },
      {
        path: 'seguridad', children: [
          {
            path: 'roles', children: [
              {
                path: '', title: 'Roles', component: RolesComponent
              },
              {
                path: 'agregar', title: 'Agregar Rol', component: AgregarRolComponent
              },
              {
                path: 'editar/:rol_id', title: 'Editar Rol', component: EditarRolComponent
              }
            ]
          },
          {
            path: 'permisos', children: [
              {
                path: '', title: 'Permisos', component: PermisosComponent
              }
            ]
          },
          {
            path: 'usuarios', children: [
              {
                path: '', title: 'Usuarios', component: UsuariosComponent
              },
              {
                path: 'agregar', title: 'Agregar Usuario', component: AgregarUsuarioComponent
              },
              {
                path: 'editar/:usuario_id', title: 'Editar Usuario', component: EditarUsuarioComponent
              },
            ]
          }
        ]
      },
      {
        path: 'guias', title: 'Guias', component: GuiasComponent
      },
      {
        path: 'tickets', title: 'Tickets', component: TicketsComponent
      },
      {
        path: 'tickets/error/:error_id', title: 'Tickets', component: TicketsComponent
      },
      {
        path: 'impresoras', children: [
          {
            path: '', title: 'Impresoras', component: ImpresorasComponent,
          },
          {
            path: 'agregar', title: 'Agregar Impresora', component: AgregarImpresoraComponent,
          },
          {
            path: 'editar/:impresora_id', title: 'Editar Impresora', component: EditarImpresoraComponent
          }
        ]
      },
      {
        path: 'complementos', title: 'Complementos', component: ComplementosComponent
      },
      {
        path: '**', redirectTo: 'perfil', pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  declarations: [
    AdminComponent,
    PerfilComponent,
    AjustesComponent,
    DashboardComponent,
    ReportesComponent,
    EmpleadosComponent,
    AgregarEmpleadoComponent,
    EditarEmpleadoComponent,
    ClientesComponent,
    AgregarClienteComponent,
    EditarClienteComponent,
    NCClientesComponent,
    AgregarNCClienteComponent,
    NDClientesComponent,
    AgregarNDClienteComponent,
    ProveedoresComponent,
    AgregarProveedorComponent,
    EditarProveedorComponent,
    NCProveedoresComponent,
    AgregarNCProveedorComponent,
    NDProveedoresComponent,
    AgregarNDProveedorComponent,
    ProductosComponent,
    AgregarProductoComponent,
    EditarProductoComponent,
    CategoriasComponent,
    AgregarCategoriaComponent,
    EditarCategoriaComponent,
    MarcasComponent,
    AgregarMarcaComponent,
    EditarMarcaComponent,
    MedidasComponent,
    AgregarMedidaComponent,
    EditarMedidaComponent,
    AtributosComponent,
    AgregarAtributoComponent,
    EditarAtributoComponent,
    ExistenciasComponent,
    SucursalesComponent,
    AgregarSucursalComponent,
    EditarSucursalComponent,
    BodegasComponent,
    AgregarBodegaComponent,
    EditarBodegaComponent,
    BancosComponent,
    AgregarBancoComponent,
    EditarBancoComponent,
    CuentasBancariasComponent,
    AgregarCuentaBancariaComponent,
    EditarCuentaBancariaComponent,
    CajasChicasComponent,
    AgregarCajaChicaComponent,
    EditarCajaChicaComponent,
    DocumentosComponent,
    AgregarDocumentoComponent,
    EditarDocumentoComponent,
    EtiquetasComponent,
    AgregarEtiquetaComponent,
    EditarEtiquetaComponent,
    ComprasComponent,
    AgregarCompraComponent,
    VentasComponent,
    AgregarVentaComponent,
    CargasComponent,
    AgregarCargaComponent,
    DescargasComponent,
    AgregarDescargaComponent,
    TrasladosComponent,
    ImportacionesComponent,
    AgregarImportacionComponent,
    GastoImportacionComponent,
    AgregarTrasladoComponent,
    ProduccionesComponent,
    AgregarProduccionComponent,
    RecibosComponent,
    AgregarReciboComponent,
    ChequesComponent,
    AgregarChequeComponent,
    DepositosComponent,
    AgregarDepositoComponent,
    NotasDebitosComponent,
    AgregarNotaDebitoComponent,
    NotasCreditosComponent,
    AgregarNotaCreditoComponent,
    CreditosComponent,
    AgregarCreditoComponent,
    EditarCreditoComponent,
    AmortizacionesComponent,
    MonedasComponent,
    AgregarMonedaComponent,
    EditarMonedaComponent,
    RolesComponent,
    AgregarRolComponent,
    EditarRolComponent,
    PermisosComponent,
    UsuariosComponent,
    AgregarUsuarioComponent,
    EditarUsuarioComponent,
    ComisionesComponent,
    OrdenesComprasComponent,
    AgregarOrdenCompraComponent,
    PedidosComponent,
    AgregarPedidoComponent,
    EnviosComponent,
    AgregarEnvioComponent,
    EditarEnvioComponent,
    CotizacionesComponent,
    AgregarCotizacionComponent,
    CajasComponent,
    EditarCotizacionComponent,
    EditarPedidoComponent,
    EditarOrdenCompraComponent,
    GuiasComponent,
    TicketsComponent,
    CarritoComponent,
    ComerciosComponent,
    AreasComponent,
    EstacionesComponent,
    CuentasComponent,
    ComandasComponent,
    DisplayComponent,
    ImpresorasComponent,
    AgregarImpresoraComponent,
    EditarImpresoraComponent,
    /////////////////////
    CuentasContablesComponent,
    AgregarCuentaContableComponent,
    EditarCuentaContableComponent,
    CentrosCostosComponent,
    AgregarCentroCostoComponent,
    EditarCentroCostoComponent,
    RubrosComponent,
    AgregarRubroComponent,
    EditarRubroComponent,

    PartidasComponent,
    AgregarPartidaComponent,
    EditarPartidaComponent,
    PresupuestosComponent,
    AgregarPresupuestoComponent,
    EditarPresupuestoComponent,
    EditarRubroComponent,
    AgregarRubroComponent,
    RubrosComponent,
    RubrosCuentasComponent,
    EditarRubroCuentaComponent,
    AgregarRubroCuentaComponent,
    CierresContablesComponent,
  ],
  imports: [
    CommonModule,
    PermisoDirective,
    MonedaPipe,
    TruncatePipe,
    FechaPipe,
    HacePipe,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgMultiSelectDropDownModule,
    NgApexchartsModule,
  ]
})
export class AdminModule { }
