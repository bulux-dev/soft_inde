import { Component } from '@angular/core';
import { RolesService } from '../../../services/roles.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles',
  standalone: false,
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {

  roles: any = [];
  roles_lista: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null)
  })
  busqueda: any = null;

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private roles_service: RolesService
  ) {

  }

  async ngOnInit() {
    await this.getRoles();
    this.scripts_service.datatable();
  }

  async getRoles() {
    let roles = await this.roles_service.getRoles(this.filtros.value);
    this.roles = roles.data;
    this.roles_lista = roles.data;
  }

  async deleteRol(e: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let rol = await this.roles_service.deleteRol(e.id);
        if (rol.code) {
          this.roles.splice(this.roles.indexOf(e), 1);
          this.alertas_service.success(rol.mensaje);
        }
      }
    });
  }

  search() {
    let data = this.roles_lista.filter((v: any) => {
      return v.nombre.toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.roles = data;
  }

}
