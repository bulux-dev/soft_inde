import { Component } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { AlertasService } from '../../../services/alertas.service';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

  usuarios: any = [];
  usuarios_lista: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null),
    apellido: new FormControl(null),
    usuario: new FormControl(null),
    correo: new FormControl(null),
    telefono: new FormControl(null),
    acceso: new FormControl(null),
  })
  busqueda: any = null;

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private usuarios_service: UsuariosService
  ) {

  }

  async ngOnInit() {
    await this.getUsuarios();
    this.scripts_service.datatable();
  }

  async getUsuarios() {
    let usuarios = await this.usuarios_service.getUsuarios(this.filtros.value);
    this.usuarios = usuarios.data;
    this.usuarios_lista = usuarios.data;
  }

  async changeStatus(e: any) {
    let usuario = await this.usuarios_service.putUsuario(e.id, { acceso: !e.acceso });
    if (usuario.code) {
      await this.getUsuarios();
      this.alertas_service.success('Acceso actualizado');
    }
  }

  async deleteUsuario(e: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let usuario = await this.usuarios_service.deleteUsuario(e.id);
        if (usuario.code) {
          this.usuarios.splice(this.usuarios.indexOf(e), 1);
          this.alertas_service.success(usuario.mensaje);
        }
      }
    });
  }

  iniciales(nombre: any, apellido: any) {
    return nombre[0] + apellido[0];
  }
  
  search() {
    let data = this.usuarios_lista.filter((v: any) => {
      return v.nombre.toUpperCase().includes(this.busqueda.toUpperCase())
      || v.apellido.toUpperCase().includes(this.busqueda.toUpperCase())
      || v.usuario.toUpperCase().includes(this.busqueda.toUpperCase())
      || v.rol.nombre.toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.usuarios = data;
  }

}
