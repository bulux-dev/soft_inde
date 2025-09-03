import { Injectable } from '@angular/core';
import { RootService } from './root.service';
@Injectable({
  providedIn: 'root'
})
export class PartidasDetallesAutomaticasService {
  
  route: string = '/partidas_detalles_automaticas'



  constructor(
    private rootService: RootService
  ) { }
  
  async getPartidasDetallesAutomaticas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getPartidaDetalleAutomatica(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postPartidaDetalleAutomatica(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putPartidaDetalleAutomatica(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deletePartidaDetalleAutomatica(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
