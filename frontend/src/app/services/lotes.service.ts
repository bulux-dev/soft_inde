import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class LotesService {

  route: string = '/lotes';

  constructor(
    private rootService: RootService
  ) { }

  async getLotes(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getLotesExistentes(params: any = null) {
    return await this.rootService.get(`${this.route}/existentes`, params);
  }

  async getLote(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postLote(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putLote(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteLote(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
