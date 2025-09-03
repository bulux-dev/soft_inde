import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { CentrosCostosService } from '../../../../services/centros-costos.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AppComponent } from '../../../../app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Location } from '@angular/common';

@Component({
  selector: 'app-editar-centro-costo',
  standalone: false,
  templateUrl: './editar-centro-costo.component.html',
  styleUrl: './editar-centro-costo.component.css'
})
export class EditarCentroCostoComponent {
  @Input() centro_costo_id: any;
  loading: boolean = false;


  tipos: any = ['MAYORIZACION', 'JORNALIZACION'];

  centros_costos: any = [];
  filtros: FormGroup = new FormGroup({
    numero: new FormControl(null),
    nombre: new FormControl(null),
    nivel: new FormControl(null),
    tipo: new FormControl(null),
    centro_costo_id: new FormControl(null)
  });

  centroCostoForm: FormGroup = new FormGroup({
    numero: new FormControl(null),
    nombre: new FormControl(null),
    nivel: new FormControl(null),
    tipo: new FormControl(null),
    centro_costo_id: new FormControl(null)
  });

  constructor(
    private alertas_service: AlertasService,
    private centros_costos_service: CentrosCostosService,
    private ngxService: NgxUiLoaderService,
    private locationService: Location,
  ) { }

  get selectS() {
    return AppComponent.selectS;
  }

  async getCentrosCostos() {
    let centros_costos = await this.centros_costos_service.getCentrosCostos(this.filtros.value);
    this.centros_costos = centros_costos.data;

  }

  async ngOnInit() {
    await this.getCentroCosto();
    await this.getCentrosCostos();
  }

  async getCentroCosto() {
    let centro_costo = await this.centros_costos_service.getCentroCosto(this.centro_costo_id);
    if (centro_costo.code) {
      this.centroCostoForm.patchValue([centro_costo.data]);
      this.centroCostoForm.controls['numero'].setValue(centro_costo.data.numero);
      this.centroCostoForm.controls['nombre'].setValue(centro_costo.data.nombre);
      this.centroCostoForm.controls['nivel'].setValue(parseFloat(centro_costo.data.nivel));
      this.centroCostoForm.controls['tipo'].setValue([centro_costo.data.tipo]);
      this.centroCostoForm.controls['centro_costo_id'].setValue([centro_costo.data.centro_costo_padre]);
    }
  }

  async putCentroCosto() {
    const { nombre, tipo, nivel, numero } = this.centroCostoForm.value;
    if (!nombre || !tipo || !nivel || !numero) {
      return this.alertas_service.error('Completa los campos obligatorios');
    }
    this.centroCostoForm.controls['tipo'].setValue(this.centroCostoForm.value.tipo[0]);
    if (this.centroCostoForm.value.centro_costo_id) {
      this.centroCostoForm.controls['centro_costo_id'].setValue(this.centroCostoForm.value.centro_costo_id[0].id);
    }

    this.ngxService.start();
    let centro_costo = await this.centros_costos_service.putCentroCosto(this.centro_costo_id, this.centroCostoForm.value);
    if (centro_costo.code) {
      this.alertas_service.success(centro_costo.mensaje);
      await this.getCentroCosto();
    }
    this.ngxService.stop();
    this.locationService.back();

  }


}
