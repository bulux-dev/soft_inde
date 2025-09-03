import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { RecibosService } from '../../../../services/recibos.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CategoriasService } from '../../../../services/categorias.service';
import { ProductosService } from '../../../../services/productos.service';
import { DigifactService } from '../../../../services/digifact.service';
import { DocumentosService } from '../../../../services/documentos.service';
import { BodegasService } from '../../../../services/bodegas.service';
import { ClientesService } from '../../../../services/clientes.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from '../../../../app.component';
import { SucursalesService } from '../../../../services/sucursales.service';
import { MonedasService } from '../../../../services/monedas.service';
import { CreditosService } from '../../../../services/creditos.service';
import { VentasService } from '../../../../services/ventas.service';
import { CreditosDetallesService } from '../../../../services/creditos_detalles.service';
import { AmortizacionesService } from '../../../../services/amortizaciones.service';

declare var $: any

@Component({
  selector: 'app-agregar-recibo',
  standalone: false,
  templateUrl: './agregar-recibo.component.html',
  styleUrl: './agregar-recibo.component.css'
})
export class AgregarReciboComponent {

  @Input() documento_id: any;
  @Input() credito_id: any;
  @Input() amortizacion_id: any;
  @Input() tipo: any;

  get selectS() {
    return AppComponent.selectS;
  }

  loading: boolean = false;
  categorias: any = [];
  productos: any = [];
  lotes: any = [];
  variaciones: any = [];
  recibos_detalles: any = [];
  ventas: any = [];
  saldos: any = [];
  pagos: any = [];
  bodegas: any = [];
  monedas: any = [];
  sucursales: any = [];
  metodos: any = ['Efectivo', 'Tarjeta', 'Transferencia', 'Deposito', 'Cheque', 'Vale'];

  categoria_id: any = null;
  documento: any;
  producto: any;
  lote: any;
  variacion: any;
  credito: any;
  amortizacion: any;

  tipos_cuotas: any = ['NIVELADA', 'SOBRE SALDOS', 'FLAT'];
  cuotas: any = []

  reciboForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [Validators.required]),
    observaciones: new FormControl(null),
    descuento: new FormControl(null),
    total: new FormControl(null),
    documento_id: new FormControl(null),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null),
    cliente_id: new FormControl(1),
    moneda_id: new FormControl(null),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    recibos_detalles: new FormControl([]),
    pagos: new FormControl([]),
    saldos: new FormControl([]),
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
  pagoForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD'), [Validators.required]),
    monto: new FormControl(null, [Validators.required]),
    cambio: new FormControl(null),
    metodo: new FormControl(null, [Validators.required]),
    autorizacion: new FormControl(null),
  });

  constructor(
    private ngxService: NgxUiLoaderService,
    private location: Location,
    private alertas_service: AlertasService,
    private recibos_service: RecibosService,
    private categorias_service: CategoriasService,
    private productos_service: ProductosService,
    private digifact_service: DigifactService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private clientes_service: ClientesService,
    private monedas_service: MonedasService,
    private ventas_service: VentasService,
    private creditos_service: CreditosService,
    private creditos_detalles_service: CreditosDetallesService,
    private amortizaciones_service: AmortizacionesService
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDocumento();
    await this.getMonedas();

    if (this.credito_id) {
      let credito = await this.creditos_service.getCredito(this.credito_id);
      this.credito = credito.data;
      this.clienteForm.controls['nit'].setValue(this.credito.credito_detalle.compr_nit);
      await this.getInfoNit();
      
      let descripcion = '';
      let precio_unitario = 0;

      if (this.tipo == 'reserva') {
        descripcion = `Reserva ${this.credito.credito_detalle.producto.nombre}`;
        precio_unitario = parseFloat(this.credito.reserva);
      }
      if (this.tipo == 'enganche') {
        if (this.credito.reserva) {
          descripcion += `Complemento de `;
        }
        descripcion += `Enganche ${this.credito.credito_detalle.producto.nombre}`;
        precio_unitario = parseFloat(this.credito.enganche);
      }
      this.recibos_detalles.push({
        cantidad: 1,
        descripcion: descripcion,
        precio_unitario: precio_unitario,
        precio: precio_unitario,
        descuento: 0,
        total: precio_unitario
      })

      if (this.amortizacion_id) {

        let amortizacion = await this.amortizaciones_service.getAmortizacion(this.amortizacion_id);
        this.amortizacion = amortizacion.data;

        descripcion = `Pago de cuota No. ${this.amortizacion.numero} del ${this.credito.credito_detalle.producto.nombre} correspondiente al mes de ${moment(amortizacion.data.fecha_inicio).format('MMMM YYYY')} `.toUpperCase();
        let precio_unitario = 0;

        this.recibos_detalles = [];

        this.recibos_detalles.push({
          cantidad: 1,
          descripcion: 'Capital',
          precio_unitario: this.amortizacion.capital,
          precio: this.amortizacion.capital,
          descuento: 0,
          total: this.amortizacion.capital
        })
        this.calculo(this.recibos_detalles[0])

        this.recibos_detalles.push({
          cantidad: 1,
          descripcion: 'Interes',
          precio_unitario: this.amortizacion.interes,
          precio: this.amortizacion.interes,
          descuento: 0,
          total: this.amortizacion.interes
        })
        this.calculo(this.recibos_detalles[1])

      }

      this.reciboForm.controls['observaciones'].setValue(descripcion);
      
    }    

    this.ngxService.stop();
  }

  async getVentas() {    
    let ventas = await this.ventas_service.getAllVentasSaldos({
      cliente_id: this.reciboForm.controls['cliente_id'].value
    });
    this.ventas = ventas.data    
    this.ventas = this.ventas.filter((v: any) => {
      let saldo_final = parseFloat(parseFloat(v.saldos[0].saldo_final).toFixed(2))
      return saldo_final > 0
    });
  }

  async getDocumento() {
    this.reciboForm.controls['documento_id'].setValue(this.documento_id);
    let documento = await this.documentos_service.getDocumento(this.documento_id);
    if (documento.code) {
      this.documento = documento.data;
      if (this.documento.sucursal_id) {
        await this.setDocumento();
      } else {
        await this.getSucursales();
      }
    }
  }

  async getCategorias() {
    let sucursal_id = this.reciboForm.controls['sucursal_id'].value[0].id;
    let categorias = await this.categorias_service.getCategoriasBySucursal(sucursal_id);
    if (categorias.code) {
      this.categorias = categorias.data;
      // await this.getProductosByCategoria(this.categoria_id);
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
      this.reciboForm.controls['moneda_id'].setValue([this.monedas[0]])
    }
  }

  async getBodegasBySucursal(id: any) {
    this.reciboForm.controls['bodega_id'].setValue(null);

    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }

    await this.getCategorias();
  }

  async setDocumento() {
    this.reciboForm.controls['sucursal_id'].setValue([this.documento.sucursal]);
    this.pagoForm.controls['metodo'].setValue(['Efectivo']);
    await this.getBodegasBySucursal(this.documento.sucursal_id);

    if (this.documento.bodega) {
      this.reciboForm.controls['bodega_id'].setValue([this.documento.bodega]);
    } else {
      this.reciboForm.controls['bodega_id'].setValue(null);
    }

    await this.getCategorias();
  }

  setVenta(v: any) {
    let p = this.saldos.find((x: any) => {
      return x.venta_id == v.id;
    });
    if (p) {
      this.alertas_service.warning('venta ya agregada', true);
    } else {
      this.saldos.push({
        venta: v,
        saldo_inicial: v.saldos[0].saldo_final,
        total: 0,
        saldo_final: v.saldos[0].saldo_final,
        venta_id: v.id
      })
      this.recibos_detalles.push({
        cantidad: 1,
        descripcion: `FACTURA No. ${v.fel_numero} SERIE: ${v.fel_serie}`,
        precio_unitario: 0,
        precio: 0,
        descuento: 0,
        total: 0,
        venta_id: v.id
      });
      $('#ventas').offcanvas('hide');
    }
  }

  removeVenta(p: any) {
    let index = this.saldos.indexOf(p);
    if (index !== -1) {
      this.saldos.splice(index, 1);
    }
  }

  setAbono(s: any) {
    if (s.total > s.saldo_inicial) {
      s.total = s.saldo_inicial
    }
    
    let index = this.saldos.findIndex((x: any) => x.venta_id == s.venta_id);
    if (index != -1) {
        this.recibos_detalles[index].precio_unitario = s.total;
        this.calculo(this.recibos_detalles[index])
    }

    
    // this.recibos_detalles[s.venta_id].total = s.total;
    // this.recibos_detalles[s.venta_id].precio_unitario = s.total;
    // this.recibos_detalles[s.venta_id].descripcion = `Abono ${s.venta.documento?.tipo_documento?.nombre} ${s.venta.serie}-${s.venta.correlativo}`
    s.saldo_final = s.saldo_inicial - s.total;
  }
  
  calculo(d: any) {
    if (d.cantidad < 0.01) {
      d.cantidad = 0.01
    }

    d.precio = d.precio_unitario * d.cantidad;
    d.total = d.precio - d.descuento;
  }

  addCliente(i: any) {
    this.reciboForm.controls['cliente_id'].setValue(i.id);
    this.clienteForm.patchValue(i);
  }

  addDetalle() {
    this.recibos_detalles.push({
      cantidad: 1,
      descripcion: '',
      precio_unitario: 0,
      precio: 0,
      descuento: 0,
      total: 0
    });
  }

  removeDetalle(i: any) {
    let index = this.recibos_detalles.indexOf(i);
    if (index !== -1) {
      this.recibos_detalles.splice(index, 1);
    }
    this.alertas_service.success('Se elimino el detalle correctamente', true);
  }

  addPago() {
    if (this.pagoForm.valid) {
      this.pagoForm.controls['metodo'].setValue(this.pagoForm.controls['metodo'].value[0]);
      this.pagos.push(this.pagoForm.value);

      if (this.pagoForm.controls['metodo'].value == 'Efectivo') {
        this.pagoForm.controls['cambio'].setValue(this.getCambio());  
        this.pagos[this.pagos.length - 1].cambio = this.getCambio();      
      } else {
        this.pagoForm.controls['cambio'].setValue(null);        
      }

      this.pagoForm.reset();
      this.pagoForm.controls['fecha'].setValue(moment().format('YYYY-MM-DD'));
    }
  }

  deletePago(p: any) {
    let index = this.pagos.indexOf(p);
    if (index !== -1) {
      this.pagos.splice(index, 1);
    }
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
      this.reciboForm.controls['cliente_id'].setValue(cliente.data[0].id);
    } else {
      let info = await this.digifact_service.getInfoNit(nit);
      if (info.code && info.data.RESPONSE[0].NOMBRE) {

        cliente = await this.clientes_service.postCliente({
          nit: nit,
          nombre: info.data.RESPONSE[0].NOMBRE
        });
        if (cliente) {
          this.clienteForm.patchValue(cliente.data);
          this.reciboForm.controls['cliente_id'].setValue(cliente.data.id);
        }

      } else {
        this.alertas_service.error('No se encontro nit');
      }
    }
    this.ngxService.stop();
  }

  getTotal() {
    let total = 0;
    this.recibos_detalles.forEach((d: any) => {
      total += d.total;
    });
    return parseFloat(total.toFixed(2));
  }

  getSubtotal() {
    let subtotal = 0;
    this.recibos_detalles.forEach((d: any) => {
      subtotal += d.subtotal;
    });
    return subtotal;
  }

  getImpuesto() {
    let impuesto = 0;
    this.recibos_detalles.forEach((d: any) => {
      impuesto += d.impuesto;
    });
    return impuesto;
  }

  getPagado() {
    let pagado = 0;
    this.pagos.forEach((p: any) => {
      pagado += p.monto;
    });
    return pagado;
  }

  getCambio() {
    let cambio = this.getPagado() - this.getTotal();
    return cambio;
  }

  getStockTotal(data: any) {
    let stock = 0;
    data.forEach((v: any) => {
      stock += v.inreciborios.length ? v.inreciborios[0].stock_final : 0;
    });
    return stock;
  }

  getAbono() {
    let total = 0;
    this.saldos.forEach((d: any) => {
      total += d.total;
    });
    return total;
  }

  async postRecibo() {
    
    $('#btn_guardar').prop('disabled', true);
    this.ngxService.start();

    if (this.getPagado() < parseFloat(this.getTotal().toFixed(2))) {
      return this.alertas_service.error(`${this.getCambio()} de monto pendiente`, true);
    }

    this.reciboForm.controls['documento_id'].setValue(this.documento.id);
    this.reciboForm.controls['recibos_detalles'].setValue(this.recibos_detalles);
    this.reciboForm.controls['pagos'].setValue(this.pagos);
    this.reciboForm.controls['saldos'].setValue(this.saldos);

    this.reciboForm.controls['total'].setValue(this.getTotal());
    this.reciboForm.controls['cliente'].setValue(this.clienteForm.value);

    if (this.reciboForm.controls['bodega_id'].value && this.reciboForm.controls['bodega_id'].value.length > 0) {
      this.reciboForm.controls['bodega_id'].setValue(this.reciboForm.controls['bodega_id'].value[0].id);
    }
    if (this.reciboForm.controls['sucursal_id'].value && this.reciboForm.controls['sucursal_id'].value.length > 0) {
      this.reciboForm.controls['sucursal_id'].setValue(this.reciboForm.controls['sucursal_id'].value[0].id);
    }
    if (this.reciboForm.controls['moneda_id'].value && this.reciboForm.controls['moneda_id'].value.length > 0) {
      this.reciboForm.controls['moneda_id'].setValue(this.reciboForm.controls['moneda_id'].value[0].id);
    }

    let recibo = await this.recibos_service.postRecibo(this.reciboForm.value);
    if (recibo.code) {
      this.alertas_service.success(recibo.mensaje);      
      if (this.credito && this.credito.id) {
        if (this.tipo == 'reserva') {
          this.creditos_detalles_service.putCreditoDetalle(this.credito.credito_detalle.id, {
            reserva_fecha: recibo.data.fecha,
            reserva_monto: recibo.data.total,
            reserva_recibo: recibo.data.serie + '-' + recibo.data.correlativo
          })
  
          await this.creditos_service.putCredito(this.credito.id, { recibo_reserva_id: recibo.data.id });
        }
        if (this.tipo == 'enganche') {
          this.creditos_detalles_service.putCreditoDetalle(this.credito.credito_detalle.id, {
            id: this.credito.credito_detalle.id,
            enganche_fecha: recibo.data.fecha,
            enganche_monto: recibo.data.total,
            enganche_recibo: recibo.data.serie + '-' + recibo.data.correlativo
          })
  
          await this.creditos_service.putCredito(this.credito.id, { recibo_enganche_id: recibo.data.id });
        }
        if (this.amortizacion_id) {
          await this.amortizaciones_service.putAmortizacion(this.amortizacion.id, { recibo_id: recibo.data.id });
        } 
      }

      this.ngxService.stop();
      this.location.back();
    }

    $('#btn_guardar').prop('disabled', false);
    this.ngxService.stop();
  }

}

