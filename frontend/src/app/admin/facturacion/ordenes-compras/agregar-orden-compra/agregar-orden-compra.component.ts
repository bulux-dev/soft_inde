import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { OrdenesComprasService } from '../../../../services/ordenes_compras.service';
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
declare var $: any

@Component({
  selector: 'app-agregar-orden-compra',
  standalone: false,
  templateUrl: './agregar-orden-compra.component.html',
  styleUrl: './agregar-orden-compra.component.css'
})
export class AgregarOrdenCompraComponent {

  @Input() documento_id: any;

  get selectS() {
    return AppComponent.selectS;
  }

  get selectM() {
    return AppComponent.selectM;
  }

  ordenes_compras_detalles: any = [];
  bodegas: any = [];
  sucursales: any = [];
  monedas: any = [];
  metodos: any = ['Efectivo', 'Tarjeta', 'Transferencia', 'Deposito', 'Cheque', 'Vale'];

  documento: any;
  moneda_simbolo: any;

  ordenCompraForm: FormGroup = new FormGroup({
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
    documento_id: new FormControl(null, [Validators.required]),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null),
    proveedor_id: new FormControl(1, [Validators.required]),
    moneda_id: new FormControl(null, [Validators.required]),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    ordenes_compras_detalles: new FormControl([]),
    lote: new FormControl([]),
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
    private ordenes_compras_service: OrdenesComprasService,
    private digifact_service: DigifactService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private proveedores_service: ProveedoresService,
    private monedas_service: MonedasService,
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDocumento();
    await this.getMonedas();
    this.ngxService.stop();
  }

  async getDocumento() {
    this.ordenCompraForm.controls['documento_id'].setValue(this.documento_id);
    let documento = await this.documentos_service.getDocumento(this.documento_id);
    if (documento.code) {
      this.documento = documento.data;
      if (this.documento.sucursal_id) {
        await this.setDocumento();
      } else {
        await this.getSucursales();
      }

      let d: any = localStorage.getItem(`carrito${this.documento_id}`);
      this.ordenes_compras_detalles = JSON.parse(d) || [];
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
      this.ordenCompraForm.controls['moneda_id'].setValue([this.monedas[0]]);
      this.setCambio(this.monedas[0]);
    }
  }


  async getBodegasBySucursal(id: any) {
    this.ordenCompraForm.controls['bodega_id'].setValue(null);

    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }
  }

  async setDocumento() {
    this.ordenCompraForm.controls['sucursal_id'].setValue([this.documento.sucursal]);

    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.ordenCompraForm.controls['bodega_id'].setValue([this.documento.bodega]);
    } else {
      this.ordenCompraForm.controls['bodega_id'].setValue(null);
    }
  }


  addProveedor(i: any) {
    this.ordenCompraForm.controls['proveedor_id'].setValue(i.id);
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
      this.ordenCompraForm.controls['proveedor_id'].setValue(proveedor.data[0].id);
    } else {
      let info = await this.digifact_service.getInfoNit(nit);
      if (info.code && info.data.RESPONSE[0].NOMBRE) {

        proveedor = await this.proveedores_service.postProveedor({
          nit: nit,
          nombre: info.data.RESPONSE[0].NOMBRE
        });
        if (proveedor) {
          this.proveedorForm.patchValue(proveedor.data);
          this.ordenCompraForm.controls['proveedor_id'].setValue(proveedor.data.id);
        }

      } else {
        this.alertas_service.error('No se encontro nit');
      }
    }
    this.ngxService.stop();
  }

  getDescuento(ext: any = null) {
    let descuento = 0;
    this.ordenes_compras_detalles.forEach((d: any) => {
      descuento += parseFloat(ext ? d.descuento_ext : d.descuento);
    });
    return descuento;
  }

  getTotal(ext: any = null) {
    let total = 0;
    this.ordenes_compras_detalles.forEach((d: any) => {
      total += parseFloat(ext ? d.total_ext : d.total);
    });
    return total;
  }

  getSubtotal(ext: any = null) {
    let subtotal = 0;
    this.ordenes_compras_detalles.forEach((d: any) => {
      subtotal += parseFloat(ext ? d.subtotal_ext : d.subtotal);
    });
    return subtotal;
  }

  getImpuesto(ext: any = null) {
    let impuesto = 0;
    this.ordenes_compras_detalles.forEach((d: any) => {
      impuesto += parseFloat(ext ? d.impuesto_ext : d.impuesto);
    });
    return impuesto;
  }

  async postOrdenCompra() {

    $('#btn_guardar').prop('disabled', true);
    this.ngxService.start();

    for (let v = 0; v < this.ordenes_compras_detalles.length; v++) {
      if (this.ordenes_compras_detalles[v].cantidad <= 0) {
        return this.alertas_service.error(`Cantidad de producto ${this.ordenes_compras_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.ordenes_compras_detalles[v].costo <= 0) {
        return this.alertas_service.error(`Costo de producto ${this.ordenes_compras_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.ordenes_compras_detalles[v].descripcion == '') {
        return this.alertas_service.error(`Descripción de producto es un campo obligatorio`, true);
      }
    }

    if (this.ordenCompraForm.controls['bodega_id'].value && this.ordenCompraForm.controls['bodega_id'].value.length > 0) {
      this.ordenCompraForm.controls['bodega_id'].setValue(this.ordenCompraForm.controls['bodega_id'].value[0].id);
    }
    if (this.ordenCompraForm.controls['sucursal_id'].value && this.ordenCompraForm.controls['sucursal_id'].value.length > 0) {
      this.ordenCompraForm.controls['sucursal_id'].setValue(this.ordenCompraForm.controls['sucursal_id'].value[0].id);
    }
    if (this.ordenCompraForm.controls['moneda_id'].value && this.ordenCompraForm.controls['moneda_id'].value.length > 0) {
      this.ordenCompraForm.controls['moneda_id'].setValue(this.ordenCompraForm.controls['moneda_id'].value[0].id);
    }

    this.ordenCompraForm.controls['documento_id'].setValue(this.documento.id);
    this.ordenCompraForm.controls['ordenes_compras_detalles'].setValue(this.ordenes_compras_detalles);

    this.ordenCompraForm.controls['descuento'].setValue(this.getDescuento());
    this.ordenCompraForm.controls['total'].setValue(this.getTotal());
    this.ordenCompraForm.controls['subtotal'].setValue(this.getSubtotal());
    this.ordenCompraForm.controls['impuesto'].setValue(this.getImpuesto());

    // Conversion a moneda extranjera
    this.ordenCompraForm.controls['descuento_ext'].setValue(this.getDescuento(true));
    this.ordenCompraForm.controls['total_ext'].setValue(this.getTotal(true));
    this.ordenCompraForm.controls['subtotal_ext'].setValue(this.getSubtotal(true));
    this.ordenCompraForm.controls['impuesto_ext'].setValue(this.getImpuesto(true));

    let orden_compra = await this.ordenes_compras_service.postOrdenCompra(this.ordenCompraForm.value);
    if (orden_compra.code) {

      await this.proveedores_service.putProveedor(this.ordenCompraForm.value.proveedor_id, {
        direccion: this.proveedorForm.controls['direccion'].value
      });

      localStorage.removeItem(`carrito${this.documento_id}`);
      this.alertas_service.success(orden_compra.mensaje);
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
    localStorage.setItem(`save_ordenes_compras_${this.documento_id}`, JSON.stringify(this.ordenes_compras_detalles));
  }

  updateCarrito() {
    this.ordenes_compras_detalles = JSON.parse(localStorage.getItem(`carrito${this.documento_id}`) || '[]');
  }

  setCambio(e: any) {
    let moneda = this.monedas.find((m: any) => m.id == e.id);
    this.ordenCompraForm.controls['tipo_cambio'].setValue(moneda.tipo_cambio);
    this.moneda_simbolo = moneda.simbolo;
  }

}

