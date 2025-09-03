import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { CuentasContablesService } from '../../../../services/cuentas_contables.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { AppComponent } from '../../../../app.component';
import { VariablesService } from '../../../../services/variables.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var $: any

@Component({
  selector: 'app-agregar-cuenta-contable',
  standalone: false,
  templateUrl: './agregar-cuenta-contable.component.html',
  styleUrl: './agregar-cuenta-contable.component.css'
})
export class AgregarCuentaContableComponent {


  @Input() cuenta_contable_id: any;
  @Input() oc: any
  @Output() newItemEvent = new EventEmitter<string>();
  loading: boolean = false;

  origenes: any = ['DEUDOR', 'ACREEDOR', 'INGRESO', 'EGRESO'];
  tipos: any = ['MAYORIZACION', 'JORNALIZACION'];
  flujos: any = ['INVERSION', 'OPERACION', 'FINANCIAMIENTO'];

  niv_nom: any;
  cuentas_contables: any = [];
  filtros: FormGroup = new FormGroup({
    numero: new FormControl(null),
    nombre: new FormControl(null),
    nivel: new FormControl(null),
    origen: new FormControl(null),
    tipo: new FormControl(null),
    cuenta_contable_id: new FormControl(null)
  })

  cuentaContableForm: FormGroup = new FormGroup({
    numero: new FormControl(null, [Validators.required]),
    nombre: new FormControl(null, [Validators.required]),
    nivel: new FormControl(null, [Validators.required]),
    origen: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required]),
    flujo: new FormControl(null),
    cuenta_contable_id: new FormControl(null)
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private cuentas_contables_service: CuentasContablesService,
    private ngxService: NgxUiLoaderService,
    private variables_service: VariablesService
  ) {
  }

  get selectS() {
    return AppComponent.selectS;
  }

  async ngOnInit() {
    await this.getCuentasContables();

    let variable = await this.variables_service.getVariables({ slug: 'niv_nom' });
    this.niv_nom = variable.data[0].valor;

    if (this.cuenta_contable_id) {
      let cuenta_contable = await this.cuentas_contables_service.getCuentaContable(this.cuenta_contable_id);
      if (cuenta_contable.code) {
        let numero = 0;
        if (cuenta_contable.data.cuentas_contables_hijas.length > 0) {
          numero = parseInt(cuenta_contable.data.cuentas_contables_hijas[cuenta_contable.data.cuentas_contables_hijas.length - 1].numero);
          this.cuentaContableForm.controls['numero'].setValue((numero + 1));
        } else {
          this.cuentaContableForm.controls['numero'].setValue(cuenta_contable.data.numero.toString() + (numero + 1));
        }
        let nivel = parseFloat(cuenta_contable.data.nivel) + 1;
        this.cuentaContableForm.controls['nivel'].setValue(nivel);
        this.cuentaContableForm.controls['tipo'].setValue(nivel == this.niv_nom ? ['JORNALIZACION'] : ['MAYORIZACION']);
        this.cuentaContableForm.controls['cuenta_contable_id'].setValue([cuenta_contable.data]);
      }
    } else {
      let numero = parseInt(this.cuentas_contables[this.cuentas_contables.length - 1].numero);
      this.cuentaContableForm.controls['numero'].setValue(numero + 1);
      this.cuentaContableForm.controls['nivel'].setValue(1);
      this.cuentaContableForm.controls['tipo'].setValue(['MAYORIZACION']);
    }
  }

  async getCuentasContables() {
    let cuentas_contables = await this.cuentas_contables_service.getCuentasContables(this.filtros.value);
    this.cuentas_contables = cuentas_contables.data;
  }

  async postCuentaContable() {
    const { nombre, tipo, nivel, numero, origen } = this.cuentaContableForm.value;
    if (!nombre || !tipo || !nivel || !numero || !origen) {
      return this.alertas_service.error('Completa los campos obligatorios');
    }
    
    this.cuentaContableForm.controls['origen'].setValue(this.cuentaContableForm.value.origen[0]);
    this.cuentaContableForm.controls['tipo'].setValue(this.cuentaContableForm.value.tipo[0]);
    if (this.cuentaContableForm.value.flujo) {
      this.cuentaContableForm.controls['flujo'].setValue(this.cuentaContableForm.value.flujo[0]);
    }
    if (this.cuentaContableForm.value.cuenta_contable_id) {
      this.cuentaContableForm.controls['cuenta_contable_id'].setValue(this.cuentaContableForm.value.cuenta_contable_id[0].id);
    }
    this.ngxService.start();
    let cuenta_contable = await this.cuentas_contables_service.postCuentaContable(this.cuentaContableForm.value);
    if (cuenta_contable.code) {
      this.alertas_service.success(cuenta_contable.mensaje);
      this.oc ? this.cuentaContableForm.reset() : this.location.back();
      $('.offcanvas').offcanvas('hide');
      this.newItemEvent.emit(cuenta_contable.data);
    }
    this.ngxService.stop();
  }


}

