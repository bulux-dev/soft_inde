import { Component } from '@angular/core';
import { PresupuestosService } from '../../../services/presupuestos.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditarPresupuestoComponent } from './editar-presupuesto/editar-presupuesto.component';
import { EstadoPresupuestoService } from '../../../services/estado-presupuesto.service';
import { CentrosCostosComponent } from '../centros-costos/centros-costos.component';
import { CentrosCostosService } from '../../../services/centros-costos.service';
@Component({
  selector: 'app-presupuestos',
  standalone: false,
  templateUrl: './presupuestos.component.html',
  styleUrl: './presupuestos.component.css'
})
export class PresupuestosComponent {
  
  
  presupuestos: any = [];
  centrosCostos: any = [];
  

  filtros: FormGroup = new FormGroup({
    numero: new FormControl(null), 
    nombre: new FormControl(null),
    fecha_inicio: new FormControl(null),
    fecha_fin: new FormControl(null),
    monto: new FormControl(null),
    tipo: new FormControl(null),
    centro_costo_id: new FormControl(null),
  })


  constructor(
    private presupuestos_service: PresupuestosService,
    private alertas_service: AlertasService,
    private scripts_service: ScriptsService,
    private estadoPresupuestoService: EstadoPresupuestoService,
    private centros_costos_service: CentrosCostosService,
  ){}

  estado: string = '';
  static estados: string []= [];
  async ngOnInit(){
    const centrosCostosData = await this.centros_costos_service.getCentrosJornalizacion();
    this.centrosCostos = centrosCostosData.data;
    console.log('Centros Costos loaded:', this.centrosCostos); // Add this log
  
    await this.getPresupuestos();
    this.scripts_service.datatable(); 
    
    this.estadoPresupuestoService.estado$.subscribe((nuevoEstado) => {
      this.estado = nuevoEstado;
      console.log('Estado actualizado:', this.estado);
    });
  }
  async getPresupuestos() {
    let response = await this.presupuestos_service.getPresupuestos(this.filtros.value);
    this.filtros.value.estado = PresupuestosComponent.estados;
    this.presupuestos = response.data.map((presupuesto: any) => {
      return presupuesto;
    });
    
    this.estado = EditarPresupuestoComponent.estados;
    console.log('this.estado',this.estado);
    console.log(PresupuestosComponent.estados);
  }
  
  obtenerEstado():void{
    
  }

  async deletePresupuesto(m: any){
    this.alertas_service.eliminar().then(async (results:any)=>{
      if (results.isConfirmed){
        let presupuesto = await this.presupuestos_service.deletePresupuesto(m.id);
        if(presupuesto.code){
          this.presupuestos.splice(this.presupuestos.indexOf(m),1);
          this.alertas_service.success('Presupuesto eliminado');
        }
        }
    });
  }
  trackByFn(index: number, item: any): number {
    return item.id;
  }
  
  getCentroCostoName(id: any): string {
    console.log('Looking for centro costo with ID:', id); // Add this log
    console.log('Available centros:', this.centrosCostos); // Add this log
    const centro = this.centrosCostos.find((c: any) => {
      console.log('Comparing:', c.id, id, c.id === id); // Add this log
      return c.id === id;
    });
    const result = centro ? `${centro.numero} - ${centro.nombre} - ${centro.tipo}` : 'N/A';
    console.log('Result:', result); // Add this log
    return result;
  }
  

}
