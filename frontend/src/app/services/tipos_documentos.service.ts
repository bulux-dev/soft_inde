import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class TiposDocumentosService {

  route: string = '/tipos_documentos';

  constructor(
    private rootService: RootService
  ) { }

  async getTiposDocumentos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getTipoDocumento(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postTipoDocumento(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putTipoDocumento(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteTipoDocumento(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
