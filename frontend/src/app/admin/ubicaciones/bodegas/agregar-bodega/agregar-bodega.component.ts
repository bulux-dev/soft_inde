import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { BodegasService } from '../../../../services/bodegas.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

declare var $: any

@Component({
  selector: 'app-agregar-bodega',
  standalone: false,
  templateUrl: './agregar-bodega.component.html',
  styleUrl: './agregar-bodega.component.css'
})
export class AgregarBodegaComponent {

  @Input() oc: any;
  @Output() newItemEvent = new EventEmitter<string>();
  loading: boolean = false;

  bodegaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    numero: new FormControl(null, [Validators.required]),
    direccion: new FormControl(null),
    telefono: new FormControl(null)
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private bodegas_service: BodegasService
  ) {
  }

  async ngOnInit() {
  }

  async postBodega() {
    this.loading = true;
    let bodega = await this.bodegas_service.postBodega(this.bodegaForm.value);
    if (bodega.code) {
      this.alertas_service.success(bodega.mensaje);
      this.oc ? this.bodegaForm.reset() : this.location.back();
      $('.offcanvas').offcanvas('hide');            
      this.newItemEvent.emit(bodega.data);
    }
    this.loading = false;
  }
  
}

