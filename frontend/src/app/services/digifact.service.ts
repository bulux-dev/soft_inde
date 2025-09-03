import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class DigifactService {

  constructor(
    private rootService: RootService) {
  }

  route = '/digifact';

  async getToken() {
    return this.rootService.get(this.route + '/token');
  }

  async getInfoNit(nit: string) {
    return this.rootService.get(this.route + '/nit/' + nit);
  }

  async getInfoDte(fecha: string) {
    return this.rootService.get(this.route + '/dte/' + fecha);
  }

  async certificacionFel(body: any) {
    return this.rootService.post(this.route + '/certificar', body);
  }

  async anulacionFel(body: any) {
    return this.rootService.post(this.route + '/anular', body);
  }

}