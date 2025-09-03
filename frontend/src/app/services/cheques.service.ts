import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ChequesService {

  route: string = '/cheques';

  constructor(
    private rootService: RootService
  ) { }

  async getCheques(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getCheque(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCheque(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCheque(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularCheque(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }
  
  async deleteCheque(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
