import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { AtributosService } from '../../../../services/atributos.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AppComponent } from '../../../../app.component';

declare var $: any

@Component({
  selector: 'app-agregar-atributo',
  standalone: false,
  templateUrl: './agregar-atributo.component.html',
  styleUrl: './agregar-atributo.component.css'
})
export class AgregarAtributoComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  @Input() oc: any;
  @Output() newItemEvent = new EventEmitter<string>();
  loading: boolean = false;

  atributoForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    valores: new FormControl([]),
  });
  

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private atributos_service: AtributosService,
  ) {
  }

  async ngOnInit() {

  }

  async postAtributo() {
    this.loading = true;
    let atributo = await this.atributos_service.postAtributo(this.atributoForm.value);

    if (atributo.code) {
      this.alertas_service.success(atributo.mensaje);
      this.oc ? this.atributoForm.reset() : this.location.back();
      $('.offcanvas').offcanvas('hide');                  
      this.newItemEvent.emit(atributo.data);
    }
    this.loading = false;
  }

}

