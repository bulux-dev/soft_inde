import { Component } from '@angular/core';
import { CreditosService } from '../../../services/creditos.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DocumentosService } from '../../../services/documentos.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppComponent } from '../../../app.component';
import moment from 'moment';
import { AmortizacionesService } from '../../../services/amortizaciones.service';

declare var $: any;

@Component({
  selector: 'app-creditos',
  standalone: false,
  templateUrl: './creditos.component.html',
  styleUrl: './creditos.component.css'
})
export class CreditosComponent {

  get selectS() {
    return AppComponent.selectS;
  }
  mostrarInput: boolean = false;
  fecha_fin: any = moment().format('YYYY-MM');

  creditos: any = [];
  creditos_lista: any = [];
  documentos: any = [];
  amortizaciones: any = [];
  filtros: FormGroup = new FormGroup({
    fecha: new FormControl(null),
    fecha_inicio: new FormControl(null),
    fecha_fin: new FormControl(),
    interes_anual: new FormControl(null),
    interes_mensual: new FormControl(null),
    plazo_anos: new FormControl(null),
    plazo_meses: new FormControl(null),
    tipo_cuota: new FormControl(null),
    monto: new FormControl(null),
    estado: new FormControl(null)
  })

  credito: any;
  documento: any;
  token = localStorage.getItem('token');
  apiUrl: any = environment.api;
  url: any;

  fecha_inicio: any = moment().startOf('day').format('YYYY-MM-DD 00:00');
  fecha_f: any = moment().endOf('day').format('YYYY-MM-DD 23:59');
  busqueda: any = null;

  constructor(
    private ngxService: NgxUiLoaderService,
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private creditos_service: CreditosService,
    private documentos_service: DocumentosService,
    private sanitizer: DomSanitizer
  ) {
  }

  async ngOnInit() {
    await this.getCreditos();
    this.scripts_service.datatable();
  }

  toggleInput() {
    this.mostrarInput = !this.mostrarInput;
  }

  async getCreditos() {
    let creditos = await this.creditos_service.getCreditos(this.fecha_inicio, this.fecha_f, this.filtros.value);
    this.creditos = creditos.data;
    this.creditos_lista = creditos.data;
  }

  openDoc(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/creditos/doc/${c.id}?token=${this.token}`);
    $('#impresiones').modal('hide');
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  openCotizacion(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/creditos/cotizacion/${c.id}?token=${this.token}`);
    $('#impresiones').modal('hide');
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  openSolicitud(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/creditos/solicitud/${c.id}?token=${this.token}`);
    $('#impresiones').modal('hide');
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  openEstadoCuenta(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/creditos/estado-cuenta/${this.fecha_fin}/${c.id}?token=${this.token}`);
    $('#impresiones').modal('hide');
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  async aprobarCredito(c: any) {
    this.alertas_service.aprobado().then(async (result: any) => {
      if (result.isConfirmed) {
        let credito = await this.creditos_service.putCredito(c.id, { estado: 'VIGENTE' });
        if (credito.code) {
          this.creditos[this.creditos.indexOf(c)].estado = 'VIGENTE';
          this.alertas_service.success('Credito Aprobado');
        }
      }
    });
  }

  async deleteCredito(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let credito = await this.creditos_service.deleteCredito(c.id);
        if (credito.code) {
          this.creditos.splice(this.creditos.indexOf(c), 1);
          this.alertas_service.success(credito.mensaje);
        }
      }
    });
  }

  async anularCredito(c: any) {
    this.alertas_service.anular().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.anularCredito(c);
        return;
      }
      if (result.isConfirmed && result.value) {
        this.ngxService.start();
        let credito = await this.creditos_service.anularCredito(c.id, {
          estado: 'ANULADO',
          fecha_anulacion: moment().format('YYYY-MM-DD HH:mm'),
          motivo_anulacion: result.value
        });
        if (credito.code) {
          this.creditos[this.creditos.indexOf(c)].estado = 'ANULADO';
          this.alertas_service.success(credito.mensaje);
        }
        this.ngxService.stop();
      }
    });
  }

  async getDocumentos() {
    let rol_id = localStorage.getItem('rol_id');
    if (rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'venta'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'venta',
        usuario_id: localStorage.getItem('usuario_id')
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      } 
    }
  }

  formatoFecha(fecha: any, formato: string = 'DD/MM/YYYY') {
    return moment(fecha).format(formato);
  }

  search() {
    let data = this.creditos_lista.filter((v: any) => {
      return String(v.id).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(v.total).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.credito_detalle.compr_nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      String(v.credito_detalle.compr_nit).toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.credito_detalle.categoria.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.credito_detalle.empleado.nombre.toUpperCase().includes(this.busqueda.toUpperCase()) ||
      v.estado.toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.creditos = data;
  }

}

