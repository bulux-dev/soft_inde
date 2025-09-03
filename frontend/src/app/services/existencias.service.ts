import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ExistenciasService {

  route: string = '/existencias';

  constructor(
    private rootService: RootService
  ) { }

  async getExistencias(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getAllExistenciaStock(params: any = null) {
    return await this.rootService.get(this.route + '/stocks', params);
  }

  async getExistenciaStock(params: any = null) {
    return await this.rootService.get(this.route + '/stock', params);
  }
  
  async getExistenciaStockByNombre(nombre: string) {
    return await this.rootService.post(this.route + '/stock/search/nombre', {
      nombre: nombre
    });
  }

  async getExistenciaStockAll(params: any = null) {
    return await this.rootService.get(this.route + '/stock/all', params);
  }

  async getExistenciaStockKardex(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(this.route + `/stock/kardex/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getExistenciaKardex(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(this.route + `/kardex/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getExistencia(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postExistencia(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putExistencia(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteExistencia(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
