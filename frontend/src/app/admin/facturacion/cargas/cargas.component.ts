import { Component } from '@angular/core';
import { CargasService } from '../../../services/cargas.service';
import { AlertasService } from '../../../services/alertas.service';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DocumentosService } from '../../../services/documentos.service';
import { AppComponent } from '../../../app.component';
import moment from 'moment';
import { ProveedoresService } from '../../../services/proveedores.service';
import { AdminComponent } from '../../admin.component';

declare var $: any;

@Component({
  selector: 'app-cargas',
  standalone: false,
  templateUrl: './cargas.component.html',
  styleUrl: './cargas.component.css'
})
export class CargasComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  cargas: any = [];
  cargas_lista: any = [];
  documentos: any = [];
  proveedores: any = [];

  estados: any = ['VIGENTE', 'ANULADA'];
  filtros: FormGroup = new FormGroup({
    serie: new FormControl(null),
    correlativo: new FormControl(null),
    estado: new FormControl(null),
    documento_id: new FormControl(null),
    proveedor_id: new FormControl(null)
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
    private cargas_service: CargasService,
    private documentos_service: DocumentosService,
    private proveedores_service: ProveedoresService,
    private sanitizer: DomSanitizer
  ) {

  }

  get robots() {
    return AppComponent.robots;
  }

  async ngOnInit() {
    await this.getCargas();
    this.scripts_service.datatable();
  }

  async getCargas() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor[0]?.id : null);

    let cargas = await this.cargas_service.getCargas(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.cargas = cargas.data;
    this.cargas_lista = cargas.data;

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor : null);
    this.ngxService.stop();

    this.search();
  }

  async getDocumentos() {
    this.validInv();
    let rol_id = localStorage.getItem('rol_id');
    if (rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'carga'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'carga',
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

  closeOC() {
    $('#documentos').offcanvas('hide');
  }

  openDoc(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/cargas/doc/${c.id}?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteCarga(c: any) {
    if (this.validInv()) {
      this.alertas_service.eliminar().then(async (result: any) => {
        if (result.isConfirmed) {
          let carga = await this.cargas_service.deleteCarga(c.id);
          if (carga.code) {
            this.cargas.splice(this.cargas.indexOf(c), 1);
            this.alertas_service.success(carga.mensaje);
          }
        }
      });
    }
  }

  async anularCarga(c: any) {
    if (this.validInv()) {
      this.alertas_service.anular().then(async (result: any) => {
        if (result.isConfirmed && !result.value) {
          await this.anularCarga(c);
          return;
        }
        if (result.isConfirmed && result.value) {
          this.ngxService.start();
          let carga = await this.cargas_service.anularCarga(c.id, {
            estado: 'ANULADA',
            fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
            motivo_anulacion: result.value
          });
          if (carga.code) {
            this.cargas[this.cargas.indexOf(c)].estado = 'ANULADA';
            this.alertas_service.success(carga.mensaje);
          }
          this.ngxService.stop();
        }
      });
    }
  }

  reporteCargas() {
    this.ngxService.start();

    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor[0]?.id : null);

    let params = Object.keys(this.filtros.value).map(key => {
      return `${key}=${this.filtros.value[key]}`;
    }).join('&');
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/cargas?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor : null);
    this.ngxService.stop();
  }

  search() {
    let data = this.cargas_lista.filter((c: any) => {
      return c.serie.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        c.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        (c.serie + '-' + c.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        c.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        c.proveedor.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(c.proveedor.nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(c.documento.nombre).toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.cargas = data;
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

