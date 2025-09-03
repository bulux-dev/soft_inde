import { Component } from '@angular/core';
import { EnviosService } from '../../../services/envios.service';
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
import { AdminComponent } from '../../admin.component';

declare var $: any;

@Component({
  selector: 'app-envios',
  standalone: false,
  templateUrl: './envios.component.html',
  styleUrl: './envios.component.css'
})
export class EnviosComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  envios: any = [];
  envios_lista: any = [];
  documentos: any = [];
  clientes: any = [];
  empleados: any = [];
  estados: any = ['VIGENTE', 'ANULADA'];

  filtros: FormGroup = new FormGroup({
    serie: new FormControl(null),
    correlativo: new FormControl(null),
    estado: new FormControl(null),
    documento_id: new FormControl(null),
    cliente_id: new FormControl(null),
    empleado_id: new FormControl(null),
  })

  documento: any;
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
    private envios_service: EnviosService,
    private documentos_service: DocumentosService,
    private sanitizer: DomSanitizer,
    private clientes_service: ClientesService,
    private empleados_service: EmpleadosService
  ) {

  }

  async ngOnInit() {
    await this.getEnvios();
    this.scripts_service.datatable();
  }

  async getEnvios() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let cliente = this.filtros.value.cliente_id;
    let empleado = this.filtros.value.empleado_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente[0]?.id : null);
    this.filtros.controls['empleado_id'].setValue(empleado ? empleado[0]?.id : null);

    let envios = await this.envios_service.getEnvios(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.envios = envios.data;
    this.envios_lista = envios.data;

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    this.filtros.controls['empleado_id'].setValue(empleado ? empleado : null);
    this.ngxService.stop();

    this.search();
  }

  async getDocumentos() {
    this.validInv();
    let rol_id = localStorage.getItem('rol_id');
    if (rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'envio'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'envio',
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

  openDoc(v: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/envios/doc/${v.id}?tipo=pdf&token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  openTicket(v: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/envios/doc/${v.id}?tipo=ticket&token=${this.token}`);
    $('#ticket').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteEnvio(v: any) {
    if (this.validInv()) {
      this.alertas_service.eliminar().then(async (result: any) => {
        if (result.isConfirmed) {
          let envio = await this.envios_service.deleteEnvio(v.id);
          if (envio.code) {
            this.envios.splice(this.envios.indexOf(v), 1);
            this.alertas_service.success(envio.mensaje);
          }
        }
      });
    }
  }

  async anularEnvio(v: any) {
    if (this.validInv()) {
      this.alertas_service.anular().then(async (result: any) => {
        if (result.isConfirmed && !result.value) {
          await this.anularEnvio(v);
          return;
        }
        if (result.isConfirmed && result.value) {
          this.ngxService.start();
          let envio = await this.envios_service.anularEnvio(v.id, {
            estado: 'ANULADO',
            fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
            motivo_anulacion: result.value
          });
          if (envio.code) {
            this.envios[this.envios.indexOf(v)].estado = 'ANULADO';
            this.alertas_service.success(envio.mensaje);
          }
          this.ngxService.stop();
        }
      });
    }
  }

  reporteEnvios() {
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
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/envios?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    this.filtros.controls['empleado_id'].setValue(empleado ? empleado : null);

    this.ngxService.stop();
  }

  getTotal() {
    let total = 0;
    this.envios.forEach((i: any) => {
      if (i.estado != 'ANULADO') {
        total += parseFloat(i.total);
      }
    })
    return total;
  }

  search() {
    let data = this.envios_lista.filter((v: any) => {
      return v.serie.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        (v.serie + '-' + v.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.cliente.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.cliente.nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.total).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.documento.nombre).toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.envios = data;
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

