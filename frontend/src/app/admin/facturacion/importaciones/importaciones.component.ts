import { Component } from '@angular/core';
import { ImportacionesService } from '../../../services/importaciones.service';
import { AlertasService } from '../../../services/alertas.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DocumentosService } from '../../../services/documentos.service';
import { AppComponent } from '../../../app.component';
import moment from 'moment';
import { ProveedoresService } from '../../../services/proveedores.service';
import { EtiquetasService } from '../../../services/etiquetas.service';
import { OperacionesEtiquetasService } from '../../../services/operaciones_etiquetas.service';
import { AdminComponent } from '../../admin.component';
import { TiposGastosService } from '../../../services/tipos_gastos.service';

declare var $: any;

@Component({
  selector: 'app-importaciones',
  standalone: false,
  templateUrl: './importaciones.component.html',
  styleUrl: './importaciones.component.css'
})
export class ImportacionesComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  get selectM() {
    return AppComponent.selectM;
  }

  rol_id: any = localStorage.getItem('rol_id');
  usuario_id: any = localStorage.getItem('usuario_id');

  importaciones: any = [];
  importaciones_lista: any = [];
  documentos: any = [];
  proveedores: any = [];
  etiquetas: any = [];
  operaciones_etiquetas: any = [];
  importaciones_gastos: any = [];
  tipos_gastos: any = [];

  estados: any = ['VIGENTE', 'ANULADA'];
  tipos_pagos: any = ['CONTADO', 'CREDITO'];
  tipos_prorrateos: any = ['AL INVENTARIO', 'AL VALOR', 'AL PESO'];
  filtros: FormGroup = new FormGroup({
    serie: new FormControl(null),
    correlativo: new FormControl(null),
    no_doc: new FormControl(null),
    estado: new FormControl(null),
    tipo_pago: new FormControl(null),
    tipo_prorrateo: new FormControl(null),
    documento_id: new FormControl(null),
    proveedor_id: new FormControl(null)
  })

  documento: any;
  importacion: any;
  token = localStorage.getItem('token');
  apiUrl: any = environment.api;
  url: any;

  fecha_inicio: any = moment().startOf('day').format('YYYY-MM-DD 00:00');
  fecha_fin: any = moment().endOf('day').format('YYYY-MM-DD 23:59');
  busqueda: any = null;

  tipoGastoForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null)
  });

  constructor(
    private ngxService: NgxUiLoaderService,
    private alertas_service: AlertasService,
    private importaciones_service: ImportacionesService,
    private documentos_service: DocumentosService,
    private proveedores_service: ProveedoresService,
    private etiquetas_service: EtiquetasService,
    private operaciones_etiquetas_service: OperacionesEtiquetasService,
    private tipos_gastos_service: TiposGastosService,
    private sanitizer: DomSanitizer
  ) {

  }

  async ngOnInit() {
    await this.getImportaciones();
    await this.getEtiquetas();
  }

  async getImportaciones() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor[0]?.id : null);

    let importaciones = await this.importaciones_service.getImportaciones(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.importaciones = importaciones.data;
    this.importaciones_lista = importaciones.data;

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor : null);
    this.ngxService.stop();

    if (this.busqueda) {
      this.search();
    }
  }

  async getDocumentos() {
    this.validInv();
    if (this.rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'importacion'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'importacion',
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

  async getTiposGastos() {
    let tipo_gasto = await this.tipos_gastos_service.getTiposGastos({
    });
    this.tipos_gastos = tipo_gasto.data;
  }

  async postTipoGasto() {
    let tipo_gasto = await this.tipos_gastos_service.postTipoGasto(this.tipoGastoForm.value);
    if (tipo_gasto.code) {
      this.alertas_service.success(tipo_gasto.mensaje);
      this.tipoGastoForm.reset();
      await this.getTiposGastos();
    }
  }

  async setTipoGasto(t: any) {
    this.tipoGastoForm.setValue({
      id: t.id,
      nombre: t.nombre
    });
  }

  async putTipoGasto() {
    let tipo_gasto = await this.tipos_gastos_service.putTipoGasto(this.tipoGastoForm.value.id, this.tipoGastoForm.value);
    if (tipo_gasto.code) {
      this.alertas_service.success(tipo_gasto.mensaje);
      this.tipoGastoForm.reset();
      this.getTiposGastos();
    }
  }

  async deleteTipoGasto(t: any) {
      this.alertas_service.eliminar().then(async (result: any) => {
        if (result.isConfirmed) {
          let tipo_gasto = await this.tipos_gastos_service.deleteTipoGasto(t.id);
          if (tipo_gasto.code) {
            this.tipos_gastos.splice(this.tipos_gastos.indexOf(t), 1);
            this.alertas_service.success(this.tipos_gastos.mensaje);
          }
        }
      });
  }

  closeOC() {
    $('#documentos').offcanvas('hide');
  }

  openDoc(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/importaciones/doc/${c.id}?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteImportacion(c: any) {
    if (this.validInv()) {
      this.alertas_service.eliminar().then(async (result: any) => {
        if (result.isConfirmed) {
          let importacion = await this.importaciones_service.deleteImportacion(c.id);
          if (importacion.code) {
            this.importaciones.splice(this.importaciones.indexOf(c), 1);
            this.alertas_service.success(importacion.mensaje);
          }
        }
      });
    }
  }

  async anularImportacion(c: any) {
    if (this.validInv()) {
      this.alertas_service.anular().then(async (result: any) => {
        if (result.isConfirmed && !result.value) {
          await this.anularImportacion(c);
          return;
        }
        if (result.isConfirmed && result.value) {
          this.ngxService.start();
          let importacion = await this.importaciones_service.anularImportacion(c.id, {
            estado: 'ANULADA',
            fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
            motivo_anulacion: result.value,
            proveedor_id: c.proveedor_id
          });
          if (importacion.code) {
            this.importaciones[this.importaciones.indexOf(c)].estado = 'ANULADA';
            this.alertas_service.success(importacion.mensaje);
          }
          this.ngxService.stop();
        }
      });
    }
  }

  async getOperacionesEtiquetas(c: any) {
    this.operaciones_etiquetas = [];
    this.importacion = c;
    let operaciones_etiquetas = await this.operaciones_etiquetas_service.getOperacionesEtiquetas({
      importacion_id: c.id
    });
    operaciones_etiquetas.data.map((oe: any) => { oe.nombre = oe.etiqueta.nombre, oe.id = oe.etiqueta.id; });
    this.operaciones_etiquetas = operaciones_etiquetas.data;
  }



  async putOperacionesEtiquetas() {
    this.ngxService.start();
    let operacion_etiqueta = await this.operaciones_etiquetas_service.putOperacionEtiqueta(this.importacion.id, {
      operacion: 'importacion',
      operaciones_etiquetas: this.operaciones_etiquetas
    });
    if (operacion_etiqueta.code) {
      this.importaciones[this.importaciones.indexOf(this.importacion)].operaciones_etiquetas = this.operaciones_etiquetas;
      this.alertas_service.success(operacion_etiqueta.mensaje);
      $('#etiquetas').modal('hide');
    }
    this.ngxService.stop();
  }

  reporteImportaciones() {
    this.ngxService.start();

    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor[0]?.id : null);

    let params = Object.keys(this.filtros.value).map(key => {
      return `${key}=${this.filtros.value[key]}`;
    }).join('&');
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/importaciones?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor : null);
    this.ngxService.stop();
  }

  getTotal() {
    let total = 0;
    this.importaciones.forEach((i: any) => {
      if (i.estado != 'ANULADO') {
        total += parseFloat(i.total);
      }
    })
    return total;
  }

  search() {
    let data = this.importaciones_lista.filter((v: any) => {
      return v.serie.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        (v.serie + '-' + v.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.tipo_pago.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.tipo_prorrateo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.proveedor.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.proveedor.nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.total).toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.importaciones = data;
  }

  get inv() {
    return AdminComponent.inv
  }

  validInv() {
    if (!this.inv) {
      this.alertas_service.error(`Para continuar debe generar cierre de inventario del mes de ${moment().subtract(1, 'month').format('MMMM')}`);
      $('#documentos').offcanvas('hide');
      return false;
    }
    return true;
  }

}

