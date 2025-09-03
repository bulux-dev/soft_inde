import { Component } from '@angular/core';
import { NDProveedoresService } from '../../../services/nd_proveedores.service';
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

declare var $: any;

@Component({
  selector: 'app-nd-proveedores',
  standalone: false,
  templateUrl: './nd-proveedores.component.html',
  styleUrl: './nd-proveedores.component.css'
})
export class NDProveedoresComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  nd_proveedores: any = [];
  nd_proveedores_lista: any = [];
  documentos: any = [];
  proveedores: any = [];
  estados: any = ['VIGENTE', 'ANULADA'];

  filtros: FormGroup = new FormGroup({
    serie: new FormControl(null),
    correlativo: new FormControl(null),
    no_nc: new FormControl(null),
    estado: new FormControl(null),
    documento_id: new FormControl(null),
    proveedor_id: new FormControl(null),
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
    private nd_proveedores_service: NDProveedoresService,
    private documentos_service: DocumentosService,
    private proveedores_service: ProveedoresService,
    private sanitizer: DomSanitizer
  ) {

  }

  async ngOnInit() {
    await this.getNDProveedores();
    this.scripts_service.datatable();
  }

  async getNDProveedores() {
    this.ngxService.start();

    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor [0]?.id : null);

    let nd_proveedores = await this.nd_proveedores_service.getNDProveedores(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.nd_proveedores = nd_proveedores.data;
    this.nd_proveedores_lista = this.nd_proveedores;

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor : null);

    this.ngxService.stop();

    this.search();
  }

  async getDocumentos() {
    let rol_id = localStorage.getItem('rol_id');
    if (rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'nd_proveedor'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'nd_proveedor',
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
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/nd_proveedores/doc/${c.id}?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteNDProveedor(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let nd_proveedor = await this.nd_proveedores_service.deleteNDProveedor(c.id);
        if (nd_proveedor.code) {
          this.nd_proveedores.splice(this.nd_proveedores.indexOf(c), 1);
          this.alertas_service.success(nd_proveedor.mensaje);
        }
      }
    });
  }

  async anularNDProveedor(c: any) {
    this.alertas_service.anular().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.anularNDProveedor(c);
        return;
      }
      if (result.isConfirmed && result.value) {
        let nd_proveedor = await this.nd_proveedores_service.anularNDProveedor(c.id, {
          estado: 'ANULADA',
          fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
          motivo_anulacion: result.value,
          proveedor_id: c.proveedor_id
        });
        if (nd_proveedor.code) {
          this.nd_proveedores[this.nd_proveedores.indexOf(c)].estado = 'ANULADA';
          this.alertas_service.success(nd_proveedor.mensaje);
        }
      }
    });
  }

  reporteNDProveedores() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor[0]?.id : null);

    let params = Object.keys(this.filtros.value).map(key => {
      return `${key}=${this.filtros.value[key]}`;
    }).join('&');
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/nd_proveedores?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor : null);
    this.ngxService.stop();

    this.search();
  }

  search() {
    let data = this.nd_proveedores_lista.filter((v: any) => {
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
    this.nd_proveedores = data;
  }

}

