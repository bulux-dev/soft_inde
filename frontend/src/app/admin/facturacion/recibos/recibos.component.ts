import { Component } from '@angular/core';
import { RecibosService } from '../../../services/recibos.service';
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

declare var $: any;

@Component({
  selector: 'app-recibos',
  standalone: false,
  templateUrl: './recibos.component.html',
  styleUrl: './recibos.component.css'
})
export class RecibosComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  get selectM() {
    return AppComponent.selectM;
  }

  recibos: any = [];
  recibos_lista: any = [];
  documentos: any = [];
  clientes: any = [];
  empleados: any = [];

  estados: any = ['VIGENTE', 'ANULADO'];
  filtros: FormGroup = new FormGroup({
    serie: new FormControl(null),
    correlativo: new FormControl(null),
    estado: new FormControl(null),
    documento_id: new FormControl(null),
    cliente_id: new FormControl(null)
  })

  documento: any;
  token = localStorage.getItem('token');
  apiUrl: any = environment.api;
  url: any;

  fecha_inicio: any = moment().startOf('day').format('YYYY-MM-DD 00:00');
  fecha_fin: any = moment().endOf('day').format('YYYY-MM-DD 23:59')
  busqueda: any = null;

  constructor(
    private ngxService: NgxUiLoaderService,
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private recibos_service: RecibosService,
    private documentos_service: DocumentosService,
    private clientes_service: ClientesService,
    private empleados_service: EmpleadosService,
    private sanitizer: DomSanitizer
  ) {

  }

  async ngOnInit() {
    await this.getRecibos();
    this.scripts_service.datatable();
  }

  async getRecibos() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let cliente = this.filtros.value.cliente_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente[0]?.id : null);

    let recibos = await this.recibos_service.getRecibos(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.recibos = recibos.data;
    this.recibos_lista = recibos.data;

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    this.ngxService.stop();

    if (this.busqueda) {
      this.search();
    }
  }

  async getDocumentos() {
    let rol_id = localStorage.getItem('rol_id');
    if (rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'recibo'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'recibo',
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

  closeOC() {
    $('#documentos').offcanvas('hide');
  }

  openDoc(r: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/recibos/doc/${r.id}?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteRecibo(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let recibo = await this.recibos_service.deleteRecibo(c.id);
        if (recibo.code) {
          this.recibos.splice(this.recibos.indexOf(c), 1);
          this.alertas_service.success(recibo.mensaje);
        }
      }
    });
  }

  async anularRecibo(r: any) {
    this.alertas_service.anular().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.anularRecibo(r);
        return;
      }
      if (result.isConfirmed && result.value) {
        this.ngxService.start();
        let recibo = await this.recibos_service.anularRecibo(r.id, {
          estado: 'ANULADO',
          fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
          motivo_anulacion: result.value,
          cliente_id: r.cliente_id
        });
        if (recibo.code) {
          this.recibos[this.recibos.indexOf(r)].estado = 'ANULADO';
          this.alertas_service.success(recibo.mensaje);
        }
        this.ngxService.stop();
      }
    });
  }

  reporteRecibos() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let cliente = this.filtros.value.cliente_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente[0]?.id : null);

    let params = Object.keys(this.filtros.value).map(key => {
      return `${key}=${this.filtros.value[key]}`;
    }).join('&');
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/recibos?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    
    this.ngxService.start();
  }

  getTotal() {
    let total = 0;
    this.recibos.forEach((i: any) => {
      if (i.estado != 'ANULADO') {
        total += parseFloat(i.total);
      }
    })
    return total;
  }

  search() {
    let data = this.recibos_lista.filter((v: any) => {
      return v.serie.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        (v.serie + '-' + v.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.cliente.nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.total).toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.recibos = data;
  }

}

