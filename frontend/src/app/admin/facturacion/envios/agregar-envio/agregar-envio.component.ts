import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { EnviosService } from '../../../../services/envios.service';
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
import { MonedasService } from '../../../../services/monedas.service';
import { EmpleadosService } from '../../../../services/empleados.service';
import { VariablesService } from '../../../../services/variables.service';
import { RecetasService } from '../../../../services/recetas.service';
import { ExistenciasService } from '../../../../services/existencias.service';

declare var $: any

@Component({
  selector: 'app-agregar-envio',
  standalone: false,
  templateUrl: './agregar-envio.component.html',
  styleUrl: './agregar-envio.component.css'
})
export class AgregarEnvioComponent {

  @Input() documento_id: any;

  get selectS() {
    return AppComponent.selectS;
  }

  envios_detalles: any = [];
  bodegas: any = [];
  monedas: any = [];
  sucursales: any = [];
  empleados: any = [];

  documento: any;
  tipo_stock: any;

  fecha_min = moment().startOf('month').format('YYYY-MM-DD HH:mm');
  fecha_max = moment().endOf('month').format('YYYY-MM-DD HH:mm');

  envioForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [Validators.required]),
    observaciones: new FormControl(null),
    descuento: new FormControl(null),
    total: new FormControl(null),
    subtotal: new FormControl(null),
    impuesto: new FormControl(null),
    documento_id: new FormControl(null),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null),
    cliente_id: new FormControl(1),
    moneda_id: new FormControl(null),
    empleado_id: new FormControl(null),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    envios_detalles: new FormControl([]),
    cuotas: new FormControl([]),
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
    private envios_service: EnviosService,
    private digifact_service: DigifactService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private clientes_service: ClientesService,
    private monedas_service: MonedasService,
    private empleados_service: EmpleadosService,
    private variables_service: VariablesService,
    private existencias_service: ExistenciasService,
    private recetas_service: RecetasService
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDocumento();
    await this.getMonedas();
    await this.getEmpleados();
    let tipo_stock = await this.variables_service.getVariables({
      slug: 'stock'
    });
    this.tipo_stock = tipo_stock.data[0].valor;
    this.ngxService.stop();
  }

  async getDocumento() {
    this.envioForm.controls['documento_id'].setValue(this.documento_id);
    let documento = await this.documentos_service.getDocumento(this.documento_id);
    if (documento.code) {
      this.documento = documento.data;
      if (this.documento.sucursal_id) {
        await this.setDocumento();
      } else {
        await this.getSucursales();
      }

      let d: any = localStorage.getItem(`carrito${this.documento_id}`);
      this.envios_detalles = JSON.parse(d) || [];
    }
  }

  async getSucursales() {
    let sucursales = await this.sucursales_service.getSucursales();
    if (sucursales.code) {
      this.sucursales = sucursales.data;
    }
  }

  async getMonedas() {
    let monedas = await this.monedas_service.getMonedas();
    if (monedas.code) {
      this.monedas = monedas.data;
      this.envioForm.controls['moneda_id'].setValue([this.monedas[0]])
    }
  }

  async getEmpleados() {
    let empleados = await this.empleados_service.getEmpleados({
      vendedor: true
    });
    if (empleados.code) {
      this.empleados = empleados.data;
    }
  }

  async getBodegasBySucursal(id: any) {
    this.envioForm.controls['bodega_id'].setValue(null);

    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }
  }

  async setDocumento() {
    this.envioForm.controls['sucursal_id'].setValue([this.documento.sucursal]);

    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.envioForm.controls['bodega_id'].setValue([this.documento.bodega]);
    } else {
      this.envioForm.controls['bodega_id'].setValue(null);
    }
  }

  addCliente(i: any) {
    this.envioForm.controls['cliente_id'].setValue(i.id);
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
      this.envioForm.controls['cliente_id'].setValue(cliente.data[0].id);
    } else {
      let info = await this.digifact_service.getInfoNit(nit);
      if (info.code && info.data.RESPONSE[0].NOMBRE) {

        cliente = await this.clientes_service.postCliente({
          nit: nit,
          nombre: info.data.RESPONSE[0].NOMBRE
        });
        if (cliente) {
          this.clienteForm.patchValue(cliente.data);
          this.envioForm.controls['cliente_id'].setValue(cliente.data.id);
        }

      } else {
        this.alertas_service.error('No se encontro nit');
      }
    }
    this.ngxService.stop();
  }

  getTotal() {
    let total = 0;
    this.envios_detalles.forEach((d: any) => {
      total += parseFloat(d.total);
    });
    return total;
  }

  getSubtotal() {
    let subtotal = 0;
    this.envios_detalles.forEach((d: any) => {
      subtotal += parseFloat(d.subtotal);
    });
    return subtotal;
  }

  getImpuesto() {
    let impuesto = 0;
    this.envios_detalles.forEach((d: any) => {
      impuesto += parseFloat(d.impuesto);
    });
    return impuesto;
  }

  async postEnvio() {

    $('#btn_guardar').prop('disabled', true);
    this.ngxService.start();

    if (!this.fechaMax()) {
      return;
    }

    // Validar carrito
    let insuficiente = '';
    for (let v = 0; v < this.envios_detalles.length; v++) {
      if (this.envios_detalles[v].cantidad <= 0) {
        return this.alertas_service.error(`Cantidad de producto ${this.envios_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.envios_detalles[v].precio_unitario < parseFloat(this.envios_detalles[v].producto.precio)) {
        return this.alertas_service.error(`Precio de producto ${this.envios_detalles[v].descripcion} debe ser mayor a ${this.envios_detalles[v].producto.precio}`, true);
      }
      if (this.envios_detalles[v].precio <= 0) {
        return this.alertas_service.error(`Precio de producto ${this.envios_detalles[v].descripcion} debe ser mayor a 0`, true);
      }
      if (this.envios_detalles[v].descripcion == '') {
        return this.alertas_service.error(`Descripción de producto es un campo obligatorio`, true);
      }
      if (this.tipo_stock == 'Estricto' && this.documento.inventario) {
        if (!this.envios_detalles[v].producto.combo) {
          if (parseFloat(this.envios_detalles[v].stock) < parseFloat(this.envios_detalles[v].cantidad)) {
            insuficiente += `\n -${this.envios_detalles[v].descripcion}`;
          }
        }
        if (this.envios_detalles[v].producto.combo) {
          let recetas = await this.recetas_service.getRecetas({
            producto_id: this.envios_detalles[v].producto_id
          });
          if (recetas.code && recetas.data) {
            for (let r = 0; r < recetas.data.length; r++) {
              let existencias = await this.existencias_service.getAllExistenciaStock({
                mes: moment().format('YYYY-MM'),
                producto_id: recetas.data[r].producto_receta_id,
                variacion_id: recetas.data[r].variacion_receta_id,
                lote_id: recetas.data[r].lote_receta_id,
                sucursal_id: this.envioForm.value.sucursal_id.map((s: any) => s.id),
                bodega_id: this.envioForm.value.bodega_id.map((b: any) => b.id)
              });
              if (existencias.code && existencias.data) {
                if (parseFloat(existencias.data.stock_final) < (parseFloat(this.envios_detalles[v].cantidad) * parseFloat(recetas.data[r].cantidad))) {
                  insuficiente += `\n -${recetas.data[r].producto_receta.nombre} (${this.envios_detalles[v].producto.nombre})`;
                }
              } else {
                insuficiente += `\n -${recetas.data[r].producto.nombre} (${this.envios_detalles[v].producto.nombre})`;
              }
            }
          } else {
            insuficiente += `Producto ${this.envios_detalles[v].descripcion} no tiene recetas\n\n`;
          }
        }
      }
    }

    if (insuficiente) {
      return this.alertas_service.error(`STOCK INSUFICIENTE \n ${insuficiente}`);
    }

    if (!this.envioForm.value.bodega_id || this.envioForm.value.bodega_id.length == 0) {
      return this.alertas_service.error(`Bodega es un campo obligatorio`, true);
    }
    if (!this.envioForm.value.sucursal_id || this.envioForm.value.sucursal_id.length == 0) {
      return this.alertas_service.error(`Sucursal es un campo obligatorio`, true);
    }
    if (!this.envioForm.value.moneda_id || this.envioForm.value.moneda_id.length == 0) {
      return this.alertas_service.error(`Moneda es un campo obligatorio`, true);
    }
    if (!this.envioForm.value.empleado_id || this.envioForm.value.empleado_id.length == 0) {
      return this.alertas_service.error(`Vendedor es un campo obligatorio`, true);
    }
    if (!this.envioForm.value.cliente_id || this.envioForm.value.cliente_id.length == 0) {
      return this.alertas_service.error(`Cliente es un campo obligatorio`, true);
    }
    if (!this.envioForm.value.documento_id || this.envioForm.value.documento_id.length == 0) {
      return this.alertas_service.error(`Documento es un campo obligatorio`, true);
    }

    this.envioForm.controls['documento_id'].setValue(this.documento.id);
    this.envioForm.controls['envios_detalles'].setValue(this.envios_detalles);

    this.envioForm.controls['total'].setValue(this.getTotal());
    this.envioForm.controls['subtotal'].setValue(this.getSubtotal());
    this.envioForm.controls['impuesto'].setValue(this.getImpuesto());
    this.envioForm.controls['cliente'].setValue(this.clienteForm.value);

    if (this.envioForm.controls['bodega_id'].value && this.envioForm.controls['bodega_id'].value.length > 0) {
      this.envioForm.controls['bodega_id'].setValue(this.envioForm.controls['bodega_id'].value[0].id);
    }
    if (this.envioForm.controls['sucursal_id'].value && this.envioForm.controls['sucursal_id'].value.length > 0) {
      this.envioForm.controls['sucursal_id'].setValue(this.envioForm.controls['sucursal_id'].value[0].id);
    }
    if (this.envioForm.controls['moneda_id'].value && this.envioForm.controls['moneda_id'].value.length > 0) {
      this.envioForm.controls['moneda_id'].setValue(this.envioForm.controls['moneda_id'].value[0].id);
    }
    if (this.envioForm.controls['empleado_id'].value && this.envioForm.controls['empleado_id'].value.length > 0) {
      this.envioForm.controls['empleado_id'].setValue(this.envioForm.controls['empleado_id'].value[0].id);
    }


    let envio = await this.envios_service.postEnvio(this.envioForm.value);
    if (envio.code) {

      await this.clientes_service.putCliente(this.envioForm.value.cliente_id, {
        direccion: this.clienteForm.controls['direccion'].value
      });

      localStorage.removeItem(`carrito${this.documento_id}`);
      this.alertas_service.success(envio.mensaje);
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
    localStorage.setItem(`save_envios_${this.documento_id}`, JSON.stringify(this.envios_detalles));
  }

  fechaMax() {
    if (this.envioForm.value.fecha > this.fecha_max) {
      this.alertas_service.error('Fecha no coincide con el mes actual', true);
      return false;
    }
    return true;
  }

  updateCarrito() {
    this.envios_detalles = JSON.parse(localStorage.getItem(`carrito${this.documento_id}`) || '[]');
  }

}

