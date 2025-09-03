import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { EtiquetasService } from '../../../../services/etiquetas.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-etiqueta',
  standalone: false,
  templateUrl: './editar-etiqueta.component.html',
  styleUrl: './editar-etiqueta.component.css'
})
export class EditarEtiquetaComponent {

  @Input() etiqueta_id: any;
  loading: boolean = false;

  compras: any = [];
  ventas: any = [];
  
  etiquetaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    operaciones_etiquetas: new FormControl(null)
  });

  constructor(
    private alertas_service: AlertasService,
    private etiquetas_service: EtiquetasService
  ) {
  }

  async ngOnInit() {
    let etiqueta = await this.etiquetas_service.getEtiqueta(this.etiqueta_id);
    if (etiqueta.code) {
      this.etiquetaForm.patchValue(etiqueta.data);      
      this.compras = etiqueta.data.operaciones_etiquetas.filter((oe: any) => oe.compra_id);
      this.ventas = etiqueta.data.operaciones_etiquetas.filter((oe: any) => oe.venta_id);      
    }
  }
  
  async putEtiqueta() {
    this.loading = true;
    let etiqueta = await this.etiquetas_service.putEtiqueta(this.etiqueta_id, this.etiquetaForm.value);
    if (etiqueta.code) {
      this.alertas_service.success(etiqueta.mensaje);
    }
    this.loading = false;
  }

  getTotalCompra() {
    let total = 0;
    this.compras.forEach((i: any) => {
      if (i.compra.estado != 'ANULADO') {
        total += parseFloat(i.compra.total);
      }
    })
    return total;
  }

  getTotalVenta() {
    let total = 0;
    this.ventas.forEach((i: any) => {
      if (i.venta.estado != 'ANULADO') {
        total += parseFloat(i.venta.total);
      }
    })
    return total;
  }

}

