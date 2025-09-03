import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { SucursalesService } from '../../../../services/sucursales.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { BodegasService } from '../../../../services/bodegas.service';
import { AppComponent } from '../../../../app.component';

declare var $: any

@Component({
  selector: 'app-agregar-sucursal',
  standalone: false,
  templateUrl: './agregar-sucursal.component.html',
  styleUrl: './agregar-sucursal.component.css'
})
export class AgregarSucursalComponent {

  get selectM() {
    return AppComponent.selectM;
  }

  @Input() oc: any;
  loading: boolean = false;
  bodegas: any = [];

  sucursalForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    numero: new FormControl(null, [Validators.required]),
    direccion: new FormControl(null),
    telefono: new FormControl(null),
    sucursales_bodegas: new FormControl([]),
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
  ) {
  }

  async ngOnInit() {
    await this.getBodegas();
  }

  async getBodegas($event: any = null) {
    let bodegas = await this.bodegas_service.getBodegas();
    if (bodegas.code) {
      this.bodegas = bodegas.data;
      if ($event) {
        this.bodegas.push($event);
        let sucursales_bodegas = this.sucursalForm.controls['sucursales_bodegas'].value;
        sucursales_bodegas.push($event);
        this.sucursalForm.controls['sucursales_bodegas'].setValue(sucursales_bodegas);
        // await this.postSucursal()
      }
    }
  }

  async postSucursal() {
    this.loading = true;
    let sucursal = await this.sucursales_service.postSucursal(this.sucursalForm.value);
    if (sucursal.code) {
      this.alertas_service.success(sucursal.mensaje);
      this.oc ? this.sucursalForm.reset() : this.location.back();
      $('.offcanvas').offcanvas('hide');
      localStorage.setItem('nuevo', JSON.stringify(sucursal.data));
    }
    this.loading = false;
  }



}

