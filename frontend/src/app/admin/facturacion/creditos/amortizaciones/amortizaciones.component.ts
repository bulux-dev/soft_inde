import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmortizacionesService } from '../../../../services/amortizaciones.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ScriptsService } from '../../../../services/scripts.service';
import { AlertasService } from '../../../../services/alertas.service';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CuotasService } from '../../../../services/cuotas.service';
import { CreditosService } from '../../../../services/creditos.service';
import moment from 'moment';
import { environment } from '../../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { DocumentosService } from '../../../../services/documentos.service';

declare var $: any;

@Component({
  selector: 'app-amortizaciones',
  standalone: false,
  templateUrl: './amortizaciones.component.html',
  styleUrl: './amortizaciones.component.css'
})
export class AmortizacionesComponent {

  @Input() credito_id: any;
  amortizacion_id: any;

  credito: any;
  tipo: any;
  amortizaciones: any = [];
  documentos: any = [];

  amortizacionForm: FormGroup = new FormGroup({
    numero: new FormControl(null, [Validators.required]),
    fecha_inicio: new FormControl(null, [Validators.required]),
    fecha_fin: new FormControl(null, [Validators.required]),
    dias: new FormControl(null, [Validators.required]),
    saldo_inicial: new FormControl(null, [Validators.required]),
    capital: new FormControl(null, [Validators.required]),
    interes: new FormControl(null, [Validators.required]),
    cuota: new FormControl(null, [Validators.required]),
    saldo_final: new FormControl(null, [Validators.required]),
    capital_acum: new FormControl(null, [Validators.required]),
    interes_acum: new FormControl(null, [Validators.required]),
    cuota_acum: new FormControl(null, [Validators.required]),
    credito_id: new FormControl(null, [Validators.required]),
    recibo_id: new FormControl(null),
  });

  token = localStorage.getItem('token');
  apiUrl: any = environment.api;
  url: any;


  constructor(
    private ngxService: NgxUiLoaderService,
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private creditos_service: CreditosService,
    private amortizaciones_service: AmortizacionesService,
    private documentos_service: DocumentosService,
    private sanitizer: DomSanitizer
  ) { }

  async ngOnInit() {
    await this.getCredito();
    this.scripts_service.datatable();
  }

  async getCredito() {
    this.ngxService.start();
    let credito = await this.creditos_service.getCredito(this.credito_id);
    if (credito.code) {
      this.credito = credito.data;
      this.amortizaciones = this.credito.amortizaciones;
      this.amortizacionForm.controls['credito_id'].setValue(this.credito_id);
    }
    this.ngxService.stop();
  }

  async getDocumentos() {
    let rol_id = localStorage.getItem('rol_id');
    if (rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'recibo'
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: 'recibo',
        usuario_id: localStorage.getItem('usuario_id')
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      } 
    }
  }

  async add() {
    this.amortizacionForm.reset();
    this.amortizacionForm.controls['credito_id'].setValue(this.credito_id);
    let proyeccion = await this.creditos_service.getProyeccionAmortizacion(this.credito, this.amortizaciones);
    this.amortizacionForm.patchValue(proyeccion[this.amortizaciones.length]);

    let capital_acum = this.amortizacionForm.controls['capital'].value;
    let interes_acum = this.amortizacionForm.controls['interes'].value;
    let cuota_acum = this.amortizacionForm.controls['cuota'].value;
    for (let i = 0; i < this.amortizaciones.length; i++) {      
      capital_acum += parseFloat(this.amortizaciones[i].capital);
      interes_acum += parseFloat(this.amortizaciones[i].interes);
      cuota_acum += parseFloat(this.amortizaciones[i].cuota);
    }
    this.amortizacionForm.controls['capital_acum'].setValue(capital_acum);
    this.amortizacionForm.controls['interes_acum'].setValue(interes_acum);
    this.amortizacionForm.controls['cuota_acum'].setValue(cuota_acum);    
  }

  async postAmortizacion() {
    this.ngxService.start();
    let amortizacion = await this.amortizaciones_service.postAmortizacion(this.amortizacionForm.value);
    if (amortizacion.code) {
      this.amortizaciones.push(this.amortizacionForm.value);
      $('#agregar-amortizacion').offcanvas('hide');
      await this.getCredito();
    }
    this.ngxService.stop();
  }


  openDoc(c: any) {     
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/recibos/doc/${c.recibo_id}?token=${this.token}`);
    $('#doc').offcanvas('show'); 
    this.ngxService.stop();     
  }

  async deleteAmortizacion(a: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        this.ngxService.start();
        let amortizacion = await this.amortizaciones_service.deleteAmortizacion(a.id);
        if (amortizacion.code) {
          this.amortizaciones.splice(this.amortizaciones.indexOf(a), 1);
        }
        this.ngxService.stop();
      }
    })
  }

}
