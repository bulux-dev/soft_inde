import { Component } from '@angular/core';
import { EtiquetasService } from '../../../services/etiquetas.service';
import { AlertasService } from '../../../services/alertas.service';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-etiquetas',
  standalone: false,
  templateUrl: './etiquetas.component.html',
  styleUrl: './etiquetas.component.css'
})
export class EtiquetasComponent {

  etiquetas: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null),
    descripcion: new FormControl(null)
  })

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private etiquetas_service: EtiquetasService
  ) {

  }

  async ngOnInit() {
    await this.getEtiquetas();
    this.scripts_service.datatable();
  }

  async getEtiquetas() {
    let etiquetas = await this.etiquetas_service.getEtiquetas(this.filtros.value);
    this.etiquetas = etiquetas.data;
  }

  async deleteEtiqueta(m: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let etiqueta = await this.etiquetas_service.deleteEtiqueta(m.id);
        if (etiqueta.code) {
          this.etiquetas.splice(this.etiquetas.indexOf(m), 1);
          this.alertas_service.success(etiqueta.mensaje);
        }
      }
    });
  }

  async changeStatus(e: any) {
    let usuario = await this.etiquetas_service.putEtiqueta(e.id, { estado: !e.estado });
    if (usuario.code) {
      await this.getEtiquetas();
      this.alertas_service.success('Estado actualizado', true);
    }
  }

}

