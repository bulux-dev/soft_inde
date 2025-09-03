import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { CotizacionesService } from '../../../../services/cotizaciones.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { DigifactService } from '../../../../services/digifact.service';
import { DocumentosService } from '../../../../services/documentos.service';
import { BodegasService } from '../../../../services/bodegas.service';
import { ClientesService } from '../../../../services/clientes.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from '../../../../app.component';
import { SucursalesService } from '../../../../services/sucursales.service';
import { MonedasService } from '../../../../services/monedas.service';
import { EmpleadosService } from '../../../../services/empleados.service';
import { VariablesService } from '../../../../services/variables.service';

declare var $: any

@Component({
  selector: 'app-agregar-cotizacion',
  standalone: false,
  templateUrl: './agregar-cotizacion.component.html',
  styleUrl: './agregar-cotizacion.component.css'
})
export class AgregarCotizacionComponent {

  @Input() documento_id: any;
  @Input() credito_id: any;

  get selectS() {
    return AppComponent.selectS;
  }

  get selectM() {
    return AppComponent.selectM;
  }

  cotizaciones_detalles: any = [];
  bodegas: any = [];
  monedas: any = [];
  sucursales: any = [];
  empleados: any = [];
  metodos: any = ['Efectivo', 'Tarjeta', 'Transferencia', 'Deposito', 'Cheque', 'Vale'];

  documento: any;
  credito: any;
  moneda_simbolo: any;
  tipo_stock: any;

  cotizacionForm: FormGroup = new FormGroup({
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
    tipo_pago: new FormControl('CONTADO'),
    tipo_cambio: new FormControl(null),
    dias_credito: new FormControl(null),
    entrega: new FormControl(null),
    direccion: new FormControl(null),
    forma_pago: new FormControl(null),
    documento_id: new FormControl(null),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null),
    cliente_id: new FormControl(1),
    moneda_id: new FormControl(null),
    empleado_id: new FormControl(null),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    cotizaciones_detalles: new FormControl([]),
    cuotas: new FormControl([]),
    credito: new FormControl(false),
    cliente: new FormControl({}),
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
    metodo: new FormControl(null, [Validators.required]),
    autorizacion: new FormControl(null),
  });

  constructor(
    private ngxService: NgxUiLoaderService,
    private location: Location,
    private alertas_service: AlertasService,
    private cotizaciones_service: CotizacionesService,
    private digifact_service: DigifactService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private clientes_service: ClientesService,
    private monedas_service: MonedasService,
    private empleados_service: EmpleadosService,
    private variables_service: VariablesService,
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDocumento();
    await this.getMonedas();
    await this.getEmpleados();
    let tipo_stock = await this.variables_service.getVariables({
      slug: 'stock'
    });
    this.tipo_stock = tipo_stock.data[0].valor;
    this.ngxService.stop();
  }


  async getDocumento() {
    this.cotizacionForm.controls['documento_id'].setValue(this.documento_id);
    let documento = await this.documentos_service.getDocumento(this.documento_id);
    if (documento.code) {
      this.documento = documento.data;
      if (this.documento.sucursal_id) {
        await this.setDocumento();
      } else {
        await this.getSucursales();
      }

      let d: any = localStorage.getItem(`carrito${this.documento_id}`);
      this.cotizaciones_detalles = JSON.parse(d) || [];
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
      this.cotizacionForm.controls['moneda_id'].setValue([this.monedas[0]])
      this.setCambio(this.monedas[0]);
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

  async getBodegasBySucursal(id: any) {
    this.cotizacionForm.controls['bodega_id'].setValue(null);

    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }
  }

  async setDocumento() {
    this.cotizacionForm.controls['sucursal_id'].setValue([this.documento.sucursal]);

    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.cotizacionForm.controls['bodega_id'].setValue([this.documento.bodega]);
    } else {
      this.cotizacionForm.controls['bodega_id'].setValue(null);
    }
  }

  addCliente(i: any) {
    this.cotizacionForm.controls['dias_credito'].setValue(i.dias_credito);
    this.cotizacionForm.controls['direccion'].setValue(i.direccion);
    this.cotizacionForm.controls['cliente_id'].setValue(i.id);
    this.clienteForm.patchValue(i);
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
      this.cotizacionForm.controls['cliente_id'].setValue(cliente.data[0].id);
    } else {
      let info = await this.digifact_service.getInfoNit(nit);
      if (info.code && info.data.RESPONSE[0].NOMBRE) {

        cliente = await this.clientes_service.postCliente({
          nit: nit,
          nombre: info.data.RESPONSE[0].NOMBRE
        });
        if (cliente) {
          this.clienteForm.patchValue(cliente.data);
          this.cotizacionForm.controls['cliente_id'].setValue(cliente.data.id);
          this.cotizacionForm.controls['dias_credito'].setValue(0);
        }

      } else {
        this.alertas_service.error('No se encontro nit');
      }
    }
    this.ngxService.stop();
  }

  getDescuento(ext: any = false) {
    let descuento = 0;
    this.cotizaciones_detalles.forEach((d: any) => {
      descuento += parseFloat(ext ? d.descuento_ext : d.descuento);
    });
    return descuento;
  }

  getTotal(ext: any = null) {
    let total = 0;
    this.cotizaciones_detalles.forEach((d: any) => {
      total += parseFloat(ext ? d.total_ext : d.total);
    });
    return total;
  }

  getSubtotal(ext: any = null) {
    let subtotal = 0;
    this.cotizaciones_detalles.forEach((d: any) => {
      subtotal += parseFloat(ext ? d.subtotal_ext : d.subtotal);
    });
    return subtotal;
  }

  getImpuesto(ext: any = null) {
    let impuesto = 0;
    this.cotizaciones_detalles.forEach((d: any) => {
      impuesto += parseFloat(ext ? d.impuesto_ext : d.impuesto);
    });
    return impuesto;
  }

  async postCotizacion() {

    $('#btn_guardar').prop('disabled', true);
    this.ngxService.start();

    for (let v = 0; v < this.cotizaciones_detalles.length; v++) {
      if (this.cotizaciones_detalles[v].cantidad <= 0) {
        return this.alertas_service.error(`Cantidad de producto ${this.cotizaciones_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.cotizacionForm.value.moneda_id[0].id == 1) {
        let precio = parseFloat(this.cotizaciones_detalles[v].producto.precio).toFixed(2);
        if (this.cotizaciones_detalles[v].precio_unitario < parseFloat(this.cotizaciones_detalles[v].producto.precio)) {
          return this.alertas_service.error(`Precio de producto ${this.cotizaciones_detalles[v].descripcion} debe ser mayor a ${precio}`, true);
        }
      } else {
        let precio = (parseFloat(this.cotizaciones_detalles[v].producto.precio) / parseFloat(this.cotizacionForm.value.tipo_cambio)).toFixed(2);
        if (this.cotizaciones_detalles[v].precio_unitario_ext < parseFloat(precio)) {
          return this.alertas_service.error(`Precio de producto ${this.cotizaciones_detalles[v].descripcion} debe ser mayor a ${precio}`, true);
        }
      }
      if (this.cotizaciones_detalles[v].precio <= 0) {
        return this.alertas_service.error(`Precio de producto ${this.cotizaciones_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.cotizaciones_detalles[v].descripcion == '') {
        return this.alertas_service.error(`Descripción de producto es un campo obligatorio`, true);
      }
    }

    if (!this.cotizacionForm.value.bodega_id || this.cotizacionForm.value.bodega_id.length == 0) {
      return this.alertas_service.error(`Bodega es un campo obligatorio`, true);
    }
    if (!this.cotizacionForm.value.sucursal_id || this.cotizacionForm.value.sucursal_id.length == 0) {
      return this.alertas_service.error(`Sucursal es un campo obligatorio`, true);
    }
    if (!this.cotizacionForm.value.moneda_id || this.cotizacionForm.value.moneda_id.length == 0) {
      return this.alertas_service.error(`Moneda es un campo obligatorio`, true);
    }
    if (!this.cotizacionForm.value.empleado_id || this.cotizacionForm.value.empleado_id.length == 0) {
      return this.alertas_service.error(`Vendedor es un campo obligatorio`, true);
    }
    if (!this.cotizacionForm.value.cliente_id || this.cotizacionForm.value.cliente_id.length == 0) {
      return this.alertas_service.error(`Cliente es un campo obligatorio`, true);
    }
    if (!this.cotizacionForm.value.documento_id || this.cotizacionForm.value.documento_id.length == 0) {
      return this.alertas_service.error(`Documento es un campo obligatorio`, true);
    }

    this.cotizacionForm.controls['documento_id'].setValue(this.documento.id);
    this.cotizacionForm.controls['cotizaciones_detalles'].setValue(this.cotizaciones_detalles);

    this.cotizacionForm.controls['descuento'].setValue(this.getDescuento());
    this.cotizacionForm.controls['total'].setValue(this.getTotal());
    this.cotizacionForm.controls['subtotal'].setValue(this.getSubtotal());
    this.cotizacionForm.controls['impuesto'].setValue(this.getImpuesto());

    // Conversion a moneda extranjera
    this.cotizacionForm.controls['descuento_ext'].setValue(this.getDescuento(true));
    this.cotizacionForm.controls['total_ext'].setValue(this.getTotal(true));
    this.cotizacionForm.controls['subtotal_ext'].setValue(this.getSubtotal(true));
    this.cotizacionForm.controls['impuesto_ext'].setValue(this.getImpuesto(true));

    this.cotizacionForm.controls['cliente'].setValue(this.clienteForm.value);

    if (this.cotizacionForm.controls['bodega_id'].value && this.cotizacionForm.controls['bodega_id'].value.length > 0) {
      this.cotizacionForm.controls['bodega_id'].setValue(this.cotizacionForm.controls['bodega_id'].value[0].id);
    }
    if (this.cotizacionForm.controls['sucursal_id'].value && this.cotizacionForm.controls['sucursal_id'].value.length > 0) {
      this.cotizacionForm.controls['sucursal_id'].setValue(this.cotizacionForm.controls['sucursal_id'].value[0].id);
    }
    if (this.cotizacionForm.controls['moneda_id'].value && this.cotizacionForm.controls['moneda_id'].value.length > 0) {
      this.cotizacionForm.controls['moneda_id'].setValue(this.cotizacionForm.controls['moneda_id'].value[0].id);
    }
    if (this.cotizacionForm.controls['empleado_id'].value && this.cotizacionForm.controls['empleado_id'].value.length > 0) {
      this.cotizacionForm.controls['empleado_id'].setValue(this.cotizacionForm.controls['empleado_id'].value[0].id);
    }


    let cotizacion = await this.cotizaciones_service.postCotizacion(this.cotizacionForm.value);
    if (cotizacion.code) {

      await this.clientes_service.putCliente(this.cotizacionForm.value.cliente_id, {
        direccion: this.clienteForm.controls['direccion'].value
      });

      localStorage.removeItem(`carrito${this.documento_id}`);
      this.alertas_service.success(cotizacion.mensaje);
      this.ngxService.stop();
      this.location.back();
    }

    $('#btn_guardar').prop('disabled', false);
    this.ngxService.stop();
  }

  get data_view() {
    let view = localStorage.getItem('data_view');
    return view ? view : 'grid'
  }

  setDataView(tipo: string) {
    localStorage.setItem('data_view', tipo);
  }

  detalleLocal() {
    localStorage.setItem(`save_cotizaciones_${this.documento_id}`, JSON.stringify(this.cotizaciones_detalles));
  }

  updateCarrito() {
    this.cotizaciones_detalles = JSON.parse(localStorage.getItem(`carrito${this.documento_id}`) || '[]');
  }

  setCambio(e: any) {
    let moneda = this.monedas.find((m: any) => m.id == e.id);
    this.cotizacionForm.controls['tipo_cambio'].setValue(moneda.tipo_cambio);
    this.moneda_simbolo = moneda.simbolo;
  }

}

