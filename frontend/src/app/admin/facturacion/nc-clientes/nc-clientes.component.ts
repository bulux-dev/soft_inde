import { Component } from '@angular/core';
import { NCClientesService } from '../../../services/nc_clientes.service';
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

declare var $: any;

@Component({
  selector: 'app-nc-clientes',
  standalone: false,
  templateUrl: './nc-clientes.component.html',
  styleUrl: './nc-clientes.component.css'
})
export class NCClientesComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  nc_clientes: any = [];
  nc_clientes_lista: any = [];
  documentos: any = [];
  clientes: any = [];
  estados: any = ['VIGENTE', 'ANULADA'];

  filtros: FormGroup = new FormGroup({
    serie: new FormControl(null),
    correlativo: new FormControl(null),
    no_nc: new FormControl(null),
    estado: new FormControl(null),
    documento_id: new FormControl(null),
    cliente_id: new FormControl(null),
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
    private nc_clientes_service: NCClientesService,
    private documentos_service: DocumentosService,
    private clientes_service: ClientesService,
    private sanitizer: DomSanitizer
  ) {

  }

  async ngOnInit() {
    await this.getNCClientes();
    this.scripts_service.datatable();
  }

  async getNCClientes() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let cliente = this.filtros.value.cliente_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente[0]?.id : null);


    let nc_clientes = await this.nc_clientes_service.getNCClientes(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.nc_clientes = nc_clientes.data;
    this.nc_clientes_lista = nc_clientes.data;

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    this.ngxService.stop();

    this.search();
  }

  async getDocumentos() {
    let rol_id = localStorage.getItem('rol_id');
    if (rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'nc_cliente'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'nc_cliente',
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

  closeOC() {
    $('#documentos').offcanvas('hide');
  }

  openDoc(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/nc_clientes/doc/${c.id}?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteNCCliente(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let nc_cliente = await this.nc_clientes_service.deleteNCCliente(c.id);
        if (nc_cliente.code) {
          this.nc_clientes.splice(this.nc_clientes.indexOf(c), 1);
          this.alertas_service.success(nc_cliente.mensaje);
        }
      }
    });
  }

  async anularNCCliente(c: any) {
    this.alertas_service.anular().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.anularNCCliente(c);
        return;
      }
      if (result.isConfirmed && result.value) {
        let nc_cliente = await this.nc_clientes_service.anularNCCliente(c.id, {
          estado: 'ANULADA',
          fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
          motivo_anulacion: result.value,
          cliente_id: c.cliente_id
        });
        if (nc_cliente.code) {
          this.nc_clientes[this.nc_clientes.indexOf(c)].estado = 'ANULADA';
          this.alertas_service.success(nc_cliente.mensaje);
        }
      }
    });
  }

  reporteNCClientes() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let cliente = this.filtros.value.cliente_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente[0]?.id : null);

    let params = Object.keys(this.filtros.value).map(key => {
      return `${key}=${this.filtros.value[key]}`;
    }).join('&');
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/nc_clientes?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    this.ngxService.stop();

    this.search();
  }

  search() {
    let data = this.nc_clientes_lista.filter((v: any) => {
      return v.serie.toUpperCase().includes(this.busqueda.toUpperCase()) || 
      v.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      (v.serie + '-' + v.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.tipo_pago.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(v.total).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.cliente.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(v.cliente.nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(v.documento.nombre).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.no_nc.toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.nc_clientes = data;
  }

}

