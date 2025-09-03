import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { CajasChicasService } from '../../../../services/cajas_chicas.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScriptsService } from '../../../../services/scripts.service';

@Component({
  selector: 'app-editar-caja-chica',
  standalone: false,
  templateUrl: './editar-caja-chica.component.html',
  styleUrl: './editar-caja-chica.component.css'
})
export class EditarCajaChicaComponent {

  @Input() caja_chica_id: any;
  loading: boolean = false;

  cajaChicaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required])
  });

  constructor(
    private alertas_service: AlertasService,
    private cajas_chicas_service: CajasChicasService,
    private scripts_service: ScriptsService
  ) {
    this.scripts_service.inputfile();
  }

  async ngOnInit() {
    let caja_chica = await this.cajas_chicas_service.getCajaChica(this.caja_chica_id);
    if (caja_chica.code) {
      this.cajaChicaForm.patchValue(caja_chica.data);
    }
    this.scripts_service.mask();
  }

  async putCajaChica() {
    this.loading = true;
    let caja_chica = await this.cajas_chicas_service.putCajaChica(this.caja_chica_id, this.cajaChicaForm.value);
    if (caja_chica.code) {
      this.alertas_service.success(caja_chica.mensaje);
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

