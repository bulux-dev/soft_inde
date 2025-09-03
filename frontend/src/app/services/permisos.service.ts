import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  route: string = '/permisos';

  constructor(
    private rootService: RootService
  ) { }

  async getPermisos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getPermisosRolUsuario(params: any = null) {
    return await this.rootService.get(this.route + '/rol_usuario', params);
  }

  async getPermiso(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postPermiso(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putPermiso(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deletePermiso(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
