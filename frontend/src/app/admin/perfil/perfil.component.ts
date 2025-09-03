import { Component, Input } from '@angular/core';
import { AlertasService } from '../../services/alertas.service';
import { UsuariosService } from '../../services/usuarios.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScriptsService } from '../../services/scripts.service';
import { RolesService } from '../../services/roles.service';
import { DashboardService } from '../../services/dashboard.service';
import moment from 'moment';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  usuario_id: any = localStorage.getItem('usuario_id');
  roles: any = [];
  loading: boolean = false;

  fecha_inicio: any = moment().startOf('month').format('YYYY-MM-DD HH:mm');
  fecha_fin: any = moment().format('YYYY-MM-DD HH:mm');

  usuarioForm: FormGroup = new FormGroup({
    logo: new FormControl(null),
    nombre: new FormControl(null, [Validators.required]),
    apellido: new FormControl(null, [Validators.required]),
    usuario: new FormControl(null, [Validators.required]),
    clave: new FormControl(null),
    correo: new FormControl(null),
    telefono: new FormControl(null),
    acceso: new FormControl(true),
    rol_id: new FormControl(null, [Validators.required]),
  });

  constructor(
    private alertas_service: AlertasService,
    private usuarios_service: UsuariosService,
    private roles_service: RolesService,
    private scripts_service: ScriptsService
  ) {
    this.scripts_service.loadScript('assets/js/input-file.js');
  }

  async ngOnInit() {
    let usuario = await this.usuarios_service.getUsuario(this.usuario_id);
    if (usuario.code) {
      this.usuarioForm.patchValue(usuario.data);
      this.usuarioForm.controls['clave'].setValue(null);
    }
    await this.getRoles();
  }

  async getRoles() {
    let roles = await this.roles_service.getRoles();
    if (roles.code) {
      this.roles = roles.data;
    }
  }

  async putUsuario() {
    this.loading = true;
    let usuario = await this.usuarios_service.putUsuario(this.usuario_id, this.usuarioForm.value);
    if (usuario.code) {
      this.alertas_service.success(usuario.mensaje);
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

  removeImage(imagen: any) {
    this.usuarioForm.controls[`${imagen}`].setValue(null);
  }

}
