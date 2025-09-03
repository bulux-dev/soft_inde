import { Component } from '@angular/core';
import { BancosService } from '../../../services/bancos.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-bancos',
  standalone: false,
  templateUrl: './bancos.component.html',
  styleUrl: './bancos.component.css'
})
export class BancosComponent {

  bancos: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    siglas: new FormControl(null, [Validators.required])
  })

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private bancos_service: BancosService
  ) {

  }

  async ngOnInit() {
    await this.getBancos();
    this.scripts_service.datatable();
  }

  async getBancos() {
    let bancos = await this.bancos_service.getBancos(this.filtros.value);
    this.bancos = bancos.data;
  }

  async deleteBanco(e: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let banco = await this.bancos_service.deleteBanco(e.id);
        if (banco.code) {
          this.bancos.splice(this.bancos.indexOf(e), 1);
          this.alertas_service.success(banco.mensaje);
        }
      }
    });
  }

  iniciales(nombre: any, apellido: any) {
    if (!apellido) {
      nombre = nombre.split(' ');
      if (nombre.length > 1) {
        return nombre[0][0] + nombre[1][0];
      }
      return nombre[0][0] + nombre[0][1];
    }
    return nombre[0] + apellido[0];
  }

}

