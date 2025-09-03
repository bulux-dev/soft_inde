import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class WebService {

  route: string = '/web';

  constructor(
    private rootService: RootService
  ) { }


  async getWebs(params: any = null) {
    return await this.rootService.get(this.route, params);
  }
  
  async getCategorias(params: any = null) {
    return await this.rootService.get(this.route + '/categorias', params);
  }

  async getMarcas(params: any = null) {
    return await this.rootService.get(this.route + '/marcas', params);
  }

  async getProductosByCategoria(categoria_id: any, params: any = null) {
    return await this.rootService.get(this.route + `/productos/categoria/${categoria_id}`, params);
  }

  async getProductosByMarca(marca_id: any, params: any = null) {
    return await this.rootService.get(this.route + `/productos/marca/${marca_id}`, params);
  }

  async getProducto(id: any) {
    return await this.rootService.get(this.route + `/productos/${id}`);
  }

}
