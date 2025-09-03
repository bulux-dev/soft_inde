import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class PartidasService {

  route: string = '/partidas';

  constructor(
    private rootService: RootService
  ) { }


  async getPartidas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getPartida(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postPartida(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putPartida(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deletePartida(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

  async anularPartida(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}/anular`, body);
  }
}
