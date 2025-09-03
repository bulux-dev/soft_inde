import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  route: string = '/reportes';

  constructor(
    private rootService: RootService
  ) { }

  async reporteVentas(params: any = null) {
    return await this.rootService.get(this.route + '/ventas', params);
  }

}
