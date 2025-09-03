import { Component } from '@angular/core';
import { NotasCreditosService } from '../../../services/notas_creditos.service';
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
import { CuentasBancariasService } from '../../../services/cuentas_bancarias.service';

declare var $: any;

@Component({
  selector: 'app-notas_creditos',
  standalone: false,
  templateUrl: './notas-creditos.component.html',
  styleUrl: './notas-creditos.component.css'
})
export class NotasCreditosComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  notas_creditos: any = [];
  notas_creditos_lista: any = [];
  documentos: any = [];
  clientes: any = [];
  cuentas_bancarias: any = [];
  estados: any = ['VIGENTE', 'ANULADA'];

  filtros: FormGroup = new FormGroup({
    serie: new FormControl(null),
    correlativo: new FormControl(null),
    no_nc: new FormControl(null),
    estado: new FormControl(null),
    documento_id: new FormControl(null),
    cliente_id: new FormControl(null),
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
    private notas_creditos_service: NotasCreditosService,
    private documentos_service: DocumentosService,
    private clientes_service: ClientesService,
    private cuentas_bancarias_service: CuentasBancariasService,
    private sanitizer: DomSanitizer
  ) {

  }

  async ngOnInit() {
    await this.getNotasCreditos();
    await this.getCuentasBancarias();
    this.scripts_service.datatable();
  }

  async getNotasCreditos() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let cliente = this.filtros.value.cliente_id;
    let cuenta_bancaria = this.filtros.value.cuenta_bancaria_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente[0]?.id : null);
    this.filtros.controls['cuenta_bancaria_id'].setValue(cuenta_bancaria ? cuenta_bancaria[0]?.id : null);

    let notas_creditos = await this.notas_creditos_service.getNotasCreditos(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.notas_creditos = notas_creditos.data;
    this.notas_creditos_lista = notas_creditos.data;

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    this.filtros.controls['cuenta_bancaria_id'].setValue(cuenta_bancaria ? cuenta_bancaria : null);
    this.ngxService.stop();

    this.search();
  }

  async getDocumentos() {
    let rol_id = localStorage.getItem('rol_id');
    if (rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'nota_credito'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'nota_credito',
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

  async getCuentasBancarias() {
    let cuentas_bancarias = await this.cuentas_bancarias_service.getCuentasBancarias();
    this.cuentas_bancarias = cuentas_bancarias.data;
  }

  closeOC() {
    $('#documentos').offcanvas('hide');
  }

  openDoc(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/notas_creditos/doc/${c.id}?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async deleteNotaCredito(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let nota_credito = await this.notas_creditos_service.deleteNotaCredito(c.id);
        if (nota_credito.code) {
          this.notas_creditos.splice(this.notas_creditos.indexOf(c), 1);
          this.alertas_service.success(nota_credito.mensaje);
        }
      }
    });
  }

  async anularNotaCredito(c: any) {
    this.alertas_service.anular().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.anularNotaCredito(c);
        return;
      }
      if (result.isConfirmed && result.value) {
        this.ngxService.start();
        let nota_credito = await this.notas_creditos_service.anularNotaCredito(c.id, {
          estado: 'ANULADA',
          fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
          motivo_anulacion: result.value,
          cliente_id: c.cliente_id
        });
        if (nota_credito.code) {
          this.notas_creditos[this.notas_creditos.indexOf(c)].estado = 'ANULADA';
          this.alertas_service.success(nota_credito.mensaje);
        }
        this.ngxService.stop();
      }
    });
  }

  getTotal() {
    let total = 0;
    this.notas_creditos.forEach((i: any) => {
      if (i.estado != 'ANULADO') {
        total += parseFloat(i.total);
      }
    })
    return total;
  }

  reporteNotasCreditos() {
    this.ngxService.start();
    let documento = this.filtros.value.documento_id;
    let cliente = this.filtros.value.cliente_id;
    let cuenta_bancaria = this.filtros.value.cuenta_bancaria_id;
    this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente[0]?.id : null);
    this.filtros.controls['cuenta_bancaria_id'].setValue(cuenta_bancaria ? cuenta_bancaria[0]?.id : null);

    let params = Object.keys(this.filtros.value).map(key => {
      return `${key}=${this.filtros.value[key]}`;
    }).join('&');
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/notas_creditos?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.filtros.controls['documento_id'].setValue(documento ? documento : null);
    this.filtros.controls['cliente_id'].setValue(cliente ? cliente : null);
    this.filtros.controls['cuenta_bancaria_id'].setValue(cuenta_bancaria ? cuenta_bancaria : null);
    this.ngxService.stop();

    this.search();
  }

  search() {
    let data = this.notas_creditos_lista.filter((v: any) => {
      return v.serie.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.correlativo.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        (v.serie + '-' + v.correlativo).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.tipo_pago.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.total).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.cliente.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.cliente.nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.estado.toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.documento.nombre).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        String(v.cuenta_bancaria).toUpperCase().includes(this.busqueda.toUpperCase()) ||
        v.no_nc.toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.notas_creditos = data;
  }

}

