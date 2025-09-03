import { Component } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { RolesService } from '../../../../services/roles.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-agregar-rol',
  standalone: false,
  templateUrl: './agregar-rol.component.html',
  styleUrl: './agregar-rol.component.css'
})
export class AgregarRolComponent {

  loading: boolean = false;

  rolForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required])
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private roles_service: RolesService
  ) {
  }

  async ngOnInit() {
  }

  async postRol() {
    this.loading = true;
    let rol = await this.roles_service.postRol(this.rolForm.value);
    if (rol.code) {
      this.alertas_service.success(rol.mensaje);
      this.location.back();
    }
    this.loading = false;
  }

}
