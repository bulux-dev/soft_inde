import { Component } from '@angular/core';
import { CotizacionesService } from '../../../services/cotizaciones.service';
import { AlertasService } from '../../../services/alertas.service';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DocumentosService } from '../../../services/documentos.service';
import { AppComponent } from '../../../app.component';
import moment from 'moment';
import { ClientesService } from '../../../services/clientes.service';
import { EmpleadosService } from '../../../services/empleados.service';
import { EtiquetasService } from '../../../services/etiquetas.service';
import { OperacionesEtiquetasService } from '../../../services/operaciones_etiquetas.service';


declare var $: any;

@Component({
  selector: 'app-cotizaciones',
  standalone: false,
  templateUrl: './cotizaciones.component.html',
  styleUrl: './cotizaciones.component.css'
})
export class CotizacionesComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  get selectM() {
    return AppComponent.selectM;
  }

  cotizaciones: any = [];
  cotizaciones_lista: any = [];
  documentos: any = [];
  clientes: any = [];
  empleados: any = [];
  etiquetas: any = [];
  operaciones_etiquetas: any = [];
  
  estados: any = ['VIGENTE', 'PENDIENTE', 'ANULADA'];
  tipos_pagos: any = ['CONTADO', 'CREDITO'];
  filtros: FormGroup = new FormGroup({
    serie: new FormControl(null),
    correlativo: new FormControl(null),
    estado: new FormControl(null),
    tipo_pago: new FormControl(null),
    documento_id: new FormControl(null),
    cliente_id: new FormControl(null),
    empleado_id: new FormControl(null),
  })

  documento: any;
  cotizacion: any;
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
    private cotizaciones_service: CotizacionesService,
    private documentos_service: DocumentosService,
    private sanitizer: DomSanitizer,
    private clientes_service: ClientesService,
    private empleados_service: EmpleadosService,
    private etiquetas_service: EtiquetasService,
    private operaciones_etiquetas_service: OperacionesEtiquetasService
  ) {

  }

  async ngOnInit() {
    await this.getCotizaciones();
    await this.getEtiquetas();
    this.scripts_service.datatable();
  }

  async getCotizaciones() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let cliente = this.filtros.value.cliente_id;
    let empleado = this.filtros.value.empleado_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente[0]?.id : null);
    this.filtros.controls['empleado_id'].setValue(empleado ? empleado[0]?.id : null);

    let cotizaciones = await this.cotizaciones_service.getCotizaciones(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.cotizaciones = cotizaciones.data;
    this.cotizaciones_lista = cotizaciones.data;

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    this.filtros.controls['empleado_id'].setValue(empleado ? empleado : null);
    this.ngxService.stop();

    if (this.busqueda) {
      this.search();      
    }
  }

  async getDocumentos() {
    let rol_id = localStorage.getItem('rol_id');
    if (rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'cotizacion'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'cotizacion',
        usuario_id: localStorage.getItem('usuario_id')
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    }
  }

  async getClientes() {
    let clientes = await this.clientes_service.getClientes();
    this.clientes = clientes.data;
    this.clientes.forEach((p: any) => {
      p.nombre = `${p.nit} - ${p.nombre}`
    });
  }

  async getEmpleados() {
    let empleados = await this.empleados_service.getEmpleados({
      vendedor: true
    });
    this.empleados = empleados.data;
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

  openDoc(v: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/cotizaciones/doc/${v.id}?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteCotizacion(v: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let cotizacion = await this.cotizaciones_service.deleteCotizacion(v.id);
        if (cotizacion.code) {
          this.cotizaciones.splice(this.cotizaciones.indexOf(v), 1);
          this.alertas_service.success(cotizacion.mensaje);
        }
      }
    });
  }

  async anularCotizacion(v: any) {
    this.alertas_service.anular().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.anularCotizacion(v);
        return;
      }
      if (result.isConfirmed && result.value) {
        this.ngxService.start();
        let cotizacion = await this.cotizaciones_service.anularCotizacion(v.id, {
          estado: 'ANULADA',
          fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
          motivo_anulacion: result.value
        });
        if (cotizacion.code) {
          this.cotizaciones[this.cotizaciones.indexOf(v)].estado = 'ANULADA';
          this.alertas_service.success(cotizacion.mensaje);
        }
        this.ngxService.stop();
      }
    });
  }

  async getOperacionesEtiquetas(c: any) {
    this.operaciones_etiquetas = [];
    this.cotizacion = c;
    let operaciones_etiquetas = await this.operaciones_etiquetas_service.getOperacionesEtiquetas({
      cotizacion_id: c.id
    });
    operaciones_etiquetas.data.map((oe: any) => { oe.nombre = oe.etiqueta.nombre, oe.id = oe.etiqueta.id; });
    this.operaciones_etiquetas = operaciones_etiquetas.data;    
  }

  async putOperacionesEtiquetas() {
    this.ngxService.start();    
    let operacion_etiqueta = await this.operaciones_etiquetas_service.putOperacionEtiqueta(this.cotizacion.id, {
      operacion: 'cotizacion',
      operaciones_etiquetas: this.operaciones_etiquetas
    });
    if (operacion_etiqueta.code) {
      this.cotizaciones[this.cotizaciones.indexOf(this.cotizacion)].operaciones_etiquetas = this.operaciones_etiquetas;
      this.alertas_service.success(operacion_etiqueta.mensaje);
      $('#etiquetas').modal('hide');
    }
    this.ngxService.stop();
  }

  reporteCotizaciones() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let cliente = this.filtros.value.cliente_id;
    let empleado = this.filtros.value.empleado_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente[0]?.id : null);
    this.filtros.controls['empleado_id'].setValue(empleado ? empleado[0]?.id : null);

    let params = Object.keys(this.filtros.value).map(key => {
      return `${key}=${this.filtros.value[key]}`;
    }).join('&');
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/cotizaciones?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    this.filtros.controls['empleado_id'].setValue(empleado ? empleado : null);

    this.ngxService.stop();
  }

  getTotal() {
    let total = 0;
    this.cotizaciones.forEach((i: any) => {
      if (i.estado != 'ANULADA') {
        total += parseFloat(i.total);
      }
    })
    return total;
  }

  search() {
    let data = this.cotizaciones_lista.filter((v: any) => {
      return v.serie.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        (v.serie + '-' + v.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.tipo_pago.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.total).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.cliente.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.cliente.nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.documento.nombre).toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.cotizaciones = data;
  }

}

