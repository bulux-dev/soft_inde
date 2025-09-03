import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { CargasService } from '../../../../services/cargas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { DocumentosService } from '../../../../services/documentos.service';
import { BodegasService } from '../../../../services/bodegas.service';
import { ProveedoresService } from '../../../../services/proveedores.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from '../../../../app.component';
import { SucursalesService } from '../../../../services/sucursales.service';
import { DigifactService } from '../../../../services/digifact.service';

declare var $: any

@Component({
  selector: 'app-agregar-carga',
  standalone: false,
  templateUrl: './agregar-carga.component.html',
  styleUrl: './agregar-carga.component.css'
})
export class AgregarCargaComponent {

  @Input() documento_id: any;

  get selectS() {
    return AppComponent.selectS;
  }

  cargas_detalles: any = [];
  bodegas: any = [];
  sucursales: any = [];

  documento: any;

  fecha_min = moment().startOf('month').format('YYYY-MM-DD HH:mm');
  fecha_max = moment().endOf('month').format('YYYY-MM-DD HH:mm');

  cargaForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [Validators.required]),
    observaciones: new FormControl(null),
    documento_id: new FormControl(null),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null),
    proveedor_id: new FormControl(1),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    cargas_detalles: new FormControl([]),
    proveedor: new FormControl([]),
    lote: new FormControl([])
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
    private cargas_service: CargasService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private proveedores_service: ProveedoresService,
    private digifact_service: DigifactService,
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDocumento();
    this.ngxService.stop();
  }

  async getDocumento() {
    this.cargaForm.controls['documento_id'].setValue(this.documento_id);
    let documento = await this.documentos_service.getDocumento(this.documento_id);
    if (documento.code) {
      this.documento = documento.data;
      if (this.documento.sucursal_id) {
        await this.setDocumento();
      } else {
        await this.getSucursales();
      }

      let d: any = localStorage.getItem(`carrito${this.documento_id}`);
      this.cargas_detalles = JSON.parse(d) || [];
    }
  }

  async getSucursales() {
    let sucursales = await this.sucursales_service.getSucursales();
    if (sucursales.code) {
      this.sucursales = sucursales.data;
    }
  }

  async getBodegasBySucursal(id: any) {
    this.cargaForm.controls['bodega_id'].setValue(null);

    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    };
  }

  async setDocumento() {
    this.cargaForm.controls['sucursal_id'].setValue([this.documento.sucursal]);

    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.cargaForm.controls['bodega_id'].setValue([this.documento.bodega]);
    } else {
      this.cargaForm.controls['bodega_id'].setValue(null);
    }
  }

  addProveedor(i: any) {
    this.cargaForm.controls['proveedor_id'].setValue(i.id);
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
      this.cargaForm.controls['proveedor_id'].setValue(proveedor.data[0].id);
    } else {
      let info = await this.digifact_service.getInfoNit(nit);
      if (info.code && info.data.RESPONSE[0].NOMBRE) {

        proveedor = await this.proveedores_service.postProveedor({
          nit: nit,
          nombre: info.data.RESPONSE[0].NOMBRE
        });
        if (proveedor) {
          this.proveedorForm.patchValue(proveedor.data);
          this.cargaForm.controls['proveedor_id'].setValue(proveedor.data.id);
        }

      } else {
        this.alertas_service.error('No se encontro nit');
      }
    }
    this.ngxService.stop();
  }

  getTotal() {
    let total = 0;
    this.cargas_detalles.forEach((d: any) => {
      total += parseFloat(d.total);
    });
    return total;
  }

  getSubtotal() {
    let subtotal = 0;
    this.cargas_detalles.forEach((d: any) => {
      subtotal += parseFloat(d.subtotal);
    });
    return subtotal;
  }

  getImpuesto() {
    let impuesto = 0;
    this.cargas_detalles.forEach((d: any) => {
      impuesto += parseFloat(d.impuesto);
    });
    return impuesto;
  }

  async postCarga() {

    $('#btn_guardar').prop('disabled', true);
    this.ngxService.start();

    if (!this.fechaMax()) {
      return;
    }

    // Validar carrito
    for (let v = 0; v < this.cargas_detalles.length; v++) {
      if (this.cargas_detalles[v].cantidad <= 0) {
        return this.alertas_service.error(`Cantidad de producto ${this.cargas_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.cargas_detalles[v].descripcion == '') {
        return this.alertas_service.error(`Descripción de producto es un campo obligatorio`, true);
      }
    }

    if (this.cargas_detalles.length == 0) {
      return this.alertas_service.error(`Selecciona productos a cargar`, true);
    }

    this.cargaForm.controls['documento_id'].setValue(this.documento.id);
    this.cargaForm.controls['cargas_detalles'].setValue(this.cargas_detalles);
    this.cargaForm.controls['proveedor'].setValue(this.proveedorForm.value);

    if (this.cargaForm.controls['bodega_id'].value && this.cargaForm.controls['bodega_id'].value.length > 0) {
      this.cargaForm.controls['bodega_id'].setValue(this.cargaForm.controls['bodega_id'].value[0].id);
    }
    if (this.cargaForm.controls['sucursal_id'].value && this.cargaForm.controls['sucursal_id'].value.length > 0) {
      this.cargaForm.controls['sucursal_id'].setValue(this.cargaForm.controls['sucursal_id'].value[0].id);
    }

    let carga = await this.cargas_service.postCarga(this.cargaForm.value);
    if (carga.code) {
      localStorage.removeItem(`carrito${this.documento_id}`);
      this.alertas_service.success(carga.mensaje);
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
    localStorage.setItem(`save_cargas_${this.documento_id}`, JSON.stringify(this.cargas_detalles));
  }

  fechaMax() {
    if (this.cargaForm.value.fecha > this.fecha_max) {
      this.alertas_service.error('Fecha no coincide con el mes actual', true);
      return false;
    }
    return true;
  }

  updateCarrito() {
    this.cargas_detalles = JSON.parse(localStorage.getItem(`carrito${this.documento_id}`) || '[]');
  }

}

