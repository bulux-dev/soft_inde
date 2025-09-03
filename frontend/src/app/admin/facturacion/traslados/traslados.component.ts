import { Component } from '@angular/core';
import { TrasladosService } from '../../../services/traslados.service';
import { AlertasService } from '../../../services/alertas.service';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DocumentosService } from '../../../services/documentos.service';
import { AppComponent } from '../../../app.component';
import moment from 'moment';
import { SucursalesService } from '../../../services/sucursales.service';
import { BodegasService } from '../../../services/bodegas.service';
import { AdminComponent } from '../../admin.component';

declare var $: any;

@Component({
  selector: 'app-traslados',
  standalone: false,
  templateUrl: './traslados.component.html',
  styleUrl: './traslados.component.css'
})
export class TrasladosComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  traslados: any = [];
  traslados_lista: any = [];
  documentos: any = [];
  estados: any = ['VIGENTE', 'ANULADA'];

  filtros: FormGroup = new FormGroup({
    serie: new FormControl(null),
    correlativo: new FormControl(null),
    estado: new FormControl(null),
    documento_id: new FormControl(null),
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
    private traslados_service: TrasladosService,
    private documentos_service: DocumentosService,
    private sanitizer: DomSanitizer,
  ) {

  }

  async ngOnInit() {
    await this.getTraslados();
    this.scripts_service.datatable();
  }

  async getTraslados() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);

    let traslados = await this.traslados_service.getTraslados(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.traslados = traslados.data;
    this.traslados_lista = traslados.data;

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.ngxService.stop();

    this.search();
  }

  async getDocumentos() {
    this.validInv();
    let rol_id = localStorage.getItem('rol_id');
    if (rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'traslado'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'traslado',
        usuario_id: localStorage.getItem('usuario_id')
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    }
  }



  closeOC() {
    $('#documentos').offcanvas('hide');
  }

  openDoc(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/traslados/doc/${c.id}?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteTraslado(c: any) {
    if (this.validInv()) {
      this.alertas_service.eliminar().then(async (result: any) => {
        if (result.isConfirmed) {
          let traslado = await this.traslados_service.deleteTraslado(c.id);
          if (traslado.code) {
            this.traslados.splice(this.traslados.indexOf(c), 1);
            this.alertas_service.success(traslado.mensaje);
          }
        }
      });
    }
  }

  async anularTraslado(c: any) {
    if (this.validInv()) {
      this.alertas_service.anular().then(async (result: any) => {
        if (result.isConfirmed && !result.value) {
          await this.anularTraslado(c);
          return;
        }
        if (result.isConfirmed && result.value) {
          this.ngxService.start();
          let traslado = await this.traslados_service.anularTraslado(c.id, {
            estado: 'ANULADO',
            fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
            motivo_anulacion: result.value
          });
          if (traslado.code) {
            this.traslados[this.traslados.indexOf(c)].estado = 'ANULADO';
            this.alertas_service.success(traslado.mensaje);
          }
          this.ngxService.stop();
        }
      });
    }
  }

  reporteTraslados() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);

    let params = Object.keys(this.filtros.value).map(key => {
      return `${key}=${this.filtros.value[key]}`;
    }).join('&');
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/traslados?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);

    this.ngxService.stop();
  }

  search() {
    let data = this.traslados_lista.filter((v: any) => {
      return v.serie.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        (v.serie + '-' + v.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.total).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.documento.nombre).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.sucursal_entrada.nombre).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.sucursal_salida.nombre).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.bodega_entrada.nombre).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.bodega_salida.nombre).toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.traslados = data;
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

