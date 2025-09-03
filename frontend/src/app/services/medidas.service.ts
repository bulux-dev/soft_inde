import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class MedidasService {

  route: string = '/medidas';

  constructor(
    private rootService: RootService
  ) { }

  async getMedidas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getMedida(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postMedida(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putMedida(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteMedida(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
