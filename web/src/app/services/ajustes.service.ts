import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class AjustesService {

  route: string = '/ajustes';

  constructor(
    private rootService: RootService
  ) { }

  async getAjustes() {
    return await this.rootService.get(this.route);
  }

  async getAjuste(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postAjuste(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putAjuste(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteAjuste(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
