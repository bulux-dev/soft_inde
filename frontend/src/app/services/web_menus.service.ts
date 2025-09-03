import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class WebMenusService {

  route: string = '/web_menus';

  constructor(
    private rootService: RootService
  ) { }

  async getWebMenus(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getWebMenu(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postWebMenu(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putWebMenu(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteWebMenu(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
