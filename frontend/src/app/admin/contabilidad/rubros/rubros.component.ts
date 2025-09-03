import { Component } from '@angular/core';
import { AlertasService } from '../../../services/alertas.service';
import { RubrosService } from '../../../services/rubros.service';
import { FormControl, FormGroup } from '@angular/forms';  
import { VariablesService } from '../../../services/variables.service';
import { ReactiveFormsModule } from '@angular/forms';
import { PresupuestosService } from '../../../services/presupuestos.service';
declare var $: any


@Component({
  selector: 'app-rubros',
  standalone: false,
  templateUrl: './rubros.component.html',
  styleUrl: './rubros.component.css'
})
export class RubrosComponent {

  rubros: any = [];
  rubro: any = [];
  niv_nom: any;
  margin_left: number = 25;


  filtros: FormGroup = new FormGroup({
    numero: new FormControl(null),
    nombre:new FormControl(null),
    nivel:new FormControl(null),
    tipo:new FormControl(null),
    monto:new FormControl(null),
    presupuesto_id:new FormControl(null),
    rubro_id:new FormControl(null),
  }  )

  constructor(
    private alertas_service: AlertasService,
    private rubros_service: RubrosService,
    private variables_service: VariablesService
  ){}


  async ngOnInit(){
    await this.getRubros();
    let variable = await this.variables_service.getVariables({ slug: 'niv_nom' });
    this.niv_nom = variable.data[0].valor;
    console.log(this.rubros);
  }


  async getRubros(){
    let rubros = await this.rubros_service.getRubros(this.filtros.value);
    this.rubros = rubros.data;
    for (const cuenta of this.rubros){
      cuenta.expandir = true;
      cuenta.comprimir = true;
    }
  }



  async deleteRubro(m: any){
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed){
        let rubro = await this.rubros_service.deleteRubro(m.id);
        if(rubro.code){
          await this.getRubros();
          this.alertas_service.success('Rubro eliminado');
        }
      }
    })
  }


}
