import { Component } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { BancosService } from '../../../../services/bancos.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ScriptsService } from '../../../../services/scripts.service';
import { CuentasBancariasService } from '../../../../services/cuentas_bancarias.service';
import { AppComponent } from '../../../../app.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-agregar-cuenta-bancaria',
  standalone: false,
  templateUrl: './agregar-cuenta-bancaria.component.html',
  styleUrl: './agregar-cuenta-bancaria.component.css'
})
export class AgregarCuentaBancariaComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  loading: boolean = false;

  tipos: any = ['Monetaria', 'Ahorro']
  bancos: any = [];

  cuentaBancariaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    no_cuenta: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required]),
    banco_id: new FormControl(null, [Validators.required]),
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private bancos_service: BancosService,
    private cuentas_bancarias_service: CuentasBancariasService,
    private scripts_service: ScriptsService
  ) {
  }

  async ngOnInit() {
    await this.getBancos();
    this.scripts_service.inputfile();
    this.scripts_service.mask();
  }

  async getBancos() {
    let bancos = await this.bancos_service.getBancos();
    if (bancos) {
      this.bancos = bancos.data;
    }
  }

  async postCuentaBancaria() {
    this.loading = true;    
    this.cuentaBancariaForm.controls['tipo'].setValue(this.cuentaBancariaForm.controls['tipo'].value[0]);
    this.cuentaBancariaForm.controls['banco_id'].setValue(this.cuentaBancariaForm.controls['banco_id'].value[0].id);
    let cuenta_bancaria = await this.cuentas_bancarias_service.postCuentaBancaria(this.cuentaBancariaForm.value);
    if (cuenta_bancaria.code) {
      this.alertas_service.success(cuenta_bancaria.mensaje);
      this.location.back();
    }
    this.loading = false;
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.cuentaBancariaForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

  removeImage(imagen: any) {
    this.cuentaBancariaForm.controls[`${imagen}`].setValue(null);
  }

}
