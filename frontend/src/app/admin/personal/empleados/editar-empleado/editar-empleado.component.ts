import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { EmpleadosService } from '../../../../services/empleados.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScriptsService } from '../../../../services/scripts.service';

@Component({
  selector: 'app-editar-empleado',
  standalone: false,
  templateUrl: './editar-empleado.component.html',
  styleUrl: './editar-empleado.component.css'
})
export class EditarEmpleadoComponent {

  @Input() empleado_id: any;
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
    private alertas_service: AlertasService,
    private empleados_service: EmpleadosService,
    private scripts_service: ScriptsService
  ) {
    this.scripts_service.inputfile();
  }

  async ngOnInit() {
    let empleado = await this.empleados_service.getEmpleado(this.empleado_id);
    if (empleado.code) {
      this.empleadoForm.patchValue(empleado.data);
    }
    this.scripts_service.mask();
  }
  
  async putEmpleado() {
    this.loading = true;
    let empleado = await this.empleados_service.putEmpleado(this.empleado_id, this.empleadoForm.value);
    if (empleado.code) {
      this.alertas_service.success(empleado.mensaje);
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

