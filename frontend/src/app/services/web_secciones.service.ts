import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class WebSeccionesService {

  route: string = '/web_secciones';

  constructor(
    private rootService: RootService
  ) { }

  async getWebSecciones(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getWebSeccion(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postWebSeccion(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putWebSeccion(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteWebSeccion(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
