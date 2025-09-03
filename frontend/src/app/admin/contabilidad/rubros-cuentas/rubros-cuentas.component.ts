import { Component } from '@angular/core';
import { RubrosCuentasService } from '../../../services/rubros-cuentas.service';
import { RubrosService } from '../../../services/rubros.service';
import { AlertasService } from '../../../services/alertas.service';
import {RouterLink, RouterOutlet} from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-rubros-cuentas',
  standalone: false,
  templateUrl: './rubros-cuentas.component.html',
  styleUrl: './rubros-cuentas.component.css'
})
export class RubrosCuentasComponent {
  rubros_cuentas: any = [];
  filtros: FormGroup = new FormGroup({
    rubro_id: new FormControl(null),
    cuenta_id: new FormControl(null)
  })

  constructor(
    private rubros_cuentas_service: RubrosCuentasService,
    private rubros_service: RubrosService,
    private alertas_service: AlertasService,
    private scripts_service: ScriptsService
  ){}


  async getRubrosCuentas(){
    let rubros_cuentas = await this.rubros_cuentas_service.getRubrosCuentas(this.filtros.value);
    this.rubros_cuentas = rubros_cuentas.data;
  }


  async deleteRubroCuenta(m: any){
    this.alertas_service.eliminar().then(async(result: any)=>{
      if(result.isConfirmed){
        let rubro_cuenta = await this.rubros_cuentas_service.deleteRubroCuenta(m.id);
        if(rubro_cuenta.code){
          this.rubros_cuentas.splice(this.rubros_cuentas.indexOf(m),1);
          this.alertas_service.success(rubro_cuenta.mensaje);
        }
      }
    })
  }

}
