import { Component } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { EmpleadosService } from '../../../../services/empleados.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ScriptsService } from '../../../../services/scripts.service';

@Component({
  selector: 'app-agregar-empleado',
  standalone: false,
  templateUrl: './agregar-empleado.component.html',
  styleUrl: './agregar-empleado.component.css'
})
export class AgregarEmpleadoComponent {

  loading: boolean = false;

  empleadoForm: FormGroup = new FormGroup({
    logo: new FormControl(null),
    nombre: new FormControl(null, [Validators.required]),
    apellido: new FormControl(null, [Validators.required]),
    nit: new FormControl(null),
    cui: new FormControl(null),
    telefono: new FormControl(null),
    correo: new FormControl(null),
    direccion: new FormControl(null),
    vendedor: new FormControl(null),
    comision: new FormControl(0),
    planilla: new FormControl(null),
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private empleados_service: EmpleadosService,
    private scripts_service: ScriptsService
  ) {
  }

  async ngOnInit() {
    this.scripts_service.inputfile();
    this.scripts_service.mask();
  }

  async postEmpleado() {
    this.loading = true;
    let empleado = await this.empleados_service.postEmpleado(this.empleadoForm.value);
    if (empleado.code) {
      this.alertas_service.success(empleado.mensaje);
      this.location.back();
    }
    this.loading = false;
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.empleadoForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

  removeImage(imagen: any) {
    this.empleadoForm.controls[`${imagen}`].setValue(null);
  }

}

