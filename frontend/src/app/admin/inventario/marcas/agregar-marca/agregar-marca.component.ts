import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { MarcasService } from '../../../../services/marcas.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

declare var $: any

@Component({
  selector: 'app-agregar-marca',
  standalone: false,
  templateUrl: './agregar-marca.component.html',
  styleUrl: './agregar-marca.component.css'
})
export class AgregarMarcaComponent {

  @Input()oc: any
  @Output() newItemEvent = new EventEmitter<string>();
  loading: boolean = false;

  marcaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null)
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private marcas_service: MarcasService
  ) {
  }

  async ngOnInit() {
  }

  async postMarca() {
    this.loading = true;
    let marca = await this.marcas_service.postMarca(this.marcaForm.value);
    if (marca.code) {
      this.alertas_service.success(marca.mensaje);
      this.oc ? this.marcaForm.reset() : this.location.back();
      $('.offcanvas').offcanvas('hide');            
      this.newItemEvent.emit(marca.data);
    }
    this.loading = false;
  }

}

