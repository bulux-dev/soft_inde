import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

declare var Swal: any;
declare var toastr: any;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  registroForm: FormGroup;
  loading: boolean = false;

  constructor(
    private auth_service: AuthService
  ) {
    this.registroForm = new FormGroup({
      nombre: new FormControl(null),
      apellido: new FormControl(null),
      correo: new FormControl(null),
      usuario: new FormControl(null),
      clave: new FormControl(null),
      clave2: new FormControl(null),
      rol_id: new FormControl(1),
    });
  }

  async registro() {
    this.loading = true;
    let registro =  await this.auth_service.registro(this.registroForm.value);
    if (registro.code) {
      toastr.success(registro.mensaje, 'Registro Exitoso', {
        closeButton: !0,
        tapToDismiss: true,
        progressBar: true,
      });
      Swal.fire({
        title: "Registro Exitoso",
        text: registro.mensaje,
        type: 'error',
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: !1,
      });
    }
    this.loading = false;
  }

}
