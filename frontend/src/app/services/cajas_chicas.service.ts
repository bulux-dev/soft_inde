import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class CajasChicasService {

  route: string = '/cajas_chicas';

  constructor(
    private rootService: RootService
  ) { }

  async getCajasChicas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getCajaChica(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCajaChica(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCajaChica(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteCajaChica(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
