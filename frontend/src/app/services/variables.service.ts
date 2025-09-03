import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  route: string = '/variables';

  constructor(
    private rootService: RootService
  ) { }

  async getVariables(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getVariable(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postVariable(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putVariable(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularVariable(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }

  async deleteVariable(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
