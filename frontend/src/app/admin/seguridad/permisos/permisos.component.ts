import { Component } from '@angular/core';
import { AjustesService } from '../../../services/panel/ajustes.service';
import { AppComponent } from '../../../app.component';
import { PermisosService } from '../../../services/permisos.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-permisos',
  standalone: false,
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.css'
})
export class PermisosComponent {

  modulos: any = [];
  roles: any = [];
  usuarios: any = [];
  menus: any = [];
  permisos_admin: any = [];
  permisos: any = [];
  empresa_id = localStorage.getItem('empresa_id');
  modulo_id: any;
  usuario_id: any;
  rol_id: any;
  menu_id: any;

  get selectS() {
    return AppComponent.selectS;
  }

  constructor(
    private ajustesService: AjustesService,
    private permisos_service: PermisosService,
    private usuarios_service: UsuariosService,
    private roles_service: RolesService
  ) {

  }

  async ngOnInit() {
    await this.getPermisosAdmin();
    await this.getModulos();
    await this.getRoles();
    await this.getPermisos();
  }

  async getRoles() {
    let roles = await this.roles_service.getRoles();
    if (roles.code) {
      this.roles = roles.data;
    }
  }

  async getUsuarios() {
    this.usuario_id = null;
    let usuarios = await this.usuarios_service.getUsuarios({
      rol_id: this.rol_id ? this.rol_id[0].id : null
    });
    if (usuarios.code) {
      this.usuarios = usuarios.data;
    }
  }

  async getModulos() {
    let modulos = await this.ajustesService.getModulos();
    if (modulos.code) {
      this.modulos = modulos.data;
    }
  }

  async getPermisosAdmin() {
    let permisos = await this.ajustesService.getPermisoByEmpresa(this.empresa_id);
    if (permisos.code) {
      this.permisos_admin = permisos.data;
    }
  }

  async getPermisos() {
    let permisos = await this.permisos_service.getPermisos();
    if (permisos.code) {
      this.permisos = permisos.data;
    }
  }

  getPermisoAdmin(m: any, me: any = null) { 
    if (m && me) {
      return this.permisos_admin.find((p: any) => p.modulo_id == m.id && p.menu_id == me.id && p.membresia == null);
    }
    return this.permisos_admin.find((p: any) => p.modulo_id == m.id && p.membresia);
  }

  getPermiso(m: any, me: any = null, a: any = null) {
    if (this.rol_id && (this.usuario_id && this.usuario_id[0] && this.usuario_id[0].id)) {
      if (m && me && a) {
        return this.permisos.find((p: any) => p.modulo_id == m.id && p.menu_id == me.id && p.accion_id == a.id && p.rol_id == this.rol_id[0].id && (p.usuario_id == this.usuario_id[0].id || p.usuario_id == null));
      } else if (m && me) {
        return this.permisos.find((p: any) => p.modulo_id == m.id && p.menu_id == me.id && p.accion_id == null && p.rol_id == this.rol_id[0].id && (p.usuario_id == this.usuario_id[0].id || p.usuario_id == null));
      } else if (m) {
        return this.permisos.find((p: any) => p.modulo_id == m.id && p.menu_id == null && p.accion_id == null && p.rol_id == this.rol_id[0].id && (p.usuario_id == this.usuario_id[0].id || p.usuario_id == null));
      }
    } else if (this.rol_id) {
      if (m && me && a) {
        return this.permisos.find((p: any) => p.modulo_id == m.id && p.menu_id == me.id && p.accion_id == a.id && p.rol_id == this.rol_id[0].id && p.usuario_id == null);
      } else if (m && me) {
        return this.permisos.find((p: any) => p.modulo_id == m.id && p.menu_id == me.id && p.accion_id == null && p.rol_id == this.rol_id[0].id && p.usuario_id == null);
      } else if (m) {
        return this.permisos.find((p: any) => p.modulo_id == m.id && p.menu_id == null && p.accion_id == null && p.rol_id == this.rol_id[0].id && p.usuario_id == null);
      }
    }
    return false;
  }

  async setPermiso(m: any, me: any = null, a: any = null) {
    if (this.rol_id && (this.usuario_id && this.usuario_id[0])) {
      let permiso = await this.permisos_service.getPermisos({
        modulo_id: m.id,
        menu_id: me ? me.id : null,
        accion_id: a ? a.id : null,
        rol_id: this.rol_id[0].id,
        usuario_id: this.usuario_id[0].id
      });
      if (permiso.data.length > 0) {        
        await this.permisos_service.deletePermiso(permiso.data[0].id);
      } else {
        await this.permisos_service.postPermiso({
          modulo_id: m.id,
          menu_id: me ? me.id : null,
          accion_id: a ? a.id : null,
          rol_id: this.rol_id ? this.rol_id[0].id : null,
          usuario_id: this.usuario_id ? this.usuario_id[0].id : null
        });
      }
    } else if (this.rol_id) {
      let permiso = await this.permisos_service.getPermisos({
        modulo_id: m.id,
        menu_id: me ? me.id : null,
        accion_id: a ? a.id : null,
        rol_id: this.rol_id[0].id,
        usuario_id: null
      });
      permiso.data = permiso.data.filter((p: any) => p.usuario_id == null);
      if (permiso.data.length > 0) {
        await this.permisos_service.deletePermiso(permiso.data[0].id);
      } else {
        await this.permisos_service.postPermiso({
          modulo_id: m.id,
          menu_id: me ? me.id : null,
          accion_id: a ? a.id : null,
          rol_id: this.rol_id ? this.rol_id[0].id : null,
          usuario_id: null
        });
      }
    }
    await this.getPermisos();
  }

  async setAllPermisos() {
    for (let m = 0; m < this.modulos.length; m++) {
      for (let me = 0; me < this.modulos[m].menus.length; me++) {
        for (let a = 0; a < this.modulos[m].menus[me].acciones.length; a++) {
          await this.setPermiso(this.modulos[m], this.modulos[m].menus[me], this.modulos[m].menus[me].acciones[a]);
        }
      }
    }
  }

  permiso(slug: any) {
    let permisos = JSON.parse(localStorage.getItem('permisos') || '[]');
    return permisos.find((p: any) => p.accion.slug == slug);
  }

}
