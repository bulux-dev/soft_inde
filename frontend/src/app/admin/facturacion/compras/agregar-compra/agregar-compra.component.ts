import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { ComprasService } from '../../../../services/compras.service';
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
import { CajasChicasService } from '../../../../services/cajas_chicas.service';

declare var $: any

@Component({
  selector: 'app-agregar-compra',
  standalone: false,
  templateUrl: './agregar-compra.component.html',
  styleUrl: './agregar-compra.component.css'
})
export class AgregarCompraComponent {

  @Input() documento_id: any;

  get selectS() {
    return AppComponent.selectS;
  }

  get selectM() {
    return AppComponent.selectM;
  }

  compras_detalles: any = [];
  pagos: any = [];
  bodegas: any = [];
  sucursales: any = [];
  monedas: any = [];
  ordenes_compras: any = [];
  metodos: any = ['Efectivo', 'Transferencia', 'Tarjeta', 'Deposito', 'Cheque', 'Vale'];
  booleanos: any = [{ id: 1, nombre: 'SI' }, { id: 0, nombre: 'NO' }];
  tarjetas: any = [];
  cajas_chicas: any = [];
  etiquetas: any = [];

  documento: any;
  no_doc_existente: boolean = false;
  moneda_simbolo: any;
  view_carrito: boolean = true;

  fecha_min = moment().startOf('month').format('YYYY-MM-DD HH:mm');
  fecha_max = moment().endOf('month').format('YYYY-MM-DD HH:mm');

  compraForm: FormGroup = new FormGroup({
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
    tipo_pago: new FormControl('CONTADO', [Validators.required]),
    tipo_cambio: new FormControl(null),
    dias_credito: new FormControl(null),
    gravable: new FormControl([{ id: 1, nombre: 'SI' }], [Validators.required]),
    libro: new FormControl([{ id: 1, nombre: 'SI' }], [Validators.required]),
    documento_id: new FormControl(null, [Validators.required]),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null),
    proveedor_id: new FormControl(1, [Validators.required]),
    moneda_id: new FormControl(null, [Validators.required]),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    compras_detalles: new FormControl([]),
    lote: new FormControl([]),
    pagos: new FormControl([]),
    orden_compra: new FormControl(null),
    orden_compra_id: new FormControl(null),
    caja_chica_id: new FormControl(null),
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
    pequeno_contribuyente: new FormControl(null),
  });
  pagoForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD'), [Validators.required]),
    monto: new FormControl(null, [Validators.required]),
    cambio: new FormControl(null),
    metodo: new FormControl(null, [Validators.required]),
    autorizacion: new FormControl(null),
    tarjeta_id: new FormControl(null),
  });

  constructor(
    private ngxService: NgxUiLoaderService,
    private location: Location,
    private alertas_service: AlertasService,
    private compras_service: ComprasService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private proveedores_service: ProveedoresService,
    private monedas_service: MonedasService,
    private ordenes_compras_service: OrdenesComprasService,
    private digifact_service: DigifactService,
    private etiquetas_service: EtiquetasService,
    private cajas_chicas_service: CajasChicasService
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDocumento();
    await this.getMonedas();
    await this.getOrdenesCompras();
    await this.getEtiquetas();
    this.ngxService.stop();
    this.getTarjetas();
    this.getCajasChicas();
  }

  async validarNoDoc() {
    let no_doc = this.compraForm.controls['no_doc'].value;
    let compra = await this.compras_service.getCompras(null, null, {
      proveedor_id: this.compraForm.controls['proveedor_id'].value,
      no_doc: no_doc || '--'
    });
    if (compra.data.length > 0) {
      this.no_doc_existente = true;
    } else {
      this.no_doc_existente = false;
    }
  }

  async getDocumento() {
    this.compraForm.controls['documento_id'].setValue(this.documento_id);
    let documento = await this.documentos_service.getDocumento(this.documento_id);
    if (documento.code) {
      this.documento = documento.data;
      if (this.documento.sucursal_id) {
        await this.setDocumento();
      } else {
        await this.getSucursales();
      }

      let d: any = localStorage.getItem(`carrito${this.documento_id}`);
      this.compras_detalles = JSON.parse(d) || [];
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
      this.compraForm.controls['moneda_id'].setValue([this.monedas[0]]);
      this.setCambio(this.monedas[0]);
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

  async getTarjetas() {
    let tarjetas = await this.proveedores_service.getProveedores({
      tarjeta_credito: true
    });
    this.tarjetas = tarjetas.data;
  }

  async getCajasChicas() {
    let cajas_chicas = await this.cajas_chicas_service.getCajasChicas({ estado: 'ABIERTA' });
    if (cajas_chicas.code) {
      this.cajas_chicas = cajas_chicas.data;
    }
  }

  async getBodegasBySucursal(id: any) {
    this.compraForm.controls['bodega_id'].setValue(null);
    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }
  }

  async setDocumento() {
    this.compraForm.controls['sucursal_id'].setValue([this.documento.sucursal]);
    this.pagoForm.controls['metodo'].setValue(['Efectivo']);
    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.compraForm.controls['bodega_id'].setValue([this.documento.bodega]);
    } else {
      this.compraForm.controls['bodega_id'].setValue(null);
    }

  }

  async setOrdenCompra(c: any) {
    this.view_carrito = false;
    this.ngxService.start();
    let orden_compra = await this.ordenes_compras_service.getOrdenCompra(c.id);
    if (orden_compra.code) {
      delete orden_compra.data.fecha;
      this.compraForm.patchValue(orden_compra.data);
      this.compraForm.controls['sucursal_id'].setValue([orden_compra.data.sucursal]);
      this.compraForm.controls['bodega_id'].setValue([orden_compra.data.bodega]);
      this.compraForm.controls['moneda_id'].setValue([orden_compra.data.moneda]);
      this.compraForm.controls['usuario_id'].setValue(localStorage.getItem('usuario_id'));
      this.compraForm.controls['orden_compra'].setValue(c.serie + '-' + c.correlativo);
      this.compraForm.controls['orden_compra_id'].setValue(c.id);
      this.proveedorForm.patchValue(orden_compra.data.proveedor);
      this.compras_detalles = orden_compra.data.ordenes_compras_detalles;
      for (let cd = 0; cd < this.compras_detalles.length; cd++) {
        delete this.compras_detalles[cd].id;
        this.compras_detalles[cd].logo = this.compras_detalles[cd].producto.logo
        this.compras_detalles[cd].tipo = this.compras_detalles[cd].producto.tipo_producto.nombre;
        this.compras_detalles[cd].equivalencias = this.compras_detalles[cd].producto.equivalencias.filter((e: any) => e.tipo === 'entrada');
        this.compras_detalles[cd].medida = this.compras_detalles[cd].medida;
        this.compras_detalles[cd].stock = 0;
      }
      await this.getInfoNit();
      $('#ordenes-compras').offcanvas('hide');
    }
    this.ngxService.stop();
    this.view_carrito = true;
  }

  addProveedor(i: any) {
    if (i.pequeno_contribuyente) {
      this.compraForm.controls['gravable'].setValue([{ id: 0, nombre: 'NO' }]);
      this.compraForm.controls['libro'].setValue([{ id: 1, nombre: 'SI' }]);
    } else {
      this.compraForm.controls['gravable'].setValue([{ id: 1, nombre: 'SI' }]);
      this.compraForm.controls['libro'].setValue([{ id: 1, nombre: 'SI' }]);
    }
    this.compraForm.controls['proveedor_id'].setValue(i.id);
    this.proveedorForm.patchValue(i);
    this.validarNoDoc();
  }

  addPago() {
    if (this.pagoForm.valid) {
      this.pagoForm.controls['metodo'].setValue(this.pagoForm.value.metodo[0]);
      if (this.pagoForm.value.metodo == 'Tarjeta') {
        if (this.pagoForm.value.tarjeta_id) {
          this.pagoForm.controls['tarjeta_id'].setValue(this.pagoForm.value.tarjeta_id[0].id);
        }
      } else {
        this.pagoForm.controls['tarjeta_id'].setValue(null);
      }

      this.pagos.push(this.pagoForm.value);

      if (this.pagoForm.value.metodo == 'Efectivo') {
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
      this.compraForm.controls['proveedor_id'].setValue(proveedor.data[0].id);
    } else {
      let info = await this.digifact_service.getInfoNit(nit);
      if (info.code && info.data.RESPONSE[0].NOMBRE) {

        proveedor = await this.proveedores_service.postProveedor({
          nit: nit,
          nombre: info.data.RESPONSE[0].NOMBRE
        });
        if (proveedor) {
          this.proveedorForm.patchValue(proveedor.data);
          this.compraForm.controls['proveedor_id'].setValue(proveedor.data.id);
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
    this.compras_detalles.forEach((d: any) => {
      total += parseFloat(ext ? d.descuento_ext : d.descuento);
    });
    return total;
  }

  getTotal(ext: any = null) {
    let total = 0;
    this.compras_detalles.forEach((d: any) => {
      total += parseFloat(ext ? d.total_ext : d.total);
    });
    return total;
  }

  getSubtotal(ext: any = null) {
    let subtotal = 0;
    this.compras_detalles.forEach((d: any) => {
      subtotal += parseFloat(ext ? d.subtotal_ext : d.subtotal);
    });
    return subtotal;
  }

  getImpuesto(ext: any = null) {
    let impuesto = 0;
    this.compras_detalles.forEach((d: any) => {
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

  async postCompra() {

    $('#btn_guardar').prop('disabled', true);
    this.ngxService.start();

    // Validar Fecha
    if (!this.fechaMax()) {
      return;
    }

    // Validar carrito
    for (let v = 0; v < this.compras_detalles.length; v++) {
      if (this.compras_detalles[v].cantidad <= 0) {
        return this.alertas_service.error(`Cantidad de producto ${this.compras_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.compras_detalles[v].costo <= 0) {
        return this.alertas_service.error(`Costo de producto ${this.compras_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.compras_detalles[v].descripcion == '') {
        return this.alertas_service.error(`Descripción de producto es un campo obligatorio`, true);
      }
    }


    // Validar No Documento
    if (!this.compraForm.value.no_doc) {
      return this.alertas_service.error('No. Documento es un campo obligatorio', true);
    }
    if (this.no_doc_existente) {
      return this.alertas_service.error('No. Documento ya existe', true);
    }

    // Validar Pago
    if (this.compraForm.value.tipo_pago == 'CONTADO' && this.getPagado() < parseFloat(this.getTotal().toFixed(2))) {
      return this.alertas_service.error(`${this.getCambio()} de monto pendiente`, true);
    }

    if (!this.compraForm.value.bodega_id || this.compraForm.value.bodega_id.length == 0) {
      return this.alertas_service.error(`Bodega es un campo obligatorio`, true);
    }
    if (!this.compraForm.value.sucursal_id || this.compraForm.value.sucursal_id.length == 0) {
      return this.alertas_service.error(`Sucursal es un campo obligatorio`, true);
    }
    if (!this.compraForm.value.moneda_id || this.compraForm.value.moneda_id.length == 0) {
      return this.alertas_service.error(`Moneda es un campo obligatorio`, true);
    }
    if (!this.compraForm.value.proveedor_id || this.compraForm.value.proveedor_id.length == 0) {
      return this.alertas_service.error(`Proveedor es un campo obligatorio`, true);
    }
    if (!this.compraForm.value.documento_id || this.compraForm.value.documento_id.length == 0) {
      return this.alertas_service.error(`Documento es un campo obligatorio`, true);
    }

    this.compraForm.controls['bodega_id'].setValue(this.compraForm.controls['bodega_id'].value[0].id);
    this.compraForm.controls['sucursal_id'].setValue(this.compraForm.controls['sucursal_id'].value[0].id);
    this.compraForm.controls['moneda_id'].setValue(this.compraForm.controls['moneda_id'].value[0].id);
    this.compraForm.controls['orden_compra_id'].setValue(this.compraForm.value.orden_compra_id);
    if (this.compraForm.controls['caja_chica_id'].value && this.compraForm.controls['caja_chica_id'].value.length > 0) {
      this.compraForm.controls['caja_chica_id'].setValue(this.compraForm.controls['caja_chica_id'].value[0].id);
    } else {
      this.compraForm.controls['caja_chica_id'].setValue(null);
    }
    if (this.compraForm.controls['gravable'].value && this.compraForm.controls['gravable'].value.length > 0) {
      this.compraForm.controls['gravable'].setValue(this.compraForm.value.gravable[0].id);
    } else {
      this.compraForm.controls['gravable'].setValue(0);
    }
    if (this.compraForm.controls['libro'].value && this.compraForm.controls['libro'].value.length > 0) {
      this.compraForm.controls['libro'].setValue(this.compraForm.value.libro[0].id);
    } else {
      this.compraForm.controls['libro'].setValue(0);
    }
    this.compraForm.controls['documento_id'].setValue(this.documento.id);
    this.compraForm.controls['compras_detalles'].setValue(this.compras_detalles);
    this.compraForm.controls['pagos'].setValue(this.pagos);

    this.compraForm.controls['descuento'].setValue(this.getDescuento());
    this.compraForm.controls['total'].setValue(this.getTotal());
    this.compraForm.controls['subtotal'].setValue(this.getSubtotal());
    this.compraForm.controls['impuesto'].setValue(this.getImpuesto());

    // Conversion a moneda extranjera
    this.compraForm.controls['descuento_ext'].setValue(this.getDescuento(true));
    this.compraForm.controls['total_ext'].setValue(this.getTotal(true));
    this.compraForm.controls['subtotal_ext'].setValue(this.getSubtotal(true));
    this.compraForm.controls['impuesto_ext'].setValue(this.getImpuesto(true));

    let compra = await this.compras_service.postCompra(this.compraForm.value);
    if (compra.code) {

      await this.proveedores_service.putProveedor(this.compraForm.value.proveedor_id, {
        direccion: this.proveedorForm.controls['direccion'].value
      });

      localStorage.removeItem(`carrito${this.documento_id}`);
      this.alertas_service.success(compra.mensaje);
      this.ngxService.stop();
      this.location.back();
    }

    $('#btn_guardar').prop('disabled', false);
    this.ngxService.stop();
  }

  fechaMax() {
    if (this.compraForm.value.fecha > this.fecha_max) {
      this.alertas_service.error('Fecha no coincide con el mes actual', true);
      return false;
    }
    return true;
  }

  updateCarrito() {
    this.compras_detalles = JSON.parse(localStorage.getItem(`carrito${this.documento_id}`) || '[]');
  }

  setCambio(e: any) {
    let moneda = this.monedas.find((m: any) => m.id == e.id);
    this.compraForm.controls['tipo_cambio'].setValue(moneda.tipo_cambio);
    this.moneda_simbolo = moneda.simbolo;
  }

}

