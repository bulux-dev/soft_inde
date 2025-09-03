import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AppComponent } from '../app.component';
import moment from 'moment';
import 'moment/locale/es';
import { AjustesService } from '../services/panel/ajustes.service';
import { PermisosService } from '../services/permisos.service';
import { ScriptsService } from '../services/scripts.service';
import { InventariosService } from '../services/inventarios.service';
import { AlertasService } from '../services/alertas.service';

declare var $: any;
declare var Swal: any;
declare var bootstrap: any;

declare function printer(receipt_data: any, ip: string): any;
declare function checkStatus(): any;

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  usuario_id: any = localStorage.getItem('usuario_id');
  rol_id: any = localStorage.getItem('rol_id');
  empresa_id: any = localStorage.getItem('empresa_id');
  usuario: any;
  icon: any = 'fad';

  modulos: any = [];
  modulos_lista: any = [];
  modulo_slug: any;
  menu_slug: any;

  permisos_admin: any = [];
  static permisos_rol: any = [];
  static permisos_usuario: any = [];
  static inv: any = false;
  static alertas_service: AlertasService;

  static isMobile: any = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)));
  notificaciones: any = [];
  busqueda: any;

  constructor(
    private router: Router,
    private usuarios_service: UsuariosService,
    private ajustesService: AjustesService,
    private permisos_service: PermisosService,
    private scripts_service: ScriptsService,
    private inventarios_service: InventariosService,
    private alertas_service: AlertasService
  ) {
  }

  async ngOnInit() {
    this.scripts_service.js();
    let usuario = await this.usuarios_service.getUsuario(this.usuario_id);
    if (usuario.code) {
      this.usuario = usuario.data;
    }
    moment.locale('es');
    await this.getPermisosAdmin();
    await this.getModulos();
    await this.getPermisos();
    await this.getInventarioMes();
  }

  static get empresa() {
    return AppComponent.ajustes;
  }

  async getPermisosAdmin() {
    let permisos = await this.ajustesService.getPermisoByEmpresa(this.empresa_id);
    if (permisos.code) {
      this.permisos_admin = permisos.data;
    }
  }

  async getModulos() {
    let modulos = await this.ajustesService.getModulos();
    if (modulos.code) {
      this.modulos = modulos.data;
      this.modulos_lista = modulos.data;
    }
  }

  async getPermisos() {
    let per = await this.permisos_service.getPermisosRolUsuario({
      rol_id: this.rol_id,
      usuario_id: null
    });
    if (per.code) {
      AdminComponent.permisos_rol = per.data;
    }

    per = await this.permisos_service.getPermisosRolUsuario({
      rol_id: this.rol_id,
      usuario_id: this.usuario_id
    });
    if (per.code) {
      AdminComponent.permisos_usuario = per.data;
    }

    this.modulo_slug = this.router.url.split('/')[2];
    this.menu_slug = this.router.url.split('/')[3];
    if (this.modulo_slug && this.menu_slug) {
      let modulo_id = this.modulos.find((m: any) => m.slug == this.modulo_slug).id;
      let menu_id = this.modulos.find((m: any) => m.slug == this.modulo_slug).menus.find((m: any) => m.slug == this.menu_slug).id;
      this.setModuloMenu(modulo_id, menu_id);
    }
  }

  getPermiso(modulo_id: any, menu_id: any = null) {
    let permiso

    if (this.rol_id == '1') {
      permiso = this.permisos_admin.find((p: any) => p.modulo_id == modulo_id);
      if (permiso) {
        return true;
      }
    } else {

      if (menu_id && AdminComponent.permisos_rol.length > 0) {
        permiso = AdminComponent.permisos_rol.find((p: any) => p.modulo_id == modulo_id && p.menu_id == menu_id);
        if (permiso && permiso.id) {
          return true;
        } else {
          permiso = AdminComponent.permisos_usuario.find((p: any) => p.modulo_id == modulo_id && p.menu_id == menu_id);
          if (permiso) {
            return true;
          }
        }
      } else {
        permiso = AdminComponent.permisos_rol.find((p: any) => p.modulo_id == modulo_id);
        if (permiso) {
          return true;
        } else {
          permiso = AdminComponent.permisos_usuario.find((p: any) => p.modulo_id == modulo_id);
          if (permiso) {
            return true;
          }
        }
      }

    }
    return false;
  }

  async getInventarioMes() {
    let inventario = await this.inventarios_service.getInventarios({
      mes: moment().format('YYYY-MM'),
    });
    if (inventario.code && inventario.data.length > 0) {
      AdminComponent.inv = true;
    }
    if (inventario.code && inventario.data.length == 0) {
      this.notificaciones.push({
        text: 'No hay inventario para este mes',
        url: 'inventario/existencias',
        type: 'error'
      })
    }
  }

  timeFromNow() {
    return moment(moment().startOf('month')).fromNow();
  }

  toggleSidebar() {
    const mainWrapper = $('.main-wrapper');
    const html = $('html');

    const shouldAddClass = !mainWrapper.hasClass('slide-nav');

    mainWrapper.toggleClass('slide-nav', shouldAddClass);
    html.toggleClass('menu-opened', shouldAddClass);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  get ajustes() {
    return AppComponent.ajustes;
  }

  async setModuloMenu(modulo_id: any, menu_id: any) {
    localStorage.setItem('modulo_id', modulo_id);
    localStorage.setItem('menu_id', menu_id);
  }

  search() {
    let data = this.modulos_lista.map((modulo: any) => {
      let filteredMenus = modulo.menus.filter((menu: any) => {
        return menu.nombre.toUpperCase().includes(this.busqueda.toUpperCase());
      });
      return { ...modulo, menus: filteredMenus };
    }).filter((modulo: any) => modulo.menus.length > 0);
    this.modulos = data;
  }

  static headerTicket(i: any) {
    let lines = i.tabs;
    let item = `DESCRIPCION`;
    lines -= item.length;

    for (let i = 0; i < lines - 6; i++) {
      item += ` `;
    }
    item += 'PRECIO';
    return item
  }

  static infoTicket(i: any, key: any, value: any) {
    let lines = i.tabs;
    let item = '';
    item += key;
    lines -= key.length;

    for (let n = 0; n < lines - value.length; n++) {
      item += ' ';
    }
    item += value;
    return item;
  }

  static centerTicket(i: any, text: any) {
    let item = '';
    let espacio = Math.floor((i.tabs - text.length) / 2);
    for (let n = 0; n < espacio; n++) {
      item += ' ';
    }
    item += text;
    for (let n = 0; n < i.tabs - (espacio + text.length); n++) {
      item += ' ';
    }
    return item;
  }

  static itemsTicket(i: any, cantidad: any, descripcion: any, total: any) {
    let lines = i.tabs;
    let item = `${cantidad} `;
    lines -= item.length;
    item += descripcion;
    lines -= descripcion.length;
    total = `Q. ${parseFloat(total).toFixed(2)}`;

    for (let n = 0; n < lines - total.length; n++) {
      item += ` `;
    }
    item += total;
    return `${item}`;
  }

  static itemsTicket2(i: any, cantidad: any, descripcion: any, comentario: any) {
    let lines = i.tabs;
    let item = `${cantidad} `;
    lines -= item.length;
    item += descripcion;
    lines -= descripcion.length;
    comentario = comentario;

    for (let n = 0; n < lines - comentario.length; n++) {
      item += ` `;
    }
    item += comentario;
    return `${item}`;
  }

  static linesTicket(i: any) {
    let item = '';
    for (let n = 0; n < i.tabs; n++) {
      item += `-`;
    }
    return item;
  }

  static print(i: any, print: any) {
    console.log(print);

    if (this.isMobile) {
      const encodedPrint = encodeURIComponent(`<PRINTER alias='${i.nombre}'><BIG><CENTER>${this.empresa?.nombre} ${print}`);
      const quickPrinterURL = `intent://${encodedPrint}"#Intent;scheme=quickprinter;package=pe.diegoveloper.printerserverapp;end;"`;
      window.location.href = quickPrinterURL;
    } else {
      // if (!checkStatus()) {
      //   this.alertas_service.error('Print Server Desconectado');
      //   return;
      // }

      printer({
        store_name: this.empresa?.nombre,
        header: '',
        info: '',
        items: `${print}`,
        totals: ''
      }, i.ip);
    }
  }

}
