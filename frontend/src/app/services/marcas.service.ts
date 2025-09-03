import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {

  route: string = '/marcas';

  constructor(
    private rootService: RootService
  ) { }

  async getMarcas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getMarca(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postMarca(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putMarca(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteMarca(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
