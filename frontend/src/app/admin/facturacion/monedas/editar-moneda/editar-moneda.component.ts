import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { MonedasService } from '../../../../services/monedas.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-moneda',
  standalone: false,
  templateUrl: './editar-moneda.component.html',
  styleUrl: './editar-moneda.component.css'
})
export class EditarMonedaComponent {

  @Input() moneda_id: any;
  loading: boolean = false;

  monedaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    simbolo: new FormControl(null, [Validators.required]),
    tipo_cambio: new FormControl(null)
  });

  constructor(
    private alertas_service: AlertasService,
    private monedas_service: MonedasService
  ) {
  }

  async ngOnInit() {
    let moneda = await this.monedas_service.getMoneda(this.moneda_id);
    if (moneda.code) {
      this.monedaForm.patchValue(moneda.data);
    }
  }
  
  async putMoneda() {
    this.loading = true;
    let moneda = await this.monedas_service.putMoneda(this.moneda_id, this.monedaForm.value);
    if (moneda.code) {
      this.alertas_service.success(moneda.mensaje);
    }
    this.loading = false;
  }

}

