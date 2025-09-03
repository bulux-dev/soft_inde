import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { ImportacionesService } from '../../../../services/importaciones.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { DocumentosService } from '../../../../services/documentos.service';
import { BodegasService } from '../../../../services/bodegas.service';
import { ProveedoresService } from '../../../../services/proveedores.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from '../../../../app.component';
import { SucursalesService } from '../../../../services/sucursales.service';
import { MonedasService } from '../../../../services/monedas.service';
import { OrdenesComprasService } from '../../../../services/ordenes_compras.service';
import { EtiquetasService } from '../../../../services/etiquetas.service';
import { DigifactService } from '../../../../services/digifact.service';
import { ComprasService } from '../../../../services/compras.service';
import { TiposGastosService } from '../../../../services/tipos_gastos.service';

declare var $: any

@Component({
  selector: 'app-agregar-importacion',
  standalone: false,
  templateUrl: './agregar-importacion.component.html',
  styleUrl: './agregar-importacion.component.css'
})
export class AgregarImportacionComponent {

  @Input() documento_id: any;

  get selectS() {
    return AppComponent.selectS;
  }

  get selectM() {
    return AppComponent.selectM;
  }

  importaciones_detalles: any = [];
  pagos: any = [];
  bodegas: any = [];
  sucursales: any = [];
  monedas: any = [];
  compras: any = [];
  ordenes_compras: any = [];
  tipos_gastos: any = [];
  metodos: any = ['Efectivo', 'Tarjeta', 'Transferencia', 'Deposito', 'Cheque', 'Vale'];
  etiquetas: any = [];

  documento: any;
  no_doc_existente: boolean = false;
  moneda_simbolo: any;
  carrito_view: boolean = true;

  fecha_min = moment().startOf('month').format('YYYY-MM-DD HH:mm');
  fecha_max = moment().endOf('month').format('YYYY-MM-DD HH:mm');

  importacionForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [Validators.required]),
    no_doc: new FormControl(null, [Validators.required]),
    observaciones: new FormControl(null),
    descuento: new FormControl(null),
    total: new FormControl(null),
    subtotal: new FormControl(null),
    impuesto: new FormControl(null),
    descuento_ext: new FormControl(null),
    total_ext: new FormControl(null),
    subtotal_ext: new FormControl(null),
    impuesto_ext: new FormControl(null),
    tipo_prorrateo: new FormControl(null),
    tipo_pago: new FormControl('CONTADO', [Validators.required]),
    tipo_cambio: new FormControl(null),
    dias_credito: new FormControl(null),
    documento_id: new FormControl(null, [Validators.required]),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null, [Validators.required]),
    proveedor_id: new FormControl(1, [Validators.required]),
    moneda_id: new FormControl(null, [Validators.required]),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    importaciones_detalles: new FormControl([]),
    lote: new FormControl([]),
    pagos: new FormControl([]),
    orden_compra: new FormControl(null),
    orden_compra_id: new FormControl(null),
    operaciones_etiquetas: new FormControl([]),
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
  pagoForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD'), [Validators.required]),
    monto: new FormControl(null, [Validators.required]),
    cambio: new FormControl(null),
    metodo: new FormControl(null, [Validators.required]),
    autorizacion: new FormControl(null),
  });

  constructor(
    private ngxService: NgxUiLoaderService,
    private location: Location,
    private alertas_service: AlertasService,
    private importaciones_service: ImportacionesService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private proveedores_service: ProveedoresService,
    private monedas_service: MonedasService,
    private ordenes_compras_service: OrdenesComprasService,
    private digifact_service: DigifactService,
    private etiquetas_service: EtiquetasService,
    private compras_service: ComprasService,
    private tipos_gastos_service: TiposGastosService
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDocumento();
    await this.getMonedas();
    await this.getOrdenesCompras();
    await this.getEtiquetas();
    await this.getCompras();
    await this.getTiposGastos();
    this.ngxService.stop();
  }

  async validarNoDoc() {
    let no_doc = this.importacionForm.controls['no_doc'].value;
    let importacion = await this.importaciones_service.getImportaciones(null, null, {
      proveedor_id: this.importacionForm.controls['proveedor_id'].value,
      no_doc: no_doc || '--'
    });
    if (importacion.data.length > 0) {
      this.no_doc_existente = true;
    } else {
      this.no_doc_existente = false;
    }
  }

  async getDocumento() {
    this.importacionForm.controls['documento_id'].setValue(this.documento_id);
    let documento = await this.documentos_service.getDocumento(this.documento_id);
    if (documento.code) {
      this.documento = documento.data;
      if (this.documento.sucursal_id) {
        await this.setDocumento();
      } else {
        await this.getSucursales();
      }

      let d: any = localStorage.getItem(`carrito${this.documento_id}`);
      this.importaciones_detalles = JSON.parse(d) || [];
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
      this.importacionForm.controls['moneda_id'].setValue([this.monedas[0]]);
      this.setCambio(this.monedas[0]);
    }
  }

  async getCompras() {
    let compras = await this.compras_service.getCompras(null, null, {
      estado: 'VIGENTE'
    });
    if (compras.code) {
      this.compras = compras.data;
      // this.ordenes_compras.forEach((c: any) => {
      //   c.nombre = `COMPRA-${c.serie}-${c.correlativo} / ${c.proveedor.nit}`
      // })
    }
  }

  async getTiposGastos() {
    let tipos_gastos = await this.tipos_gastos_service.getTiposGastos();
    if (tipos_gastos.code) {
      this.tipos_gastos = tipos_gastos.data;
    }
  }

  async getOrdenesCompras() {
    let ordenes_compras = await this.ordenes_compras_service.getOrdenesCompras(null, null, {
      estado: 'PENDIENTE'
    });
    if (ordenes_compras.code) {
      this.ordenes_compras = ordenes_compras.data;
      this.ordenes_compras.forEach((oc: any) => {
        oc.nombre = `OC-${oc.serie}-${oc.correlativo} / ${oc.proveedor.nit}`
      })
    }
  }

  async getEtiquetas() {
    let etiquetas = await this.etiquetas_service.getEtiquetas({
      estado: true
    });
    this.etiquetas = etiquetas.data;
  }

  async getBodegasBySucursal(id: any) {
    this.importacionForm.controls['bodega_id'].setValue(null);
    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }

  }

  async setDocumento() {
    this.importacionForm.controls['sucursal_id'].setValue([this.documento.sucursal]);
    this.pagoForm.controls['metodo'].setValue(['Efectivo']);
    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.importacionForm.controls['bodega_id'].setValue([this.documento.bodega]);
    } else {
      this.importacionForm.controls['bodega_id'].setValue(null);
    }

  }

  async setOrdenCompra(c: any) {
    this.ngxService.start();
    let orden_compra = await this.ordenes_compras_service.getOrdenCompra(c.id);
    if (orden_compra.code) {
      delete orden_compra.data.fecha;
      this.importacionForm.patchValue(orden_compra.data);
      this.importacionForm.controls['sucursal_id'].setValue([orden_compra.data.sucursal]);
      this.importacionForm.controls['bodega_id'].setValue([orden_compra.data.bodega]);
      this.importacionForm.controls['moneda_id'].setValue([orden_compra.data.moneda]);
      this.importacionForm.controls['usuario_id'].setValue(localStorage.getItem('usuario_id'));
      this.importacionForm.controls['orden_compra'].setValue(c.serie + '-' + c.correlativo);
      this.importacionForm.controls['orden_compra_id'].setValue(c.id);
      this.proveedorForm.patchValue(orden_compra.data.proveedor);
      this.importaciones_detalles = orden_compra.data.ordenes_compras_detalles;
      for (let cd = 0; cd < this.importaciones_detalles.length; cd++) {
        delete this.importaciones_detalles[cd].id;
        this.importaciones_detalles[cd].logo = this.importaciones_detalles[cd].producto.logo
        this.importaciones_detalles[cd].tipo = this.importaciones_detalles[cd].producto.tipo_producto.nombre;
        this.importaciones_detalles[cd].equivalencias = this.importaciones_detalles[cd].producto.equivalencias.filter((e: any) => e.tipo === 'entrada');
        this.importaciones_detalles[cd].medida = this.importaciones_detalles[cd].medida;
        this.importaciones_detalles[cd].stock = 0;
      }
      await this.getInfoNit();
      $('#ordenes-compras').offcanvas('hide');
    }
    this.ngxService.stop();
  }

  addProveedor(i: any) {
    this.importacionForm.controls['proveedor_id'].setValue(i.id);
    this.proveedorForm.patchValue(i);
    this.validarNoDoc();
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

  async getInfoNit() {
    let nit = this.proveedorForm.controls['nit'].value.replace(/-/g, '').trim().toUpperCase();
    this.proveedorForm.controls['nit'].setValue(nit);

    this.ngxService.start();
    let proveedor = await this.proveedores_service.getProveedores({
      nit: nit
    });
    if (proveedor.data.length > 0) {
      this.proveedorForm.patchValue(proveedor.data[0]);
      this.importacionForm.controls['proveedor_id'].setValue(proveedor.data[0].id);
    } else {
      let info = await this.digifact_service.getInfoNit(nit);
      if (info.code && info.data.RESPONSE[0].NOMBRE) {

        proveedor = await this.proveedores_service.postProveedor({
          nit: nit,
          nombre: info.data.RESPONSE[0].NOMBRE
        });
        if (proveedor) {
          this.proveedorForm.patchValue(proveedor.data);
          this.importacionForm.controls['proveedor_id'].setValue(proveedor.data.id);
        }

      } else {
        this.alertas_service.error('No se encontro nit');
      }
    }
    this.validarNoDoc();
    this.ngxService.stop();
  }

  getDescuento(ext: any = null) {
    let total = 0;
    this.importaciones_detalles.forEach((d: any) => {
      total += parseFloat(ext ? d.descuento_ext : d.descuento);
    });
    return total;
  }

  getTotal(ext: any = null) {
    let total = 0;
    this.importaciones_detalles.forEach((d: any) => {
      total += parseFloat(ext ? d.total_ext : d.total);
    });
    return total;
  }

  getSubtotal(ext: any = null) {
    let subtotal = 0;
    this.importaciones_detalles.forEach((d: any) => {
      subtotal += parseFloat(ext ? d.subtotal_ext : d.subtotal);
    });
    return subtotal;
  }

  getImpuesto(ext: any = null) {
    let impuesto = 0;
    this.importaciones_detalles.forEach((d: any) => {
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

  async postImportacion() {

    $('#btn_guardar').prop('disabled', true);
    this.ngxService.start();

    // Validar Fecha
    if (!this.fechaMax()) {
      return;
    }

    // Validar carrito
    for (let v = 0; v < this.importaciones_detalles.length; v++) {
      if (this.importaciones_detalles[v].cantidad <= 0) {
        return this.alertas_service.error(`Cantidad de producto ${this.importaciones_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.importaciones_detalles[v].costo <= 0) {
        return this.alertas_service.error(`Costo de producto ${this.importaciones_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.importaciones_detalles[v].descripcion == '') {
        return this.alertas_service.error(`Descripción de producto es un campo obligatorio`, true);
      }
    }


    // Validar No Documento
    if (this.no_doc_existente) {
      return this.alertas_service.error('No. Documento ya existe', true);
    }

    // Validar Pago
    if (this.importacionForm.value.tipo_pago == 'CONTADO' && this.getPagado() < parseFloat(this.getTotal().toFixed(2))) {
      return this.alertas_service.error(`${this.getCambio()} de monto pendiente`, true);
    }

    if (!this.importacionForm.value.bodega_id || this.importacionForm.value.bodega_id.length == 0) {
      return this.alertas_service.error(`Bodega es un campo obligatorio`, true);
    }
    if (!this.importacionForm.value.sucursal_id || this.importacionForm.value.sucursal_id.length == 0) {
      return this.alertas_service.error(`Sucursal es un campo obligatorio`, true);
    }
    if (!this.importacionForm.value.moneda_id || this.importacionForm.value.moneda_id.length == 0) {
      return this.alertas_service.error(`Moneda es un campo obligatorio`, true);
    }
    if (!this.importacionForm.value.proveedor_id || this.importacionForm.value.proveedor_id.length == 0) {
      return this.alertas_service.error(`Proveedor es un campo obligatorio`, true);
    }
    if (!this.importacionForm.value.documento_id || this.importacionForm.value.documento_id.length == 0) {
      return this.alertas_service.error(`Documento es un campo obligatorio`, true);
    }

    this.importacionForm.controls['bodega_id'].setValue(this.importacionForm.controls['bodega_id'].value[0].id);
    this.importacionForm.controls['sucursal_id'].setValue(this.importacionForm.controls['sucursal_id'].value[0].id);
    this.importacionForm.controls['moneda_id'].setValue(this.importacionForm.controls['moneda_id'].value[0].id);
    this.importacionForm.controls['documento_id'].setValue(this.documento.id);
    this.importacionForm.controls['importaciones_detalles'].setValue(this.importaciones_detalles);
    this.importacionForm.controls['pagos'].setValue(this.pagos);

    this.importacionForm.controls['descuento'].setValue(this.getDescuento());
    this.importacionForm.controls['total'].setValue(this.getTotal());
    this.importacionForm.controls['subtotal'].setValue(this.getSubtotal());
    this.importacionForm.controls['impuesto'].setValue(this.getImpuesto());

    // Conversion a moneda extranjera
    this.importacionForm.controls['descuento_ext'].setValue(this.getDescuento(true));
    this.importacionForm.controls['total_ext'].setValue(this.getTotal(true));
    this.importacionForm.controls['subtotal_ext'].setValue(this.getSubtotal(true));
    this.importacionForm.controls['impuesto_ext'].setValue(this.getImpuesto(true));

    let importacion = await this.importaciones_service.postImportacion(this.importacionForm.value);
    if (importacion.code) {

      await this.proveedores_service.putProveedor(this.importacionForm.value.proveedor_id, {
        direccion: this.proveedorForm.controls['direccion'].value
      });

      localStorage.removeItem(`carrito${this.documento_id}`);
      this.alertas_service.success(importacion.mensaje);
      this.ngxService.stop();
      this.location.back();
    }

    $('#btn_guardar').prop('disabled', false);
    this.ngxService.stop();
  }

  fechaMax() {
    if (this.importacionForm.value.fecha > this.fecha_max) {
      this.alertas_service.error('Fecha no coincide con el mes actual', true);
      return false;
    }
    return true;
  }

  updateCarrito() {
    this.importaciones_detalles = JSON.parse(localStorage.getItem(`carrito${this.documento_id}`) || '[]');
  }

  setCambio(e: any) {
    let moneda = this.monedas.find((m: any) => m.id == e.id);
    this.importacionForm.controls['tipo_cambio'].setValue(moneda.tipo_cambio);
    this.moneda_simbolo = moneda.simbolo;
  }

  setTipoCambio() {
    this.carrito_view = false;
    setTimeout(() => {
      this.carrito_view = true;
    }, 500);
  }

}

