import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class BancosService {

  route: string = '/bancos';

  constructor(
    private rootService: RootService
  ) { }

  async getBancos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getBanco(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postBanco(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putBanco(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteBanco(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
