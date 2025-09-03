import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ValoresService {

  route: string = '/valores';

  constructor(
    private rootService: RootService
  ) { }

  async getValores(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getValor(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postValor(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putValor(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteValor(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
