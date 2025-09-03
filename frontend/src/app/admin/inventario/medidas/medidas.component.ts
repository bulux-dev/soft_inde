import { Component } from '@angular/core';
import { MedidasService } from '../../../services/medidas.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-medidas',
  standalone: false,
  templateUrl: './medidas.component.html',
  styleUrl: './medidas.component.css'
})
export class MedidasComponent {

  medidas: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null)
  })

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private medidas_service: MedidasService
  ) {

  }

  async ngOnInit() {
    await this.getMedidas();
    this.scripts_service.datatable();
  }

  async getMedidas() {
    let medidas = await this.medidas_service.getMedidas(this.filtros.value);
    this.medidas = medidas.data;
  }

  async deleteMedida(m: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let medida = await this.medidas_service.deleteMedida(m.id);
        if (medida.code) {
          this.medidas.splice(this.medidas.indexOf(m), 1);
          this.alertas_service.success(medida.mensaje);
        }
      }
    });
  }

}

