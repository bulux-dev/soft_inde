import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  getDepartamentos(): Promise<any> {
    return this.httpClient.get('assets/data/departamentos.json').toPromise();
  }

  async getMunicipios(departamento_id: any): Promise<any> {
    let data: any = await this.httpClient.get('assets/data/municipios.json').toPromise();
    return data.filter((municipio: any) => municipio.departamento_id === departamento_id);
  }

  getIconos(): Promise<any> {
    return this.httpClient.get('assets/data/iconos.json').toPromise();
  }

}
