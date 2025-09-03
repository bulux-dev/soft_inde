import { Component, Input, Output, EventEmitter } from '@angular/core';
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
import { RubrosCuentasService } from '../../../../services/rubros-cuentas.service';
import { CuentasContablesService } from '../../../../services/cuentas_contables.service';
import { PresupuestosComponent } from '../../presupuestos/presupuestos.component';



declare var $: any
@Component({
  selector: 'app-editar-rubro-cuenta',
  standalone: false,
  templateUrl: './editar-rubro-cuenta.component.html',
  styleUrl: './editar-rubro-cuenta.component.css'
})
export class EditarRubroCuentaComponent {
  @Input() rubro_id: any;
  @Output() newItemEvent = new EventEmitter<string>();
  @Input() oc: any;
  loading: boolean = false;
  
  tipos: any = ['MAYORIZACION', 'JORNALIZACION'];
  rubros: any = [];
  rubro: any = [];
  niv_nom: any;
  margin_left: number = 25;
  cuentas_contables: any = [];
  rubros_cuentas: any = [];

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

rubroForm: FormGroup = new FormGroup({
  numero: new FormControl(null, [Validators.required]),
  nombre: new FormControl(null, [Validators.required]),
  nivel: new FormControl(null, [Validators.required]),
  tipo: new FormControl(null, [Validators.required]),
  monto: new FormControl(null, [Validators.required]),
  presupuesto_id: new FormControl(null, [Validators.required]),
  rubro_id: new FormControl(null),
  rubros_cuentas: new FormControl([]),
});

rubroCuentaForm: FormGroup = new FormGroup({
  cuenta_contable_id: new FormControl(null, [Validators.required]),
  rubro_id: new FormControl(null, [Validators.required]),
});






//  static presupuesto_id: any;

constructor(
  private alertas_service: AlertasService,
  private ngxService: NgxUiLoaderService,
  private rubros_service: RubrosService,
  private variables_service: VariablesService,
  private presupuestos_service: PresupuestosService,
  private location: Location,
  private rubros_cuentas_service: RubrosCuentasService,
  private cuentas_contables_service: CuentasContablesService
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
    await this.getRubro();
}

async getCuentasContables() {
  let cuentas_contables = await this.cuentas_contables_service.getCuentasJornalizacion();
  this.cuentas_contables = cuentas_contables.data;
}

async getRubro() {
  let rubro = await this.rubros_service.getRubro(this.rubro_id);
  if (rubro.data) {
    this.rubroForm.patchValue(rubro.data);
    this.rubroForm.controls['presupuesto_id'].setValue(rubro.data.presupuesto_id);
    this.rubroForm.controls['rubro_id'].setValue([rubro.data.rubro_padre]);
    this.rubroForm.controls['tipo'].setValue([rubro.data.tipo]);
    let muestratipo = [rubro.data.tipo];
    console.log('muestratipo:',muestratipo)
    console.log('padre: ', [rubro.data.rubro_padre]);
    
  }
}

  

  async postRubroCuenta(){   
    this.ngxService.start();
    try{
      let rubros = this.rubros_cuentas.map((d: any) => {
        d.cuenta_contable_id = d.cuenta_contable_id ? d.cuenta_contable_id[0].id : null;
        d.rubro_id = d.rubro_id ? d.rubro_id : parseInt(this.rubro_id);
      });

      
      this.rubroForm.controls['rubros_cuentas'].setValue(this.rubros_cuentas);
      console.log(this.rubros_cuentas)
      this.rubros_cuentas_service.postRubroCuenta(rubros);
      this.alertas_service.success('Cuenta contable guardada exitosamente');
      }catch(error){
      this.alertas_service.error('Error al guardar la cuenta contable');      
    }
    this.ngxService.stop();
  }
  agregarCuenta() {
      this.rubros_cuentas.push({
        cuenta_contable_id:null,
    })
  }
removeCuenta(i:number){
  this.rubros_cuentas.splice(i, 1);
}
  async volver(){
    this.location.back();
  }

  async putRubroCuenta(){
    this.ngxService.start();
    try{
      this.rubroCuentaForm.controls['rubro_id'].setValue(this.rubro_id);
      this.rubroCuentaForm.controls['cuenta_contable_id'].setValue(this.rubroCuentaForm.value.cuenta_contable_id[0].id);
      this.rubros_cuentas.map((d: any)=>{
        d.cuenta_contable_id = d.cuenta_contable_id ? d.cuenta_contable_id[0].id : null;
        d.rubro_id = d.rubro_id ? d.rubro_id[0].id : null;
        delete d.cuenta_contable;
        delete d.rubro;
      });
    
    } catch(error){
      console.log(error);
      this.alertas_service.error('Error al guardar la cuenta contable');
    }
    this.ngxService.stop();
  }

  agregarRubroCuenta(){
    this.rubros_cuentas.push({
      rubro_id: null,
      cuentas_contables: null,
    });
  }
  getTipoRubro(){
    this.rubro.data.tipo;
    console.log(this.rubro.data);
  }
}
