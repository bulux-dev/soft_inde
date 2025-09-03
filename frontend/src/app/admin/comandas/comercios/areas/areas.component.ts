import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { ComerciosService } from '../../../../services/comercios.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../../../../app.component';
import { AreasService } from '../../../../services/areas.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var $: any

@Component({
  selector: 'app-areas',
  standalone: false,
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.css'
})
export class AreasComponent {

  @Input() comercio_id: any;
  area_id: any;

  loading: boolean = false;
  comercio: any = null;

  get selectS() {
    return AppComponent.selectS;
  }

  areaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    comercio_id: new FormControl(null, [Validators.required])
  });

  constructor(
    private alertas_service: AlertasService,
    private ngxService: NgxUiLoaderService,
    private comercios_service: ComerciosService,
    private areas_service: AreasService
  ) {
  }

  async ngOnInit() {
    await this.getComercio();
  }

  async getComercio() {
    this.loading = true;
    let comercio = await this.comercios_service.getComercio(this.comercio_id);
    if (comercio.code) {
      this.comercio = comercio.data;
      this.areaForm.patchValue({ comercio_id: comercio.data.id });
    }
    this.loading = false;
  }

  async setArea(a: any) {
    this.area_id = a.id;
    this.areaForm.patchValue(a);
  }

  async postArea() {
    this.ngxService.start();
    let area = await this.areas_service.postArea(this.areaForm.value);
    if (area.code) {
      this.alertas_service.success(area.mensaje);
      $('.offcanvas').offcanvas('hide');
      await this.getComercio();
    }
    this.ngxService.stop();
  }

  async putArea() {
    this.ngxService.start();
    let area = await this.areas_service.putArea(this.area_id, this.areaForm.value);
    if (area.code) {
      this.alertas_service.success(area.mensaje);
      await this.getComercio();
      $('.offcanvas').offcanvas('hide');
    }
    this.ngxService.stop();
  }

  async deleteArea(a: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let area = await this.areas_service.deleteArea(a.id);
        if (area.code) {
          this.comercio.areas.splice(this.comercio.areas.indexOf(a), 1);
          this.alertas_service.success(area.mensaje);
        }
      }
    });
  }

}

