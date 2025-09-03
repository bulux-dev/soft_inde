import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { PresupuestosService } from '../../../../services/presupuestos.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { PresupuestosComponent } from '../presupuestos.component';
import { RubrosService } from '../../../../services/rubros.service';
import { VariablesService } from '../../../../services/variables.service';
import { EditarRubroComponent } from '../../rubros/editar-rubro/editar-rubro.component';
import { AgregarRubroComponent } from '../../rubros/agregar-rubro/agregar-rubro.component';
import { AppComponent } from '../../../../app.component';
import { EditarRubroCuentaComponent } from '../../rubros-cuentas/editar-rubro-cuenta/editar-rubro-cuenta.component';
import { RubrosCuentasService } from '../../../../services/rubros-cuentas.service';
import { EstadoPresupuestoService } from '../../../../services/estado-presupuesto.service';
import { CentrosCostosComponent } from '../../centros-costos/centros-costos.component';
import { CentrosCostosService } from '../../../../services/centros-costos.service';
declare var $: any

@Component({
  selector: 'app-editar-presupuesto',
  standalone: false,
  templateUrl: './editar-presupuesto.component.html',
  styleUrl: './editar-presupuesto.component.css'
})
export class EditarPresupuestoComponent {

  @Input() presupuesto_id: any;
  @Input() oc: any;
  @Output() newItemEvent = new EventEmitter<string>();
  @Input() rubro_id: any;
  @Output() estadoChange = new EventEmitter<string>();
  
  loading: boolean = false;
  rubros: any = [];
  niv_nom: any;
  margin_left: number = 25;
  totalRubros: number = 0;

  tipos: any = ['MAYORIZACION', 'JORNALIZACION'];
  centrosCostos: any = [];  

  presupuestoForm: FormGroup = new FormGroup({
    numero: new FormControl(null),
    nombre: new FormControl(null),
    fecha_inicio: new FormControl(null),
    fecha_fin: new FormControl(null),
    monto: new FormControl(null),
    tipo: new FormControl(null),
    centro_costo_id: new FormControl(null),
  });

  rubroForm: FormGroup = new FormGroup({
    numero: new FormControl(null),
    nombre: new FormControl(null),
    nivel: new FormControl(null),
    tipo: new FormControl(null),
    monto: new FormControl(null),
    presupuesto_id: new FormControl(null),
    rubro_id: new FormControl(null),
  })
  static rubro_id: any;

  tempData: any = {
    tipo: '',
  }
  tempRubroData: any = {
    tipoRubro: '',
  }
  constructor(
    private presupuestos_service: PresupuestosService,
    private alertas_service: AlertasService,
    private location: Location,
    private rubros_service: RubrosService,
    private variables_service: VariablesService,
    private rubros_cuentas_service: RubrosCuentasService,
    private EstadoPresupuestoService: EstadoPresupuestoService,
    private centros_costos_service: CentrosCostosService,
  ) { }

  get selectS() {
    return AppComponent.selectS;
  }
  async ngOnInit() {
    const centrosCostosData = await this.centros_costos_service.getCentrosJornalizacion();
    this.centrosCostos = centrosCostosData.data;
    await this.getPresupuesto();
    await this.getRubro(this.presupuesto_id);
    await this.getRubro(this.rubro_id);
    this.calculateTotalRubros();
    let variable = await this.variables_service.getVariables({ slug: 'niv_nom' });
    this.niv_nom = variable.data[0].valor;
    
    console.log(this.totalRubros);
    console.log(this.presupuestoForm.value.monto);
    this.verificarEstado();
    
    
  }

  getCentroCostoName(id: any): string {
    const centro = this.centrosCostos.find((c: any) => c.id === id);
    return centro ? `${centro.numero} - ${centro.nombre} - ${centro.tipo}` : 'N/A';
  }

  onCentroCostoSelect(selectedItem: any): void {
    this.tempData.centro_costo_id = selectedItem.id;
  }
  async ngOnChanges(){
  }
 

  async getPresupuesto() {
    let presupuesto = await this.presupuestos_service.getPresupuesto(this.presupuesto_id);
    if (presupuesto.code) {
      console.log('cargar el tipo',presupuesto.data.tipo)
      parseInt(presupuesto.data.monto);
      this.presupuestoForm.patchValue(presupuesto.data);
      this.presupuestoForm.controls['monto'].setValue(presupuesto.data.monto);
      this.presupuestoForm.controls['tipo'].setValue([presupuesto.data.tipo]);
      console.log('monto',presupuesto.data.monto);

      this.getRubro(this.presupuesto_id)
      this.rubroForm.controls['presupuesto_id'].setValue(this.presupuesto_id);
      let presupuesto_id = this.presupuesto_id;
    }
  }

  async postRubro() {
    this.loading = true;
    let rubroValue = this.rubroForm.value;
    rubroValue.tipo = this.tempRubroData.tipo;
    let rubro = await this.rubros_service.postRubro(this.rubroForm.value);
    console.log('data rubro', rubro);

    if (rubro.code) {
      this.alertas_service.success(rubro.mensaje);
      this.rubros.push(rubro.data);
      this.rubroForm.controls['numero'].setValue(null);
      this.rubroForm.controls['nombre'].setValue(null);
      this.rubroForm.controls['nivel'].setValue(null);
      this.rubroForm.controls['tipo'].setValue(null);
      this.rubroForm.controls['monto'].setValue(null);
      $('.offcanvas').offcanvas('hide');
      this.newItemEvent.emit(rubro.data);
    }
    this.loading = false;
    this.verificarEstado();
  }
  async getRubro(v: any = null) {
    let rubros = await this.rubros_service.getRubros(this.rubroForm.value);
    this.rubros = rubros.data;
    for (const rubro of this.rubros) {
      rubro.expandir = true;
      rubro.comprimier = false;
    }
    console.log(this.rubros);
  }
  async putPresupuesto() {
    let presupuestoValue = this.presupuestoForm.value;
    presupuestoValue.tipo = this.tempData.tipo;
    this.loading = true;
    let presupuesto = await this.presupuestos_service.putPresupuesto(this.presupuesto_id, this.presupuestoForm.value);
    if (presupuesto.code) {
      this.alertas_service.success(presupuesto.mensaje);
    }
    this.loading = false;
    this.location.back();
  }
  onTipoRubroSelect(selectedItem: any): void {
    console.log(selectedItem);
    this.tempRubroData.tipo = selectedItem;
  }  
  async putRubro() {
    await this.getRubros();
    console.log(this.rubros);
    console.log(this.rubros);
    this.loading = true;
    let rubro = await this.rubros_service.putRubro(AgregarRubroComponent.rubro_id, this.rubroForm.value);
    if (rubro.code) {
      console.log(rubro);
      this.rubros[this.rubros.indexOf(this.rubros.find((r: any) => r.id == AgregarRubroComponent.rubro_id))] = this.rubroForm.value;
      this.alertas_service.success(rubro.mensaje);
      this.rubroForm.controls['numero'].setValue(null);
      this.rubroForm.controls['nombre'].setValue(null);
      this.rubroForm.controls['nivel'].setValue(null);
      this.rubroForm.controls['tipo'].setValue(null);
      this.rubroForm.controls['monto'].setValue(null);
      AgregarRubroComponent.rubro_id = null;
    }
    this.loading = false;
    this.verificarEstado();
  }


  async setRubro(v: any) {
    AgregarRubroComponent.rubro_id = v.id;
    this.rubroForm.patchValue(v);
  }

  async getRubros() {
    let rubros = await this.rubros_service.getRubros();
    if (rubros.code) {
      this.rubros = rubros.data.filter((rubro: any)=>
      rubro.presupuesto_id === this.presupuesto_id,
    
      rubros.rubro_id === AgregarRubroComponent.rubro_id);
      console.log('rubros.rubro_id',rubros.rubro_id);
    }
  }
  
  
  async deleteRubro(m: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        this.loading = true;
        let rubro = await this.rubros_service.deleteRubro(m.id);
        if (rubro.code) {
          this.alertas_service.success(rubro.mensaje);
          this.rubros.splice(this.rubros.indexOf(m), 1);
        }
        this.loading = false;
      }
    })
  }

  
  async volver(){
    this.location.back();
  }

  calculateTotalRubros(): void {
    
    this.totalRubros = this.rubros.reduce((total: number, rubro: any) => {
      const currentMonto = Number(rubro.monto) || 0;
      const childrenTotal = rubro.children ? this.calculateChildrenTotal(rubro.children.monto) : 0;
      return total + currentMonto + childrenTotal;
    }, 0);
  }


  
  private calculateChildrenTotal(children: any[]): number {
    return children.reduce((total: number, child: any) => {
      const childMonto = Number(child.monto) || 0;
      const grandchildrenTotal = child.children ? this.calculateChildrenTotal(child.children.monto) : 0;
      return total + childMonto + grandchildrenTotal;
    }, 0);
  }

  estado: string = '';
  static estados: string = '';
  verificarEstado(): void {
    // Compara el total de rubros con el monto del presupuesto
    if (this.totalRubros === parseInt(this.presupuestoForm.value.monto)) {
     
      this.estado = 'Aprobado';
      console.log(this.estado);
      PresupuestosComponent.estados[1] = 'Aprobado';
      EditarPresupuestoComponent.estados = 'Aprobado';
      this.EstadoPresupuestoService.setEstado('Aprobado');
    } else {
      
      this.estado = 'Pendiente';
      console.log(this.estado);
      PresupuestosComponent.estados[0] = 'Pendiente';
      EditarPresupuestoComponent.estados = 'Pendiente';
      this.EstadoPresupuestoService.setEstado('Pendiente');
    }
  }

  getTotalRubros(){
    let total = 0; 
    this.rubros.map((d: any) => {
      if (d.monto) {
        total += parseFloat(d.monto);
      }
    })
    return total;
  }

  validarTotales(){
    return this.rubroForm.invalid ||
    this.getTotalRubros() != this.presupuestoForm.value.monto
  }

}


