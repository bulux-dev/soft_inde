import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { AtributosService } from '../../../../services/atributos.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValoresService } from '../../../../services/valores.service';

declare var $: any

@Component({
  selector: 'app-editar-atributo',
  standalone: false,
  templateUrl: './editar-atributo.component.html',
  styleUrl: './editar-atributo.component.css'
})
export class EditarAtributoComponent {

  @Input() oc: any;
  @Input() atributo_id: any;
  @Output() newItemEvent = new EventEmitter<string>();
  valor_id: any;
  loading: boolean = false;

  valores: any = [];

  atributoForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required])
  });

  valorForm: FormGroup = new FormGroup({
    nombre: new FormControl(null),
    atributo_id: new FormControl(null)
  })

  constructor(
    private alertas_service: AlertasService,
    private atributos_service: AtributosService,
    private valores_service: ValoresService
  ) {
  }

  async ngOnInit() {    
    await this.getAtributo();
  }

  async getAtributo() {    
    let atributo = await this.atributos_service.getAtributo(this.atributo_id);
    if (atributo.code) {
      this.atributoForm.patchValue(atributo.data);
      this.valorForm.patchValue({ atributo_id: atributo.data.id });
      this.valores = atributo.data.valores;
    }
  }

  async postValor() {
    this.loading = true;
    let valor = await this.valores_service.postValor(this.valorForm.value);
    if (valor.code) {
      this.alertas_service.success(valor.mensaje);
      this.valores.push(valor.data);
      this.valorForm.controls['nombre'].setValue(null);
      $('.offcanvas').offcanvas('hide');            
      this.newItemEvent.emit(valor.data);
    }
    this.loading = false;
  }

  async putAtributo() {
    this.loading = true;
    let atributo = await this.atributos_service.putAtributo(this.atributo_id, this.atributoForm.value);
    if (atributo.code) {
      this.alertas_service.success(atributo.mensaje);
    }
    this.loading = false;
  }

  async putValor() {
    this.loading = true;
    let valor = await this.valores_service.putValor(this.valor_id, this.valorForm.value);
    if (valor.code) {
      this.valores[this.valores.indexOf(this.valores.find((v: any) => v.id == this.valor_id))].nombre = this.valorForm.value.nombre;
      this.alertas_service.success(valor.mensaje);
      this.valorForm.controls['nombre'].setValue(null);
      this.valor_id = null;
    }
    this.loading = false;
  }

  async setValor(v: any) {
    this.valor_id = v.id;
    this.valorForm.patchValue(v);
  }

  async deleteValor(m: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        this.loading = true;
        let valor = await this.valores_service.deleteValor(m.id);
        if (valor.code) {
          this.alertas_service.success(valor.mensaje);
          this.valores.splice(this.valores.indexOf(m), 1);
        }
        this.loading = false;
      }
    });
  }

}

