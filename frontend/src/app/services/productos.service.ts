import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  route: string = '/productos';

  constructor(
    private rootService: RootService
  ) { }

  async getProductos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getProducto(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postProducto(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async searchProductoBySKU(sku: string) {
    return await this.rootService.post(`${this.route}/search/sku`, {
      sku: sku
    });
  }

  async searchProductoByNombre(nombre: string, categoria_id: any) {
    return await this.rootService.post(`${this.route}/search/nombre`, {
      nombre: nombre,
      categoria_id: categoria_id
    });
  }

  async searchProductoByLote(nombre: string, categoria_id: any) {
    return await this.rootService.post(`${this.route}/search/lote`, {
      nombre: nombre,
      categoria_id: categoria_id
    });
  }

  async putProducto(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteProducto(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

  async getProductosByCategoria(params: any = null) {    
    return await this.rootService.get(`${this.route}/categoria`, params);
  }

  async getProductosByMarca(params: any = null) {    
    return await this.rootService.get(`${this.route}/marca`, params);
  }

  async getProductosByMedida(params: any = null) {    
    return await this.rootService.get(`${this.route}/medida`, params);
  }

}
