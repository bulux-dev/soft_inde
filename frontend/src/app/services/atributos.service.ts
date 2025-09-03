import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class AtributosService {

  route: string = '/atributos';

  constructor(
    private rootService: RootService
  ) { }

  async getAtributos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getAtributo(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postAtributo(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putAtributo(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteAtributo(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
