import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { TrasladosService } from '../../../../services/traslados.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { DocumentosService } from '../../../../services/documentos.service';
import { BodegasService } from '../../../../services/bodegas.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from '../../../../app.component';
import { SucursalesService } from '../../../../services/sucursales.service';
import { VariablesService } from '../../../../services/variables.service';
import { ExistenciasService } from '../../../../services/existencias.service';
import { RecetasService } from '../../../../services/recetas.service';

declare var $: any

@Component({
  selector: 'app-agregar-traslado',
  standalone: false,
  templateUrl: './agregar-traslado.component.html',
  styleUrl: './agregar-traslado.component.css'
})
export class AgregarTrasladoComponent {

  @Input() documento_id: any;

  get selectS() {
    return AppComponent.selectS;
  }

  traslados_detalles: any = [];
  bodegas: any = [];
  sucursales: any = [];
  bodegas2: any = [];
  sucursales2: any = [];
  lotes: any = [];

  documento: any;
  tipo_stock: any;

  fecha_min = moment().startOf('month').format('YYYY-MM-DD HH:mm');
  fecha_max = moment().endOf('month').format('YYYY-MM-DD HH:mm');

  trasladoForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [Validators.required]),
    observaciones: new FormControl(null),
    documento_id: new FormControl(null),
    sucursal_salida_id: new FormControl(null, [Validators.required]),
    bodega_salida_id: new FormControl(null),
    sucursal_entrada_id: new FormControl(null, [Validators.required]),
    bodega_entrada_id: new FormControl(null),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    traslados_detalles: new FormControl([]),
    lote: new FormControl([])
  });

  constructor(
    private ngxService: NgxUiLoaderService,
    private location: Location,
    private alertas_service: AlertasService,
    private traslados_service: TrasladosService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private variables_service: VariablesService,
    private existencias_service: ExistenciasService,
    private recetas_service: RecetasService
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDocumento();
    await this.getSucursales();
    let tipo_stock = await this.variables_service.getVariables({
      slug: 'stock'
    });
    this.tipo_stock = tipo_stock.data[0].valor;
    this.ngxService.stop();
  }

  async getDocumento() {
    this.trasladoForm.controls['documento_id'].setValue(this.documento_id);
    let documento = await this.documentos_service.getDocumento(this.documento_id);
    if (documento.code) {
      this.documento = documento.data;
      if (this.documento.sucursal_id) {
        await this.setDocumento();
      } else {
        await this.getSucursales();
      }

      let d: any = localStorage.getItem(`carrito${this.documento_id}`);
      this.traslados_detalles = JSON.parse(d) || [];
    }
  }

  async getSucursales() {
    let sucursales = await this.sucursales_service.getSucursales();
    if (sucursales.code) {
      this.sucursales2 = sucursales.data;
    }
  }

  async getBodegasBySucursal(id: any) {
    this.trasladoForm.controls['bodega_salida_id'].setValue(null);

    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }
  }

  async getBodegasBySucursal2(id: any) {
    this.trasladoForm.controls['bodega_entrada_id'].setValue(null);

    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas2 = bodegas.data;
    }
  }

  async setDocumento() {
    this.trasladoForm.controls['sucursal_salida_id'].setValue([this.documento.sucursal]);

    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.trasladoForm.controls['bodega_salida_id'].setValue([this.documento.bodega]);
    } else {
      this.trasladoForm.controls['bodega_salida_id'].setValue(null);
    }
  }

  getTotal() {
    let total = 0;
    this.traslados_detalles.forEach((d: any) => {
      total += parseFloat(d.total);
    });
    return total;
  }

  getSubtotal() {
    let subtotal = 0;
    this.traslados_detalles.forEach((d: any) => {
      subtotal += parseFloat(d.subtotal);
    });
    return subtotal;
  }

  getImpuesto() {
    let impuesto = 0;
    this.traslados_detalles.forEach((d: any) => {
      impuesto += parseFloat(d.impuesto);
    });
    return impuesto;
  }

  async postTraslado() {

    $('#btn_guardar').prop('disabled', true);
    this.ngxService.start();

    if (!this.fechaMax()) {
      return;
    }

    // Validar carrito
    let insuficiente = '';
    for (let v = 0; v < this.traslados_detalles.length; v++) {
      if (this.traslados_detalles[v].cantidad <= 0) {
        return this.alertas_service.error(`Cantidad de producto ${this.traslados_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.traslados_detalles[v].descripcion == '') {
        return this.alertas_service.error(`Descripción de producto es un campo obligatorio`, true);
      }
      if (this.tipo_stock == 'Estricto' && this.documento.inventario) {
        if (!this.traslados_detalles[v].producto.combo) {
          if (parseFloat(this.traslados_detalles[v].stock) < parseFloat(this.traslados_detalles[v].cantidad)) {
            insuficiente += `\n -${this.traslados_detalles[v].descripcion}`;
          }
        }
        if (this.traslados_detalles[v].producto.combo) {
          let recetas = await this.recetas_service.getRecetas({
            producto_id: this.traslados_detalles[v].producto_id
          });
          if (recetas.code && recetas.data) {
            for (let r = 0; r < recetas.data.length; r++) {
              let existencias = await this.existencias_service.getAllExistenciaStock({
                mes: moment().format('YYYY-MM'),
                producto_id: recetas.data[r].producto_receta_id,
                variacion_id: recetas.data[r].variacion_receta_id,
                lote_id: recetas.data[r].lote_receta_id,
                sucursal_id: this.trasladoForm.value.sucursal_id.map((s: any) => s.id),
                bodega_id: this.trasladoForm.value.bodega_id.map((b: any) => b.id)
              });
              if (existencias.code && existencias.data) {
                if (parseFloat(existencias.data.stock_final) < (parseFloat(this.traslados_detalles[v].cantidad) * parseFloat(recetas.data[r].cantidad))) {
                  insuficiente += `\n -${recetas.data[r].producto_receta.nombre} (${this.traslados_detalles[v].producto.nombre})`;
                }
              } else {
                insuficiente += `\n -${recetas.data[r].producto.nombre} (${this.traslados_detalles[v].producto.nombre})`;
              }
            }
          } else {
            insuficiente += `Producto ${this.traslados_detalles[v].descripcion} no tiene recetas\n\n`;
          }
        }
      }
    }

    if (this.traslados_detalles.length == 0) {
      return this.alertas_service.error(`Selecciona productos a trasladar`, true);
    }

    this.trasladoForm.controls['documento_id'].setValue(this.documento.id);
    this.trasladoForm.controls['traslados_detalles'].setValue(this.traslados_detalles);

    if (this.trasladoForm.controls['bodega_salida_id'].value && this.trasladoForm.controls['bodega_salida_id'].value.length > 0) {
      this.trasladoForm.controls['bodega_salida_id'].setValue(this.trasladoForm.controls['bodega_salida_id'].value[0].id);
    }
    if (this.trasladoForm.controls['bodega_entrada_id'].value && this.trasladoForm.controls['bodega_entrada_id'].value.length > 0) {
      this.trasladoForm.controls['bodega_entrada_id'].setValue(this.trasladoForm.controls['bodega_entrada_id'].value[0].id);
    }
    if (this.trasladoForm.controls['sucursal_salida_id'].value && this.trasladoForm.controls['sucursal_salida_id'].value.length > 0) {
      this.trasladoForm.controls['sucursal_salida_id'].setValue(this.trasladoForm.controls['sucursal_salida_id'].value[0].id);
    }
    if (this.trasladoForm.controls['sucursal_entrada_id'].value && this.trasladoForm.controls['sucursal_entrada_id'].value.length > 0) {
      this.trasladoForm.controls['sucursal_entrada_id'].setValue(this.trasladoForm.controls['sucursal_entrada_id'].value[0].id);
    }

    let traslado = await this.traslados_service.postTraslado(this.trasladoForm.value);
    if (traslado.code) {
      localStorage.removeItem(`carrito${this.documento_id}`);
      this.alertas_service.success(traslado.mensaje);
      this.ngxService.stop();
      this.location.back();
    }

    $('#btn_guardar').prop('disabled', false);
    this.ngxService.stop();
  }

  get data_view() {
    let view = localStorage.getItem('data_view');
    return view ? view : 'grid'
  }

  setDataView(tipo: string) {
    localStorage.setItem('data_view', tipo);
  }

  detalleLocal() {
    localStorage.setItem(`save_traslados_${this.documento_id}`, JSON.stringify(this.traslados_detalles));
  }

  fechaMax() {
    if (this.trasladoForm.value.fecha > this.fecha_max) {
      this.alertas_service.error('Fecha mayor al mes actual', true);
      return false;
    }
    if (this.trasladoForm.value.fecha < this.fecha_min) {
      this.alertas_service.error('Fecha menor al mes actual', true);
      return false;
    }
    return true;
  }
  updateCarrito() {
    this.traslados_detalles = JSON.parse(localStorage.getItem(`carrito${this.documento_id}`) || '[]');
  }

}

