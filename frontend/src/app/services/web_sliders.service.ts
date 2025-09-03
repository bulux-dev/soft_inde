import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class WebSlidersService {

  route: string = '/web_sliders';

  constructor(
    private rootService: RootService
  ) { }

  async getWebSliders(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getWebSlider(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postWebSlider(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putWebSlider(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteWebSlider(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
