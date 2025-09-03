import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  route: string = '/dashboard';

  constructor(
    private rootService: RootService
  ) { }

  async seguridad() {
    return await this.rootService.get(this.route + '/seguridad', null);
  }

  async personal() {
    return await this.rootService.get(this.route + '/personal', null);
  }

  async operaciones(fecha_inicio: string, fecha_fin: string) {
    return await this.rootService.get(this.route + '/operaciones/' + fecha_inicio + '/' + fecha_fin, null);
  }

  async compras(fecha_inicio: string, fecha_fin: string) {
    return await this.rootService.get(this.route + '/compras/' + fecha_inicio + '/' + fecha_fin, null);
  }

  async ventas(fecha_inicio: string, fecha_fin: string) {
    return await this.rootService.get(this.route + '/ventas/' + fecha_inicio + '/' + fecha_fin, null);
  }

  async cotizaciones(fecha_inicio: string, fecha_fin: string) {
    return await this.rootService.get(this.route + '/cotizaciones/' + fecha_inicio + '/' + fecha_fin, null);
  } 

  async pedidos(fecha_inicio: string, fecha_fin: string) {
    return await this.rootService.get(this.route + '/pedidos/' + fecha_inicio + '/' + fecha_fin, null);
  }

  async ordenes_compras(fecha_inicio: string, fecha_fin: string) {
    return await this.rootService.get(this.route + '/ordenes_compras/' + fecha_inicio + '/' + fecha_fin, null);
  }

  async cargas(fecha_inicio: string, fecha_fin: string) {
    return await this.rootService.get(this.route + '/cargas/' + fecha_inicio + '/' + fecha_fin, null);  
  }

  async descargas(fecha_inicio: string, fecha_fin: string) {
    return await this.rootService.get(this.route + '/descargas/' + fecha_inicio + '/' + fecha_fin, null);
  }

  async traslados(fecha_inicio: string, fecha_fin: string) {
    return await this.rootService.get(this.route + '/traslados/' + fecha_inicio + '/' + fecha_fin, null);
  }

  async operacionesMes(mes: string) {
    return await this.rootService.get(this.route + '/operaciones/' + mes, null);
  }

}
