import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ImpresorasService {

  route: string = '/impresoras';

  constructor(
    private rootService: RootService
  ) { }

  async getImpresoras(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getImpresora(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postImpresora(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putImpresora(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteImpresora(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
