import { Injectable } from '@angular/core';
import { RootService } from './root.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CentrosCostosService {


  route: string = '/centros_costos';

  constructor(
    private rootService: RootService,
    private http: HttpClient,
    
    
  ) { }


  
  async getCentrosCostos(params: any = null) {
    return await this.rootService.get(this.route, params);
    return await this.http.get(`${environment.api}/centros_costos`).toPromise();
  }
  async getCentrosJornalizacion(params: any = null) {
    const options = params ? { params } : {};
    return await this.rootService.get(`${this.route}/jornalizacion`, params);
  }

  async getCentroCosto(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCentroCosto(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCentroCosto(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteCentroCosto(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
