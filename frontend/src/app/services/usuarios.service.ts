import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  route: string = '/usuarios';

  constructor(
    private rootService: RootService
  ) { }

  async getUsuarios(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getUsuario(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postUsuario(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putUsuario(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteUsuario(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
