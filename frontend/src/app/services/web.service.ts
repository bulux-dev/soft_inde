import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class WebService {

  route: string = '/web';

  constructor(
    private rootService: RootService
  ) { }

  async getWebs(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getWeb(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postWeb(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putWeb(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteWeb(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
