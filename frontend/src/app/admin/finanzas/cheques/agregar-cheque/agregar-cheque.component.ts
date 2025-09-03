import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { ChequesService } from '../../../../services/cheques.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { DigifactService } from '../../../../services/digifact.service';
import { DocumentosService } from '../../../../services/documentos.service';
import { BodegasService } from '../../../../services/bodegas.service';
import { ProveedoresService } from '../../../../services/proveedores.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from '../../../../app.component';
import { SucursalesService } from '../../../../services/sucursales.service';
import { MonedasService } from '../../../../services/monedas.service';
import { ComprasService } from '../../../../services/compras.service';
import { CuentasBancariasService } from '../../../../services/cuentas_bancarias.service';
import { CajasChicasService } from '../../../../services/cajas_chicas.service';

declare var $: any

@Component({
  selector: 'app-agregar-cheque',
  standalone: false,
  templateUrl: './agregar-cheque.component.html',
  styleUrl: './agregar-cheque.component.css'
})
export class AgregarChequeComponent {

  @Input() documento_id: any;

  get selectS() {
    return AppComponent.selectS;
  }

  loading: boolean = false;
  bodegas: any = [];
  sucursales: any = [];
  monedas: any = [];
  compras: any = [];
  saldos: any = [];
  cuentas_bancarias: any = [];
  cajas_chicas: any = [];

  documento: any;

  chequeForm: FormGroup = new FormGroup({
    no_cheque: new FormControl(null, [Validators.required]),
    nombre: new FormControl(null),
    fecha: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [Validators.required]),
    observaciones: new FormControl(null),
    total: new FormControl(null, [Validators.required]),
    documento_id: new FormControl(null),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null),
    proveedor_id: new FormControl(1, [Validators.required]),
    moneda_id: new FormControl(null, [Validators.required]),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    cuenta_bancaria_id: new FormControl(null, [Validators.required]),
    caja_chica_id: new FormControl(null),
    saldos: new FormControl([]),
  });
  proveedorForm: FormGroup = new FormGroup({
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
    private cheques_service: ChequesService,
    private digifact_service: DigifactService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private proveedores_service: ProveedoresService,
    private monedas_service: MonedasService,
    private compras_service: ComprasService,
    private cuentas_bancarias_service: CuentasBancariasService,
    private cajas_chicas_service: CajasChicasService
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDocumento();
    await this.getMonedas();
    await this.getCuentasBancarias();
    this.ngxService.stop();
    this.getCajasChicas();
  }

  async getCompras() {
    let compras = await this.compras_service.getAllComprasSaldos({
      proveedor_id: this.chequeForm.controls['proveedor_id'].value
    });
    this.compras = compras.data;
    this.compras = this.compras.filter((v: any) => {
      let saldo_final = parseFloat(parseFloat(v.saldos[0].saldo_final).toFixed(2))
      return saldo_final > 0
    })
  }

  async getCuentasBancarias() {
    let cuentas_bancarias = await this.cuentas_bancarias_service.getCuentasBancarias();
    if (cuentas_bancarias.code) {
      this.cuentas_bancarias = cuentas_bancarias.data;
    }
  }

  async getCajasChicas() {
    let cajas_chicas = await this.cajas_chicas_service.getCajasChicas({ estado: 'ABIERTA' });
    if (cajas_chicas.code) {
      this.cajas_chicas = cajas_chicas.data;
    }
  }

  async getDocumento() {
    this.chequeForm.controls['documento_id'].setValue(this.documento_id);
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
      this.chequeForm.controls['moneda_id'].setValue([this.monedas[0]]);
    }
  }

  async getBodegasBySucursal(id: any) {
    this.chequeForm.controls['bodega_id'].setValue(null);

    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }

  }

  async setDocumento() {
    this.chequeForm.controls['sucursal_id'].setValue([this.documento.sucursal]);

    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.chequeForm.controls['bodega_id'].setValue([this.documento.bodega]);
    } else {
      this.chequeForm.controls['bodega_id'].setValue(null);
    }

  }

  setCompra(c: any) {
    this.saldos.push({
      compra: c,
      saldo_inicial: c.saldos[0].saldo_final,
      total: 0,
      saldo_final: c.saldos[0].saldo_final,
      compra_id: c.id
    })
    this.alertas_service.success('Compra seleccionada', true);
    this.chequeForm.controls['caja_chica_id'].setValue(null);
  }

  removeCompra(p: any) {
    let index = this.saldos.indexOf(p);
    if (index !== -1) {
      this.saldos.splice(index, 1);
    }
  }

  compraExistente(c: any) {
    return this.saldos.some((saldo: any) => saldo.compra_id === c.id);
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

  addProveedor(i: any) {
    this.chequeForm.controls['proveedor_id'].setValue(i.id);
    this.proveedorForm.patchValue(i);
  }

  async getInfoNit() {
    let nit = this.proveedorForm.controls['nit'].value.replace(/-/g, '').trim().toUpperCase();
    this.proveedorForm.controls['nit'].setValue(nit);

    this.ngxService.start();
    let proveedor = await this.proveedores_service.getProveedores({
      nit: nit
    });
    if (proveedor.data.length > 0) {
      this.proveedorForm.patchValue(proveedor.data[0]);
      this.chequeForm.controls['proveedor_id'].setValue(proveedor.data[0].id);
    } else {
      let info = await this.digifact_service.getInfoNit(nit);
      if (info.code && info.data.RESPONSE[0].NOMBRE) {

        proveedor = await this.proveedores_service.postProveedor({
          nit: nit,
          nombre: info.data.RESPONSE[0].NOMBRE
        });
        if (proveedor) {
          this.proveedorForm.patchValue(proveedor.data);
          this.chequeForm.controls['proveedor_id'].setValue(proveedor.data.id);
        }

      } else {
        this.alertas_service.error('No se encontro nit');
      }
    }
    this.ngxService.stop();
  }

  async postCheque() {

    $('#btn_guardar').prop('disabled', true);
    this.ngxService.start();

    if (this.chequeForm.controls['bodega_id'].value && this.chequeForm.controls['bodega_id'].value.length > 0) {
      this.chequeForm.controls['bodega_id'].setValue(this.chequeForm.controls['bodega_id'].value[0].id);
    }
    if (this.chequeForm.controls['sucursal_id'].value && this.chequeForm.controls['sucursal_id'].value.length > 0) {
      this.chequeForm.controls['sucursal_id'].setValue(this.chequeForm.controls['sucursal_id'].value[0].id);
    }
    if (this.chequeForm.controls['moneda_id'].value && this.chequeForm.controls['moneda_id'].value.length > 0) {
      this.chequeForm.controls['moneda_id'].setValue(this.chequeForm.controls['moneda_id'].value[0].id);
    }

    this.chequeForm.controls['nombre'].setValue(this.proveedorForm.value.nombre);
    this.chequeForm.controls['documento_id'].setValue(this.documento.id);
    this.chequeForm.controls['saldos'].setValue(this.saldos);
    this.chequeForm.controls['cuenta_bancaria_id'].setValue(this.chequeForm.controls['cuenta_bancaria_id'].value[0].id);
    if (this.chequeForm.controls['caja_chica_id'].value) {
      this.chequeForm.controls['caja_chica_id'].setValue(this.chequeForm.controls['caja_chica_id'].value[0].id);
    }

    let cheque = await this.cheques_service.postCheque(this.chequeForm.value);
    if (cheque.code) {
      this.alertas_service.success(cheque.mensaje);
      this.ngxService.stop();
      this.location.back();
    }

    $('#btn_guardar').prop('disabled', false);
    this.ngxService.stop();
  }

  getTotal() {
    let total = parseFloat(this.chequeForm.value.total);
    return total;
  }

  getAbono() {
    let total = 0;
    this.saldos.forEach((d: any) => {
      total += d.total;
    });
    return total;
  }

}

