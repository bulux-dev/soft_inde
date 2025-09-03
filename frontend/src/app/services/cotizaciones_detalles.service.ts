import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class CotizacionesDetallesService {

  route: string = '/cotizaciones_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getCotizacionesDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getCotizacionDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCotizacionDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCotizacionDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteCotizacionDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
