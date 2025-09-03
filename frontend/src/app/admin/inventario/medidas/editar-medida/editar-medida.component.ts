import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { MedidasService } from '../../../../services/medidas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-editar-medida',
  standalone: false,
  templateUrl: './editar-medida.component.html',
  styleUrl: './editar-medida.component.css'
})
export class EditarMedidaComponent {

  @Input() medida_id: any;
  loading: boolean = false;

  get selectS() {
    return AppComponent.selectS;
  }

  medidaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    simbolo: new FormControl(null, [Validators.required])
  });

  constructor(
    private alertas_service: AlertasService,
    private medidas_service: MedidasService
  ) {
  }

  async ngOnInit() {
    await this.getMedida();
  }

  async getMedida() {
    let medida = await this.medidas_service.getMedida(this.medida_id);
    if (medida.code) {
      this.medidaForm.patchValue(medida.data);
    }
  }
  
  async putMedida() {
    this.loading = true;
    let medida = await this.medidas_service.putMedida(this.medida_id, this.medidaForm.value);
    if (medida.code) {
      this.alertas_service.success(medida.mensaje);
      await this.getMedida();
    }
    this.loading = false;
  }

}

