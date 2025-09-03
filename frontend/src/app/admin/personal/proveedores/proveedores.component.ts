import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProveedoresService } from '../../../services/proveedores.service';
import { AlertasService } from '../../../services/alertas.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
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
  selector: 'app-proveedores',
  standalone: false,
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent {

  @Input() oc: any;
  @Output() newItemEvent = new EventEmitter<string>();

  proveedores: any = [];
  proveedores_lista: any = [];
  cxp: any = [];
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
    private proveedores_service: ProveedoresService,
    private saldos_service: SaldosService,
    private ngxService: NgxUiLoaderService,
    private sanitizer: DomSanitizer
  ) {
  }

  async ngOnInit() {
    await this.getProveedores();
    this.scripts_service.datatable();
  }

  async getProveedores() {
    let proveedores = await this.proveedores_service.getProveedores(this.filtros.value);
    this.proveedores = proveedores.data;
    this.proveedores_lista = proveedores.data;
  }

  async getCXP() {
    this.ngxService.start();
    let cxp = await this.saldos_service.getSaldosCXP();
    this.cxp = cxp.data
    this.ngxService.stop();
  }

  async setCXP(c: any) {
    this.ngxService.start();
    let cxp = await this.saldos_service.getSaldosCXPProveedor(c.proveedor_id);
    const index = this.cxp.findIndex((item: any) => item.proveedor_id == c.proveedor_id);
    this.cxp[index].saldos = cxp.data
    this.ngxService.stop();    
  }

  setProveedor(i: any) {
    $('.offcanvas').offcanvas('hide');    
    if (this.oc) {
      this.newItemEvent.emit(i);
      return
    }
    this.router.navigate(['/admin/personal/proveedores/editar/', i.id]);
  }

  async deleteProveedor(e: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let proveedor = await this.proveedores_service.deleteProveedor(e.id);
        if (proveedor.code) {
          this.proveedores.splice(this.proveedores.indexOf(e), 1);
          this.alertas_service.success(proveedor.mensaje);
        }
      }
    });
  }

  openDocCXP() {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/proveedores/cxp?token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  openDocCXPProveedor(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/proveedores/cxp/${c.id}?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }

  openDocCXPDetalle(c: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/proveedores/cxp/detalle/${c.id}?fecha_inicio=${this.fecha_inicio}&fecha_fin=${this.fecha_fin}&token=${this.token}`);
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
    let data = this.proveedores_lista.filter((v: any) => {
      return v.nombre.toUpperCase().includes(this.busqueda.toUpperCase())
      || v.nit.toString().toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.proveedores = data;
  }

}

