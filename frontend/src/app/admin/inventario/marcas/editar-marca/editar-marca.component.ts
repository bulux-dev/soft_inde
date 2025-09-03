import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { MarcasService } from '../../../../services/marcas.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-marca',
  standalone: false,
  templateUrl: './editar-marca.component.html',
  styleUrl: './editar-marca.component.css'
})
export class EditarMarcaComponent {

  @Input() marca_id: any;
  loading: boolean = false;

  marcaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null)
  });

  constructor(
    private alertas_service: AlertasService,
    private marcas_service: MarcasService
  ) {
  }

  async ngOnInit() {
    let marca = await this.marcas_service.getMarca(this.marca_id);
    if (marca.code) {
      this.marcaForm.patchValue(marca.data);
    }
  }
  
  async putMarca() {
    this.loading = true;
    let marca = await this.marcas_service.putMarca(this.marca_id, this.marcaForm.value);
    if (marca.code) {
      this.alertas_service.success(marca.mensaje);
    }
    this.loading = false;
  }

}

