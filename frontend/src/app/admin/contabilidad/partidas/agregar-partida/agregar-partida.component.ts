import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { PartidasService } from '../../../../services/partidas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AppComponent } from '../../../../app.component';
import { CentrosCostosService } from '../../../../services/centros-costos.service';
import { CuentasContablesService } from '../../../../services/cuentas_contables.service';
import { RubrosService } from '../../../../services/rubros.service';
import { RubrosCuentasService } from '../../../../services/rubros-cuentas.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var $: any;

@Component({
  selector: 'app-agregar-partida',
  standalone: false,
  templateUrl: './agregar-partida.component.html',
  styleUrl: './agregar-partida.component.css'
})
export class AgregarPartidaComponent {
  @Input() oc: any;
  @Output() newItemEvent = new EventEmitter<string>();

  tipos: any = ['APERTURA', 'INGRESO', 'EGRESO', 'CIERRE'];
  categorias: any = ['REGULARIZACION', 'RECLASIFICACION', 'BAJA ACTIVO', 'AJUST', 'CUENTAS POR PAGAR', 'CUENTAS POR COBRAR', 'DEPRECIACION', 'PROVISION'];

  cuentas_contables: any = [];
  centros_costos: any[] = [];
  rubros: any[] = [];
  partidaDetallesValues: any[] = [];

  partidas_detalles: any = [];

  partidaForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    fecha: new FormControl(null, [Validators.required]),
    // numero: new FormControl(null, [Validators.required]),
    total: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required]),
    tipo_documento: new FormControl(null),
    categoria: new FormControl(''),
    estado: new FormControl(null),
    partidas_detalles: new FormControl([])
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private ngxService: NgxUiLoaderService,
    private partidas_service: PartidasService,
    private rubros_service: RubrosService,
    private cuentas_contables_service: CuentasContablesService,
    private centros_costos_service: CentrosCostosService,
    private rubros_cuentas_service: RubrosCuentasService
  ) { }

  get selectS() {
    return AppComponent.selectS;
  }

  async ngOnInit() {
    await this.getCuentasContables();
    await this.getCentrosCostos();
  }

  async getCuentasContables() {
    let cuentas_contables = await this.cuentas_contables_service.getCuentasJornalizacion();
    this.cuentas_contables = cuentas_contables.data;
  }

  async getCentrosCostos() {
    let centros_costos = await this.centros_costos_service.getCentrosJornalizacion();
    this.centros_costos = centros_costos.data;
  }

  async getRubros() {
    let rubros = await this.rubros_service.getRubros();
    this.rubros = rubros.data;
  }

  async postPartida() {
    this.ngxService.start();
    try {
      this.partidaForm.controls['estado'].setValue('VIGENTE');
      this.partidaForm.controls['tipo_documento'].setValue('MANUAL');
      this.partidaForm.controls['tipo'].setValue(this.partidaForm.value.tipo[0]);
      if (this.partidaForm.value.categoria) {
        this.partidaForm.controls['categoria'].setValue(this.partidaForm.value.categoria[0]);
      }
      this.partidas_detalles.map((d: any) => {
        d.cuenta_contable_id = d.cuenta_contable_id ? d.cuenta_contable_id[0].id : null;
        d.centro_costo_id = d.centro_costo_id ? d.centro_costo_id[0].id : null;
        d.rubro_id = d.rubro_id ? d.rubro_id[0].id : null;
      });
      this.partidaForm.controls['partidas_detalles'].setValue(this.partidas_detalles);

      let partida = await this.partidas_service.postPartida(this.partidaForm.value);
      if (partida.code) {
        this.alertas_service.success(partida.mensaje);
        this.location.back();
        console.log(this.partidas_detalles);
      }
    } catch (error) {
      this.alertas_service.error('Error al guardar la partida');
    }
    this.ngxService.stop();
  }

  agregarDetalle() {
    this.partidas_detalles.push({
      debe: null,
      haber: null,
      cuenta_contable_id: null,
      centro_costo_id: null,
      rubro_id: null
    });
  }

  removeDetalle(i: number) {
    this.partidas_detalles.splice(i, 1);
  }

  getTotalDebe() {
    let total = 0;
    this.partidas_detalles.map((d: any) => {
      if (d.debe) {
        total += parseFloat(d.debe);
      }
    });
    return total;
  }

  getTotalHaber() {
    let total = 0;
    this.partidas_detalles.map((d: any) => {
      if (d.haber) {
        total += parseFloat(d.haber);
      }
    });
    return total;
  }

  validarPartida() {
    return this.partidaForm.invalid ||
      this.getTotalDebe() != this.getTotalHaber() ||
      this.partidas_detalles.length == 0 ||
      this.getTotalDebe() != parseFloat(this.partidaForm.value.total) ||
      this.getTotalHaber() != parseFloat(this.partidaForm.value.total) ||
      this.getTotalDebe() == 0 ||
      this.getTotalHaber() == 0 ||
      this.partidas_detalles.some((d: any) => !d.cuenta_contable_id);
  }

}