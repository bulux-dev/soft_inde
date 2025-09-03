import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ImportesProductosService {

  route: string = '/importes_productos';

  constructor(
    private rootService: RootService
  ) { }

  async getImportesProductos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }
  
  async getImporteProducto(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postImporteProducto(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putImporteProducto(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteImporteProducto(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
