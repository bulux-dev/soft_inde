import { Component } from '@angular/core';
import { OrdenesComprasService } from '../../../services/ordenes_compras.service';
import { AlertasService } from '../../../services/alertas.service';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DocumentosService } from '../../../services/documentos.service';
import { AppComponent } from '../../../app.component';
import moment from 'moment';
import { ProveedoresService } from '../../../services/proveedores.service';
import { OperacionesEtiquetasService } from '../../../services/operaciones_etiquetas.service';
import { EtiquetasService } from '../../../services/etiquetas.service';

declare var $: any;

@Component({
  selector: 'app-ordenes-compras',
  standalone: false,
  templateUrl: './ordenes-compras.component.html',
  styleUrl: './ordenes-compras.component.css'
})
export class OrdenesComprasComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  get selectM() {
    return AppComponent.selectM;
  }

  rol_id: any = localStorage.getItem('rol_id');
  usuario_id: any = localStorage.getItem('usuario_id');

  ordenes_compras: any = [];
  ordenes_compras_lista: any = [];
  documentos: any = [];
  proveedores: any = [];
  etiquetas: any = [];
  operaciones_etiquetas: any = [];

  estados: any = ['VIGENTE', 'PENDIENTE', 'ANULADA'];
  tipos_pagos: any = ['CONTADO', 'CREDITO'];
  filtros: FormGroup = new FormGroup({
    serie: new FormControl(null),
    correlativo: new FormControl(null),
    no_doc: new FormControl(null),
    estado: new FormControl(null),
    tipo_pago: new FormControl(null),
    documento_id: new FormControl(null),
    proveedor_id: new FormControl(null)
  })

  documento: any;
  orden_compra: any;
  token = localStorage.getItem('token');
  apiUrl: any = environment.api;
  url: any;

  fecha_inicio: any = moment().startOf('day').format('YYYY-MM-DD 00:00');
  fecha_fin: any = moment().endOf('day').format('YYYY-MM-DD 23:59');
  busqueda: any = null;

  constructor(
    private ngxService: NgxUiLoaderService,
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private ordenes_compras_service: OrdenesComprasService,
    private documentos_service: DocumentosService,
    private proveedores_service: ProveedoresService,
    private etiquetas_service: EtiquetasService,
    private operaciones_etiquetas_service: OperacionesEtiquetasService,
    private sanitizer: DomSanitizer
  ) {

  }

  async ngOnInit() {
    await this.getOrdenesCompras();
    await this.getEtiquetas();
    this.scripts_service.datatable();
  }

  async getOrdenesCompras() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor[0]?.id : null);

    let ordenes_compras = await this.ordenes_compras_service.getOrdenesCompras(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.ordenes_compras = ordenes_compras.data;
    this.ordenes_compras_lista = ordenes_compras.data;

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor : null);
    this.ngxService.stop();

    if (this.busqueda) {
      this.search();      
    }
  }

  async getDocumentos() {
    if (this.rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'orden_compra'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'orden_compra',
        usuario_id: localStorage.getItem('usuario_id')
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    }
  }

  async getProveedores() {
    let proveedores = await this.proveedores_service.getProveedores();
    this.proveedores = proveedores.data;
    this.proveedores.forEach((p: any) => {
      p.nombre = `${p.nit} - ${p.nombre}`
    });
  }

  async getEtiquetas() {
    let etiquetas = await this.etiquetas_service.getEtiquetas({
      estado: true
    });
    this.etiquetas = etiquetas.data;
  }

  closeOC() {
    $('#documentos').offcanvas('hide');
  }

  openDoc(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/ordenes_compras/doc/${c.id}?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteOrdenCompra(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let orden_compra = await this.ordenes_compras_service.deleteOrdenCompra(c.id);
        if (orden_compra.code) {
          this.ordenes_compras.splice(this.ordenes_compras.indexOf(c), 1);
          this.alertas_service.success(orden_compra.mensaje);
        }
      }
    });
  }

  async anularOrdenCompra(c: any) {
    this.alertas_service.anular().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.anularOrdenCompra(c);
        return;
      }
      if (result.isConfirmed && result.value) {
        this.ngxService.start();
        let ordenes_compras = await this.ordenes_compras_service.anularOrdenCompra(c.id, {
          estado: 'ANULADA',
          fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
          motivo_anulacion: result.value
        });
        if (ordenes_compras.code) {
          this.ordenes_compras[this.ordenes_compras.indexOf(c)].estado = 'ANULADA';
          this.alertas_service.success(ordenes_compras.mensaje);
        }
        this.ngxService.stop();
      }
    });
  }

  async getOperacionesEtiquetas(c: any) {
    this.operaciones_etiquetas = [];
    this.orden_compra = c;
    let operaciones_etiquetas = await this.operaciones_etiquetas_service.getOperacionesEtiquetas({
      orden_compra_id: c.id
    });
    operaciones_etiquetas.data.map((oe: any) => { oe.nombre = oe.etiqueta.nombre, oe.id = oe.etiqueta.id; });
    this.operaciones_etiquetas = operaciones_etiquetas.data;    
  }

  async putOperacionesEtiquetas() {
    this.ngxService.start();    
    let operacion_etiqueta = await this.operaciones_etiquetas_service.putOperacionEtiqueta(this.orden_compra.id, {
      operacion: 'orden_compra',
      operaciones_etiquetas: this.operaciones_etiquetas
    });
    if (operacion_etiqueta.code) {
      this.ordenes_compras[this.ordenes_compras.indexOf(this.orden_compra)].operaciones_etiquetas = this.operaciones_etiquetas;
      this.alertas_service.success(operacion_etiqueta.mensaje);
      $('#etiquetas').modal('hide');
    }
    this.ngxService.stop();
  }

  reporteOrdenesCompras() {
    this.ngxService.start();

    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor[0]?.id : null);

    let params = Object.keys(this.filtros.value).map(key => {
      return `${key}=${this.filtros.value[key]}`;
    }).join('&');
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/ordenes_compras?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor : null);
    this.ngxService.stop();
  }

  getTotal() {
    let total = 0;
    this.ordenes_compras.forEach((i: any) => {
      if (i.estado != 'ANULADO') {
        total += parseFloat(i.total);
      }
    })
    return total;
  }

  search() {
    let data = this.ordenes_compras_lista.filter((v: any) => {
      return v.serie.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        (v.serie + '-' + v.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.tipo_pago.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.total).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.proveedor.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.proveedor.nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.estado.toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.ordenes_compras = data;
  }

}

