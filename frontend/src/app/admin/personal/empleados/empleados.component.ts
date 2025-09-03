import { Component } from '@angular/core';
import { EmpleadosService } from '../../../services/empleados.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-empleados',
  standalone: false,
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css'
})
export class EmpleadosComponent {

  empleados: any = [];
  empleados_lista: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    apellido: new FormControl(null, [Validators.required]),
    nit: new FormControl(null),
    cui: new FormControl(null),
    direccion: new FormControl(null),
    correo: new FormControl(null),
    telefono: new FormControl(null),
  })
  busqueda: any = null;

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private empleados_service: EmpleadosService
  ) {

  }

  async ngOnInit() {
    await this.getEmpleados();
    this.scripts_service.datatable();
  }

  async getEmpleados() {
    let empleados = await this.empleados_service.getEmpleados(this.filtros.value);
    this.empleados = empleados.data;
    this.empleados_lista = empleados.data;
  }

  async deleteEmpleado(e: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let empleado = await this.empleados_service.deleteEmpleado(e.id);
        if (empleado.code) {
          this.empleados.splice(this.empleados.indexOf(e), 1);
          this.alertas_service.success(empleado.mensaje);
        }
      }
    });
  }

  iniciales(nombre: any, apellido: any) {
    if (!apellido) {
      nombre = nombre.split(' ');
      if (nombre.length > 1) {
        return nombre[0][0] + nombre[1][0];
      }
      return nombre[0][0] + nombre[0][1];
    }
    return nombre[0] + apellido[0];
  }

  search() {
    let data = this.empleados_lista.filter((v: any) => {
      return v.nombre.toUpperCase().includes(this.busqueda.toUpperCase())
      || v.apellido.toUpperCase().includes(this.busqueda.toUpperCase())
      || v.nit.toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.empleados = data;
  }

}

