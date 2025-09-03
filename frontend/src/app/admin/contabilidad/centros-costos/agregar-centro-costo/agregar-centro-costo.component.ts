import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { CentrosCostosService } from '../../../../services/centros-costos.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AppComponent } from '../../../../app.component';
import { VariablesService } from '../../../../services/variables.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var $: any

@Component({
  selector: 'app-agregar-centro-costo',
  standalone: false,
  templateUrl: './agregar-centro-costo.component.html',
  styleUrl: './agregar-centro-costo.component.css'
})
export class AgregarCentroCostoComponent {
  @Input() centro_costo_id: any;
  @Input() oc: any;
  @Output() newItemEvent = new EventEmitter<string>();
  loading: boolean = false;

  tipos: any = ['MAYORIZACION', 'JORNALIZACION'];
  niv_nom: any;
  centros_costos: any = [];
  filtros: FormGroup = new FormGroup({
    numero: new FormControl(null),
    nombre: new FormControl(null),
    nivel: new FormControl(null),
    centro_costo_id: new FormControl(null)
  })

  centroCostoForm: FormGroup = new FormGroup({
    numero: new FormControl(null, [Validators.required]),
    nombre: new FormControl(null, [Validators.required]),
    nivel: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required]),
    centro_costo_id: new FormControl(null)
  })

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private centros_costos_service: CentrosCostosService,
    private ngxService: NgxUiLoaderService,
    private variables_service: VariablesService
  ) { }

  get selectS() {
    return AppComponent.selectS;
  }

  async ngOnInit() {
    await this.getCentrosCostos();

    let variable = await this.variables_service.getVariables({ slug: 'niv_nom' });
    this.niv_nom = variable.data[0].valor;

    if (this.centro_costo_id) {
      let centro_costo = await this.centros_costos_service.getCentroCosto(this.centro_costo_id);
      if (centro_costo.code) {
        let numero = 0;
        if (centro_costo.data.centros_costos_hijas.length > 0) {
          numero = parseInt(centro_costo.data.centros_costos_hijas[centro_costo.data.centros_costos_hijas.length - 1].numero);
          this.centroCostoForm.controls['numero'].setValue((numero + 1));
        } else {
          this.centroCostoForm.controls['numero'].setValue(centro_costo.data.numero.toString() + (numero + 1));
        }
        let nivel = parseFloat(centro_costo.data.nivel) + 1;
        this.centroCostoForm.controls['nivel'].setValue(nivel);
        this.centroCostoForm.controls['tipo'].setValue(nivel == this.niv_nom ? ['JORNALIZACION'] : ['MAYORIZACION']);
        this.centroCostoForm.controls['centro_costo_id'].setValue([centro_costo.data]);
      }
    } else {
      let numero = parseInt(this.centros_costos[this.centros_costos.length - 1].numero);
      this.centroCostoForm.controls['numero'].setValue(numero + 1);
      this.centroCostoForm.controls['nivel'].setValue(1);
      this.centroCostoForm.controls['tipo'].setValue(['MAYORIZACION']);
    }
  }


  async getCentrosCostos() {
    let centros_costos = await this.centros_costos_service.getCentrosCostos(this.filtros.value);
    this.centros_costos = centros_costos.data;
  }


  async postCentroCosto() {
    const { nombre, tipo, nivel, numero } = this.centroCostoForm.value;
    if (!nombre || !tipo || !nivel || !numero) {
      return this.alertas_service.error('Completa los campos obligatorios');
    }
    this.centroCostoForm.controls['tipo'].setValue(this.centroCostoForm.value.tipo[0]);
    if (this.centroCostoForm.value.centro_costo_id) {
      this.centroCostoForm.controls['centro_costo_id'].setValue(this.centroCostoForm.value.centro_costo_id[0].id);
    }
    this.ngxService.start();
    let centro_costo = await this.centros_costos_service.postCentroCosto(this.centroCostoForm.value);
    if (centro_costo.code) {
      this.alertas_service.success(centro_costo.mensaje);
      this.oc ? this.centroCostoForm.reset() : this.location.back();
      $('.offcanvas').offcanvas('hide');
      this.newItemEvent.emit(centro_costo.data);
    }
    this.ngxService.stop();
  }





}
