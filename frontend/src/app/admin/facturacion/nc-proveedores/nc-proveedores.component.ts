import { Component } from '@angular/core';
import { NCProveedoresService } from '../../../services/nc_proveedores.service';
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
  selector: 'app-nc-proveedores',
  standalone: false,
  templateUrl: './nc-proveedores.component.html',
  styleUrl: './nc-proveedores.component.css'
})
export class NCProveedoresComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  nc_proveedores: any = [];
  nc_proveedores_lista: any = [];
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
    private nc_proveedores_service: NCProveedoresService,
    private documentos_service: DocumentosService,
    private proveedores_service: ProveedoresService,
    private sanitizer: DomSanitizer
  ) {

  }

  async ngOnInit() {
    await this.getNCProveedores();
    this.scripts_service.datatable();
  }

  async getNCProveedores() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor [0]?.id : null);

    let nc_proveedores = await this.nc_proveedores_service.getNCProveedores(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.nc_proveedores = nc_proveedores.data;
    this.nc_proveedores_lista = this.nc_proveedores;

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor : null);
    this.ngxService.stop();

    this.search();
  }

  async getDocumentos() {
    let rol_id = localStorage.getItem('rol_id');
    if (rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'nc_proveedor'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'nc_proveedor',
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
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/nc_proveedores/doc/${c.id}?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteNCProveedor(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let nc_proveedor = await this.nc_proveedores_service.deleteNCProveedor(c.id);
        if (nc_proveedor.code) {
          this.nc_proveedores.splice(this.nc_proveedores.indexOf(c), 1);
          this.alertas_service.success(nc_proveedor.mensaje);
        }
      }
    });
  }

  async anularNCProveedor(c: any) {
    this.alertas_service.anular().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.anularNCProveedor(c);
        return;
      }
      if (result.isConfirmed && result.value) {
        let nc_proveedor = await this.nc_proveedores_service.anularNCProveedor(c.id, {
          estado: 'ANULADA',
          fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
          motivo_anulacion: result.value,
          proveedor_id: c.proveedor_id
        });
        if (nc_proveedor.code) {
          this.nc_proveedores[this.nc_proveedores.indexOf(c)].estado = 'ANULADA';
          this.alertas_service.success(nc_proveedor.mensaje);
        }
      }
    });
  }

  reporteNCProveedores() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor[0]?.id : null);

    let params = Object.keys(this.filtros.value).map(key => {
      return `${key}=${this.filtros.value[key]}`;
    }).join('&');
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/nc_proveedores?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor : null);
    this.ngxService.stop();

    this.search();
  }

  search() {
    let data = this.nc_proveedores_lista.filter((v: any) => {
      return v.serie.toUpperCase().includes(this.busqueda.toUpperCase()) || 
      v.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      (v.serie + '-' + v.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.tipo_pago.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(v.total).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.proveedor.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(v.proveedor.nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(v.documento.nombre).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.no_nc.toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.nc_proveedores = data;
  }

}

