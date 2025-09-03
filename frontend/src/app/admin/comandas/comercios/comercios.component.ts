import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComerciosService } from '../../../services/comercios.service';
import { AlertasService } from '../../../services/alertas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from '../../../app.component';

declare var $: any

@Component({
  selector: 'app-comercios',
  standalone: false,
  templateUrl: './comercios.component.html',
  styleUrl: './comercios.component.css'
})
export class ComerciosComponent {

  comercios: any = [];
  comercios_lista: any = [];
  iconos: any = [];
  iconos_lista: any = [];
  comercio_id: any = null;

  comercioForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    operador: new FormControl(null),

  });

  loading: boolean = true;
  busqueda: any = null;
  busqueda_icono: any = null;

  constructor(
    private ngxService: NgxUiLoaderService,
    private alertas_service: AlertasService,
    private comercios_service: ComerciosService
  ) {

  }

  get selectS() {
    return AppComponent.selectS;
  }

  async ngOnInit() {
    await this.getComercios();
  }

  async getComercios() {
    this.loading = true;
    let comercios = await this.comercios_service.getComercios();
    this.comercios = comercios.data;
    this.loading = false;
  }

  async setComercio(c: any) {
    this.comercio_id = c.id;
    this.comercioForm.patchValue(c);
  }

  async postComercio() {
    this.ngxService.start();
    let comercio = await this.comercios_service.postComercio(this.comercioForm.value);
    if (comercio.code) {
      this.alertas_service.success(comercio.mensaje);
      $('.offcanvas').offcanvas('hide');
      await this.getComercios();
    }
    this.ngxService.stop();
  }

  async putComercio() {
    this.ngxService.start();
    let comercio = await this.comercios_service.putComercio(this.comercio_id, this.comercioForm.value);
    if (comercio.code) {
      this.alertas_service.success(comercio.mensaje);
      await this.getComercios();
      $('.offcanvas').offcanvas('hide');
    }
    this.ngxService.stop();
  }

  async deleteComercio(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let comercio = await this.comercios_service.deleteComercio(c.id);
        if (comercio.code) {
          this.comercios.splice(this.comercios.indexOf(c), 1);
          this.alertas_service.success(comercio.mensaje);
        }
      }
    });
  }

}

