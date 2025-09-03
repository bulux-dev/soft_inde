import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { ImpresorasService } from '../../../../services/impresoras.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AppComponent } from '../../../../app.component';

declare var $: any

@Component({
  selector: 'app-agregar-impresora',
  standalone: false,
  templateUrl: './agregar-impresora.component.html',
  styleUrl: './agregar-impresora.component.css'
})
export class AgregarImpresoraComponent {

  @Input() oc: any;
  @Output() newItemEvent = new EventEmitter<string>();
  loading: boolean = false;

  get selectS() {
    return AppComponent.selectS;
  }

  impresoraForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    ip: new FormControl(null, [Validators.required]),
    tabs: new FormControl(null, [Validators.required])
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private impresoras_service: ImpresorasService
  ) {
  }

  async ngOnInit() {
    
  }

  async postImpresora() {
    this.loading = true;
    let impresora = await this.impresoras_service.postImpresora(this.impresoraForm.value);
    if (impresora.code) {
      this.alertas_service.success(impresora.mensaje);
      this.oc ? this.impresoraForm.reset() : this.location.back();
      $('.offcanvas').offcanvas('hide');
      this.newItemEvent.emit(impresora.data);
    }
    this.loading = false;
  }

}

