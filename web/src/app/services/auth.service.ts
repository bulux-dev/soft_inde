import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private rootService: RootService
  ) { }

  login(data: any): Promise<any> {
    return this.rootService.authPost('/auth/login', data);
  }

  registro(data: any): Promise<any> {
    return this.rootService.authPost('/auth/registro', data);
  }

  recuperar(data: any): Promise<any> {
    return this.rootService.authPost('/auth/recuperar', data);
  }

}
