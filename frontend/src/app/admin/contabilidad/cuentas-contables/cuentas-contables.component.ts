import { Component } from '@angular/core';
import { CuentasContablesService } from '../../../services/cuentas_contables.service';
import { AlertasService } from '../../../services/alertas.service';
import { FormControl, FormGroup } from '@angular/forms';
import { VariablesService } from '../../../services/variables.service';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router,RouterLink, RouterModule } from '@angular/router';
import { RootService } from '../../../services/root.service';


@Component({
  selector: 'app-cuentas-contables',
  standalone: false,
  templateUrl: './cuentas-contables.component.html',
  styleUrl: './cuentas-contables.component.css'
})

export class CuentasContablesComponent {
  
  cuentas_contables: any = [];
  cuenta_contable: any = [];
  niv_nom: any;
  margin_left: number = 25;

  filtros: FormGroup = new FormGroup({
    numero: new FormControl(null),
    nombre: new FormControl(null),
    nivel: new FormControl(null),
    origen: new FormControl(null),
    tipo: new FormControl(null),
    cuenta_contable_id: new FormControl(null)  

  })

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private cuentas_contables_service: CuentasContablesService,
    private variables_service: VariablesService,
    private rootService: RootService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    await this.getCuentasContables();
    let variable = await this.variables_service.getVariables({ slug: 'niv_nom' });
    this.niv_nom = variable.data[0].valor;
  }

  async getCuentasContables() {
    let cuentas_contables = await this.cuentas_contables_service.getCuentasContables(this.filtros.value);
    this.cuentas_contables = cuentas_contables.data;
    for (const cuenta of this.cuentas_contables) {
      cuenta.expandir = true;
      cuenta.comprimir = false;
    }
  }

  async deleteCuentaContable(m: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let cuenta_contable = await this.cuentas_contables_service.deleteCuentaContable(m.id);
        if (cuenta_contable.code) {
          await this.getCuentasContables();
          this.alertas_service.success('Cuenta Contable eliminada');
        }
      }
    });
  }
}
