import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { EnviosService } from '../../../../services/envios.service';
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
import { ExistenciasService } from '../../../../services/existencias.service';
import { EmpleadosService } from '../../../../services/empleados.service';

declare var $: any

@Component({
  selector: 'app-editar-envio',
  standalone: false,
  templateUrl: './editar-envio.component.html',
  styleUrl: './editar-envio.component.css'
})
export class EditarEnvioComponent {

  @Input() envio_id: any;

  get selectS() {
    return AppComponent.selectS;
  }

  envios_detalles: any = [];
  bodegas: any = [];
  sucursales: any = [];
  monedas: any = [];
  empleados: any = [];
  metodos: any = ['Efectivo', 'Tarjeta', 'Transferencia', 'Deposito', 'Cheque', 'Vale'];

  documento: any;
  credito: any;

  envioForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [Validators.required]),
    observaciones: new FormControl(null),
    descuento: new FormControl(null),
    total: new FormControl(null),
    subtotal: new FormControl(null),
    impuesto: new FormControl(null),
    tipo_pago: new FormControl('CONTADO'),
    dias_credito: new FormControl(null),
    documento_id: new FormControl(null),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null),
    cliente_id: new FormControl(1),
    moneda_id: new FormControl(null),
    empleado_id: new FormControl(null),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    envios_detalles: new FormControl([]),
    lote: new FormControl(null),
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

  constructor(
    private ngxService: NgxUiLoaderService,
    private location: Location,
    private alertas_service: AlertasService,
    private envios_service: EnviosService,
    private digifact_service: DigifactService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private clientes_service: ClientesService,
    private monedas_service: MonedasService,
    private existencias_service: ExistenciasService,
    private empleados_service: EmpleadosService,
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();

    let envio = await this.envios_service.getEnvio(this.envio_id);
    let documento = await this.documentos_service.getDocumento(envio.data.documento_id);
    this.documento = documento.data;

    this.envioForm.patchValue(envio.data);
    this.envioForm.controls['cliente_id'].setValue([envio.data.cliente]);
    this.envioForm.controls['moneda_id'].setValue([envio.data.moneda]);
    this.envioForm.controls['empleado_id'].setValue([envio.data.empleado]);
    this.envioForm.controls['sucursal_id'].setValue([envio.data.sucursal]);
    this.envioForm.controls['bodega_id'].setValue([envio.data.bodega]);

    this.clienteForm.patchValue(envio.data.cliente);
    this.envios_detalles = [];

    for (let d = 0; d < envio.data.envios_detalles.length; d++) {
      let element = envio.data.envios_detalles[d];

      element.logo = element.producto.logo;

      let existencias = await this.existencias_service.getExistenciaStock({
        producto_id: element.producto_id,
        mes: moment().format('YYYY-MM')
      });
      if (existencias.data) {
        element.stock = existencias.data.stock_final
      }
      this.envios_detalles.push(element);

    }

    await this.getMonedas();
    await this.getEmpleados();

    this.ngxService.stop();
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
      this.envioForm.controls['moneda_id'].setValue([this.monedas[0]])
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
    this.envioForm.controls['bodega_id'].setValue(null);

    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }
  }

  async setDocumento() {
    this.envioForm.controls['sucursal_id'].setValue([this.documento.sucursal]);

    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.envioForm.controls['bodega_id'].setValue([this.documento.bodega]);
    } else {
      this.envioForm.controls['bodega_id'].setValue(null);
    }
  }

  addCliente(i: any) {
    this.envioForm.controls['dias_credito'].setValue(i.dias_credito);
    this.envioForm.controls['cliente_id'].setValue(i.id);
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
      this.envioForm.controls['cliente_id'].setValue(cliente.data[0].id);
    } else {
      let info = await this.digifact_service.getInfoNit(nit);
      if (info.code && info.data.RESPONSE[0].NOMBRE) {

        cliente = await this.clientes_service.postCliente({
          nit: nit,
          nombre: info.data.RESPONSE[0].NOMBRE
        });
        if (cliente) {
          this.clienteForm.patchValue(cliente.data);
          this.envioForm.controls['cliente_id'].setValue(cliente.data.id);
          this.envioForm.controls['dias_credito'].setValue(0);
        }

      } else {
        this.alertas_service.error('No se encontro nit');
      }
    }
    this.ngxService.stop();
  }

  getTotal() {
    let total = 0;
    this.envios_detalles.forEach((d: any) => {
      total += parseFloat(d.total);
    });
    return total;
  }

  getSubtotal() {
    let subtotal = 0;
    this.envios_detalles.forEach((d: any) => {
      subtotal += parseFloat(d.subtotal);
    });
    return subtotal;
  }

  getImpuesto() {
    let impuesto = 0;
    this.envios_detalles.forEach((d: any) => {
      impuesto += parseFloat(d.impuesto);
    });
    return impuesto;
  }

  async putEnvio() {

    for (let v = 0; v < this.envios_detalles.length; v++) {
      if (this.envios_detalles[v].cantidad <= 0) {
        return this.alertas_service.error(`Cantidad de producto ${this.envios_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.envios_detalles[v].precio <= 0) {
        return this.alertas_service.error(`Precio de producto ${this.envios_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.envios_detalles[v].descripcion == '') {
        return this.alertas_service.error(`Descripción de producto es un campo obligatorio`, true);
      }
    }

    if (!this.envioForm.value.bodega_id || this.envioForm.value.bodega_id.length == 0) {
      return this.alertas_service.error(`Bodega es un campo obligatorio`, true);
    }
    if (!this.envioForm.value.sucursal_id || this.envioForm.value.sucursal_id.length == 0) {
      return this.alertas_service.error(`Sucursal es un campo obligatorio`, true);
    }
    if (!this.envioForm.value.moneda_id || this.envioForm.value.moneda_id.length == 0) {
      return this.alertas_service.error(`Moneda es un campo obligatorio`, true);
    }
    if (!this.envioForm.value.empleado_id || this.envioForm.value.empleado_id.length == 0) {
      return this.alertas_service.error(`Vendedor es un campo obligatorio`, true);
    }
    if (!this.envioForm.value.cliente_id || this.envioForm.value.cliente_id.length == 0) {
      return this.alertas_service.error(`Cliente es un campo obligatorio`, true);
    }
    // if (!this.envioForm.value.documento_id || this.envioForm.value.documento_id.length == 0) {
    //   return this.alertas_service.error(`Documento es un campo obligatorio`, true);
    // }

    // this.envioForm.controls['documento_id'].setValue(this.documento.id);
    this.envioForm.controls['envios_detalles'].setValue(this.envios_detalles);

    this.envioForm.controls['total'].setValue(this.getTotal());
    this.envioForm.controls['subtotal'].setValue(this.getSubtotal());
    this.envioForm.controls['impuesto'].setValue(this.getImpuesto());
    this.envioForm.controls['cliente'].setValue(this.clienteForm.value);

    this.ngxService.start();

    if (this.envioForm.controls['bodega_id'].value && this.envioForm.controls['bodega_id'].value.length > 0) {
      this.envioForm.controls['bodega_id'].setValue(this.envioForm.controls['bodega_id'].value[0].id);
    }
    if (this.envioForm.controls['sucursal_id'].value && this.envioForm.controls['sucursal_id'].value.length > 0) {
      this.envioForm.controls['sucursal_id'].setValue(this.envioForm.controls['sucursal_id'].value[0].id);
    }
    if (this.envioForm.controls['moneda_id'].value && this.envioForm.controls['moneda_id'].value.length > 0) {
      this.envioForm.controls['moneda_id'].setValue(this.envioForm.controls['moneda_id'].value[0].id);
    }
    if (this.envioForm.controls['empleado_id'].value && this.envioForm.controls['empleado_id'].value.length > 0) {
      this.envioForm.controls['empleado_id'].setValue(this.envioForm.controls['empleado_id'].value[0].id);
    }
    if (this.envioForm.controls['cliente_id'].value && this.envioForm.controls['cliente_id'].value.length > 0) {
      this.envioForm.controls['cliente_id'].setValue(this.envioForm.controls['cliente_id'].value[0].id);
    }

    let envio = await this.envios_service.putEnvio(this.envio_id, this.envioForm.value);
    if (envio.code) {

      await this.clientes_service.putCliente(this.envioForm.value.cliente_id, {
        direccion: this.clienteForm.controls['direccion'].value
      });

      // localStorage.removeItem(`save_envios_${this.documento_id}`);
      this.alertas_service.success(envio.mensaje);
      this.ngxService.stop();
      this.location.back();
    }

    this.ngxService.stop();
  }

  get data_view() {
    let view = localStorage.getItem('data_view');
    return view ? view : 'grid'
  }

  setDataView(tipo: string) {
    localStorage.setItem('data_view', tipo);
  }

  updateCarrito() {
    this.envios_detalles = JSON.parse(localStorage.getItem(`carrito${this.documento.id}`) || '[]');
  }

}
