import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {

  route: string = '/cotizaciones';

  constructor(
    private rootService: RootService
  ) { }

  async getCotizaciones(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getCotizacion(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCotizacion(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCotizacion(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularCotizacion(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }

  async deleteCotizacion(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
