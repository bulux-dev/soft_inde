import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { VentasService } from '../../../../services/ventas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DigifactService } from '../../../../services/digifact.service';
import { DocumentosService } from '../../../../services/documentos.service';
import { BodegasService } from '../../../../services/bodegas.service';
import { ClientesService } from '../../../../services/clientes.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from '../../../../app.component';
import { SucursalesService } from '../../../../services/sucursales.service';
import { MonedasService } from '../../../../services/monedas.service';
import { CreditosService } from '../../../../services/creditos.service';
import { EmpleadosService } from '../../../../services/empleados.service';
import { CotizacionesService } from '../../../../services/cotizaciones.service';
import { PedidosService } from '../../../../services/pedidos.service';
import { EtiquetasService } from '../../../../services/etiquetas.service';
import { Router } from '@angular/router';
import { ExistenciasService } from '../../../../services/existencias.service';
import { VariablesService } from '../../../../services/variables.service';
import { RecetasService } from '../../../../services/recetas.service';

declare var $: any

@Component({
  selector: 'app-agregar-venta',
  standalone: false,
  templateUrl: './agregar-venta.component.html',
  styleUrl: './agregar-venta.component.css'
})
export class AgregarVentaComponent {

  @Input() documento_id: any;
  @Input() credito_id: any;
  @Input() cuenta_id: any;

  get selectS() {
    return AppComponent.selectS;
  }

  get selectM() {
    return AppComponent.selectM;
  }

  ventas_detalles: any = [];
  pagos: any = [];
  abonos: any = [];
  bodegas: any = [];
  monedas: any = [];
  cotizaciones: any = [];
  pedidos: any = [];
  sucursales: any = [];
  empleados: any = [];
  metodos: any = ['Efectivo', 'Tarjeta', 'Transferencia', 'Deposito', 'Cheque', 'Vale'];
  booleanos: any = [{ id: 1, nombre: 'SI' }, { id: 0, nombre: 'NO' }];
  etiquetas: any = [];

  documento: any;
  credito: any;
  moneda_simbolo: any;
  view_carrito: boolean = true;

  fecha_min = moment().startOf('month').format('YYYY-MM-DD HH:mm');
  fecha_max = moment().endOf('month').format('YYYY-MM-DD HH:mm');
  tipo_stock: any;

  ventaForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [Validators.required]),
    observaciones: new FormControl(null),
    descuento: new FormControl(null),
    total: new FormControl(null),
    subtotal: new FormControl(null),
    impuesto: new FormControl(null),
    descuento_ext: new FormControl(null),
    total_ext: new FormControl(null),
    subtotal_ext: new FormControl(null),
    impuesto_ext: new FormControl(null),
    tipo_pago: new FormControl('CONTADO', [Validators.required]),
    tipo_cambio: new FormControl(null),
    dias_credito: new FormControl(null),
    gravable: new FormControl([{ id: 1, nombre: 'SI' }], [Validators.required]),
    libro: new FormControl([{ id: 1, nombre: 'SI' }, [Validators.required]]),
    cambiaria: new FormControl(false),
    fel_numero: new FormControl(null),
    fel_serie: new FormControl(null),
    fel_autorizacion: new FormControl(null),
    documento_id: new FormControl(null, [Validators.required]),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null),
    cliente_id: new FormControl(1, [Validators.required]),
    moneda_id: new FormControl(null, [Validators.required]),
    empleado_id: new FormControl(null),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    ventas_detalles: new FormControl([]),
    pagos: new FormControl([]),
    abonos: new FormControl([]),
    cuotas: new FormControl([]),
    credito: new FormControl(false),
    cliente: new FormControl({}),
    cotizacion: new FormControl(null),
    cotizacion_id: new FormControl(null),
    pedido: new FormControl(null),
    pedido_id: new FormControl(null),
    cuenta_id: new FormControl(null),
    documento: new FormControl(null),
    operaciones_etiquetas: new FormControl([]),
  });
  clienteForm: FormGroup = new FormGroup({
    nombre: new FormControl('Consumidor Final', [Validators.required]),
    nit: new FormControl('CF'),
    cui: new FormControl(null),
    direccion: new FormControl(null),
    contacto: new FormControl(null),
    correo: new FormControl(null),
    telefono: new FormControl(null),
  });
  pagoForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD'), [Validators.required]),
    monto: new FormControl(null, [Validators.required]),
    cambio: new FormControl(null),
    metodo: new FormControl(null, [Validators.required]),
    autorizacion: new FormControl(null),
  });
  abonoForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD'), [Validators.required]),
    monto: new FormControl(null, [Validators.required]),
  });

  constructor(
    private ngxService: NgxUiLoaderService,
    private alertas_service: AlertasService,
    private ventas_service: VentasService,
    private digifact_service: DigifactService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private clientes_service: ClientesService,
    private monedas_service: MonedasService,
    private creditos_service: CreditosService,
    private empleados_service: EmpleadosService,
    private cotizaciones_service: CotizacionesService,
    private pedidos_service: PedidosService,
    private etiquetas_service: EtiquetasService,
    private existencias_service: ExistenciasService,
    private variables_service: VariablesService,
    private recetas_service: RecetasService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDocumento();
    await this.getMonedas();
    await this.getCotizaciones();
    await this.getPedidos();
    await this.getEmpleados();
    await this.getEtiquetas();
    if (this.credito_id) {
      let credito = await this.creditos_service.getCredito(this.credito_id);
      this.credito = credito.data;
      this.clienteForm.controls['nit'].setValue(this.credito.credito_detalle.compr_nit);
      await this.getInfoNit();

      let descripcion = `VENTA DE ${this.credito.credito_detalle.producto.nombre}`.toUpperCase();

      this.ventas_detalles.push({
        logo: this.credito.credito_detalle.producto.logo,
        sku: this.credito.credito_detalle.producto.sku,
        descripcion: this.credito.credito_detalle.producto.nombre,
        tipo: 'BIEN',
        producto: this.credito.credito_detalle.producto,
        cantidad: 1,
        precio_unitario: this.credito.total,
        precio: this.credito.total,
        descuento: 0,
        total: this.credito.total,
        subtotal: 0,
        impuesto: 0,
        producto_id: this.credito.credito_detalle.producto.id,
        medida_id: this.credito.credito_detalle.producto.medida_id,
        medida: this.credito.credito_detalle.producto.medida,
        lote_id: null,
        lote: null,
        variacion_id: null,
        stock: 1
      });

      this.ventaForm.controls['observaciones'].setValue(descripcion);

      this.ventaForm.controls['tipo_pago'].setValue('CREDITO');

    }
    if (this.cuenta_id) {
      this.ventaForm.controls['cuenta_id'].setValue(this.cuenta_id);
    }

    let tipo_stock = await this.variables_service.getVariables({
      slug: 'stock'
    });
    this.tipo_stock = tipo_stock.data[0].valor;

    this.ngxService.stop();
  }

  async getDocumento() {
    let documento = await this.documentos_service.getDocumento(this.documento_id);
    if (documento.code) {
      this.documento = documento.data;
      this.ventaForm.controls['documento_id'].setValue(this.documento_id);
      this.ventaForm.controls['documento'].setValue(this.documento);
      if (this.documento.cambiaria) {
        this.ventaForm.controls['cambiaria'].setValue(true);
      }
      if (this.documento.sucursal_id) {
        await this.setDocumento();
      } else {
        await this.getSucursales();
      }

      let d: any = localStorage.getItem(`carrito${this.documento_id}`);
      this.ventas_detalles = JSON.parse(d) || [];
    }
  }

  async getSucursales() {
    let sucursales = await this.sucursales_service.getSucursales();
    if (sucursales.code) {
      this.sucursales = sucursales.data;
    }
  }

  async getMonedas() {
    let monedas = await this.monedas_service.getMonedas();
    if (monedas.code) {
      this.monedas = monedas.data;
      this.ventaForm.controls['moneda_id'].setValue([this.monedas[0]])
      this.setCambio(this.monedas[0]);
    }
  }

  async getCotizaciones() {
    let cotizaciones = await this.cotizaciones_service.getCotizaciones(null, null, {
      estado: 'PENDIENTE'
    });
    if (cotizaciones.code) {
      this.cotizaciones = cotizaciones.data;
    }
  }

  async getPedidos() {
    let pedidos = await this.pedidos_service.getPedidos(null, null, {
      estado: 'PENDIENTE'
    });
    if (pedidos.code) {
      this.pedidos = pedidos.data;
    }
  }

  async getEmpleados() {
    let empleados = await this.empleados_service.getEmpleados({
      vendedor: true
    });
    if (empleados.code) {
      this.empleados = empleados.data;
    }
  }

  async getEtiquetas() {
    let etiquetas = await this.etiquetas_service.getEtiquetas({
      estado: true
    });
    this.etiquetas = etiquetas.data;
  }

  async getBodegasBySucursal(id: any) {
    this.ventaForm.controls['bodega_id'].setValue(null);

    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }

  }

  async setDocumento() {
    this.ventaForm.controls['sucursal_id'].setValue([this.documento.sucursal]);
    this.pagoForm.controls['metodo'].setValue(['Efectivo']);
    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.ventaForm.controls['bodega_id'].setValue([this.documento.bodega]);
    } else {
      this.ventaForm.controls['bodega_id'].setValue(null);
    }

  }

  async setCotizacion(c: any) {
    this.view_carrito = false;
    this.ngxService.start();

    let cotizacion = await this.cotizaciones_service.getCotizacion(c.id);
    if (cotizacion.code) {
      delete cotizacion.data.fecha;
      this.ventaForm.patchValue(cotizacion.data);
      this.ventaForm.controls['cotizacion'].setValue(c.serie + '-' + c.correlativo);
      this.ventaForm.controls['cotizacion_id'].setValue(c.id);
      this.ventaForm.controls['pedido'].setValue(null);
      this.ventaForm.controls['pedido_id'].setValue(null);
      this.ventaForm.controls['sucursal_id'].setValue([cotizacion.data.sucursal]);
      this.ventaForm.controls['bodega_id'].setValue([cotizacion.data.bodega]);
      this.ventaForm.controls['moneda_id'].setValue([cotizacion.data.moneda]);
      this.ventaForm.controls['empleado_id'].setValue([cotizacion.data.empleado]);
      this.ventaForm.controls['usuario_id'].setValue(localStorage.getItem('usuario_id'));
      this.clienteForm.patchValue(cotizacion.data.cliente);
      this.ventas_detalles = cotizacion.data.cotizaciones_detalles;
      for (let vd = 0; vd < this.ventas_detalles.length; vd++) {
        delete this.ventas_detalles[vd].id;
        this.ventas_detalles[vd].logo = this.ventas_detalles[vd].producto.logo
        this.ventas_detalles[vd].tipo = this.ventas_detalles[vd].producto.tipo_producto.nombre
        this.ventas_detalles[vd].equivalencias = this.ventas_detalles[vd].producto.equivalencias.filter((e: any) => e.tipo === 'entrada');
        this.ventas_detalles[vd].medida = this.ventas_detalles[vd].medida;

        let sucursal_id = this.ventaForm.value.sucursal_id ? this.ventaForm.value.sucursal_id.map((s: any) => s.id) : null;
        let bodega_id = this.ventaForm.value.bodega_id ? this.ventaForm.value.bodega_id.map((b: any) => b.id) : null;

        let existencias = await this.existencias_service.getAllExistenciaStock({
          mes: moment().format('YYYY-MM'),
          producto_id: this.ventas_detalles[vd].producto_id,
          variacion_id: this.ventas_detalles[vd].variacion_id,
          lote_id: this.ventas_detalles[vd].lote_id,
          sucursal_id: sucursal_id,
          bodega_id: bodega_id
        });
        if (existencias.code && existencias.data) {
          this.ventas_detalles[vd].stock = existencias.data.stock_final;
        } else {
          this.ventas_detalles[vd].stock = 0;
        }
      }
      await this.getInfoNit();
      $('#cotizaciones').offcanvas('hide');
    }
    this.ngxService.stop();
    this.view_carrito = true;
  }

  async setPedido(p: any) {
    this.view_carrito = false;
    this.ngxService.start();
    let pedido = await this.pedidos_service.getPedido(p.id);
    if (pedido.code) {
      delete pedido.data.fecha;
      this.ventaForm.patchValue(pedido.data);
      this.ventaForm.controls['sucursal_id'].setValue([pedido.data.sucursal]);
      this.ventaForm.controls['bodega_id'].setValue([pedido.data.bodega]);
      this.ventaForm.controls['moneda_id'].setValue([pedido.data.moneda]);
      this.ventaForm.controls['empleado_id'].setValue([pedido.data.empleado]);
      this.ventaForm.controls['usuario_id'].setValue(localStorage.getItem('usuario_id'));
      this.ventaForm.controls['pedido'].setValue(p.serie + '-' + p.correlativo);
      this.ventaForm.controls['pedido_id'].setValue(p.id);
      this.ventaForm.controls['cotizacion'].setValue(null);
      this.ventaForm.controls['cotizacion_id'].setValue(null);
      this.clienteForm.patchValue(pedido.data.cliente);
      this.ventas_detalles = pedido.data.pedidos_detalles;
      for (let vd = 0; vd < this.ventas_detalles.length; vd++) {
        delete this.ventas_detalles[vd].id;
        this.ventas_detalles[vd].logo = this.ventas_detalles[vd].producto.logo
        this.ventas_detalles[vd].tipo = this.ventas_detalles[vd].producto.tipo_producto.nombre
        this.ventas_detalles[vd].equivalencias = this.ventas_detalles[vd].producto.equivalencias.filter((e: any) => e.tipo === 'entrada');
        this.ventas_detalles[vd].medida = this.ventas_detalles[vd].medida;

        let sucursal_id = this.ventaForm.value.sucursal_id ? this.ventaForm.value.sucursal_id.map((s: any) => s.id) : null;
        let bodega_id = this.ventaForm.value.bodega_id ? this.ventaForm.value.bodega_id.map((b: any) => b.id) : null;

        let existencias = await this.existencias_service.getAllExistenciaStock({
          mes: moment().format('YYYY-MM'),
          producto_id: this.ventas_detalles[vd].producto_id,
          variacion_id: this.ventas_detalles[vd].variacion_id,
          lote_id: this.ventas_detalles[vd].lote_id,
          sucursal_id: sucursal_id,
          bodega_id: bodega_id
        });
        if (existencias.code && existencias.data) {
          this.ventas_detalles[vd].stock = existencias.data.stock_final;
        } else {
          this.ventas_detalles[vd].stock = 0;
        }
      }
      await this.getInfoNit();
      $('#pedidos').offcanvas('hide');
    }
    this.ngxService.stop();
    this.view_carrito = true;
  }

  addCliente(i: any) {
    this.ventaForm.controls['dias_credito'].setValue(i.dias_credito);
    this.ventaForm.controls['cliente_id'].setValue(i.id);
    this.clienteForm.patchValue(i);
  }

  addPago() {
    if (this.pagoForm.valid) {
      this.pagoForm.controls['metodo'].setValue(this.pagoForm.controls['metodo'].value[0]);
      this.pagos.push(this.pagoForm.value);

      if (this.pagoForm.controls['metodo'].value == 'Efectivo') {
        this.pagoForm.controls['cambio'].setValue(this.getCambio());
        this.pagos[this.pagos.length - 1].cambio = this.getCambio();
      } else {
        this.pagoForm.controls['cambio'].setValue(null);
      }

      this.pagoForm.reset();
      this.pagoForm.controls['fecha'].setValue(moment().format('YYYY-MM-DD'));
    }
  }

  deletePago(p: any) {
    let index = this.pagos.indexOf(p);
    if (index !== -1) {
      this.pagos.splice(index, 1);
    }
  }

  addAbono() {
    if (this.abonoForm.valid) {
      this.abonos.push(this.abonoForm.value);
      this.abonoForm.reset();
      this.abonoForm.controls['fecha'].setValue(moment().format('YYYY-MM-DD'));
    }
  }

  deleteAbono(a: any) {
    let index = this.abonos.indexOf(a);
    if (index !== -1) {
      this.abonos.splice(index, 1);
    }
  }

  async getInfoNit() {
    let nit = this.clienteForm.controls['nit'].value.replace(/-/g, '').trim().toUpperCase();
    this.clienteForm.controls['nit'].setValue(nit);

    this.ngxService.start();
    let cliente = await this.clientes_service.getClientes({
      nit: nit
    });
    if (cliente.data.length > 0) {
      this.clienteForm.patchValue(cliente.data[0]);
      this.ventaForm.controls['cliente_id'].setValue(cliente.data[0].id);
    } else {
      let info = await this.digifact_service.getInfoNit(nit);
      if (info.code && info.data.RESPONSE[0].NOMBRE) {

        cliente = await this.clientes_service.postCliente({
          nit: nit,
          nombre: info.data.RESPONSE[0].NOMBRE
        });
        if (cliente) {
          this.clienteForm.patchValue(cliente.data);
          this.ventaForm.controls['cliente_id'].setValue(cliente.data.id);
        }

      } else {
        this.alertas_service.error('No se encontro nit');
      }
    }
    this.ngxService.stop();
  }

  getDescuento(ext: any = null) {
    let total = 0;
    this.ventas_detalles.forEach((d: any) => {
      total += parseFloat(ext ? d.descuento_ext : d.descuento);
    });
    return total;
  }

  getTotal(ext: any = null) {
    let total = 0;
    this.ventas_detalles.forEach((d: any) => {
      total += parseFloat(ext ? d.total_ext : d.total);
    });
    return total;
  }

  getSubtotal(ext: any = null) {
    let subtotal = 0;
    this.ventas_detalles.forEach((d: any) => {
      subtotal += parseFloat(ext ? d.subtotal_ext : d.subtotal);
    });
    return subtotal;
  }

  getImpuesto(ext: any = null) {
    let impuesto = 0;
    this.ventas_detalles.forEach((d: any) => {
      // d.impuesto = Math.round((parseFloat(d.impuesto) + Number.EPSILON) * 100) / 100;
      impuesto += parseFloat(ext ? d.impuesto_ext : d.impuesto);
    });
    return impuesto;
  }

  getPagado() {
    let pagado = 0;
    this.pagos.forEach((p: any) => {
      pagado += parseFloat(p.monto);
    });
    return pagado;
  }

  getCambio() {
    let cambio = this.getPagado() - this.getTotal();
    return cambio;
  }

  async postVenta() {

    $('#btn_guardar').prop('disabled', true);
    this.ngxService.start();

    // Validar Fecha
    if (!this.fechaMax()) {
      return;
    }

    // Validar carrito
    let insuficiente = '';
    for (let v = 0; v < this.ventas_detalles.length; v++) {
      if (this.ventas_detalles[v].cantidad <= 0) {
        return this.alertas_service.error(`Cantidad de producto ${this.ventas_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.ventaForm.value.moneda_id[0].id == 1) {
        if (this.ventas_detalles[v].precio_unitario < parseFloat(this.ventas_detalles[v].producto.precio)) {
          return this.alertas_service.error(`Precio de producto ${this.ventas_detalles[v].descripcion} debe ser mayor a ${this.ventas_detalles[v].producto.precio}`, true);
        } 
      } else {
        if (this.ventas_detalles[v].precio_unitario_ext < (parseFloat(this.ventas_detalles[v].producto.precio) / parseFloat(this.ventaForm.value.tipo_cambio))) {
          return this.alertas_service.error(`Precio de producto ${this.ventas_detalles[v].descripcion} debe ser mayor a ${parseFloat(this.ventas_detalles[v].producto.precio) / parseFloat(this.ventaForm.value.tipo_cambio)}`, true);
        }
      }
      if (this.ventas_detalles[v].precio <= 0) {
        return this.alertas_service.error(`Precio de producto ${this.ventas_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.ventas_detalles[v].descripcion == '') {
        return this.alertas_service.error(`Descripción de producto es un campo obligatorio`, true);
      }
      if (this.tipo_stock == 'Estricto' && this.documento.inventario) {
        if (!this.ventas_detalles[v].producto.combo) {
          if (parseFloat(this.ventas_detalles[v].stock) < parseFloat(this.ventas_detalles[v].cantidad)) {
            insuficiente += `\n -${this.ventas_detalles[v].descripcion}`;
          }
        }
        if (this.ventas_detalles[v].producto.combo) {
          let recetas = await this.recetas_service.getRecetas({
            producto_id: this.ventas_detalles[v].producto_id
          });
          if (recetas.code && recetas.data) {
            for (let r = 0; r < recetas.data.length; r++) {
              let existencias = await this.existencias_service.getAllExistenciaStock({
                mes: moment().format('YYYY-MM'),
                producto_id: recetas.data[r].producto_receta_id,
                variacion_id: recetas.data[r].variacion_receta_id,
                lote_id: recetas.data[r].lote_receta_id,
                sucursal_id: this.ventaForm.value.sucursal_id.map((s: any) => s.id),
                bodega_id: this.ventaForm.value.bodega_id.map((b: any) => b.id)
              });
              if (existencias.code && existencias.data) {
                if (parseFloat(existencias.data.stock_final) < (parseFloat(this.ventas_detalles[v].cantidad) * parseFloat(recetas.data[r].cantidad))) {
                  insuficiente += `\n -${recetas.data[r].producto_receta.nombre} (${this.ventas_detalles[v].producto.nombre})`;
                }
              } else {
                insuficiente += `\n -${recetas.data[r].producto.nombre} (${this.ventas_detalles[v].producto.nombre})`;
              }
            }
          } else {
            insuficiente += `Producto ${this.ventas_detalles[v].descripcion} no tiene recetas\n\n`;
          }
        }
      }
    }

    if (insuficiente) {
      return this.alertas_service.error(`STOCK INSUFICIENTE \n ${insuficiente}`);
    }

    // Validar Pago
    if (this.ventaForm.value.tipo_pago == 'CONTADO' && this.getPagado() < parseFloat(this.getTotal().toFixed(2))) {
      return this.alertas_service.error(`${this.getCambio()} de monto pendiente`, true);
    }

    if (!this.ventaForm.value.bodega_id || this.ventaForm.value.bodega_id.length == 0) {
      return this.alertas_service.error(`Bodega es un campo obligatorio`, true);
    }
    if (!this.ventaForm.value.sucursal_id || this.ventaForm.value.sucursal_id.length == 0) {
      return this.alertas_service.error(`Sucursal es un campo obligatorio`, true);
    }
    if (!this.ventaForm.value.moneda_id || this.ventaForm.value.moneda_id.length == 0) {
      return this.alertas_service.error(`Moneda es un campo obligatorio`, true);
    }
    if (!this.ventaForm.value.empleado_id || this.ventaForm.value.empleado_id.length == 0) {
      return this.alertas_service.error(`Vendedor es un campo obligatorio`, true);
    }
    if (!this.ventaForm.value.cliente_id || this.ventaForm.value.cliente_id.length == 0) {
      return this.alertas_service.error(`Cliente es un campo obligatorio`, true);
    }
    if (!this.ventaForm.value.documento_id || this.ventaForm.value.documento_id.length == 0) {
      return this.alertas_service.error(`Documento es un campo obligatorio`, true);
    }

    if (this.ventaForm.controls['gravable'].value && this.ventaForm.controls['gravable'].value.length > 0) {
      this.ventaForm.controls['gravable'].setValue(this.ventaForm.value.gravable[0].id);
    } else {
      this.ventaForm.controls['gravable'].setValue(0);
    }
    if (this.ventaForm.controls['libro'].value && this.ventaForm.controls['libro'].value.length > 0) {
      this.ventaForm.controls['libro'].setValue(this.ventaForm.value.libro[0].id);
    } else {
      this.ventaForm.controls['libro'].setValue(0);
    }
    this.ventaForm.controls['documento_id'].setValue(this.documento.id);
    this.ventaForm.controls['ventas_detalles'].setValue(this.ventas_detalles);
    this.ventaForm.controls['pagos'].setValue(this.pagos);
    this.ventaForm.controls['abonos'].setValue(this.abonos);

    this.ventaForm.controls['descuento'].setValue(this.getDescuento());
    this.ventaForm.controls['total'].setValue(this.getTotal());
    this.ventaForm.controls['subtotal'].setValue(this.getSubtotal());
    this.ventaForm.controls['impuesto'].setValue(this.getImpuesto());

    // Conversion a moneda extranjera
    this.ventaForm.controls['descuento_ext'].setValue(this.getDescuento(true));
    this.ventaForm.controls['total_ext'].setValue(this.getTotal(true));
    this.ventaForm.controls['subtotal_ext'].setValue(this.getSubtotal(true));
    this.ventaForm.controls['impuesto_ext'].setValue(this.getImpuesto(true));


    this.ventaForm.controls['cliente'].setValue(this.clienteForm.value);

    if (this.documento.certificacion) {
      let certificacion = await this.digifact_service.certificacionFel(this.ventaForm.value);
      if (certificacion.data.Codigo == 1) {
        this.ventaForm.controls['fel_numero'].setValue(certificacion.data.NUMERO);
        this.ventaForm.controls['fel_serie'].setValue(certificacion.data.Serie);
        this.ventaForm.controls['fel_autorizacion'].setValue(certificacion.data.Autorizacion);
      } else {
        this.alertas_service.error(certificacion.data.ResponseDATA1 || certificacion.data.Mensaje);
        this.ngxService.stop();
        return;
      }
    }

    this.ventaForm.controls['bodega_id'].setValue(this.ventaForm.controls['bodega_id'].value[0].id);
    this.ventaForm.controls['sucursal_id'].setValue(this.ventaForm.controls['sucursal_id'].value[0].id);
    this.ventaForm.controls['moneda_id'].setValue(this.ventaForm.controls['moneda_id'].value[0].id);
    this.ventaForm.controls['empleado_id'].setValue(this.ventaForm.controls['empleado_id'].value[0].id);

    let venta = await this.ventas_service.postVenta(this.ventaForm.value);
    if (venta.code) {
      if (this.credito_id) {
        this.creditos_service.putCredito(this.credito_id, {
          estado: 'VIGENTE',
          venta_id: venta.data.id
        });
      }

      await this.clientes_service.putCliente(this.ventaForm.value.cliente_id, {
        direccion: this.clienteForm.controls['direccion'].value
      });

      localStorage.removeItem(`carrito${this.documento_id}`);
      this.alertas_service.success(venta.mensaje);
      this.ngxService.stop();
      this.router.navigate(['/admin/facturacion/ventas']);
    }

    $('#btn_guardar').prop('disabled', false);
    this.ngxService.stop();
  }

  fechaMax() {
    if (this.ventaForm.value.fecha > this.fecha_max) {
      this.alertas_service.error('Fecha mayor al mes actual', true);
      return false;
    }
    if (this.ventaForm.value.fecha < this.fecha_min) {
      this.alertas_service.error('Fecha menor al mes actual', true);
      return false;
    }
    return true;
  }

  updateCarrito() {
    this.ventas_detalles = JSON.parse(localStorage.getItem(`carrito${this.documento_id}`) || '[]');
  }

  setCambio(e: any) {
    let moneda = this.monedas.find((m: any) => m.id == e.id);
    this.ventaForm.controls['tipo_cambio'].setValue(moneda.tipo_cambio);
    this.moneda_simbolo = moneda.simbolo;
  }

}

