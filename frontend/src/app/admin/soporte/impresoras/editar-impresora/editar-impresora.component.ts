import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { ImpresorasService } from '../../../../services/impresoras.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-editar-impresora',
  standalone: false,
  templateUrl: './editar-impresora.component.html',
  styleUrl: './editar-impresora.component.css'
})
export class EditarImpresoraComponent {

  @Input() impresora_id: any;
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
    private alertas_service: AlertasService,
    private impresoras_service: ImpresorasService
  ) {
  }

  async ngOnInit() {
    await this.getImpresora();
  }

  async getImpresora() {
    let impresora = await this.impresoras_service.getImpresora(this.impresora_id);
    if (impresora.code) {
      this.impresoraForm.patchValue(impresora.data);
    }
  }
  
  async putImpresora() {
    this.loading = true;
    let impresora = await this.impresoras_service.putImpresora(this.impresora_id, this.impresoraForm.value);
    if (impresora.code) {
      this.alertas_service.success(impresora.mensaje);
      await this.getImpresora();
    }
    this.loading = false;
  }

}

