
import { Component } from '@angular/core';
import { PartidasService } from '../../../services/partidas.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-partidas',
  standalone: false,
  templateUrl: './partidas.component.html',
  styleUrl: './partidas.component.css'
})
export class PartidasComponent {
  partidas: any[] = [];
  filtros: FormGroup = new FormGroup({
    fecha: new FormControl(null),
    numero: new FormControl(null),
    nombre: new FormControl(null),
    total: new FormControl(null),
    tipo: new FormControl(null),
    tipo_documento: new FormControl(null),
    categoria: new FormControl(null),
    estado: new FormControl(null),



  })
  constructor(
    private partidas_service: PartidasService,
    private alertas_service: AlertasService,
  ){

  }

  async ngOnInit() {
    await this.getPartidas();
}

  async getPartidas() {
    let partidas = await this.partidas_service.getPartidas(this.filtros.value);
    this.partidas = partidas.data;
  }
  async deletePartida(m: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let partida = await this.partidas_service.deletePartida(m.id);
        if (partida.code) {
          this.partidas.splice(this.partidas.indexOf(m), 1);
          this.alertas_service.success('Partida eliminada');
        }
      }
    })
  }

}