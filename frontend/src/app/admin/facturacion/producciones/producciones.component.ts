import { Component } from '@angular/core';
import { ProduccionesService } from '../../../services/producciones.service';
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

declare var $: any;

@Component({
  selector: 'app-producciones',
  standalone: false,
  templateUrl: './producciones.component.html',
  styleUrl: './producciones.component.css'
})
export class ProduccionesComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  get selectM() {
    return AppComponent.selectM;
  }

  rol_id: any = localStorage.getItem('rol_id');
  usuario_id: any = localStorage.getItem('usuario_id');

  producciones: any = [];
  producciones_lista: any = [];
  documentos: any = [];
  proveedores: any = [];
  etiquetas: any = [];
  operaciones_etiquetas: any = [];

  estados: any = ['VIGENTE', 'ANULADA'];
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
  produccion: any;
  token = localStorage.getItem('token');
  apiUrl: any = environment.api;
  url: any;

  fecha_inicio: any = moment().startOf('day').format('YYYY-MM-DD 00:00');
  fecha_fin: any = moment().endOf('day').format('YYYY-MM-DD 23:59');
  busqueda: any = null;

  constructor(
    private ngxService: NgxUiLoaderService,
    private alertas_service: AlertasService,
    private producciones_service: ProduccionesService,
    private documentos_service: DocumentosService,
    private proveedores_service: ProveedoresService,
    private etiquetas_service: EtiquetasService,
    private operaciones_etiquetas_service: OperacionesEtiquetasService,
    private sanitizer: DomSanitizer
  ) {

  }

  async ngOnInit() {
    await this.getProducciones();
    await this.getEtiquetas();
  }

  async getProducciones() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor[0]?.id : null);

    let producciones = await this.producciones_service.getProducciones(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.producciones = producciones.data;
    this.producciones_lista = producciones.data;

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
        slug: 'produccion'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'produccion',
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
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/producciones/doc/${c.id}?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteProduccion(c: any) {
    if (this.validInv()) {
      this.alertas_service.eliminar().then(async (result: any) => {
        if (result.isConfirmed) {
          let produccion = await this.producciones_service.deleteProduccion(c.id);
          if (produccion.code) {
            this.producciones.splice(this.producciones.indexOf(c), 1);
            this.alertas_service.success(produccion.mensaje);
          }
        }
      });
    }
  }

  async anularProduccion(c: any) {
    if (this.validInv()) {
      this.alertas_service.anular().then(async (result: any) => {
        if (result.isConfirmed && !result.value) {
          await this.anularProduccion(c);
          return;
        }
        if (result.isConfirmed && result.value) {
          this.ngxService.start();
          let produccion = await this.producciones_service.anularProduccion(c.id, {
            estado: 'ANULADA',
            fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
            motivo_anulacion: result.value,
            proveedor_id: c.proveedor_id
          });
          if (produccion.code) {
            this.producciones[this.producciones.indexOf(c)].estado = 'ANULADA';
            this.alertas_service.success(produccion.mensaje);
          }
          this.ngxService.stop();
        }
      }); 
    }
  }

  async getOperacionesEtiquetas(c: any) {
    this.operaciones_etiquetas = [];
    this.produccion = c;
    let operaciones_etiquetas = await this.operaciones_etiquetas_service.getOperacionesEtiquetas({
      produccion_id: c.id
    });
    operaciones_etiquetas.data.map((oe: any) => { oe.nombre = oe.etiqueta.nombre, oe.id = oe.etiqueta.id; });
    this.operaciones_etiquetas = operaciones_etiquetas.data;    
  }

  async putOperacionesEtiquetas() {
    this.ngxService.start();    
    let operacion_etiqueta = await this.operaciones_etiquetas_service.putOperacionEtiqueta(this.produccion.id, {
      operacion: 'produccion',
      operaciones_etiquetas: this.operaciones_etiquetas
    });
    if (operacion_etiqueta.code) {
      this.producciones[this.producciones.indexOf(this.produccion)].operaciones_etiquetas = this.operaciones_etiquetas;
      this.alertas_service.success(operacion_etiqueta.mensaje);
      $('#etiquetas').modal('hide');
    }
    this.ngxService.stop();
  }

  reporteProducciones() {
    this.ngxService.start();

    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor[0]?.id : null);

    let params = Object.keys(this.filtros.value).map(key => {
      return `${key}=${this.filtros.value[key]}`;
    }).join('&');
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/producciones?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor : null);
    this.ngxService.stop();
  }

  getTotal() {
    let total = 0;
    this.producciones.forEach((i: any) => {
      if (i.estado != 'ANULADO') {
        total += parseFloat(i.total);
      }
    })
    return total;
  }

  search() {
    let data = this.producciones_lista.filter((v: any) => {
      return v.serie.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        (v.serie + '-' + v.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.tipo_pago.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.proveedor.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.proveedor.nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.total).toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.producciones = data;
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

