import { Component } from '@angular/core';
import { PedidosService } from '../../../services/pedidos.service';
import { AlertasService } from '../../../services/alertas.service';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DocumentosService } from '../../../services/documentos.service';
import { AppComponent } from '../../../app.component';
import moment from 'moment';
import { EmpleadosService } from '../../../services/empleados.service';
import { ClientesService } from '../../../services/clientes.service';
import { EtiquetasService } from '../../../services/etiquetas.service';
import { OperacionesEtiquetasService } from '../../../services/operaciones_etiquetas.service';

declare var $: any;

@Component({
  selector: 'app-pedidos',
  standalone: false,
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  get selectM() {
    return AppComponent.selectM;
  }

  pedidos: any = [];
  pedidos_lista: any = [];
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
  pedido: any;
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
    private pedidos_service: PedidosService,
    private documentos_service: DocumentosService,
    private sanitizer: DomSanitizer,
    private clientes_service: ClientesService,
    private empleados_service: EmpleadosService,
    private etiquetas_service: EtiquetasService,
    private operaciones_etiquetas_service: OperacionesEtiquetasService
  ) {

  }

  async ngOnInit() {
    await this.getPedidos();
    await this.getEtiquetas();
    this.scripts_service.datatable();
  }

  async getPedidos() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let cliente = this.filtros.value.cliente_id;
    let empleado = this.filtros.value.empleado_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente[0]?.id : null);
    this.filtros.controls['empleado_id'].setValue(empleado ? empleado[0]?.id : null);

    let pedidos = await this.pedidos_service.getPedidos(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.pedidos = pedidos.data;
    this.pedidos_lista = pedidos.data;

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
        slug: 'pedido'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'pedido',
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
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/pedidos/doc/${v.id}?tipo=pdf&token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  openTicket(v: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/pedidos/doc/${v.id}?tipo=ticket&token=${this.token}`);
    $('#ticket').offcanvas('show');
    this.ngxService.stop();
  }

  async deletePedido(v: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let pedido = await this.pedidos_service.deletePedido(v.id);
        if (pedido.code) {
          this.pedidos.splice(this.pedidos.indexOf(v), 1);
          this.alertas_service.success(pedido.mensaje);
        }
      }
    });
  }

  async anularPedido(v: any) {
    this.alertas_service.anular().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.anularPedido(v);
        return;
      }
      if (result.isConfirmed && result.value) {
        this.ngxService.start();
        let pedido = await this.pedidos_service.anularPedido(v.id, {
          estado: 'ANULADO',
          fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
          motivo_anulacion: result.value
        });
        if (pedido.code) {
          this.pedidos[this.pedidos.indexOf(v)].estado = 'ANULADO';
          this.alertas_service.success(pedido.mensaje);
        }
        this.ngxService.stop();
      }
    });
  }

  async getOperacionesEtiquetas(c: any) {
    this.operaciones_etiquetas = [];
    this.pedido = c;
    let operaciones_etiquetas = await this.operaciones_etiquetas_service.getOperacionesEtiquetas({
      pedido_id: c.id
    });
    operaciones_etiquetas.data.map((oe: any) => { oe.nombre = oe.etiqueta.nombre, oe.id = oe.etiqueta.id; });
    this.operaciones_etiquetas = operaciones_etiquetas.data;    
  }

  async putOperacionesEtiquetas() {
    this.ngxService.start();    
    let operacion_etiqueta = await this.operaciones_etiquetas_service.putOperacionEtiqueta(this.pedido.id, {
      operacion: 'pedido',
      operaciones_etiquetas: this.operaciones_etiquetas
    });
    if (operacion_etiqueta.code) {
      this.pedidos[this.pedidos.indexOf(this.pedido)].operaciones_etiquetas = this.operaciones_etiquetas;
      this.alertas_service.success(operacion_etiqueta.mensaje);
      $('#etiquetas').modal('hide');
    }
    this.ngxService.stop();
  }

  reportePedidos() {
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
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/pedidos?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    this.filtros.controls['empleado_id'].setValue(empleado ? empleado : null);

    this.ngxService.stop();
  }

  getTotal() {
    let total = 0;
    this.pedidos.forEach((i: any) => {
      if (i.estado != 'ANULADO') {
        total += parseFloat(i.total);
      }
    })
    return total;
  }

  search() {
    let data = this.pedidos_lista.filter((v: any) => {
      return v.serie.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        (v.serie + '-' + v.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.tipo_pago.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.cliente.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.cliente.nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.total).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.documento.nombre).toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.pedidos = data;
  }

}

