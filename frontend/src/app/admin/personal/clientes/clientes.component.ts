import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ClientesService } from '../../../services/clientes.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SaldosService } from '../../../services/saldos.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {

  @Input() oc: any;
  @Output() newItemEvent = new EventEmitter<string>();

  clientes: any = [];
  clientes_lista: any = [];
  cxc: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    nit: new FormControl(null),
    cui: new FormControl(null),
    direccion: new FormControl(null),
    contacto: new FormControl(null),
    correo: new FormControl(null),
    telefono: new FormControl(null),
  })
  busqueda: any = null;

  token = localStorage.getItem('token');
  apiUrl: any = environment.api;
  url: any;

  fecha_inicio: any = moment().startOf('month').format('YYYY-MM-DD 00:00');
  fecha_fin: any = moment().endOf('month').format('YYYY-MM-DD 23:59');

  constructor(
    private router: Router,
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private clientes_service: ClientesService,
    private saldos_service: SaldosService,
    private ngxService: NgxUiLoaderService,
    private sanitizer: DomSanitizer
  ) {
  }

  async ngOnInit() {
    await this.getClientes();
    this.scripts_service.datatable();
  }

  async getClientes() {
    let clientes = await this.clientes_service.getClientes(this.filtros.value);
    this.clientes = clientes.data;
    this.clientes_lista = clientes.data;
  }

  async getCXC() {
    this.ngxService.start();
    let cxc = await this.saldos_service.getSaldosCXC();
    this.cxc = cxc.data
    this.ngxService.stop();
  }

  async setCXC(c: any) {
    this.ngxService.start();
    let cxc = await this.saldos_service.getSaldosCXCCliente(c.cliente_id);
    const index = this.cxc.findIndex((item: any) => item.cliente_id == c.cliente_id);
    this.cxc[index].saldos = cxc.data
    this.ngxService.stop();    
  }

  setCliente(i: any) {
    $('.offcanvas').offcanvas('hide');
    if (this.oc) {
      this.newItemEvent.emit(i);
      return
    }
    this.router.navigate(['/admin/personal/clientes/editar/', i.id]);
  }

  async deleteCliente(e: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let cliente = await this.clientes_service.deleteCliente(e.id);
        if (cliente.code) {
          this.clientes.splice(this.clientes.indexOf(e), 1);
          this.alertas_service.success(cliente.mensaje);
        }
      }
    });
  }

  openDocCXC() {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/clientes/cxc?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  openDocCXCCliente(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/clientes/cxc/${c.id}?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  openDocCXCDetalle(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/clientes/cxc/detalle/${c.id}?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  iniciales(nombre: any) {
    nombre = nombre.split(' ');
    if (nombre.length > 1) {
      return nombre[0][0] + nombre[1][0];
    }
    return nombre[0][0] + nombre[0][1];
  }

  search() {
    let data = this.clientes_lista.filter((v: any) => {
      return v.nombre.toUpperCase().includes(this.busqueda.toUpperCase())
      || v.nit.toString().toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.clientes = data;
  }

}

