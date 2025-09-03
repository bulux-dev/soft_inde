import { Component } from '@angular/core';
import { MarcasService } from '../../../services/marcas.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-marcas',
  standalone: false,
  templateUrl: './marcas.component.html',
  styleUrl: './marcas.component.css'
})
export class MarcasComponent {

  marcas: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null),
    descripcion: new FormControl(null)
  })

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private marcas_service: MarcasService
  ) {

  }

  async ngOnInit() {
    await this.getMarcas();
    this.scripts_service.datatable();
  }

  async getMarcas() {
    let marcas = await this.marcas_service.getMarcas(this.filtros.value);
    this.marcas = marcas.data;
  }

  async deleteMarca(m: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let marca = await this.marcas_service.deleteMarca(m.id);
        if (marca.code) {
          this.marcas.splice(this.marcas.indexOf(m), 1);
          this.alertas_service.success(marca.mensaje);
        }
      }
    });
  }

}

