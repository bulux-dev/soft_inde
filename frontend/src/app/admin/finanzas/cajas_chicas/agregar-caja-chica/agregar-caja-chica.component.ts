import { Component } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { CajasChicasService } from '../../../../services/cajas_chicas.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ScriptsService } from '../../../../services/scripts.service';

@Component({
  selector: 'app-agregar-caja-chica',
  standalone: false,
  templateUrl: './agregar-caja-chica.component.html',
  styleUrl: './agregar-caja-chica.component.css'
})
export class AgregarCajaChicaComponent {

  loading: boolean = false;

  cajaChicaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required])
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private cajas_chicas_service: CajasChicasService,
    private scripts_service: ScriptsService
  ) {
  }

  async ngOnInit() {
    this.scripts_service.inputfile();
    this.scripts_service.mask();
  }

  async postCajaChica() {
    this.loading = true;
    let caja_chica = await this.cajas_chicas_service.postCajaChica(this.cajaChicaForm.value);
    if (caja_chica.code) {
      this.alertas_service.success(caja_chica.mensaje);
      this.location.back();
    }
    this.loading = false;
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.cajaChicaForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

  removeImage(imagen: any) {
    this.cajaChicaForm.controls[`${imagen}`].setValue(null);
  }

}

