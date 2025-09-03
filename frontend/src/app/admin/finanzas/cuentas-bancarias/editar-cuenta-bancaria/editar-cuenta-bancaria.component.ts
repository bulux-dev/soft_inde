import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { BancosService } from '../../../../services/bancos.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScriptsService } from '../../../../services/scripts.service';
import { CuentasBancariasService } from '../../../../services/cuentas_bancarias.service';
import { AppComponent } from '../../../../app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-editar-cuenta-bancaria',
  standalone: false,
  templateUrl: './editar-cuenta-bancaria.component.html',
  styleUrl: './editar-cuenta-bancaria.component.css'
})
export class EditarCuentaBancariaComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  @Input() cuenta_bancaria_id: any;
  loading: boolean = false;

  bancos: any = [];
  tipos: any = ['Monetaria', 'Ahorro']

  token = localStorage.getItem('token');
  apiUrl: any = environment.api;
  url: any;

  cuentaBancariaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    no_cuenta: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required]),
    banco_id: new FormControl(null, [Validators.required])
  });

  constructor(
    private alertas_service: AlertasService,
    private bancos_service: BancosService,
    private cuentas_bancarias_service: CuentasBancariasService,
    private scripts_service: ScriptsService,
    private location: Location,
    private ngxService: NgxUiLoaderService,
    private sanitizer: DomSanitizer,
  ) {
    this.scripts_service.inputfile();
  }

  async ngOnInit() {
    await this.getBancos();
    let cuenta_bancaria = await this.cuentas_bancarias_service.getCuentaBancaria(this.cuenta_bancaria_id);
    if (cuenta_bancaria.code) {
      this.cuentaBancariaForm.patchValue(cuenta_bancaria.data);    
      this.cuentaBancariaForm.controls['tipo'].setValue([cuenta_bancaria.data.tipo]);  
      this.cuentaBancariaForm.controls['banco_id'].setValue([cuenta_bancaria.data.banco]);
    }
    this.scripts_service.mask();
  }

  async getBancos() {
    let bancos = await this.bancos_service.getBancos();
    if (bancos) {
      this.bancos = bancos.data;
    }
  }

  reporteLibroBancos() {
    this.ngxService.start();
    // let documento = this.filtros.value.documento_id;
    // let cliente = this.filtros.value.cliente_id;
    // let empleado = this.filtros.value.empleado_id;
    // this.filtros.controls['documento_id'].setValue(documento ? documento[0]?.id : null);
    // this.filtros.controls['cliente_id'].setValue(cliente ? cliente[0]?.id : null);
    // this.filtros.controls['empleado_id'].setValue(empleado ? empleado[0]?.id : null);

    // let params = Object.keys(this.filtros.value).map(key => {
    //   return `${key}=${this.filtros.value[key]}`;
    // }).join('&');
    let params = 'cuenta_bancaria_id=' + this.cuenta_bancaria_id;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/reportes/libro_bancos?${params}&token=${this.token}`);
    $('#doc').offcanvas('show');

    this.ngxService.stop();
  }

  async putCuentaBancaria() {
    this.loading = true;
    this.cuentaBancariaForm.controls['tipo'].setValue(this.cuentaBancariaForm.controls['tipo'].value[0]);
    this.cuentaBancariaForm.controls['banco_id'].setValue(this.cuentaBancariaForm.controls['banco_id'].value[0].id);

    let cuenta_bancaria = await this.cuentas_bancarias_service.putCuentaBancaria(this.cuenta_bancaria_id, this.cuentaBancariaForm.value);
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
