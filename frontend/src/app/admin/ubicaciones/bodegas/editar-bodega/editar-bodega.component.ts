import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { BodegasService } from '../../../../services/bodegas.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-bodega',
  standalone: false,
  templateUrl: './editar-bodega.component.html',
  styleUrl: './editar-bodega.component.css'
})
export class EditarBodegaComponent {

  @Input() bodega_id: any;
  loading: boolean = false;

  bodegaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    numero: new FormControl(null, [Validators.required]),
    direccion: new FormControl(null),
    telefono: new FormControl(null)
  });

  constructor(
    private alertas_service: AlertasService,
    private Bodegas_service: BodegasService
  ) {
  }

  async ngOnInit() {
    let bodega = await this.Bodegas_service.getBodega(this.bodega_id);
    if (bodega.code) {
      this.bodegaForm.patchValue(bodega.data);
    }
  }
  
  async putBodega() {
    this.loading = true;
    let bodega = await this.Bodegas_service.putBodega(this.bodega_id, this.bodegaForm.value);
    if (bodega.code) {
      this.alertas_service.success(bodega.mensaje);
    }
    this.loading = false;
  }

}

