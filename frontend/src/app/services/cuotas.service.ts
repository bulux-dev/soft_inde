import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class CuotasService {

  route: string = '/cuotas';

  constructor(
    private rootService: RootService
  ) { }

  async getCuotas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getCuota(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCuota(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCuota(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteCuota(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
