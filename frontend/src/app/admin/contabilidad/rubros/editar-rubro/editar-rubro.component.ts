import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { RubrosService } from '../../../../services/rubros.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../../../app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { VariablesService } from '../../../../services/variables.service';
import { PresupuestosService } from '../../../../services/presupuestos.service';
import { EditarPresupuestoComponent } from '../../presupuestos/editar-presupuesto/editar-presupuesto.component';
import { Location } from '@angular/common';
import { CuentasContablesService } from '../../../../services/cuentas_contables.service';



@Component({
  selector: 'app-editar-rubro',
  standalone: false,
  templateUrl: './editar-rubro.component.html',
  styleUrl: './editar-rubro.component.css'
})
export class EditarRubroComponent {

  @Input() rubro_id: any;
  loading: boolean = false;
  
  tipos: any = ['MAYORIZACION', 'JORNALIZACION'];
  rubros: any = [];
  rubro: any = [];
  niv_nom: any;
  margin_left: number = 25;

static presupuesto_id: any;
static rubro_id: any;
presupuestos: any = [];
filtros: FormGroup = new FormGroup({
  numero: new FormControl(null),
  nombre: new FormControl(null),
  nivel: new FormControl(null),
  tipo: new FormControl(null),
  monto: new FormControl(null),
  presupuesto_id: new FormControl(null),
  rubro_id: new FormControl(null),  
});

rubros_cuentas: any = [];
cuentas_contables: any = [];
rubroForm: FormGroup = new FormGroup({
  numero: new FormControl(null,[Validators.required]),
  nombre:new FormControl(null,[Validators.required]),
  nivel:new FormControl(null,[Validators.required]),
  tipo:new FormControl(null,[Validators.required]),
  monto:new FormControl(null,[Validators.required]),
  presupuesto_id:new FormControl(null,[Validators.required]),
  rubro_id:new FormControl(null),
});



tempData: any = {
  tipo: '',
};


constructor(
  private alertas_service: AlertasService,
  private ngxService: NgxUiLoaderService,
  private rubros_service: RubrosService,
  private variables_service: VariablesService,
  private presupuestos_service: PresupuestosService,
  private location: Location,
  private cuentas_contables_service: CuentasContablesService,
){}
get selectS() {
  return AppComponent.selectS;
}

async getRubros(){
  let rubros = await this.rubros_service.getRubros(this.filtros.value);
  this.rubros = rubros.data;
}

getPresupuestos(){
  this.presupuestos = this.presupuestos_service.getPresupuestos();
}
async ngOnInit() {
  await this.getCuentasContables();
  await this.getRubros();
  await this.getRubro();
  let variable = await this.variables_service.getVariables({ slug: 'niv_nom' });
  this.niv_nom = variable.data[0].valor;
  if(this.rubro_id){
    let rubro = await this.rubros_service.getRubro(this.rubro_id);
    if (rubro.data) {
      let numero = 0;
      if ( rubro.data.rubros_hijos.length > 0) {
        numero = parseInt(rubro.data.rubros_hijos[rubro.data.rubros_hijos.length - 1].numero);
        console.log('tipo1:',this.rubroForm.value.tipo)
        this.rubroForm.controls['numero'].setValue(numero + 1);
      }else{
        this.rubroForm.controls['numero'].setValue(rubro.data.numero.toString() + (numero + 1));
        console.log('tipo2:',this.rubroForm.value.tipo)
      }
      let nivel = parseFloat(rubro.data.nivel) ;
      this.rubroForm.controls['nivel'].setValue(nivel);
      this.rubroForm.controls['tipo'].setValue(nivel == this.niv_nom ? ['JORNALIZACION'] : ['MAYORIZACION']);
      console.log('nivel enthis.niv_nom',this.niv_nom,'nivel',nivel)
      this.rubroForm.controls['rubro_id'].setValue([rubro.data]);
      this.rubroForm.controls['presupuesto_id'].setValue(rubro.data.presupuesto_id);
      console.log('tipo3:',this.rubroForm.value.tipo)
    } else{
      let numero = parseInt(this.rubros[this.rubros.length - 1].numero);
      this.rubroForm.controls['numero'].setValue(numero + 1);
      this.rubroForm.controls['nivel'].setValue(1);
      this.rubroForm.controls['tipo'].setValue([rubro.data.tipo]);
      this.rubroForm.controls['presupuesto_id'].setValue(rubro.data.presupuesto_id);
      this.rubroForm.controls['rubro_id'].setValue([rubro.data]);
      console.log('tipo4:',this.rubroForm.value.tipo)
      
    }
    let muestratipo = [rubro.data.tipo];
    console.log('muestratipo:',muestratipo)
  }
  
  
}


async getRubro() {
  let rubro = await this.rubros_service.getRubro(this.rubro_id);
  if (rubro.data) {
    this.rubroForm.patchValue(rubro.data);
    this.rubroForm.controls['presupuesto_id'].setValue(rubro.data.presupuesto_id);
    this.rubroForm.controls['rubro_id'].setValue([rubro.data.rubro_padre]);
    console.log('tipo1:',this.rubroForm.value.tipo)
    if(this.rubroForm.value.nivel == this.niv_nom){
      this.rubroForm.controls['tipo'].setValue(['JORNALIZACION']);
    }  
    console.log('tipo1:',this.rubroForm.value.tipo)
  }
}


  async putRubro(){
    let rubroValue = this.rubroForm.value;
  //  rubroValue.tipo = this.tempData.tipo;
    this.rubroForm.controls['presupuesto_id'].setValue(EditarRubroComponent.presupuesto_id);
    this.rubroForm.controls['rubro_id'].setValue(EditarRubroComponent.rubro_id);
    this.rubroForm.controls['tipo'].setValue([rubroValue.data.tipo]);
    this.rubroForm.controls['monto'].setValue(this.rubroForm.value.monto);
    this.rubroForm.controls['nivel'].setValue(this.rubroForm.value.nivel);
    this.rubroForm.controls['nombre'].setValue(this.rubroForm.value.nombre);
    EditarRubroComponent.rubro_id = this.rubroForm.value.rubro_id;
    if(this.rubroForm.value.rubro_id){
      this.rubroForm.controls['rubro_id'].setValue(this.rubroForm.value.rubro_id[0].id);
    }
    this.ngxService.start();
    let rubro = await this.rubros_service.putRubro(this.rubro_id,rubroValue);
    if(rubro.code){
      this.alertas_service.success(rubro.mensaje);
      await this.getRubro();
    }
    this.ngxService.stop();    
    this.loading = false;
    this.volver();
  }




async volver(){
  this.location.back();
}
removeCuenta(i:number){
  this.rubros_cuentas.splice(i, 1);
} 
agregarRubroCuenta(){
  this.rubros_cuentas.push({
    rubro_id: null,
    cuentas_contables: null,
  });
}
async getCuentasContables() {
  let cuentas_contables = await this.cuentas_contables_service.getCuentasJornalizacion();
  this.cuentas_contables = cuentas_contables.data;
}

agregarCuenta() {
  this.rubros_cuentas.push({
    cuenta_contable_id:null,
})
}

  getTipoRubro(){
    if(this.rubroForm.value.tipo == 'JORNALIZACION'){
      let prueba = 'JORNALIZACION';
    }
  }


}
