import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../../../../app.component';
import { AlertasService } from '../../../../services/alertas.service';
import { TiposGastosService } from '../../../../services/tipos_gastos.service';
import { ComprasService } from '../../../../services/compras.service';
import { MonedasService } from '../../../../services/monedas.service';
import { ImportacionesService } from '../../../../services/importaciones.service';

@Component({
  selector: 'app-gasto-importacion',
  standalone: false,
  templateUrl: './gasto-importacion.component.html',
  styleUrl: './gasto-importacion.component.css'
})
export class GastoImportacionComponent {

  @Input() importacion_id: any;

  importaciones_gastos: any = [];
  tipos_prorrateos: any = ['AL INVENTARIO', 'AL VALOR', 'AL PESO'];
  tipos_gastos: any = [];
  importaciones_detalles: any = [];
  monedas: any = [];
  compras: any = [];

  importacionForm: FormGroup = new FormGroup({
    estado: new FormControl(null),
    factor: new FormControl(null),
    factor_ext: new FormControl(null),
    tipo_prorrateo: new FormControl(null),
    tipo_cambio: new FormControl(null),
    importaciones_detalles: new FormControl([]),
    importaciones_gastos: new FormControl([])
  });

  moneda_simbolo: any;
  ext: any = true;

  constructor(
    private alertas_service: AlertasService,
    private compras_service: ComprasService,
    private monedas_service: MonedasService,
    private tipos_gastos_service: TiposGastosService,
    private importaciones_service: ImportacionesService
  ) {

  }

  async ngOnInit() {
    await this.getImportacion();
    await this.getMonedas();
    await this.getCompras();
    await this.getTiposGastos();
  }

  get selectS() {
    return AppComponent.selectS;
  }

  async getImportacion() {
    let importacion = await this.importaciones_service.getImportacion(this.importacion_id);
    if (importacion.code) {
      this.importacionForm.patchValue(importacion.data);
      this.importaciones_gastos = importacion.data.importaciones_gastos;
      this.importaciones_detalles = importacion.data.importaciones_detalles;

      this.moneda_simbolo = importacion.data.moneda.simbolo;

      this.importaciones_gastos.map((d: any) => {
        d.tipo_gasto_id = d.tipo_gasto ? [d.tipo_gasto] : null;
      });

      this.importacionForm.controls['tipo_prorrateo'].setValue([importacion.data.tipo_prorrateo]);
    }
  }

  async getCompras() {
    let compras = await this.compras_service.getCompras(null, null, {
      estado: 'VIGENTE'
    });
    if (compras.code) {
      this.compras = compras.data;
    }
  }

  async getTiposGastos() {
    let tipos_gastos = await this.tipos_gastos_service.getTiposGastos();
    if (tipos_gastos.code) {
      this.tipos_gastos = tipos_gastos.data;
    }
  }

  async getMonedas() {
    let monedas = await this.monedas_service.getMonedas();
    if (monedas.code) {
      this.monedas = monedas.data;
    }
  }

  removeGasto(d: any) {
    this.importaciones_gastos.splice(d, 1);
    this.setProrrateo();
  }

  setCompra(c: any) {
    this.importaciones_gastos.push({
      compra: c,
      compra_id: c.id
    });
    this.alertas_service.success('Compra seleccionada', true);
    this.setProrrateo();
  }

  compraExistente(c: any) {
    return this.importaciones_gastos.some((saldo: any) => saldo.compra_id === c.id);
  }

  getTotalGasto() {
    let total = 0;
    this.importaciones_gastos.map((g: any) => {
      if (g.compra.gravable) {
        total += parseFloat(g.compra.subtotal);
      } else {
        total += parseFloat(g.compra.total);
      }
    });
    return total;
  }

  getTotalGastoExt() {
    let total = 0;
    this.importaciones_gastos.map((g: any) => {
      if (g.compra.gravable) {
        total += parseFloat(g.compra.moneda_id == 1 ? parseFloat(g.compra.subtotal) / parseFloat(this.importacionForm.value.tipo_cambio) : g.compra.sub_total_ext);
      } else {
        total += parseFloat(g.compra.moneda_id == 1 ? parseFloat(g.compra.total) / parseFloat(this.importacionForm.value.tipo_cambio) : g.compra.total_ext);
      }
    });
    return total;
  }

  getTotalCantidad() {
    let cantidad = 0;
    this.importaciones_detalles.forEach((d: any) => {
      cantidad += parseFloat(d.cantidad);
    });
    return cantidad;
  }

  getTotalPeso() {
    let peso = 0;
    this.importaciones_detalles.forEach((d: any) => {
      peso += parseFloat(d.peso);
    });
    return peso;
  }

  getTotalCostoU() {
    let costo = 0;
    this.importaciones_detalles.forEach((d: any) => {
      costo += parseFloat(this.ext ? d.costo_unitario_ext : d.costo_unitario);
    });
    return costo;
  }

  getTotalTotal() {
    let total = 0;
    this.importaciones_detalles.forEach((d: any) => {
      total += parseFloat(this.ext ? d.total_ext : d.total);
    });
    return total;
  }

  getGastoNeto(d: any) {
    return parseFloat(((d.costo_unitario_cif_ext) - d.costo_unitario_ext).toFixed(2));
  }

  getTotalGastoNeto() {
    let total = 0;
    this.importaciones_detalles.forEach((d: any) => {
      total += this.getGastoNeto(d);
    });
    return total;
  }

  getTotalCostoUnitarioCIF() {
    let total = 0;
    this.importaciones_detalles.forEach((d: any) => {
      total += parseFloat(this.ext ? d.costo_unitario_cif_ext : d.costo_unitario_cif);
    });
    return total;
  }

  getTotalCostoCIF() {
    let total = 0;
    this.importaciones_detalles.forEach((d: any) => {
      total += parseFloat(this.ext ? d.costo_cif_ext : d.costo_cif);
    });
    return total;
  }

  setProrrateo() {
    let factor = 0;
    let factor_ext = 0;

    if (this.importacionForm.value.tipo_prorrateo[0] == 'AL INVENTARIO') {
      factor = parseFloat((this.getTotalGasto() / this.getTotalCantidad()).toFixed(4));
      factor_ext = parseFloat((this.getTotalGastoExt() / this.getTotalCantidad()).toFixed(4));

      this.importaciones_detalles = this.importaciones_detalles.map((d: any) => {
        let costo_cif_ext = (parseFloat(d.costo_unitario_ext) + factor_ext) * parseFloat(d.cantidad);
        if (d.arancel) {
          costo_cif_ext += parseFloat(d.total_ext) * parseFloat(d.arancel) / 100;
        }
        let costo_unitario_cif_ext = costo_cif_ext / parseFloat(d.cantidad);
        return {
          ...d,
          porc_gasto: parseFloat((parseFloat(d.cantidad) / this.getTotalCantidad() * 100).toFixed(2)),
          costo_cif_ext: costo_cif_ext,
          costo_unitario_cif_ext: costo_unitario_cif_ext,
          costo_cif: costo_cif_ext * this.importacionForm.value.tipo_cambio,
          costo_unitario_cif: costo_unitario_cif_ext * this.importacionForm.value.tipo_cambio,
        };
      });

    }
    if (this.importacionForm.value.tipo_prorrateo[0] == 'AL VALOR') {
      factor = parseFloat((this.getTotalGasto() / this.getTotalTotal()).toFixed(4));
      factor_ext = parseFloat((this.getTotalGastoExt() / this.getTotalTotal()).toFixed(4));

      this.importaciones_detalles = this.importaciones_detalles.map((d: any) => {
        let costo_cif_ext = ((parseFloat(d.total_ext) * factor_ext)) + parseFloat(d.total_ext);
        if (d.arancel) {
          costo_cif_ext += parseFloat(d.total_ext) * parseFloat(d.arancel) / 100;
        }
        let costo_unitario_cif_ext = costo_cif_ext / parseFloat(d.cantidad);
        return {
          ...d,
          porc_gasto: parseFloat((parseFloat(d.total_ext) / this.getTotalTotal() * 100).toFixed(2)),
          costo_cif_ext: costo_cif_ext,
          costo_unitario_cif_ext: costo_unitario_cif_ext,
          costo_cif: costo_cif_ext * this.importacionForm.value.tipo_cambio,
          costo_unitario_cif: costo_unitario_cif_ext * this.importacionForm.value.tipo_cambio,
        };
      });
    }
    if (this.importacionForm.value.tipo_prorrateo[0] == 'AL PESO') {
      factor = parseFloat((this.getTotalGasto() / this.getTotalPeso()).toFixed(4));
      factor_ext = parseFloat((this.getTotalGastoExt() / this.getTotalPeso()).toFixed(4));

      this.importaciones_detalles = this.importaciones_detalles.map((d: any) => {
        let costo_cif_ext = ((parseFloat(d.peso) * factor_ext)) + parseFloat(d.total_ext);
        if (d.arancel) {
          costo_cif_ext += parseFloat(d.total_ext) * parseFloat(d.arancel) / 100;
        }
        let costo_unitario_cif_ext = costo_cif_ext / parseFloat(d.cantidad);
        return {
          ...d,
          porc_gasto: parseFloat((parseFloat(d.peso) / this.getTotalPeso() * 100).toFixed(2)),
          costo_cif_ext: costo_cif_ext,
          costo_unitario_cif_ext: costo_unitario_cif_ext,
          costo_cif: costo_cif_ext * this.importacionForm.value.tipo_cambio,
          costo_unitario_cif: costo_unitario_cif_ext * this.importacionForm.value.tipo_cambio,
        };
      });
    }

    this.importacionForm.controls['factor'].setValue(factor);
    this.importacionForm.controls['factor_ext'].setValue(factor_ext);

  }

  async putGastoImportacion() {
    this.importaciones_gastos.map((g: any) => {
      g.tipo_gasto_id = g.tipo_gasto_id ? g.tipo_gasto_id[0].id : null
    });
    if (this.importacionForm.value.tipo_prorrateo) {
      this.importacionForm.controls['tipo_prorrateo'].setValue(this.importacionForm.controls['tipo_prorrateo'].value[0]);
    }
    this.importacionForm.controls['importaciones_detalles'].setValue(this.importaciones_detalles);
    this.importacionForm.controls['importaciones_gastos'].setValue(this.importaciones_gastos);

    let importacion = await this.importaciones_service.putImportacion(this.importacion_id, this.importacionForm.value);
    if (importacion.code) {
      this.alertas_service.success(importacion.mensaje, true);
      await this.getImportacion();
    }

  }

}
