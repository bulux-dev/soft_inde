import { Component } from '@angular/core';
import { DescargasService } from '../../../services/descargas.service';
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
import { AdminComponent } from '../../admin.component';

declare var $: any;

@Component({
  selector: 'app-descargas',
  standalone: false,
  templateUrl: './descargas.component.html',
  styleUrl: './descargas.component.css'
})
export class DescargasComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  descargas: any = [];
  descargas_lista: any = [];
  documentos: any = [];
  clientes: any = [];

  estados: any = ['VIGENTE', 'ANULADA'];
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
  fecha_fin: any = moment().endOf('day').format('YYYY-MM-DD 23:59');
  busqueda: any = null;

  constructor(
    private ngxService: NgxUiLoaderService,
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private descargas_service: DescargasService,
    private documentos_service: DocumentosService,
    private clientes_service: ClientesService,
    private sanitizer: DomSanitizer
  ) {

  }

  async ngOnInit() {
    await this.getDescargas();
    this.scripts_service.datatable();
  }

  async getDescargas() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let cliente = this.filtros.value.cliente_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente[0]?.id : null);

    let descargas = await this.descargas_service.getDescargas(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.descargas = descargas.data;
    this.descargas_lista = descargas.data;

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    this.ngxService.stop();

    this.search();

  }

  async getDocumentos() {
    this.validInv();
    let rol_id = localStorage.getItem('rol_id');
    if (rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'descarga'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'descarga',
        usuario_id: localStorage.getItem('usuario_id')
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    }
  }

  async getClienes() {
    let clientes = await this.clientes_service.getClientes();
    this.clientes = clientes.data;
  }

  closeOC() {
    $('#documentos').offcanvas('hide');
  }

  openDoc(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/descargas/doc/${c.id}?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteDescarga(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let descarga = await this.descargas_service.deleteDescarga(c.id);
        if (descarga.code) {
          this.descargas.splice(this.descargas.indexOf(c), 1);
          this.alertas_service.success(descarga.mensaje);
        }
      }
    });
  }

  async anularDescarga(c: any) {
    this.alertas_service.anular().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.anularDescarga(c);
        return;
      }
      if (result.isConfirmed && result.value) {
        this.ngxService.start();
        let descarga = await this.descargas_service.anularDescarga(c.id, {
          estado: 'ANULADA',
          fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
          motivo_anulacion: result.value
        });
        if (descarga.code) {
          this.descargas[this.descargas.indexOf(c)].estado = 'ANULADA';
          this.alertas_service.success(descarga.mensaje);
        }
        this.ngxService.stop();
      }
    });
  }

  reporteDescargas() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let cliente = this.filtros.value.cliente_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente[0]?.id : null);

    let params = Object.keys(this.filtros.value).map(key => {
      return `${key}=${this.filtros.value[key]}`;
    }).join('&');
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/descargas?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    this.ngxService.stop();
  }

  search() {
    let data = this.descargas_lista.filter((c: any) => {
      return c.serie.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        c.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        (c.serie + '-' + c.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        c.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        c.cliente.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(c.cliente.nit).toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.descargas = data;
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

