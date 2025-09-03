import { Component } from '@angular/core';
import { BodegasService } from '../../../services/bodegas.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-bodegas',
  standalone: false,
  templateUrl: './bodegas.component.html',
  styleUrl: './bodegas.component.css'
})
export class BodegasComponent {

  bodegas: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null),
    numero: new FormControl(null),
    direccion: new FormControl(null),
    telefono: new FormControl(null),
  })

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private bodegas_service: BodegasService
  ) {

  }

  async ngOnInit() {
    await this.getBodegas();
    this.scripts_service.datatable();
  }

  async getBodegas() {
    let bodegas = await this.bodegas_service.getBodegas(this.filtros.value);
    this.bodegas = bodegas.data;
  }

  async deleteBodega(b: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let bodega = await this.bodegas_service.deleteBodega(b.id);
        if (bodega.code) {
          this.bodegas.splice(this.bodegas.indexOf(b), 1);
          this.alertas_service.success(bodega.mensaje);
        }
      }
    });
  }

}

