import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../../../services/alertas.service';
import { EstacionesService } from '../../../../../../services/estaciones.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../../../../../../app.component';
import { CuentasService } from '../../../../../../services/cuentas.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';

declare var $: any

@Component({
  selector: 'app-cuentas',
  standalone: false,
  templateUrl: './cuentas.component.html',
  styleUrl: './cuentas.component.css'
})
export class CuentasComponent {

  @Input() estacion_id: any;
  cuenta_id: any;

  loading: boolean = false;
  estacion: any = null;

  get selectS() {
    return AppComponent.selectS;
  }

  cuentaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    estado: new FormControl('ABIERTA', [Validators.required]),
    estacion_id: new FormControl(null, [Validators.required])
  });

  constructor(
    private alertas_service: AlertasService,
    private ngxService: NgxUiLoaderService,
    private estaciones_service: EstacionesService,
    private cuentas_service: CuentasService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    await this.getEstacion();
  }

  async getEstacion() {
    this.loading = true;
    let estacion = await this.estaciones_service.getEstacion(this.estacion_id);
    if (estacion.code) {
      this.estacion = estacion.data;
      this.cuentaForm.patchValue({ estacion_id: estacion.data.id });
    }
    this.loading = false;
  }

  async setCuenta(a: any) {
    this.cuenta_id = a.id;
    this.cuentaForm.patchValue(a);
  }

  async postCuenta() {
    this.ngxService.start();
    let numero = this.estacion.cuentas.length + 1;
    this.cuentaForm.patchValue({ nombre: `Cuenta ${numero}` });
    let cuenta = await this.cuentas_service.postCuenta(this.cuentaForm.value);
    if (cuenta.code) {
      this.alertas_service.success(cuenta.mensaje);
      $('.offcanvas').offcanvas('hide');
      this.router.navigate([`/admin/comandas/comercios/${this.estacion.area.comercio.id}/area/${this.estacion.area.id}/estacion/${this.estacion.id}/cuenta/${cuenta.data.id}`]);
    }
    this.ngxService.stop();
  }

  async putCuenta() {
    this.ngxService.start();
    let cuenta = await this.cuentas_service.putCuenta(this.cuenta_id, this.cuentaForm.value);
    if (cuenta.code) {
      this.alertas_service.success(cuenta.mensaje);
      await this.getEstacion();
      $('.offcanvas').offcanvas('hide');
    }
    this.ngxService.stop();
  }

  async deleteCuenta(a: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let cuenta = await this.cuentas_service.deleteCuenta(a.id);
        if (cuenta.code) {
          this.estacion.cuentas.splice(this.estacion.cuentas.indexOf(a), 1);
          this.alertas_service.success(cuenta.mensaje);
        }
      }
    });
  }

}

