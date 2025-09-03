import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  route: string = '/areas';

  constructor(
    private rootService: RootService
  ) { }

  async getAreas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getArea(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postArea(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putArea(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteArea(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
