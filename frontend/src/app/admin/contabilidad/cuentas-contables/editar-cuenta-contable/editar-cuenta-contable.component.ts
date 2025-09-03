import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { CuentasContablesService } from '../../../../services/cuentas_contables.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../../../app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-editar-cuenta-contable',
  standalone: false,
  templateUrl: './editar-cuenta-contable.component.html',
  styleUrl: './editar-cuenta-contable.component.css'
})
export class EditarCuentaContableComponent {

  @Input() cuenta_contable_id: any;
  loading: boolean = false;

  origenes: any = ['DEUDOR', 'ACREEDOR', 'INGRESO', 'EGRESO'];
  tipos: any = ['MAYORIZACION', 'JORNALIZACION'];
  flujos: any = ['INVERSION', 'OPERACION', 'FINANCIAMIENTO'];

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
    private alertas_service: AlertasService,
    private ngxService: NgxUiLoaderService,
    private cuentas_contables_service: CuentasContablesService
  ) {
  }

  get selectS() {
    return AppComponent.selectS;
  }

  async getCuentasContables() {
    let cuentas_contables = await this.cuentas_contables_service.getCuentasContables(this.filtros.value);
    this.cuentas_contables = cuentas_contables.data;
  }

  async ngOnInit() {
    await this.getCuentasContables();
    await this.getCuentaContable();
  }

  async getCuentaContable() {
    let cuenta_contable = await this.cuentas_contables_service.getCuentaContable(this.cuenta_contable_id);
    if (cuenta_contable.code) {
      this.cuentaContableForm.patchValue(cuenta_contable.data);
      this.cuentaContableForm.controls['origen'].setValue([cuenta_contable.data.origen]);
      this.cuentaContableForm.controls['tipo'].setValue([cuenta_contable.data.tipo]);
      if (cuenta_contable.data.flujo) {
        this.cuentaContableForm.controls['flujo'].setValue([cuenta_contable.data.flujo]);
      }
      if (cuenta_contable.data.cuenta_contable_padre) {
        this.cuentaContableForm.controls['cuenta_contable_id'].setValue([cuenta_contable.data.cuenta_contable_padre]);        
      }
    }
    console.log('nivel cuenta',this.cuentaContableForm.value.nivel)
  }
  
  async putCuentaContable() {
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
    let cuenta_contable = await this.cuentas_contables_service.putCuentaContable(this.cuenta_contable_id, this.cuentaContableForm.value);
    if (cuenta_contable.code) {
      this.alertas_service.success(cuenta_contable.mensaje);
      await this.getCuentaContable();
    }
    this.ngxService.stop();
  }

}

