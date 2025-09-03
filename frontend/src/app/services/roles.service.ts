import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  route: string = '/roles';

  constructor(
    private rootService: RootService
  ) { }

  async getRoles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getRol(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postRol(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putRol(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteRol(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
