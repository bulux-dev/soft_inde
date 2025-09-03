import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { DescargasService } from '../../../../services/descargas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { DigifactService } from '../../../../services/digifact.service';
import { DocumentosService } from '../../../../services/documentos.service';
import { BodegasService } from '../../../../services/bodegas.service';
import { ClientesService } from '../../../../services/clientes.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from '../../../../app.component';
import { SucursalesService } from '../../../../services/sucursales.service';
import { VariablesService } from '../../../../services/variables.service';
import { RecetasService } from '../../../../services/recetas.service';
import { ExistenciasService } from '../../../../services/existencias.service';

declare var $: any

@Component({
  selector: 'app-agregar-descarga',
  standalone: false,
  templateUrl: './agregar-descarga.component.html',
  styleUrl: './agregar-descarga.component.css'
})
export class AgregarDescargaComponent {

  @Input() documento_id: any;

  get selectS() {
    return AppComponent.selectS;
  }

  descargas_detalles: any = [];
  bodegas: any = [];
  sucursales: any = [];

  documento: any;
  tipo_stock: any;

  fecha_min = moment().startOf('month').format('YYYY-MM-DD HH:mm');
  fecha_max = moment().endOf('month').format('YYYY-MM-DD HH:mm');

  descargaForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [Validators.required]),
    observaciones: new FormControl(null),
    documento_id: new FormControl(null),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null),
    cliente_id: new FormControl(1),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    descargas_detalles: new FormControl([]),
    cliente: new FormControl({}),
  });
  clienteForm: FormGroup = new FormGroup({
    nombre: new FormControl('Consumidor Final', [Validators.required]),
    nit: new FormControl('CF'),
    cui: new FormControl(null),
    direccion: new FormControl(null),
    contacto: new FormControl(null),
    correo: new FormControl(null),
    telefono: new FormControl(null),
  });

  constructor(
    private ngxService: NgxUiLoaderService,
    private location: Location,
    private alertas_service: AlertasService,
    private descargas_service: DescargasService,
    private digifact_service: DigifactService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private clientes_service: ClientesService,
    private variables_service: VariablesService,
    private existencias_service: ExistenciasService,
    private recetas_service: RecetasService,
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDocumento();
    let tipo_stock = await this.variables_service.getVariables({
      slug: 'stock'
    });
    this.tipo_stock = tipo_stock.data[0].valor;
    this.ngxService.stop();
  }

  async getDocumento() {
    this.descargaForm.controls['documento_id'].setValue(this.documento_id);
    let documento = await this.documentos_service.getDocumento(this.documento_id);
    if (documento.code) {
      this.documento = documento.data;
      if (this.documento.sucursal_id) {
        await this.setDocumento();
      } else {
        await this.getSucursales();
      }

      let d: any = localStorage.getItem(`carrito${this.documento_id}`);
      this.descargas_detalles = JSON.parse(d) || [];
    }
  }

  async getSucursales() {
    let sucursales = await this.sucursales_service.getSucursales();
    if (sucursales.code) {
      this.sucursales = sucursales.data;
    }
  }

  async getBodegasBySucursal(id: any) {
    this.descargaForm.controls['bodega_id'].setValue(null);

    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }
  }

  async setDocumento() {
    this.descargaForm.controls['sucursal_id'].setValue([this.documento.sucursal]);

    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.descargaForm.controls['bodega_id'].setValue([this.documento.bodega]);
    } else {
      this.descargaForm.controls['bodega_id'].setValue(null);
    }
  }

  addCliente(i: any) {
    this.descargaForm.controls['cliente_id'].setValue(i.id);
    this.clienteForm.patchValue(i);
  }


  async getInfoNit() {
    let nit = this.clienteForm.controls['nit'].value.replace(/-/g, '').trim().toUpperCase();
    this.clienteForm.controls['nit'].setValue(nit);

    this.ngxService.start();
    let cliente = await this.clientes_service.getClientes({
      nit: nit
    });
    if (cliente.data.length > 0) {
      this.clienteForm.patchValue(cliente.data[0]);
      this.descargaForm.controls['cliente_id'].setValue(cliente.data[0].id);
    } else {
      let info = await this.digifact_service.getInfoNit(nit);
      if (info.code && info.data.RESPONSE[0].NOMBRE) {

        cliente = await this.clientes_service.postCliente({
          nit: nit,
          nombre: info.data.RESPONSE[0].NOMBRE
        });
        if (cliente) {
          this.clienteForm.patchValue(cliente.data);
          this.descargaForm.controls['cliente_id'].setValue(cliente.data.id);
        }

      } else {
        this.alertas_service.error('No se encontro nit');
      }
    }
    this.ngxService.stop();
  }

  getTotal() {
    let total = 0;
    this.descargas_detalles.forEach((d: any) => {
      total += parseFloat(d.total);
    });
    return total;
  }

  getSubtotal() {
    let subtotal = 0;
    this.descargas_detalles.forEach((d: any) => {
      subtotal += parseFloat(d.subtotal);
    });
    return subtotal;
  }

  getImpuesto() {
    let impuesto = 0;
    this.descargas_detalles.forEach((d: any) => {
      impuesto += parseFloat(d.impuesto);
    });
    return impuesto;
  }

  async postDescarga() {

    $('#btn_guardar').prop('disabled', true);
    this.ngxService.start();

    if (!this.fechaMax()) {
      return;
    }

    // Validar carrito
    let insuficiente = '';
    for (let v = 0; v < this.descargas_detalles.length; v++) {
      if (this.descargas_detalles[v].cantidad <= 0) {
        return this.alertas_service.error(`Cantidad de producto ${this.descargas_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.descargas_detalles[v].descripcion == '') {
        return this.alertas_service.error(`Descripción de producto es un campo obligatorio`, true);
      }
      if (this.tipo_stock == 'Estricto' && this.documento.inventario) {
        if (!this.descargas_detalles[v].producto.combo) {
          if (parseFloat(this.descargas_detalles[v].stock) < parseFloat(this.descargas_detalles[v].cantidad)) {
            insuficiente += `\n -${this.descargas_detalles[v].descripcion}`;
          }
        }
        if (this.descargas_detalles[v].producto.combo) {
          let recetas = await this.recetas_service.getRecetas({
            producto_id: this.descargas_detalles[v].producto_id
          });
          if (recetas.code && recetas.data) {
            for (let r = 0; r < recetas.data.length; r++) {
              let existencias = await this.existencias_service.getAllExistenciaStock({
                mes: moment().format('YYYY-MM'),
                producto_id: recetas.data[r].producto_receta_id,
                variacion_id: recetas.data[r].variacion_receta_id,
                lote_id: recetas.data[r].lote_receta_id,
                sucursal_id: this.descargaForm.value.sucursal_id.map((s: any) => s.id),
                bodega_id: this.descargaForm.value.bodega_id.map((b: any) => b.id)
              });
              if (existencias.code && existencias.data) {
                if (parseFloat(existencias.data.stock_final) < (parseFloat(this.descargas_detalles[v].cantidad) * parseFloat(recetas.data[r].cantidad))) {
                  insuficiente += `\n -${recetas.data[r].producto_receta.nombre} (${this.descargas_detalles[v].producto.nombre})`;
                }
              } else {
                insuficiente += `\n -${recetas.data[r].producto.nombre} (${this.descargas_detalles[v].producto.nombre})`;
              }
            }
          } else {
            insuficiente += `Producto ${this.descargas_detalles[v].descripcion} no tiene recetas\n\n`;
          }
        }
      }
    }

    if (insuficiente) {
      return this.alertas_service.error(`STOCK INSUFICIENTE \n ${insuficiente}`);
    }

    if (this.descargas_detalles.length == 0) {
      return this.alertas_service.error(`Selecciona productos a descargar`, true);
    }

    this.descargaForm.controls['documento_id'].setValue(this.documento.id);
    this.descargaForm.controls['descargas_detalles'].setValue(this.descargas_detalles);
    this.descargaForm.controls['cliente'].setValue(this.clienteForm.value);

    if (this.descargaForm.controls['bodega_id'].value && this.descargaForm.controls['bodega_id'].value.length > 0) {
      this.descargaForm.controls['bodega_id'].setValue(this.descargaForm.controls['bodega_id'].value[0].id);
    }
    if (this.descargaForm.controls['sucursal_id'].value && this.descargaForm.controls['sucursal_id'].value.length > 0) {
      this.descargaForm.controls['sucursal_id'].setValue(this.descargaForm.controls['sucursal_id'].value[0].id);
    }

    let descarga = await this.descargas_service.postDescarga(this.descargaForm.value);
    if (descarga.code) {
      localStorage.removeItem(`carrito${this.documento_id}`);
      this.alertas_service.success(descarga.mensaje);
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
    localStorage.setItem(`save_descargas_${this.documento_id}`, JSON.stringify(this.descargas_detalles));
  }

  fechaMax() {
    if (this.descargaForm.value.fecha > this.fecha_max) {
      this.alertas_service.error('Fecha no coincide con el mes actual', true);
      return false;
    }
    return true;
  }

  updateCarrito() {
    this.descargas_detalles = JSON.parse(localStorage.getItem(`carrito${this.documento_id}`) || '[]');
  }

}

