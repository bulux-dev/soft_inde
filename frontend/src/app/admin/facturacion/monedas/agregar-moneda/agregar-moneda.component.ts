import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { MonedasService } from '../../../../services/monedas.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

declare var $: any

@Component({
  selector: 'app-agregar-moneda',
  standalone: false,
  templateUrl: './agregar-moneda.component.html',
  styleUrl: './agregar-moneda.component.css'
})
export class AgregarMonedaComponent {

  @Input()oc: any
  @Output() newItemEvent = new EventEmitter<string>();
  loading: boolean = false;

  monedaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    simbolo: new FormControl(null, [Validators.required]),
    tipo_cambio: new FormControl(null)
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private monedas_service: MonedasService
  ) {
  }

  async ngOnInit() {
  }

  async postMoneda() {
    this.loading = true;
    let moneda = await this.monedas_service.postMoneda(this.monedaForm.value);
    if (moneda.code) {
      this.alertas_service.success(moneda.mensaje);
      this.oc ? this.monedaForm.reset() : this.location.back();
      $('.offcanvas').offcanvas('hide');            
      this.newItemEvent.emit(moneda.data);
    }
    this.loading = false;
  }

}

