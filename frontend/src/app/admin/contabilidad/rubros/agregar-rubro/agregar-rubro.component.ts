import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { RubrosService } from '../../../../services/rubros.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { PresupuestosService } from '../../../../services/presupuestos.service';
import { PresupuestosComponent } from '../../presupuestos/presupuestos.component';
import { AppComponent } from '../../../../app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { VariablesService } from '../../../../services/variables.service';
import { EditarPresupuestoComponent } from '../../presupuestos/editar-presupuesto/editar-presupuesto.component';



declare var $: any

@Component({
  selector: 'app-agregar-rubro',
  standalone: false,
  templateUrl: './agregar-rubro.component.html',
  styleUrl: './agregar-rubro.component.css'
})
export class AgregarRubroComponent {

  @Input() rubro_id: any
  @Input() oc: any
  @Output() newItemEvent = new EventEmitter<string>();
  loading: boolean = false;

  tipos: any = ['MAYORIZACION', 'JORNALIZACION'];
  static presupuesto_id: any;
  static rubro_id: any;
  niv_nom: any;
  rubros: any = [];
  rubros_cuentas: any = [];
  cuentas_contables: any = [];

  filtros: FormGroup = new FormGroup({
    numero: new FormControl(null),
    nombre: new FormControl(null),
    nivel: new FormControl(null),
    tipo: new FormControl(null),
    monto: new FormControl(null),
    rubro_id: new FormControl(null),
    presupuesto_id: new FormControl(null),

  });
  presupuestoForm: FormGroup = new FormGroup({
    presupuesto_id: new FormControl(null, [Validators.required]),
  });
  

  rubroForm: FormGroup = new FormGroup({
    numero: new FormControl(null, [Validators.required]),
    nombre: new FormControl(null, [Validators.required]),
    nivel: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required]),
    monto: new FormControl(null, [Validators.required]),
    presupuesto_id: new FormControl(null, [Validators.required]),
    rubro_id: new FormControl(null),
  });

  tempData: any ={
    tipo:'',
  }

  onTipoSelect(selectedItem: any): void {
    console.log(selectedItem);
    this.tempData.tipo = selectedItem;
  }  
    constructor (
    private location: Location,
    private alertas_service: AlertasService,
    private rubros_service: RubrosService,
    private ngxService: NgxUiLoaderService,
    private variables_service: VariablesService

  ){}
  get selectS() {
    return AppComponent.selectS;
  }
  async ngOnInit(){
    await this.getRubros();

    let variable = await this.variables_service.getVariables({ slug: 'niv_nom' });
    this.niv_nom = variable.data[0].valor;

    if (this.rubro_id) {
      let rubro = await this.rubros_service.getRubro(this.rubro_id);
      if (rubro.code) {
        let numero = 0;
        if (rubro.data.rubros_hijos.length > 0) {
          numero = parseInt(rubro.data.rubros_hijos[rubro.data.rubros_hijos.length - 1].numero);
          this.rubroForm.controls['numero'].setValue(numero + 1);
        } else {
          this.rubroForm.controls['numero'].setValue(rubro.data.numero.toString() + (numero + 1));
        }
        let nivel = parseFloat(rubro.data.nivel) + 1;
        this.rubroForm.controls['nivel'].setValue(nivel);
        this.rubroForm.controls['tipo'].setValue(nivel == this.niv_nom ? ['JORNALIZACION'] : ['MAYORIZACION']);
        this.rubroForm.controls['rubro_id'].setValue([rubro.data]);
        this.rubroForm.controls['presupuesto_id'].setValue(rubro.data.presupuesto_id);
      }
    } else {
      let numero = this.rubros[this.rubros.length - 1].numero;
      this.rubroForm.controls['numero'].setValue(numero + 1);
      this.rubroForm.controls['nivel'].setValue(1);
      this.rubroForm.controls['tipo'].setValue('MAYORIZACION');
      this.rubroForm.controls['presupuesto_id'].setValue(AgregarRubroComponent.presupuesto_id);
      this.rubroForm.controls['monto'].setValue(0);
    }
  
  }
  async getRubros(){
    let rubros = await this.rubros_service.getRubros(this.filtros.value);
    this.rubros = rubros.data; 
  }



  async postRubro(){
    let rubroValue = this.rubroForm.value;
    rubroValue.tipo = this.tempData.tipo;
    this.rubroForm.controls['presupuesto_id'].setValue(this.rubroForm.value.presupuesto_id);
    this.rubroForm.controls['rubro_id'].setValue(this.rubro_id);
    this.rubroForm.controls['tipo'].setValue(this.rubroForm.value.tipo[0]);
    this.rubroForm.controls['monto'].setValue(this.rubroForm.value.monto);
    this.rubroForm.controls['nivel'].setValue(this.rubroForm.value.nivel);
    this.rubroForm.controls['nombre'].setValue(this.rubroForm.value.nombre);
   
    this.ngxService.start();
    let rubro = await this.rubros_service.postRubro(this.rubroForm.value);
    console.log('rubros en total' , rubro)
    if(rubro.code){
      this.alertas_service.success(rubro.mensaje);
      this.oc ? this.rubroForm.reset() : this.location.back();
      $('.offcanvas').offcanvas('hide');            
      this.newItemEvent.emit(rubro.data);
    }
    this.ngxService.stop();
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
  
}