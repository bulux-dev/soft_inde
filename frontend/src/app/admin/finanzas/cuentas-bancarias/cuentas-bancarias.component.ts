import { Component } from '@angular/core';
import { BancosService } from '../../../services/bancos.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CuentasBancariasService } from '../../../services/cuentas_bancarias.service';

@Component({
  selector: 'app-cuentas-bancarias',
  standalone: false,
  templateUrl: './cuentas-bancarias.component.html',
  styleUrl: './cuentas-bancarias.component.css'
})
export class CuentasBancariasComponent {

  cuentas_bancarias: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    no_cuenta: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required])
  })

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private cuentas_bancarias_service: CuentasBancariasService
  ) {

  }

  async ngOnInit() {
    await this.getCuentasBancarias();
    this.scripts_service.datatable();
  }

  async getCuentasBancarias() {
    let cuentas_bancanrias = await this.cuentas_bancarias_service.getCuentasBancarias(this.filtros.value);
    this.cuentas_bancarias = cuentas_bancanrias.data;
  }

  async deleteCuentaBancaria(e: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let cuenta_bancaria = await this.cuentas_bancarias_service.deleteCuentaBancaria(e.id);
        if (cuenta_bancaria.code) {
          this.cuentas_bancarias.splice(this.cuentas_bancarias.indexOf(e), 1);
          this.alertas_service.success(cuenta_bancaria.mensaje);
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
