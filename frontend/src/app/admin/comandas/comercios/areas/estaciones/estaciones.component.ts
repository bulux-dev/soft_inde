import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../../services/alertas.service';
import { AreasService } from '../../../../../services/areas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../../../../../app.component';
import { EstacionesService } from '../../../../../services/estaciones.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var $: any

@Component({
  selector: 'app-estaciones',
  standalone: false,
  templateUrl: './estaciones.component.html',
  styleUrl: './estaciones.component.css'
})
export class EstacionesComponent {

  @Input() area_id: any;
  estacion_id: any;

  loading: boolean = false;
  area: any = null;

  get selectS() {
    return AppComponent.selectS;
  }

  estacionForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    area_id: new FormControl(null, [Validators.required])
  });

  constructor(
    private alertas_service: AlertasService,
    private ngxService: NgxUiLoaderService,
    private areas_service: AreasService,
    private estaciones_service: EstacionesService
  ) {
  }

  async ngOnInit() {
    await this.getArea();
  }

  async getArea() {
    this.loading = true;
    let area = await this.areas_service.getArea(this.area_id);
    if (area.code) {
      this.area = area.data;
      this.estacionForm.patchValue({ area_id: area.data.id });
    }
    this.loading = false;
  }

  async setEstacion(a: any) {
    this.estacion_id = a.id;
    this.estacionForm.patchValue(a);
  }

  async postEstacion() {
    this.ngxService.start();
    let estacion = await this.estaciones_service.postEstacion(this.estacionForm.value);
    if (estacion.code) {
      this.alertas_service.success(estacion.mensaje);
      $('.offcanvas').offcanvas('hide');
      await this.getArea();
    }
    this.ngxService.stop();
  }

  async putEstacion() {
    this.ngxService.start();
    let estacion = await this.estaciones_service.putEstacion(this.estacion_id, this.estacionForm.value);
    if (estacion.code) {
      this.alertas_service.success(estacion.mensaje);
      await this.getArea();
      $('.offcanvas').offcanvas('hide');
    }
    this.ngxService.stop();
  }

  async deleteEstacion(a: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let estacion = await this.estaciones_service.deleteEstacion(a.id);
        if (estacion.code) {
          this.area.estaciones.splice(this.area.estaciones.indexOf(a), 1);
          this.alertas_service.success(estacion.mensaje);
        }
      }
    });
  }

}

