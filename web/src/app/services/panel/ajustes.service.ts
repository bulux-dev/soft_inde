import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class AjustesService {

  constructor(
    private rootService: RootService
  ) { }

  async getAjustes() {
    return await this.rootService.getPanel('/ajustes');
  }

  // Empresa

  async getEmpresa(id: any) {
    return await this.rootService.getPanel('/empresas/' + id);
  }

  async getEmpresaSlug(slug: any) {
    return await this.rootService.getPanel('/empresas/slug/' + slug);
  }

  async putEmpresa(id: any, data: any) {
    return await this.rootService.putPanel('/empresas/' + id, data);
  }

  // Modulos Permisos

  async getModulos() {
    return await this.rootService.getPanel('/modulos');
  }

  async getMenus() {
    return await this.rootService.getPanel('/menus');
  }

  async getAcciones() {
    return await this.rootService.getPanel('/acciones');
  }

  async getPermisos() {
    return await this.rootService.getPanel('/permisos');
  }

  async getPermisoByEmpresa(empresa_id: any, modulo_id: any = null, menu_id: any = null) {
    return await this.rootService.getPanel(`/permisos/empresa/${empresa_id}/${modulo_id}/${menu_id}`);
  }

  async postPermiso(body: any) {
    return await this.rootService.postPanel('/permisos', body);
  }

  async deletePermiso(id: any) {
    return await this.rootService.deletePanel(`/permisos/${id}`);
  }

}
