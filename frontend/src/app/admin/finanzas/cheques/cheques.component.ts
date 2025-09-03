import { Component } from '@angular/core';
import { ChequesService } from '../../../services/cheques.service';
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
import { CuentasBancariasService } from '../../../services/cuentas_bancarias.service';

declare var $: any;

@Component({
  selector: 'app-cheques',
  standalone: false,
  templateUrl: './cheques.component.html',
  styleUrl: './cheques.component.css'
})
export class ChequesComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  cheques: any = [];
  cheques_lista: any = [];
  documentos: any = [];
  proveedores: any = [];
  cuentas_bancarias: any = [];
  estados: any = ['VIGENTE', 'ANULADA'];

  filtros: FormGroup = new FormGroup({
    serie: new FormControl(null),
    correlativo: new FormControl(null),
    no_cheque: new FormControl(null),
    estado: new FormControl(null),
    documento_id: new FormControl(null),
    proveedor_id: new FormControl(null),
    cuenta_bancaria_id: new FormControl(null),
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
    private cheques_service: ChequesService,
    private documentos_service: DocumentosService,
    private proveedores_service: ProveedoresService,
    private cuentas_bancarias_service: CuentasBancariasService,
    private sanitizer: DomSanitizer
  ) {

  }

  async ngOnInit() {
    await this.getCheques();
    await this.getCuentasBancarias();
    this.scripts_service.datatable();
  }

  async getCheques() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    let cuenta_bancaria = this.filtros.value.cuenta_bancaria_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor [0]?.id : null);
    this.filtros.controls['cuenta_bancaria_id'].setValue(cuenta_bancaria ? cuenta_bancaria[0]?.id : null);

    let cheques = await this.cheques_service.getCheques(this.fecha_inicio, this.fecha_fin,this.filtros.value);
    this.cheques = cheques.data;
    this.cheques_lista = cheques.data;

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor : null);
    this.filtros.controls['cuenta_bancaria_id'].setValue(cuenta_bancaria ? cuenta_bancaria : null);
    this.ngxService.stop();

    this.search();
  }

  async getDocumentos() {
    let rol_id = localStorage.getItem('rol_id');
    if (rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'cheque'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'cheque',
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

  async getCuentasBancarias() {
    let cuentas_bancarias = await this.cuentas_bancarias_service.getCuentasBancarias();
    this.cuentas_bancarias = cuentas_bancarias.data;
  }

  closeOC() {
    $('#documentos').offcanvas('hide');
  }

  openDoc(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/cheques/doc/${c.id}?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteCheque(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let cheque = await this.cheques_service.deleteCheque(c.id);
        if (cheque.code) {
          this.cheques.splice(this.cheques.indexOf(c), 1);
          this.alertas_service.success(cheque.mensaje);
        }
      }
    });
  }

  async anularCheque(c: any) {
    this.alertas_service.anular().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.anularCheque(c);
        return;
      }
      if (result.isConfirmed && result.value) {
        this.ngxService.start();
        let cheque = await this.cheques_service.anularCheque(c.id, {
          estado: 'ANULADO',
          fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
          motivo_anulacion: result.value,
          proveedor_id: c.proveedor_id
        });
        if (cheque.code) {
          this.cheques[this.cheques.indexOf(c)].estado = 'ANULADO';
          this.alertas_service.success(cheque.mensaje);
        }
        this.ngxService.stop();
      }
    });
  }

  getTotal() {
    let total = 0;
    this.cheques.forEach((i: any) => {
      if (i.estado != 'ANULADO') {
        total += parseFloat(i.total);
      }
    })
    return total;
  }

  reporteCheques() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    let cuenta_bancaria = this.filtros.value.cuenta_bancaria_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor[0]?.id : null);
    this.filtros.controls['cuenta_bancaria_id'].setValue(cuenta_bancaria ? cuenta_bancaria[0]?.id : null);

    let params = Object.keys(this.filtros.value).map(key => {
      return `${key}=${this.filtros.value[key]}`;
    }).join('&');
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/cheques?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor : null);
    this.filtros.controls['cuenta_bancaria_id'].setValue(cuenta_bancaria ? cuenta_bancaria : null);
    this.ngxService.stop();

    this.search();
  }

  search() {
    let data = this.cheques_lista.filter((c: any) => {
      return c.serie.toUpperCase().includes(this.busqueda.toUpperCase()) || 
      c.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      (c.serie + '-' + c.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      c.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      c.proveedor.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(c.proveedor.nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      c.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(c.documento.nombre).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(c.cuenta_bancaria).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      c.no_cheque.toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.cheques = data;
  } 

}

