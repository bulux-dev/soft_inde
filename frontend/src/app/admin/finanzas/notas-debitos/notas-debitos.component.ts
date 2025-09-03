import { Component } from '@angular/core';
import { NotasDebitosService } from '../../../services/notas_debitos.service';
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
  selector: 'app-notas_debitos',
  standalone: false,
  templateUrl: './notas-debitos.component.html',
  styleUrl: './notas-debitos.component.css'
})
export class NotasDebitosComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  notas_debitos: any = [];
  notas_debitos_lista: any = [];
  documentos: any = [];
  proveedores: any = [];
  cuentas_bancarias: any = [];
  estados: any = ['VIGENTE', 'ANULADA'];

  filtros: FormGroup = new FormGroup({
    serie: new FormControl(null),
    correlativo: new FormControl(null),
    no_nc: new FormControl(null),
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
    private notas_debitos_service: NotasDebitosService,
    private documentos_service: DocumentosService,
    private proveedores_service: ProveedoresService,
    private cuentas_bancarias_service: CuentasBancariasService,
    private sanitizer: DomSanitizer
  ) {

  }

  async ngOnInit() {
    await this.getNotasDebitos();
    await this.getCuentasBancarias();
    this.scripts_service.datatable();
  }

  async getNotasDebitos() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let proveedor = this.filtros.value.proveedor_id;
    let cuenta_bancaria = this.filtros.value.cuenta_bancaria_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor[0]?.id : null);
    this.filtros.controls['cuenta_bancaria_id'].setValue(cuenta_bancaria ? cuenta_bancaria[0]?.id : null);

    let notas_debitos = await this.notas_debitos_service.getNotasDebitos(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.notas_debitos = notas_debitos.data;
    this.notas_debitos_lista = notas_debitos.data;

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
        slug: 'nota_debito'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'nota_debito',
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
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/notas_debitos/doc/${c.id}?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteNotaDebito(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let nota_debito = await this.notas_debitos_service.deleteNotaDebito(c.id);
        if (nota_debito.code) {
          this.notas_debitos.splice(this.notas_debitos.indexOf(c), 1);
          this.alertas_service.success(nota_debito.mensaje);
        }
      }
    });
  }

  async anularNotaDebito(c: any) {
    this.alertas_service.anular().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.anularNotaDebito(c);
        return;
      }
      if (result.isConfirmed && result.value) {
        this.ngxService.start();
        let nota_debito = await this.notas_debitos_service.anularNotaDebito(c.id, {
          estado: 'ANULADA',
          fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
          motivo_anulacion: result.value,
          proveedor_id: c.proveedor_id
        });
        if (nota_debito.code) {
          this.notas_debitos[this.notas_debitos.indexOf(c)].estado = 'ANULADA';
          this.alertas_service.success(nota_debito.mensaje);
        }
        this.ngxService.stop();
      }
    });
  }

  getTotal() {
    let total = 0;
    this.notas_debitos.forEach((i: any) => {
      if (i.estado != 'ANULADO') {
        total += parseFloat(i.total);
      }
    })
    return total;
  }

  reporteNotasDebitos() {
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
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/depositos?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['proveedor_id'].setValue(proveedor ? proveedor : null);
    this.filtros.controls['cuenta_bancaria_id'].setValue(cuenta_bancaria ? cuenta_bancaria : null);
    this.ngxService.stop();

    this.search();
  }

  search() {
    let data = this.notas_debitos_lista.filter((v: any) => {
      return v.serie.toUpperCase().includes(this.busqueda.toUpperCase()) || 
      v.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      (v.serie + '-' + v.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.tipo_pago.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(v.total).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.proveedor.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(v.proveedor.nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(v.documento.nombre).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(v.cuenta_bancaria).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.no_nc.toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.notas_debitos = data;
  }

}

