import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { NCClientesService } from '../../../../services/nc_clientes.service';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { DigifactService } from '../../../../services/digifact.service';
import { DocumentosService } from '../../../../services/documentos.service';
import { BodegasService } from '../../../../services/bodegas.service';
import { ClientesService } from '../../../../services/clientes.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from '../../../../app.component';
import { SucursalesService } from '../../../../services/sucursales.service';
import { MonedasService } from '../../../../services/monedas.service';
import { VentasService } from '../../../../services/ventas.service';

declare var $: any

@Component({
  selector: 'app-agregar-nc_cliente',
  standalone: false,
  templateUrl: './agregar-nc-cliente.component.html',
  styleUrl: './agregar-nc-cliente.component.css'
})
export class AgregarNCClienteComponent {

  @Input() documento_id: any;

  get selectS() {
    return AppComponent.selectS;
  }

  loading: boolean = false;
  bodegas: any = [];
  sucursales: any = [];
  monedas: any = [];
  ventas: any = [];
  saldos: any = [];

  documento: any;

  nc_clienteForm: FormGroup = new FormGroup({
    no_nc: new FormControl(null, [Validators.required]),
    fecha: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [Validators.required]),
    observaciones: new FormControl(null),
    total: new FormControl(null),
    documento_id: new FormControl(null),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null),
    cliente_id: new FormControl(1),
    moneda_id: new FormControl(null),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    saldos: new FormControl([]),
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
    private nc_clientes_service: NCClientesService,
    private digifact_service: DigifactService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private clientes_service: ClientesService,
    private monedas_service: MonedasService,
    private ventas_service: VentasService,
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDocumento();
    await this.getMonedas();
    this.ngxService.stop();
  }

  async getVentas() {
    let ventas = await this.ventas_service.getAllVentasSaldos({
      cliente_id: this.nc_clienteForm.controls['cliente_id'].value,
    });
    this.ventas = ventas.data;
    this.ventas = this.ventas.filter((v: any) => {
      let saldo_final = parseFloat(parseFloat(v.saldos[0].saldo_final).toFixed(2))
      return saldo_final > 0
    });
  }

  async getDocumento() {
    this.nc_clienteForm.controls['documento_id'].setValue(this.documento_id);
    let documento = await this.documentos_service.getDocumento(this.documento_id);
    if (documento.code) {
      this.documento = documento.data;
      if (this.documento.sucursal_id) {
        await this.setDocumento();
      } else {
        await this.getSucursales();
      }
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
      this.nc_clienteForm.controls['moneda_id'].setValue([this.monedas[0]]);
    }
  }

  async getBodegasBySucursal(id: any) {
    this.nc_clienteForm.controls['bodega_id'].setValue(null);

    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }

  }

  async setDocumento() {
    this.nc_clienteForm.controls['sucursal_id'].setValue([this.documento.sucursal]);

    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.nc_clienteForm.controls['bodega_id'].setValue([this.documento.bodega]);
    } else {
      this.nc_clienteForm.controls['bodega_id'].setValue(null);
    }

  }

  setVenta(c: any) {
    this.saldos.push({
      venta: c,
      saldo_inicial: c.saldos[0].saldo_final,
      total: 0,
      saldo_final: c.saldos[0].saldo_final,
      venta_id: c.id
    })
    $('#ventas').offcanvas('hide');
  }

  removeVenta(p: any) {
    let index = this.saldos.indexOf(p);
    if (index !== -1) {
      this.saldos.splice(index, 1);
    }
  }

  calculo(d: any) {
    if (d.cantidad < 0.01) {
      d.cantidad = 0.01
    }

    d.precio = d.precio_unitario * d.cantidad;
    d.total = d.precio - d.descuento;
  }

  addCliente(i: any) {
    this.nc_clienteForm.controls['cliente_id'].setValue(i.id);
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
      this.nc_clienteForm.controls['cliente_id'].setValue(cliente.data[0].id);
    } else {
      let info = await this.digifact_service.getInfoNit(nit);
      if (info.code && info.data.RESPONSE[0].NOMBRE) {

        cliente = await this.clientes_service.postCliente({
          nit: nit,
          nombre: info.data.RESPONSE[0].NOMBRE
        });
        if (cliente) {
          this.clienteForm.patchValue(cliente.data);
          this.nc_clienteForm.controls['cliente_id'].setValue(cliente.data.id);
        }

      } else {
        this.alertas_service.error('No se encontro nit');
      }
    }
    this.ngxService.stop();
  }

  async postNCCliente() {

    $('#btn_guardar').prop('disabled', true);
    this.ngxService.start();

    if (this.nc_clienteForm.controls['bodega_id'].value && this.nc_clienteForm.controls['bodega_id'].value.length > 0) {
      this.nc_clienteForm.controls['bodega_id'].setValue(this.nc_clienteForm.controls['bodega_id'].value[0].id);
    }
    if (this.nc_clienteForm.controls['sucursal_id'].value && this.nc_clienteForm.controls['sucursal_id'].value.length > 0) {
      this.nc_clienteForm.controls['sucursal_id'].setValue(this.nc_clienteForm.controls['sucursal_id'].value[0].id);
    }
    if (this.nc_clienteForm.controls['moneda_id'].value && this.nc_clienteForm.controls['moneda_id'].value.length > 0) {
      this.nc_clienteForm.controls['moneda_id'].setValue(this.nc_clienteForm.controls['moneda_id'].value[0].id);
    }


    this.nc_clienteForm.controls['documento_id'].setValue(this.documento.id);
    this.nc_clienteForm.controls['saldos'].setValue(this.saldos);

    let nc_cliente = await this.nc_clientes_service.postNCCliente(this.nc_clienteForm.value);
    if (nc_cliente.code) {
      this.alertas_service.success(nc_cliente.mensaje);
      this.ngxService.stop();
      this.location.back();
    }

    $('#btn_guardar').prop('disabled', false);
    this.ngxService.stop();
  }

  getTotal() {
    let total = parseFloat(this.nc_clienteForm.value.total);
    return total;
  }

  getAbono() {
    let total = 0;
    this.saldos.forEach((d: any) => {
      total += d.total;
    });
    return total;
  }

  calcularSaldoFinal(s: any) {
    s.saldo_final = parseFloat(s.saldo_inicial) - parseFloat(s.total);
  }

}

