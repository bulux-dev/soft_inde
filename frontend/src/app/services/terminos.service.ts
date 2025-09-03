import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class TerminosService {

  route: string = '/terminos';

  constructor(
    private rootService: RootService
  ) { }

  async getTerminos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getTermino(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postTermino(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putTermino(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteTermino(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
