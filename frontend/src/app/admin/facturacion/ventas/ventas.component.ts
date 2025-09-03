import { Component } from '@angular/core';
import { VentasService } from '../../../services/ventas.service';
import { AlertasService } from '../../../services/alertas.service';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DocumentosService } from '../../../services/documentos.service';
import { AppComponent } from '../../../app.component';
import { DigifactService } from '../../../services/digifact.service';
import moment from 'moment';
import { ClientesService } from '../../../services/clientes.service';
import { EmpleadosService } from '../../../services/empleados.service';
import { EtiquetasService } from '../../../services/etiquetas.service';
import { OperacionesEtiquetasService } from '../../../services/operaciones_etiquetas.service';
import { AdminComponent } from '../../admin.component';
import { ImpresorasService } from '../../../services/impresoras.service';

declare var $: any;
declare function quickPrint(data: any): any;

@Component({
  selector: 'app-ventas',
  standalone: false,
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  get selectM() {
    return AppComponent.selectM;
  }

  rol_id: any = localStorage.getItem('rol_id');
  usuario_id: any = localStorage.getItem('usuario_id');

  ventas: any = [];
  ventas_lista: any = [];
  documentos: any = [];
  clientes: any = [];
  empleados: any = [];
  etiquetas: any = [];
  operaciones_etiquetas: any = [];
  certificaciones: any = [];
  impresoras: any = [];

  estados: any = ['VIGENTE', 'ANULADA'];
  tipos_pagos: any = ['CONTADO', 'CREDITO'];
  filtros: FormGroup = new FormGroup({
    serie: new FormControl(null),
    correlativo: new FormControl(null),
    estado: new FormControl(null),
    tipo_pago: new FormControl(null),
    fel_numero: new FormControl(null),
    fel_serie: new FormControl(null),
    fel_autorizacion: new FormControl(null),
    documento_id: new FormControl(null),
    cliente_id: new FormControl(null),
    empleado_id: new FormControl(null),
  })

  documento: any;
  venta: any;
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
    private ventas_service: VentasService,
    private documentos_service: DocumentosService,
    private clientes_service: ClientesService,
    private sanitizer: DomSanitizer,
    private digifact_service: DigifactService,
    private empleados_service: EmpleadosService,
    private etiquetas_service: EtiquetasService,
    private operaciones_etiquetas_service: OperacionesEtiquetasService,
    private impresoras_service: ImpresorasService
  ) {

  }

  async ngOnInit() {
    await this.getVentas();
    await this.getEtiquetas();
    await this.getImpresoras();
    this.scripts_service.datatable();
    this.scripts_service.quickprint();
  }

  async getVentas() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let cliente = this.filtros.value.cliente_id;
    let empleado = this.filtros.value.empleado_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente[0]?.id : null);
    this.filtros.controls['empleado_id'].setValue(empleado ? empleado[0]?.id : null);

    let ventas = await this.ventas_service.getVentas(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.ventas = ventas.data;
    this.ventas_lista = ventas.data;

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    this.filtros.controls['empleado_id'].setValue(empleado ? empleado : null);
    this.ngxService.stop();

    if (this.busqueda) {
      this.search();
    }
  }

  async getDocumentos() {
    this.validInv();
    if (this.rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'venta'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'venta',
        usuario_id: this.usuario_id
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    }
  }

  async getImpresoras() {
    let impresoras = await this.impresoras_service.getImpresoras();
    this.impresoras = impresoras.data;
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
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/ventas/doc/${v.id}?tipo=pdf&token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  openTicket(v: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/ventas/doc/${v.id}?tipo=ticket&token=${this.token}`);
    $('#ticket').offcanvas('show');
    this.ngxService.stop();
  }

  openEnvio(v: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/ventas/doc/${v.id}?tipo=envio&token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteVenta(v: any) {
    if (this.validInv()) {
      this.alertas_service.eliminar().then(async (result: any) => {
        if (result.isConfirmed) {
          let venta = await this.ventas_service.deleteVenta(v.id);
          if (venta.code) {
            this.ventas.splice(this.ventas.indexOf(v), 1);
            this.alertas_service.success(venta.mensaje);
          }
        }
      });
    }
  }

  async anularVenta(v: any) {
    if (this.validInv()) {
      this.alertas_service.anular().then(async (result: any) => {
        if (result.isConfirmed && !result.value) {
          await this.anularVenta(v);
          return;
        }
        if (result.isConfirmed && result.value) {
          this.ngxService.start();

          v.fecha_anulacion = moment().format('YYYY-MM-DD HH:mm');
          if (v.fel_numero && v.fel_serie && v.fel_autorizacion && v.estado == 'VIGENTE') {
            let anulacion = await this.digifact_service.anulacionFel(v);
            if (anulacion.data.Codigo == 1) {

            } else if (anulacion.data.Codigo == 9019) {
              this.alertas_service.error(anulacion.data.Mensaje);
              this.ngxService.stop();
              return;
            } else {
              this.alertas_service.error(anulacion.data.ResponseDATA1);
              this.ngxService.stop();
              return;
            }
          }

          let venta = await this.ventas_service.anularVenta(v.id, {
            estado: 'ANULADA',
            fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
            motivo_anulacion: result.value,
            cliente_id: v.cliente_id
          });
          if (venta.code) {
            this.ventas[this.ventas.indexOf(v)].estado = 'ANULADA';
            this.alertas_service.success(venta.mensaje);
          }
          this.ngxService.stop();
        }
      });
    }
  }

  async getOperacionesEtiquetas(v: any) {
    this.operaciones_etiquetas = [];
    this.venta = v;
    let operaciones_etiquetas = await this.operaciones_etiquetas_service.getOperacionesEtiquetas({
      venta_id: v.id
    });
    operaciones_etiquetas.data.map((oe: any) => { oe.nombre = oe.etiqueta.nombre, oe.id = oe.etiqueta.id; });
    this.operaciones_etiquetas = operaciones_etiquetas.data;
  }

  async putOperacionesEtiquetas() {
    this.ngxService.start();
    let operacion_etiqueta = await this.operaciones_etiquetas_service.putOperacionEtiqueta(this.venta.id, {
      operacion: 'venta',
      operaciones_etiquetas: this.operaciones_etiquetas
    });
    if (operacion_etiqueta.code) {
      this.ventas[this.ventas.indexOf(this.venta)].operaciones_etiquetas = this.operaciones_etiquetas;
      this.alertas_service.success(operacion_etiqueta.mensaje);
      $('#etiquetas').modal('hide');
    }
    this.ngxService.stop();
  }

  reporteVentas() {
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
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/ventas?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    this.filtros.controls['empleado_id'].setValue(empleado ? empleado : null);

    this.ngxService.stop();
  }

  async getInfoDte() {
    this.ngxService.start();
    let info = await this.digifact_service.getInfoDte(moment(this.fecha_inicio).format('YYYY-MM-DD'));
    if (info.code && info.data.RESPONSE) {
      this.certificaciones = info.data.RESPONSE;

      let f_inicio = moment(this.fecha_inicio).startOf('day').format('YYYY-MM-DD HH:mm');
      let f_fin = moment(this.fecha_fin).endOf('day').format('YYYY-MM-DD HH:mm');
      let ventas = await this.ventas_service.getVentas(f_inicio, f_fin, this.filtros.value);
      for (let c = 0; c < this.certificaciones.length; c++) {
        for (let v = 0; v < ventas.data.length; v++) {
          if (this.certificaciones[c].SERIE == ventas.data[v].fel_serie) {
            this.certificaciones[c].SYNC = true;
          }
        }
      }

      $('#certificaciones').offcanvas('show');
    }
    this.ngxService.stop();
  }

  getTotal() {
    let total = 0;
    this.ventas.forEach((i: any) => {
      if (i.estado != 'ANULADA') {
        total += parseFloat(i.total);
      }
    })
    return total;
  }

  search() {
    let data = this.ventas_lista.filter((v: any) => {
      return v.serie.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        (v.serie + '-' + v.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.total).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.tipo_pago.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.cliente.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.cliente.nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.documento.nombre).toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.ventas = data;
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

  async setVenta(v: any) {
    let venta = await this.ventas_service.getVenta(v.id);
    this.venta = venta.data;
  }

  async printVenta(i: any) {
    
    let detalles: any = [];
    let items = '';
    for (let n = 0; n < detalles.length; n++) {
      items += `${AdminComponent.itemsTicket(i, parseInt(detalles[n].cantidad), detalles[n].descripcion, detalles[n].total)}\n`;
    }

    let imp = `
    
    ${AdminComponent.centerTicket(i, `VENTA ${this.venta.serie}-${this.venta.correlativo}`)}
    
      `;

    AdminComponent.print(i, imp);

  }

}

