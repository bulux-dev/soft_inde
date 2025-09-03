import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { DepositosService } from '../../../../services/depositos.service';
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
import { VentasService } from '../../../../services/ventas.service';
import { CuentasBancariasService } from '../../../../services/cuentas_bancarias.service';
import { RecibosService } from '../../../../services/recibos.service';

declare var $: any

@Component({
  selector: 'app-agregar-deposito',
  standalone: false,
  templateUrl: './agregar-deposito.component.html',
  styleUrl: './agregar-deposito.component.css'
})
export class AgregarDepositoComponent {

  @Input() documento_id: any;

  get selectS() {
    return AppComponent.selectS;
  }

  loading: boolean = false;
  bodegas: any = [];
  sucursales: any = [];
  monedas: any = [];
  ventas: any = [];
  recibos: any = [];
  saldos: any = [];
  cuentas_bancarias: any = [];

  recibos_bancos: any = [];

  documento: any;

  depositoForm: FormGroup = new FormGroup({
    no_deposito: new FormControl(null, [Validators.required]),
    nombre: new FormControl(null),
    fecha: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [Validators.required]),
    observaciones: new FormControl(null),
    total: new FormControl(null, [Validators.required]),
    documento_id: new FormControl(null),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null),
    cliente_id: new FormControl(1, [Validators.required]),
    moneda_id: new FormControl(null, [Validators.required]),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    cuenta_bancaria_id: new FormControl(null, [Validators.required]),
    saldos: new FormControl([]),
    recibos_bancos: new FormControl([]),
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
    private depositos_service: DepositosService,
    private digifact_service: DigifactService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private clientes_service: ClientesService,
    private monedas_service: MonedasService,
    private ventas_service: VentasService,
    private recibos_service: RecibosService,
    private cuentas_bancarias_service: CuentasBancariasService
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDocumento();
    await this.getMonedas();
    await this.getCuentasBancarias();
    this.ngxService.stop();
  }

  async getVentas() {
    let ventas = await this.ventas_service.getAllVentasSaldos({
      cliente_id: this.depositoForm.controls['cliente_id'].value
    });
    this.ventas = ventas.data;
    this.ventas = this.ventas.filter((v: any) => {
      let saldo_final = parseFloat(parseFloat(v.saldos[0].saldo_final).toFixed(2))
      return saldo_final > 0
    });
  }

  async getRecibos() {
    let recibos = await this.recibos_service.getAllRecibosSaldos();
    this.recibos = recibos.data;
  }

  async getCuentasBancarias() {
    let cuentas_bancarias = await this.cuentas_bancarias_service.getCuentasBancarias();
    if (cuentas_bancarias.code) {
      this.cuentas_bancarias = cuentas_bancarias.data;
    }
  }

  async getDocumento() {
    this.depositoForm.controls['documento_id'].setValue(this.documento_id);
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
      this.depositoForm.controls['moneda_id'].setValue([this.monedas[0]]);
    }
  }

  async getBodegasBySucursal(id: any) {
    this.depositoForm.controls['bodega_id'].setValue(null);

    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }

  }

  async setDocumento() {
    this.depositoForm.controls['sucursal_id'].setValue([this.documento.sucursal]);

    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.depositoForm.controls['bodega_id'].setValue([this.documento.bodega]);
    } else {
      this.depositoForm.controls['bodega_id'].setValue(null);
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
    this.alertas_service.success('Venta seleccionada', true);
  }

  setRecibo(c: any) {
    this.recibos_bancos.push({
      recibo: c,
      recibo_id: c.id
    });
    this.alertas_service.success('Recibo seleccionado', true);
  }

  removeVenta(p: any) {
    let index = this.saldos.indexOf(p);
    if (index !== -1) {
      this.saldos.splice(index, 1);
    }
  }

  removeRecibo(p: any) {
    let index = this.recibos_bancos.indexOf(p);
    if (index !== -1) {
      this.recibos_bancos.splice(index, 1);
    }
  }

  ventaExistente(v: any) {
    return this.saldos.some((saldo: any) => saldo.venta_id === v.id);
  }

  reciboExistente(r: any) {
    return this.recibos_bancos.some((recibo: any) => recibo.recibo_id === r.id);
  }

  setAbono(s: any) {
    s.saldo_final = parseFloat(s.saldo_inicial) - parseFloat(s.total);
    s.saldo_inicial = parseFloat(s.saldo_inicial.toFixed(2));
    s.saldo_final = parseFloat(s.saldo_final.toFixed(2));
    s.total = parseFloat(s.total.toFixed(2));
  }

  calculo(d: any) {
    if (d.cantidad < 0.01) {
      d.cantidad = 0.01
    }

    d.precio = d.precio_unitario * d.cantidad;
    d.total = d.precio - d.descuento;
  }

  addCliente(i: any) {
    this.depositoForm.controls['cliente_id'].setValue(i.id);
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
      this.depositoForm.controls['cliente_id'].setValue(cliente.data[0].id);
    } else {
      let info = await this.digifact_service.getInfoNit(nit);
      if (info.code && info.data.RESPONSE[0].NOMBRE) {

        cliente = await this.clientes_service.postCliente({
          nit: nit,
          nombre: info.data.RESPONSE[0].NOMBRE
        });
        if (cliente) {
          this.clienteForm.patchValue(cliente.data);
          this.depositoForm.controls['cliente_id'].setValue(cliente.data.id);
        }

      } else {
        this.alertas_service.error('No se encontro nit');
      }
    }
    this.ngxService.stop();
  }

  async postDeposito() {

    $('#btn_guardar').prop('disabled', true);
    this.ngxService.start();

    if (this.depositoForm.controls['bodega_id'].value && this.depositoForm.controls['bodega_id'].value.length > 0) {
      this.depositoForm.controls['bodega_id'].setValue(this.depositoForm.controls['bodega_id'].value[0].id);
    }
    if (this.depositoForm.controls['sucursal_id'].value && this.depositoForm.controls['sucursal_id'].value.length > 0) {
      this.depositoForm.controls['sucursal_id'].setValue(this.depositoForm.controls['sucursal_id'].value[0].id);
    }
    if (this.depositoForm.controls['moneda_id'].value && this.depositoForm.controls['moneda_id'].value.length > 0) {
      this.depositoForm.controls['moneda_id'].setValue(this.depositoForm.controls['moneda_id'].value[0].id);
    }

    this.depositoForm.controls['nombre'].setValue(this.clienteForm.value.nombre);
    this.depositoForm.controls['documento_id'].setValue(this.documento.id);
    this.depositoForm.controls['saldos'].setValue(this.saldos);
    this.depositoForm.controls['recibos_bancos'].setValue(this.recibos_bancos);
    this.depositoForm.controls['cuenta_bancaria_id'].setValue(this.depositoForm.controls['cuenta_bancaria_id'].value[0].id);

    let deposito = await this.depositos_service.postDeposito(this.depositoForm.value);
    if (deposito.code) {
      this.alertas_service.success(deposito.mensaje);
      this.ngxService.stop();
      this.location.back();
    }

    $('#btn_guardar').prop('disabled', false);
    this.ngxService.stop();
  }

  getTotal() {
    let total = parseFloat(this.depositoForm.value.total);
    return total;
  }

  getAbono() {
    let total = 0;
    this.saldos.forEach((d: any) => {
      total += d.total;
    });
    return total;
  }

  getTotalRecibos() {
    let total = 0;
    this.recibos_bancos.forEach((d: any) => {
      total += parseFloat(d.recibo.total);
    });
    return total;
  }

}

