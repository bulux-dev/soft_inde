import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AlertasService } from './alertas.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var Swal: any;
declare var toastr: any;

@Injectable({
  providedIn: 'root',
})
export class RootService {

  constructor(
    private httpClient: HttpClient,
    private aletas_service: AlertasService,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) {
  }

  dataUser: any;

  url = environment.api;
  url_panel = environment.panel;

  async get(path: string, params: any = null) {
    let data: any = await this.httpClient.get(this.url + path, {
      params: params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.isToken(localStorage.getItem('token'))
      }
    }).toPromise();
    this.verify(data);
    return data;
  }

  async getPanel(path: string) {
    let data: any = await this.httpClient.get(this.url_panel + path, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.isToken(localStorage.getItem('token'))
      }
    }).toPromise();
    this.verify(data);
    return data;
  }

  async post(path: string, body: any = null) {
    let data: any = await this.httpClient.post(this.url + path, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.isToken(localStorage.getItem('token'))
      }
    }).toPromise();
    this.verify(data);
    return data;
  }

  async postPanel(path: string, body: any = null) {
    let data: any = await this.httpClient.post(this.url_panel + path, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.isToken(localStorage.getItem('token'))
      }
    }).toPromise();
    this.verify(data);
    return data;
  }

  async put(path: string, body: any) {
    let data: any = await this.httpClient.put(this.url + path, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.isToken(localStorage.getItem('token'))
      }
    }).toPromise();
    this.verify(data);
    return data;
  }

  async putPanel(path: string, body: any) {
    let data: any = await this.httpClient.put(this.url_panel + path, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.isToken(localStorage.getItem('token'))
      }
    }).toPromise();
    this.verify(data);
    return data;
  }

  async delete(path: string) {
    let data: any = await this.httpClient.delete(this.url + path, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.isToken(localStorage.getItem('token'))
      }
    }).toPromise();
    this.verify(data);
    return data;
  }

  async deletePanel(path: string) {
    let data: any = await this.httpClient.delete(this.url_panel + path, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.isToken(localStorage.getItem('token'))
      }
    }).toPromise();
    this.verify(data);
    return data;
  }

  async authPost(path: string, body: any) {
    let data: any = await this.httpClient.post(this.url + path, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.isToken(localStorage.getItem('token'))
      }
    }).toPromise();
    this.verify(data);
    return data;
  }

  async postFile(path: string, body: any) {
    let data: any = await this.httpClient.post(this.url + path, body, {
      headers: {
        'Authorization': this.isToken(localStorage.getItem('token'))
      }
    }).toPromise();
    return data;
  }

  async deleteFile(path: string) {
    let data: any = await this.httpClient.delete(this.url + path, {
      headers: {
        'Authorization': this.isToken(localStorage.getItem('token'))
      }
    }).toPromise();
    return data;
  }

  async verify(data: any) {
    if (!data.code) {
      if (data.error == 'Token de autorizacion inválido') {
        localStorage.removeItem('token');
        toastr.error('Sesión expirada', 'Sesión expirada', {
          closeButton: !0,
          tapToDismiss: true,
          progressBar: true,
          positionClass: 'toast-bottom-right',
        });
        location.href = '/login';
        return;
      }
      
      Swal.fire({
        title: `Error #${data.error_id}`,
        text: data.mensaje,
        type: 'error',
        footer: `<a target='_blank' href='/admin/tickets/error/${data.error_id}'> ¿Desea abrir ticket de Soporte?</a>`,
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: !1,
      });
      toastr.error(data.mensaje, `Error #${data.error_id}`, {
        closeButton: !0,
        tapToDismiss: true,
        progressBar: true,
        positionClass: 'toast-bottom-right',
      });
      this.ngxService.stop();
    }
  }

  isToken(token: any) {
    if (token) {
      return token;
    } else {
      return '';
    }
  }

}
