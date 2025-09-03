import { Component } from "@angular/core"
import { CentrosCostosService } from '../../../services/centros-costos.service'
import { AlertasService } from "../../../services/alertas.service"
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { VariablesService } from "../../../services/variables.service"
import { NgModule } from "@angular/core"
import { AppComponent } from "../../../app.component"
import { RouterLink, RouterModule } from "@angular/router"



@Component({
  selector: "app-centros-costos",
  standalone: false,
  templateUrl: "./centros-costos.component.html",
  styleUrls: ["./centros-costos.component.css"]
})

export class CentrosCostosComponent {
  centros_costos: any = [];
  centro_costo: any = [];
  niv_nom: any;
  margin_left: number = 25;

  filtros: FormGroup = new FormGroup({
    numero: new FormControl(null),
    nombre: new FormControl(null),
    nivel: new FormControl(null),
    tipo: new FormControl(null),
    centro_costo_id: new FormControl(null)
  });
  constructor(
    private centros_costos_service: CentrosCostosService,
    private alertas_service: AlertasService,
    private variables_service: VariablesService

  ) { }

  async ngOnInit() {
    await this.getCentrosCostos();
    let variable = await this.variables_service.getVariables({ slug: 'niv_nom' });
    this.niv_nom = variable.data[0].valor;
  }

  async getCentrosCostos() {
    let centros_costos = await this.centros_costos_service.getCentrosCostos(this.filtros.value);
    this.centros_costos = centros_costos.data;
    for (const centro of this.centros_costos) {
      centro.expandir = true;
      centro.comprimir = false;
    }
  }

  async deleteCentroCosto(m: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if(result.isConfirmed){
        let centro_costo = await this.centros_costos_service.deleteCentroCosto(m.id);
        if(centro_costo.code){
          await this.getCentrosCostos();
          this.alertas_service.success('Centro Costo eliminado');
        }}
  });
  }


}
