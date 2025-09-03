import { Component } from '@angular/core';
import { AtributosService } from '../../../services/atributos.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-atributos',
  standalone: false,
  templateUrl: './atributos.component.html',
  styleUrl: './atributos.component.css'
})
export class AtributosComponent {

  atributos: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null)
  })

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private atributos_service: AtributosService
  ) {

  }

  async ngOnInit() {
    await this.getAtributos();
    this.scripts_service.datatable();
  }

  async getAtributos() {
    let atributos = await this.atributos_service.getAtributos(this.filtros.value);
    this.atributos = atributos.data;
  }

  async deleteAtributo(m: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let atributo = await this.atributos_service.deleteAtributo(m.id);
        if (atributo.code) {
          this.atributos.splice(this.atributos.indexOf(m), 1);
          this.alertas_service.success(atributo.mensaje);
        }
      }
    });
  }

}

