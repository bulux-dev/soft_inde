import { Component } from '@angular/core';
import { MonedasService } from '../../../services/monedas.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monedas',
  standalone: false,
  templateUrl: './monedas.component.html',
  styleUrl: './monedas.component.css'
})
export class MonedasComponent {

  monedas: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null),
    simbolo: new FormControl(null),
    tipo_cambio: new FormControl(null)
  })

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private monedas_service: MonedasService
  ) {

  }

  async ngOnInit() {
    await this.getMonedas();
    this.scripts_service.datatable();
  }

  async getMonedas() {
    let monedas = await this.monedas_service.getMonedas(this.filtros.value);
    this.monedas = monedas.data;
  }

  async deleteMoneda(m: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let moneda = await this.monedas_service.deleteMoneda(m.id);
        if (moneda.code) {
          this.monedas.splice(this.monedas.indexOf(m), 1);
          this.alertas_service.success(moneda.mensaje);
        }
      }
    });
  }

}

