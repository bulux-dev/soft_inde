import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppComponent } from '../app.component';
import { AlertasService } from '../services/alertas.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './recuperar.component.html',
  styleUrl: './recuperar.component.css'
})
export class RecuperarComponent {

  constructor(
    private ngxService: NgxUiLoaderService,
    private alertas_service: AlertasService,
    private auh_service: AuthService
  ) { }

  correo: string = '';

  get ajustes() {
    return AppComponent.ajustes;
  }

  async recuperar() { 
    this.ngxService.start();
    let recuperar = await this.auh_service.recuperar({
      correo: this.correo
    });
    if (recuperar.code) {
      this.alertas_service.success(recuperar.mensaje);
    }
    this.ngxService.stop();
  }

}
