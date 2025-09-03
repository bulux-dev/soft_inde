import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { UsuariosService } from '../../../../services/usuarios.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ScriptsService } from '../../../../services/scripts.service';
import { RolesService } from '../../../../services/roles.service';

@Component({
  selector: 'app-agregar-usuario',
  standalone: false,
  templateUrl: './agregar-usuario.component.html',
  styleUrl: './agregar-usuario.component.css'
})
export class AgregarUsuarioComponent {

  @Input() oc: any;
  roles: any = [];
  loading: boolean = false;

  usuarioForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    apellido: new FormControl(null, [Validators.required]),
    usuario: new FormControl(null, [Validators.required]),
    clave: new FormControl(null, [Validators.required]),
    correo: new FormControl(null),
    telefono: new FormControl(null),
    acceso: new FormControl(true),
    logo: new FormControl(null),
    rol_id: new FormControl(null, [Validators.required]),
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private usuarios_service: UsuariosService,
    private roles_service: RolesService,
    private scripts_service: ScriptsService
  ) {
  }

  async ngOnInit() {
    await this.getRoles();
    this.scripts_service.inputfile();
  }

  async getRoles() {
    let roles = await this.roles_service.getRoles();
    if (roles.code) {
      this.roles = roles.data;
    }
  }

  async postUsuario() {
    this.loading = true;
    let usuario = await this.usuarios_service.postUsuario(this.usuarioForm.value);
    if (usuario.code) {
      this.alertas_service.success(usuario.mensaje);
      this.location.back();
    }
    this.loading = false;
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.usuarioForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }
  
}
