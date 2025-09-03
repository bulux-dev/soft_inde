import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { EtiquetasService } from '../../../../services/etiquetas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

declare var $: any

@Component({
  selector: 'app-agregar-etiqueta',
  standalone: false,
  templateUrl: './agregar-etiqueta.component.html',
  styleUrl: './agregar-etiqueta.component.css'
})
export class AgregarEtiquetaComponent {

  @Input()oc: any
  @Output() newItemEvent = new EventEmitter<string>();
  loading: boolean = false;

  etiquetaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required])
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private etiquetas_service: EtiquetasService
  ) {
  }

  async ngOnInit() {
  }

  async postEtiqueta() {
    this.loading = true;
    let etiqueta = await this.etiquetas_service.postEtiqueta(this.etiquetaForm.value);
    if (etiqueta.code) {
      this.alertas_service.success(etiqueta.mensaje);
      this.oc ? this.etiquetaForm.reset() : this.location.back();
      $('.offcanvas').offcanvas('hide');            
      this.newItemEvent.emit(etiqueta.data);
    }
    this.loading = false;
  }

}

