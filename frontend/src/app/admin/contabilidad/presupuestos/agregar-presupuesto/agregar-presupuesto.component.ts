import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { PresupuestosService } from '../../../../services/presupuestos.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { AppComponent } from '../../../../app.component';
import { CentrosCostosComponent } from '../../centros-costos/centros-costos.component';
import { CentrosCostosService } from '../../../../services/centros-costos.service';


declare var $: any;


@Component({
  selector: 'app-agregar-presupuesto',
  standalone: false,
  templateUrl: './agregar-presupuesto.component.html',
  styleUrl: './agregar-presupuesto.component.css'
})
export class AgregarPresupuestoComponent {

  @Input()oc: any
  @Output() newItemEvent = new EventEmitter<string>()
  loading: boolean = false

  rubros: any = [];
  tipos: any = ['MAYORIZACION', 'JORNALIZACION'];
  centros_costos: any[] = [];
  presupuestoForm: FormGroup = new FormGroup({
//    numero: new FormControl(null, [Validators.required]),
    nombre: new FormControl(null, [Validators.required]),
    fecha_inicio: new FormControl(null, [Validators.required]),
    fecha_fin: new FormControl(null, [Validators.required]),
    monto: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required]),
    centro_costo_id: new FormControl(null, [Validators.required]),
  })
  tempData: any = {
    categoria: '',
    tipo: '',
    tipo_documento: '',
    estado: '',
    centro_costo_id: null,
  }
  constructor (
    private location: Location,
    private alertas_service: AlertasService,
    private presupuestos_service: PresupuestosService,
    private centros_costos_service: CentrosCostosService,
  
  ){}

  get selectS() {
    return AppComponent.selectS;
  }




  async ngOnInit(){
    await this.getCentrosCostos();
    try{
      const centrosCostosData = await this.centros_costos_service.getCentrosJornalizacion();
      this.centros_costos = centrosCostosData.data;
    }catch(err){this.alertas_service.error('Error al cargar los datos')}    
  }

  tempCentroCosto: any={
    centro_costo_id: null,
  }
  onCentroCostoSelect(selectedItem: any): void {
    this.tempData.centro_costo_id = selectedItem.id;
  }
  onTipoSelect(selectedItem: any): void {
    console.log(selectedItem);
    this.tempData.tipo = selectedItem;
  }  
  getCentroCostoName(id: any): string {
    const centro = this.centros_costos.find((c: any) => c.id === id);
    return centro ? `${centro.numero} - ${centro.nombre} - ${centro.tipo}` : 'N/A';
  }

  async postPresupuesto(){
    this.loading= true;
    console.log(this.presupuestoForm.value);
    let presupuestoValue = this.presupuestoForm.value;
    presupuestoValue.tipo = this.tempData.tipo;
    let presupuesto = await this.presupuestos_service.postPresupuesto(presupuestoValue);
    if (presupuesto.code){
      this.alertas_service.success(presupuesto.mensaje);
      this.oc ? this.presupuestoForm.reset() : this.location.back();
      $('.offcanvas').offcanvas('hide');
      this.newItemEvent.emit(presupuesto.data);
    }
    this.loading = false;
  }

  async getCentrosCostos() {
    let centros_costos = await this.centros_costos_service.getCentrosJornalizacion();
    this.centros_costos = centros_costos.data;
  }

  getTotalRubros(){
    let total = 0; 
    this.rubros.map((d: any) => {
      if (d.monto) {
        total += parseFloat(d.monto);
      }
    });
    return total;
  }
  removeCentroCosto(i:number){
    this.centros_costos.splice(i,1);
  }

}
