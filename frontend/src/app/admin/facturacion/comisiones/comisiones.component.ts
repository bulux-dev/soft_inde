import { Component } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EmpleadosService } from '../../../services/empleados.service';
import { ComisionesService } from '../../../services/comisiones.service';
import moment from 'moment';

@Component({
  selector: 'app-comisiones',
  standalone: false,
  templateUrl: './comisiones.component.html',
  styleUrl: './comisiones.component.css'
})
export class ComisionesComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  get selectM() {
    return AppComponent.selectM;
  }

  empleados: any = [];
  ventas: any = [];
  productos: any = [];
  comisiones: any = [];

  filtros: FormGroup = new FormGroup({
    fecha_inicio: new FormControl(moment().startOf('month').format('YYYY-MM-DD')),
    fecha_fin: new FormControl(moment().endOf('month').format('YYYY-MM-DD')),
    empleados: new FormControl(null),
    venta_id: new FormControl(null),
    producto_id: new FormControl(null)
  })

  constructor(
    private ngxService: NgxUiLoaderService,
    private empleados_service: EmpleadosService,
    private comisiones_service: ComisionesService
  ) { }

  async ngOnInit() {
    await this.getEmpleados();
  }

  async getEmpleados() {
    let empleados = await this.empleados_service.getEmpleados({
      vendedor: true
    });
    this.empleados = empleados.data;
  }

  async getComisiones() {
    this.comisiones = [];
    this.filtros.value.empleados.forEach(async (e: any) => {
      let comisiones = await this.comisiones_service.getComisionesRange(this.filtros.value.fecha_inicio, this.filtros.value.fecha_fin, {
        empleado_id: e.id,
      });
      this.comisiones.push({
        empleado: e,
        data: comisiones.data
      })
    });
  }

  getMonto(empleado_id: any = null) {
    let total = 0;
    let comisiones = this.comisiones;
    if (empleado_id) {
      comisiones = this.comisiones.filter((c: any) => c.empleado.id == empleado_id);
    }
    comisiones.forEach((c: any) => {
      c.data.forEach((d: any) => {
        total += parseFloat(d.monto)
      })
    });
    return total;
  }

  getTotal(empleado_id: any = null) {
    let total = 0;
    let comisiones = this.comisiones;
    if (empleado_id) {
      comisiones = this.comisiones.filter((c: any) => c.empleado.id == empleado_id);
    }
    comisiones.forEach((c: any) => {
      c.data.forEach((d: any) => {
        total += parseFloat(d.total)
      })
    });
    return total;
  }

}
