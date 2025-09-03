import { Injectable } from '@angular/core';
import { RootService } from './root.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplementosService {

  route: string = '/complementos';
  urlAPI: any = environment.panel;

  constructor(
    private rootService: RootService
  ) { }

  async getComplementos() {
    return await this.rootService.getPanel(this.route);
  }

  async getComplemento(id: number) {
    return await this.rootService.getPanel(`${this.route}/${id}`);
  }

  async postComplemento(body: any) {
    return await this.rootService.postPanel(this.route, body);
  }

  async putComplemento(id: number, body: any) {
    return await this.rootService.putPanel(`${this.route}/${id}`, body);
  }

  async deleteComplemento(id: number) {
    return await this.rootService.deletePanel(`${this.route}/${id}`);
  }

}
