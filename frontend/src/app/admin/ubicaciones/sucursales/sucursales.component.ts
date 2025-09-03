import { Component } from '@angular/core';
import { SucursalesService } from '../../../services/sucursales.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sucursales',
  standalone: false,
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.css'
})
export class SucursalesComponent {

  sucursales: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null),
    numero: new FormControl(null),
    direccion: new FormControl(null),
    telefono: new FormControl(null)
  })

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private sucursales_service: SucursalesService
  ) {

  }

  async ngOnInit() {
    await this.getSucursales();
    this.scripts_service.datatable();
  }

  async getSucursales() {
    let sucursales = await this.sucursales_service.getSucursales(this.filtros.value);
    this.sucursales = sucursales.data;
  }

  async deleteSucursal(s: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let sucursal = await this.sucursales_service.deleteSucursal(s.id);
        if (sucursal.code) {
          this.sucursales.splice(this.sucursales.indexOf(s), 1);
          this.alertas_service.success(sucursal.mensaje);
        }
      }
    });
  }

}

