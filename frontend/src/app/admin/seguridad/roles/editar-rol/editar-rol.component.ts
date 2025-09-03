import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { RolesService } from '../../../../services/roles.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-rol',
  standalone: false,
  templateUrl: './editar-rol.component.html',
  styleUrl: './editar-rol.component.css'
})
export class EditarRolComponent {

  @Input() rol_id: any;
  loading: boolean = false;

  rolForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required])
  });

  constructor(
    private alertas_service: AlertasService,
    private roles_service: RolesService
  ) {
  }

  async ngOnInit() {
    let rol = await this.roles_service.getRol(this.rol_id);
    if (rol.code) {
      this.rolForm.patchValue(rol.data);
    }
  }

  async putRol() {
    this.loading = true;
    let rol = await this.roles_service.putRol(this.rol_id, this.rolForm.value);
    if (rol.code) {
      this.alertas_service.success(rol.mensaje);
    }
    this.loading = false;
  }

}
