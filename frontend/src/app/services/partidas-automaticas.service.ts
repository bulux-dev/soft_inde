import { Injectable } from '@angular/core';
import { RootService } from './root.service';
@Injectable({
  providedIn: 'root'
})
export class PartidasAutomaticasService {

  route: string = '/partidas-automaticas';

  constructor(
    private rootService: RootService
  ) { }

  
  async getPartidasAutomaticas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getPartidaAutomatica(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postPartidaAutomatica(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putPartidaAutomatica(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deletePartidaAutomatica(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
