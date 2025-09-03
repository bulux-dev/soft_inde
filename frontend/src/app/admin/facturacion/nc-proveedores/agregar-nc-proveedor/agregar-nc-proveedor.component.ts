import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { NCProveedoresService } from '../../../../services/nc_proveedores.service';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
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

declare var $: any

@Component({
  selector: 'app-agregar-nc_proveedor',
  standalone: false,
  templateUrl: './agregar-nc-proveedor.component.html',
  styleUrl: './agregar-nc-proveedor.component.css'
})
export class AgregarNCProveedorComponent {

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

  documento: any;

  nc_proveedorForm: FormGroup = new FormGroup({
    no_nc: new FormControl(null, [Validators.required]),
    fecha: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [Validators.required]),
    observaciones: new FormControl(null),
    total: new FormControl(null),
    documento_id: new FormControl(null),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null),
    proveedor_id: new FormControl(1),
    moneda_id: new FormControl(null),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
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
    private nc_proveedores_service: NCProveedoresService,
    private digifact_service: DigifactService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private proveedores_service: ProveedoresService,
    private monedas_service: MonedasService,
    private compras_service: ComprasService,
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDocumento();
    await this.getMonedas();
    this.ngxService.stop();
  }

  async getCompras() {
    let compras = await this.compras_service.getAllComprasSaldos({
      proveedor_id: this.nc_proveedorForm.controls['proveedor_id'].value
    });
    this.compras = compras.data;
    this.compras = this.compras.filter((v: any) => {
      let saldo_final = parseFloat(parseFloat(v.saldos[0].saldo_final).toFixed(2))
      return saldo_final > 0
    });
  }

  async getDocumento() {
    this.nc_proveedorForm.controls['documento_id'].setValue(this.documento_id);
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
      this.nc_proveedorForm.controls['moneda_id'].setValue([this.monedas[0]]);
    }
  }

  async getBodegasBySucursal(id: any) {
    this.nc_proveedorForm.controls['bodega_id'].setValue(null);

    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }

  }

  async setDocumento() {
    this.nc_proveedorForm.controls['sucursal_id'].setValue([this.documento.sucursal]);

    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.nc_proveedorForm.controls['bodega_id'].setValue([this.documento.bodega]);
    } else {
      this.nc_proveedorForm.controls['bodega_id'].setValue(null);
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
    $('#compras').offcanvas('hide');
  }

  removeCompra(p: any) {
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

  addProveedor(i: any) {
    this.nc_proveedorForm.controls['proveedor_id'].setValue(i.id);
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
      this.nc_proveedorForm.controls['proveedor_id'].setValue(proveedor.data[0].id);
    } else {
      let info = await this.digifact_service.getInfoNit(nit);
      if (info.code && info.data.RESPONSE[0].NOMBRE) {

        proveedor = await this.proveedores_service.postProveedor({
          nit: nit,
          nombre: info.data.RESPONSE[0].NOMBRE
        });
        if (proveedor) {
          this.proveedorForm.patchValue(proveedor.data);
          this.nc_proveedorForm.controls['proveedor_id'].setValue(proveedor.data.id);
        }

      } else {
        this.alertas_service.error('No se encontro nit');
      }
    }
    this.ngxService.stop();
  }

  async postNCProveedor() {

    $('#btn_guardar').prop('disabled', true);
    this.ngxService.start();

    if (this.nc_proveedorForm.controls['bodega_id'].value && this.nc_proveedorForm.controls['bodega_id'].value.length > 0) {
      this.nc_proveedorForm.controls['bodega_id'].setValue(this.nc_proveedorForm.controls['bodega_id'].value[0].id);
    }
    if (this.nc_proveedorForm.controls['sucursal_id'].value && this.nc_proveedorForm.controls['sucursal_id'].value.length > 0) {
      this.nc_proveedorForm.controls['sucursal_id'].setValue(this.nc_proveedorForm.controls['sucursal_id'].value[0].id);
    }
    if (this.nc_proveedorForm.controls['moneda_id'].value && this.nc_proveedorForm.controls['moneda_id'].value.length > 0) {
      this.nc_proveedorForm.controls['moneda_id'].setValue(this.nc_proveedorForm.controls['moneda_id'].value[0].id);
    }


    this.nc_proveedorForm.controls['documento_id'].setValue(this.documento.id);
    this.nc_proveedorForm.controls['saldos'].setValue(this.saldos);

    let nc_proveedor = await this.nc_proveedores_service.postNCProveedor(this.nc_proveedorForm.value);
    if (nc_proveedor.code) {
      this.alertas_service.success(nc_proveedor.mensaje);
      this.ngxService.stop();
      this.location.back();
    }

    $('#btn_guardar').prop('disabled', false);
    this.ngxService.stop();
  }

  getTotal() {
    let total = parseFloat(this.nc_proveedorForm.value.total);
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

