import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertasService } from '../services/alertas.service';
import { AppComponent } from '../app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var $: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup = new FormGroup({
    usuario: new FormControl('', [Validators.required]),
    clave: new FormControl('', [Validators.required]),
  });
  loading: boolean = false;

  constructor(
    private alertas_service: AlertasService,
    private auth_service: AuthService,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/admin']);
    }
  }

  async login() {
    this.ngxService.start();
    let login = await this.auth_service.login(this.loginForm.value);
    if (login.code) {
      localStorage.setItem('token', login.token);
      localStorage.setItem('usuario_id', login.usuario_id);
      localStorage.setItem('rol_id', login.rol_id);
      localStorage.setItem('empresa_id', login.empresa_id);
      this.alertas_service.success(login.mensaje);
      this.ngxService.stop();
      location.href = 'admin';
    }
  }

  get ajustes() {
    return AppComponent.ajustes;
  }

  showPassword($event: any) {
    $($event).toggleClass("fa-eye fa-eye-slash");
    var input = $(".pass-input");
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  }

}
