import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { MedidasService } from '../../../../services/medidas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AppComponent } from '../../../../app.component';

declare var $: any

@Component({
  selector: 'app-agregar-medida',
  standalone: false,
  templateUrl: './agregar-medida.component.html',
  styleUrl: './agregar-medida.component.css'
})
export class AgregarMedidaComponent {

  @Input() oc: any;
  @Output() newItemEvent = new EventEmitter<string>();
  loading: boolean = false;

  get selectS() {
    return AppComponent.selectS;
  }

  medidaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    simbolo: new FormControl(null, [Validators.required])
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private medidas_service: MedidasService
  ) {
  }

  async ngOnInit() {
    
  }

  async postMedida() {
    this.loading = true;
    let medida = await this.medidas_service.postMedida(this.medidaForm.value);
    if (medida.code) {
      this.alertas_service.success(medida.mensaje);
      this.oc ? this.medidaForm.reset() : this.location.back();
      $('.offcanvas').offcanvas('hide');
      this.newItemEvent.emit(medida.data);
    }
    this.loading = false;
  }

}

