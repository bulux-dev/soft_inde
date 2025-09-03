import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { SucursalesService } from '../../../../services/sucursales.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BodegasService } from '../../../../services/bodegas.service';
import { AppComponent } from '../../../../app.component';

declare var $: any

@Component({
  selector: 'app-editar-sucursal',
  standalone: false,
  templateUrl: './editar-sucursal.component.html',
  styleUrl: './editar-sucursal.component.css'
})
export class EditarSucursalComponent {

  get selectM() {
    return AppComponent.selectM;
  }

  get selectM2() {
    return AppComponent.selectM2;
  }
  
  @Input() sucursal_id: any;
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
    private alertas_service: AlertasService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService
  ) {
  }

  async ngOnInit() {
    await this.getSucursal();
    await this.getBodegas();
  }

  async getSucursal() {
    let sucursal = await this.sucursales_service.getSucursal(this.sucursal_id);
    if (sucursal.code) {
      this.sucursalForm.patchValue(sucursal.data);
      this.sucursalForm.controls['sucursales_bodegas'].setValue(sucursal.data.sucursales_bodegas.map((b: any) => (b.bodega)));
    }
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
        await this.putSucursal()
      }
    }
  }

  async putSucursal() {
    this.loading = true;
    let sucursal = await this.sucursales_service.putSucursal(this.sucursal_id, this.sucursalForm.value);
    if (sucursal.code) {
      this.alertas_service.success(sucursal.mensaje)
      await this.getSucursal();
    }
    this.loading = false;
  }

}

