import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductosService } from '../../services/productos.service';
import { AlertasService } from '../../services/alertas.service';
import { CategoriasService } from '../../services/categorias.service';
import { MarcasService } from '../../services/marcas.service';
import { VariacionesService } from '../../services/variaciones.service';
import { LotesService } from '../../services/lotes.service';
import { ExistenciasService } from '../../services/existencias.service';
import { VariablesService } from '../../services/variables.service';
import moment from 'moment';
import { RecetasService } from '../../services/recetas.service';
import { ProductosPreciosService } from '../../services/productos_precios.service';
import { AppComponent } from '../../app.component';

declare var $: any

@Component({
  selector: 'app-carrito',
  standalone: false,
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {

  @Input() oc: any;
  @Input() sucursal_id: any = null;
  @Input() bodega_id: any = null;
  @Input() documento_id: any = null;
  @Input() moneda_id: any = 1;
  @Input() cuenta_id: any = null;
  @Input() documento: any;
  @Input() tipo_cambio: any = 1;
  @Input() moneda_simbolo: any;
  @Input() gravable: any = 1;
  @Input() carrito_local: any = true;
  @Input() carrito_detalles: any = [];
  @Input() carrito_temp: any = [];
  @Output() newItemEvent = new EventEmitter<string>();
  @Output() newItemEvent2 = new EventEmitter<string>();

  get selectS() {
    return AppComponent.selectS;
  }

  busqueda: any = null;

  loading: boolean = false;
  categorias: any = [];
  marcas: any = [];
  productos: any = [];
  productos_lista: any = [];
  lotes: any = [];
  variaciones: any = [];
  productos_precios: any = [];
  producto_precio: any = null;

  categoria_id: any = null;
  categoria2_id: any = null;
  categoria3_id: any = null;
  marca_id: any = null;
  producto: any;
  lote: any;
  variacion: any;
  credito: any;
  tipo_stock: any;
  impuesto: any;

  isHovered = false;
  isHoverDescripcion = false;

  loteForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    fecha_alta: new FormControl(null),
    fecha_caducidad: new FormControl(null),
    producto_id: new FormControl(null)
  });

  constructor(
    private ngxService: NgxUiLoaderService,
    private alertas_service: AlertasService,
    private categorias_service: CategoriasService,
    private marcas_service: MarcasService,
    private productos_service: ProductosService,
    private varaiciones_service: VariacionesService,
    private lotes_service: LotesService,
    private existencias_service: ExistenciasService,
    private variables_service: VariablesService,
    private recetas_service: RecetasService,
    private productos_precios_service: ProductosPreciosService
  ) { }

  async ngOnInit() {
    await this.getCategorias();
    await this.getMarcas();
    await this.getProductosPrecios();

    let tipo_stock = await this.variables_service.getVariables({
      slug: 'stock'
    });
    this.tipo_stock = tipo_stock.data[0].valor;

    let impuesto = await this.variables_service.getVariables({
      slug: 'impuesto'
    })
    this.impuesto = impuesto.data[0].valor;

    // Temp
    if (this.carrito_local) {
      this.carrito_detalles = this.carrito_temp;
    }

    if (this.cuenta_id && this.carrito_detalles.length == 0) {
      let d: any = localStorage.getItem(`carrito${this.documento_id}`);

      if (d) {
        this.carrito_detalles = JSON.parse(d) || [];
      }
    }

    this.updateCarrito();

  }

  async getCategorias() {
    let categorias = await this.categorias_service.getCategoriasBySucursal(this.sucursal_id);
    if (categorias.code) {
      this.categorias = categorias.data;
    }
  }

  async getMarcas() {
    let marcas = await this.marcas_service.getMarcas();
    if (marcas.code) {
      this.marcas = marcas.data;
    }
  }

  async getProductosPrecios() {
    let productos_precios = await this.productos_precios_service.getProductosPrecios();
    if (productos_precios.code) {
      this.productos_precios = productos_precios.data;
    }
  }

  async getProductosByCategoria(id: any) {
    this.ngxService.start();
    this.categoria_id = id;
    let productos = await this.productos_service.getProductosByCategoria({
      categoria_id: this.categoria_id,
      sucursal_id: this.sucursal_id,
      bodega_id: this.bodega_id
    });
    if (productos.code) {
      this.productos = productos.data;
      this.productos_lista = this.productos;
    }
    this.ngxService.stop();
  }

  async getProductosByMarca(id: any) {
    this.ngxService.start();
    this.marca_id = id;
    let productos = await this.productos_service.getProductosByMarca({
      marca_id: this.marca_id,
      sucursal_id: this.sucursal_id,
      bodega_id: this.bodega_id
    });
    if (productos.code) {
      this.productos = productos.data;
      this.productos_lista = this.productos;
    }
    this.ngxService.stop();
  }

  async searchByNombre($event: any, tipo: any = null) {
    this.ngxService.start();
    let busqueda = $event.target.value;
    if (this.categoria_id) {
      let productos = await this.productos_service.searchProductoByNombre(busqueda, this.categoria_id);
      this.productos = productos.data;
      this.productos_lista = this.productos;
    } else {
      let productos = await this.productos_service.searchProductoByNombre(busqueda, null);
      this.productos = productos.data;
      this.productos_lista = this.productos;
    }
    this.ngxService.stop();
  }

  async searchBySku($event: any) {
    this.ngxService.start();
    let busqueda = $event.target.value;

    let producto = await this.productos_service.searchProductoBySKU(busqueda);
    if (producto.data && producto.data.id) {
      await this.addProducto(producto.data);
    } else {
      this.alertas_service.warning('Producto no encontrado');
    }
    this.ngxService.stop();
  }

  async addProducto(p: any) {
    this.producto = p;
    this.lote = null;

    if (this.producto.combo) {
      await this.validarCombo(p);
    } else if (this.producto.lote) {
      let lotes = await this.lotes_service.getLotesExistentes({
        producto_id: this.producto.id,
      });
      // if (lotes.data.length > 0) {
      //   this.lotes = lotes.data;
      //   $('#lotes').offcanvas('show');
      // } else {
      //   this.alertas_service.error('No existen lotes disponibles', true);
      // }
      this.lotes = lotes.data;
      $('#lotes').offcanvas('show');
    } else {
      await this.validarVariaciones();
    }
  }

  async addLote(l: any = null) {
    this.ngxService.start();

    if (this.documento.tipo_documento.inv_entrada && !this.documento.tipo_documento.inv_salida) {
      this.loteForm.controls['nombre'].setValue(this.loteForm.controls['nombre'].value.trim());
      let lote = await this.lotes_service.getLotes({
        nombre: this.loteForm.controls['nombre'].value,
        fecha_alta: this.loteForm.controls['fecha_alta'].value,
        fecha_caducidad: this.loteForm.controls['fecha_caducidad'].value,
        producto_id: this.producto.id,
      });

      if (lote.data.length > 0) {
        this.lote = lote.data[0];
      } else {
        this.loteForm.controls['producto_id'].setValue(this.producto.id);
        let lote = await this.lotes_service.postLote(this.loteForm.value);
        if (lote.code) {
          this.lote = lote.data;
        }
      }
      this.loteForm.reset();
    }
    if (this.documento.tipo_documento.inv_salida) {
      this.lote = l ? l : null
    }

    $('#lotes').offcanvas('hide');
    await this.validarVariaciones();
    this.ngxService.stop();
  }

  async validarVariaciones() {
    // this.ngxService.start();
    let variaciones = await this.varaiciones_service.getVariaciones({
      producto_id: this.producto.id,
      sucursal_id: this.sucursal_id,
      bodega_id: this.bodega_id
    });
    this.ngxService.stop();
    if (variaciones.data.length > 0) {
      this.variaciones = variaciones.data;
      for (let v = 0; v < this.variaciones.length; v++) {
        this.variaciones[v].variacion = '';
        for (let d = 0; d < this.variaciones[v].variaciones_detalles.length; d++) {
          if (this.variaciones[v].variaciones_detalles[d].termino) {
            this.variaciones[v].variacion += `${this.variaciones[v].variaciones_detalles[d].termino.valor.nombre}`;
          } else {
            this.variaciones[v].variacion += ` Cualquier ${this.variaciones[v].variaciones_detalles[d].atributo.nombre}`;
          }
          d < this.variaciones[v].variaciones_detalles.length - 1 ? this.variaciones[v].variacion += ` - ` : null;
        }
      }
      $('#variaciones').offcanvas('show');
      this.ngxService.stop();
      return
    } else {

      let existencia = await this.existencias_service.getExistenciaStock({
        mes: moment().format('YYYY-MM'),
        producto_id: this.producto.id,
        lote_id: this.producto.lote && this.lote ? this.lote.id : null,
        sucursal_id: this.sucursal_id,
        bodega_id: this.bodega_id
      })
      let stock = existencia.data ? parseFloat(existencia.data.stock_final) : 0;

      if (this.documento.inventario) {
        if (this.documento.tipo_documento.inv_salida) {
          if (this.producto.stock && stock <= 0) {
            if (this.tipo_stock == 'Estricto') {
              this.alertas_service.error('Stock insuficiente', true);
              this.ngxService.stop();
              return
            }
            if (this.tipo_stock == 'Aviso') {
              this.alertas_service.error('Stock insuficiente', true);
              this.ngxService.stop();
            }
            if (this.tipo_stock == 'Libre') {
              this.ngxService.stop();
            }
          }
        }
      }

      let porc_iva = 12 / 100;
      let cantidad = 1;
      let unitario = 0;
      if (this.documento.tipo_documento.costo) {
        unitario = this.producto.costo;
      }
      if (this.documento.tipo_documento.precio) {
        unitario = this.producto.precio;
      }
      let unitario_total = cantidad * unitario;
      let descuento = 0;
      let total = unitario_total - descuento;
      let subtotal = total / (1 + porc_iva);
      let impuesto = subtotal * porc_iva;
      if (this.gravable != 1) {
        subtotal = total;
        impuesto = 0;
      }

      let existe = this.carrito_detalles.find((d: any) => d.producto_id === this.producto.id && d.lote_id === (this.lote ? this.lote.id : null));
      if (!existe) {

        let tipo = '';
        if (this.documento.tipo_documento.inv_entrada) {
          tipo = 'entrada';
        }
        if (this.documento.tipo_documento.inv_salida) {
          tipo = 'salida';
        }

        this.carrito_detalles.push({
          logo: this.producto.logo,
          sku: this.producto.sku,
          descripcion: this.producto.nombre,
          tipo: this.producto.tipo_producto.nombre,
          producto: this.producto,
          cantidad: cantidad,
          precio_unitario: unitario,
          costo_unitario: unitario,
          precio: unitario_total,
          costo: unitario_total,
          descuento: descuento,
          total: total,
          subtotal: subtotal,
          impuesto: impuesto,
          precio_unitario_ext: (unitario / this.tipo_cambio).toFixed(2),
          costo_unitario_ext: (unitario / this.tipo_cambio).toFixed(2),
          precio_ext: (unitario_total / this.tipo_cambio).toFixed(2),
          costo_ext: (unitario_total / this.tipo_cambio).toFixed(2),
          descuento_ext: (descuento / this.tipo_cambio).toFixed(2),
          total_ext: (total / this.tipo_cambio).toFixed(2),
          subtotal_ext: (subtotal / this.tipo_cambio).toFixed(2),
          impuesto_ext: (impuesto / this.tipo_cambio).toFixed(2),
          arancel: this.producto.arancel ? this.producto.arancel : 0,
          peso: 0,
          producto_id: this.producto.id,
          medida_id: this.producto.medida_id,
          medida: this.producto.medida,
          equivalencias: this.producto.equivalencias ? this.producto.equivalencias.filter((e: any) => e.tipo === tipo) : [],
          equivalencia: 1,
          lote_id: this.producto.lote && this.lote ? this.lote.id : null,
          lote: this.producto.lote && this.lote ? this.lote : null,
          variacion_id: null,
          stock_producto: stock,
          stock: stock
        });
        this.detalleLocal();
      }
      this.alertas_service.success('Se agrego el producto correctamente', true);
      this.calculo(existe, 'suma');
      // this.ngxService.stop();
    }
  }

  async validarCombo(p: any) {
    let recetas = await this.recetas_service.getRecetas({
      producto_id: p.id
    });
    recetas = recetas.data;
    for (let r = 0; r < recetas.length; r++) {
      if (recetas[r] && recetas[r].producto_receta) {
        let existencia = await this.existencias_service.getExistenciaStock({
          mes: moment().format('YYYY-MM'),
          producto_id: recetas[r].producto_receta.id,
          lote_id: null,
          variacion_id: null,
          sucursal_id: this.sucursal_id,
          bodega_id: this.bodega_id
        })
        let stock = existencia.data ? existencia.data.stock_final : 0;

        if (this.documento.inventario) {
          if (this.documento.tipo_documento.inv_salida) {
            console.log(recetas[r].producto_receta.stock, parseFloat(stock));

            if (recetas[r].producto_receta.stock && parseFloat(stock) === 0) {
              if (this.tipo_stock == 'Estricto') {
                this.alertas_service.error('Stock insuficiente', true);
                this.ngxService.stop();
                return
              }
              if (this.tipo_stock == 'Aviso') {
                this.alertas_service.error('Stock insuficiente', true);
                this.ngxService.stop();
              }
              if (this.tipo_stock == 'Libre') {
                this.ngxService.stop();
              }
            }
          }
        }
      }
    }

    let porc_iva = 12 / 100;
    let cantidad = 1;
    let unitario = 0;
    if (this.documento.tipo_documento.costo) {
      unitario = this.producto.costo;
    }
    if (this.documento.tipo_documento.precio) {
      unitario = this.producto.precio;
    }
    let unitario_total = cantidad * unitario;
    let descuento = 0;
    let total = unitario_total - descuento;
    let subtotal = total / (1 + porc_iva);
    let impuesto = subtotal * porc_iva;
    if (this.gravable[0] != 1) {
      subtotal = total;
      impuesto = 0;
    }

    let existe = this.carrito_detalles.find((d: any) => d.producto_id === this.producto.id && d.lote_id === (this.lote ? this.lote.id : null));
    if (!existe) {

      let tipo = '';
      if (this.documento.tipo_documento.inv_entrada) {
        tipo = 'entrada';
      }
      if (this.documento.tipo_documento.inv_salida) {
        tipo = 'salida';
      }

      this.carrito_detalles.push({
        logo: this.producto.logo,
        sku: this.producto.sku,
        descripcion: this.producto.nombre,
        tipo: this.producto.tipo_producto.nombre,
        producto: this.producto,
        cantidad: cantidad,
        precio_unitario: unitario,
        costo_unitario: unitario,
        precio: unitario_total,
        costo: unitario_total,
        descuento: descuento,
        total: total,
        subtotal: subtotal,
        impuesto: impuesto,
        arancel: this.producto.arancel ? this.producto.arancel : 0,
        peso: 0,
        producto_id: this.producto.id,
        medida_id: this.producto.medida_id,
        medida: this.producto.medida,
        equivalencias: this.producto.equivalencias ? this.producto.equivalencias.filter((e: any) => e.tipo === tipo) : [],
        equivalencia: 1,
        lote_id: this.producto.lote && this.lote ? this.lote.id : null,
        lote: this.producto.lote && this.lote ? this.lote : null,
        variacion_id: null,
        stock_producto: Infinity,
        stock: Infinity
      });
      this.detalleLocal();
    }
    this.alertas_service.success('Se agrego el producto correctamente', true);
    this.calculo(existe, 'suma');

  }

  async addVariacion(v: any) {
    this.variacion = v;

    let existencia = await this.existencias_service.getExistenciaStock({
      mes: moment().format('YYYY-MM'),
      producto_id: this.producto.id,
      lote_id: this.producto.lote && this.lote ? this.lote.id : null,
      variacion_id: v.id,
      sucursal_id: this.sucursal_id,
      bodega_id: this.bodega_id
    })
    let stock = existencia.data ? existencia.data.stock_final : 0;

    if (this.documento.inventario) {
      if (this.documento.tipo_documento.inv_salida) {
        if (this.producto.stock && parseFloat(stock) === 0) {
          if (this.tipo_stock == 'Estricto') {
            this.alertas_service.error('Stock insuficiente', true);
            this.ngxService.stop();
            return
          }
          if (this.tipo_stock == 'Aviso') {
            this.alertas_service.error('Stock insuficiente', true);
            this.ngxService.stop();
          }
          if (this.tipo_stock == 'Libre') {
            this.ngxService.stop();
          }
        }
      }
    }

    let porc_iva = 12 / 100;
    let cantidad = 1;
    let unitario = 0;
    if (this.documento.tipo_documento.costo) {
      unitario = v.costo ? v.costo : v.producto.costo;
    }
    if (this.documento.tipo_documento.precio) {
      unitario = v.precio ? v.precio : v.producto.precio;
    }
    let unitario_total = cantidad * unitario;
    let descuento = 0;
    let total = unitario_total - descuento;
    let subtotal = total / (1 + porc_iva);
    let impuesto = subtotal * porc_iva;
    if (this.gravable != 1) {
      subtotal = total;
      impuesto = 0;
    }

    let existe = this.carrito_detalles.find((d: any) => d.variacion_id === v.id && d.lote_id === (this.lote ? this.lote.id : null));
    if (!existe) {

      let tipo = '';
      if (this.documento.tipo_documento.inv_entrada) {
        tipo = 'entrada';
      }
      if (this.documento.tipo_documento.inv_salida) {
        tipo = 'salida';
      }

      this.carrito_detalles.push({
        logo: v.logo ? v.logo : v.producto.logo,
        sku: v.sku ? v.sku : v.producto.sku,
        descripcion: v.nombre ? v.nombre : `${v.producto.nombre} (${v.variacion})`,
        tipo: this.producto.tipo_producto.nombre,
        producto: v.producto,
        cantidad: cantidad,
        precio_unitario: unitario,
        costo_unitario: unitario,
        precio: unitario_total,
        costo: unitario_total,
        descuento: descuento,
        total: total,
        subtotal: subtotal,
        impuesto: impuesto,
        arancel: this.producto.arancel ? this.producto.arancel : 0,
        peso: 0,
        producto_id: v.producto_id,
        medida_id: v.producto.medida_id,
        medida: v.producto.medida,
        equivalencias: v.producto.equivalencias ? v.producto.equivalencias.filter((e: any) => e.tipo === tipo) : [],
        equivalencia: 1,
        lote_id: this.lote && this.lote ? this.lote.id : null,
        lote: this.lote,
        variacion_id: v.id,
        stock_producto: stock,
        stock: stock
      });
      this.detalleLocal();
    }
    this.alertas_service.success('Se agrego el producto correctamente', true);
    this.calculo(existe, 'suma');
  }

  calculo(d: any, sr: any = null) {
    this.producto = d ? d.producto : this.producto;
    if (d) {
      if (sr == 'suma') {
        d.cantidad++;
      }
      if (sr == 'resta') {
        d.cantidad--;
      }
      let porc_iva = parseFloat(this.impuesto) / 100;

      // Existencias
      if (this.documento.inventario) {
        if (this.documento.tipo_documento.inv_salida) {
          if (this.producto.stock && parseFloat(d.cantidad) > parseFloat(d.stock)) {
            if (this.tipo_stock == 'Estricto') {
              this.alertas_service.error('Stock insuficiente', true);
              setTimeout(() => {
                d.cantidad = d.stock;
                this.detalleLocal();
              }, 100);
            }
            if (this.tipo_stock == 'Aviso') {
              this.alertas_service.warning('Stock insuficiente', true);
            }
          }
        }
      }

      // Operacion
      if (this.moneda_id == 1) {

        if (this.documento.tipo_documento.costo) {
          d.costo = d.costo_unitario * d.cantidad;
          d.total = d.costo - d.descuento;
        }
        if (this.documento.tipo_documento.precio) {
          d.precio = d.precio_unitario * d.cantidad;
          d.total = d.precio - d.descuento;
        }

        if (this.gravable == 1) {
          d.subtotal = d.total / (1 + porc_iva);
          d.impuesto = d.subtotal * porc_iva;
        } else {
          d.subtotal = d.total;
          d.impuesto = 0;
        }

      } else {

        if (this.documento.tipo_documento.costo) {
          d.costo_ext = d.costo_unitario_ext * d.cantidad;
          d.total_ext = d.costo_ext - d.descuento_ext;
        }
        if (this.documento.tipo_documento.precio) {
          d.precio_ext = d.precio_unitario_ext * d.cantidad;
          d.total_ext = d.precio_ext - d.descuento_ext;
        }

        if (this.documento.slug == 'importacion') {
          d.subtotal_ext = d.total_ext;
          d.impuesto_ext = d.total_ext * porc_iva;
        } else {
          d.subtotal_ext = d.total_ext / (1 + porc_iva);
          d.impuesto_ext = d.subtotal_ext * porc_iva;
        }


        // Conversion a M. Nacional
        if (this.documento.tipo_documento.costo) {
          d.costo_unitario = parseFloat(d.costo_unitario_ext) * parseFloat(this.tipo_cambio);
          d.costo = parseFloat(d.costo_ext) * parseFloat(this.tipo_cambio);
        }
        if (this.documento.tipo_documento.precio) {
          d.precio_unitario = parseFloat(d.precio_unitario_ext) * parseFloat(this.tipo_cambio);
          d.precio = parseFloat(d.precio_ext) * parseFloat(this.tipo_cambio);
        }
        d.descuento = parseFloat(d.descuento_ext) * parseFloat(this.tipo_cambio);
        d.total = parseFloat(d.total_ext) * parseFloat(this.tipo_cambio);
        d.subtotal = parseFloat(d.subtotal_ext) * parseFloat(this.tipo_cambio);
        d.impuesto = parseFloat(d.impuesto_ext) * parseFloat(this.tipo_cambio);

      }

    }
    this.detalleLocal();
  }

  get data_view() {
    let view = localStorage.getItem('data_view');
    return view ? view : 'grid'
  }

  setDataView(tipo: string) {
    localStorage.setItem('data_view', tipo);
  }

  detalleLocal() {
    if (this.carrito_local) {
      localStorage.setItem(`carrito${this.documento_id}`, JSON.stringify(this.carrito_detalles));
      this.newItemEvent.emit();
    }
  }

  getVariacionOff(v: any) {
    if (this.documento.tipo_documento.inv_salida && this.lote) {
      let existencias = this.lote.existencias;
      for (let e = 0; e < existencias.length; e++) {
        if (existencias[e].variacion_id == v.id) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  setEquivalencia(d: any, e: any) {
    d.medida_id = e.medida_id;
    d.medida = e.medida;
    d.equivalencia = e.equivalencia ? parseFloat(e.equivalencia) : 1;
    d.precio_unitario = d.producto.precio * d.equivalencia;
    d.stock = (d.stock_producto / d.equivalencia).toFixed(2);
    this.calculo(d);
  }

  setPrecio(d: any, p: any) {
    if (p) {
      if (p.tipo == 'PORCENTAJE') {
        d.precio_unitario = parseFloat(d.producto.costo) + (parseFloat(d.producto.costo) * (parseFloat(p.valor) / 100));
        this.calculo(d);
      }
      if (p.tipo == 'MONTO') {
        d.precio_unitario = parseFloat(d.producto.costo) + parseFloat(p.valor);
        this.calculo(d);
      }
    } else {
      d.precio_unitario = parseFloat(d.producto.precio);
      this.calculo(d);
    }
  }

  async limpiarProductos() {
    let limpiar = await this.alertas_service.limpiar();
    if (limpiar.isConfirmed) {
      this.carrito_detalles = [];
      this.detalleLocal();
    }
  }

  removeItem(i: any) {
    let index = this.carrito_detalles.indexOf(i);
    if (index !== -1) {
      this.carrito_detalles.splice(index, 1);
    }
    this.alertas_service.success('Se elimino el producto correctamente', true);
    this.detalleLocal();
  }

  getTotal(ext: any = null) {
    let total = 0;
    this.carrito_detalles.forEach((d: any) => {
      total += parseFloat(ext ? d.total_ext : d.total);
    });
    return total;
  }

  getSubtotal(ext: any = null) {
    let subtotal = 0;
    this.carrito_detalles.forEach((d: any) => {
      subtotal += parseFloat(ext ? d.subtotal_ext : d.subtotal);
    });
    return subtotal;
  }

  getImpuesto(ext: any = null) {
    let impuesto = 0;
    this.carrito_detalles.forEach((d: any) => {
      // d.impuesto = Math.round((parseFloat(d.impuesto) + Number.EPSILON) * 100) / 100;
      impuesto += parseFloat(ext ? d.impuesto_ext : d.impuesto);
    });
    return impuesto;
  }

  updateDescripcion($event: any, d: any) {
    d.descripcion = $event.target.innerText;
    this.detalleLocal();
  }

  updateCarrito() {
    for (let c = 0; c < this.carrito_detalles.length; c++) {
      this.calculo(this.carrito_detalles[c]);
    }
  }

  getTotalCantidad() {
    let totalCantidad = 0;
    this.carrito_detalles.forEach((d: any) => {
      totalCantidad += parseFloat(d.cantidad);
    });
    return totalCantidad;
  }

  moveUp(i: any) {
    this.carrito_detalles.map((d: any) => d.movido = false);
    let index = this.carrito_detalles.indexOf(i);
    if (index !== 0) {
      let temp = this.carrito_detalles[index];
      this.carrito_detalles[index] = this.carrito_detalles[index - 1];
      this.carrito_detalles[index - 1] = temp;
      this.carrito_detalles[index - 1].movido = true;
    }
    this.detalleLocal();
  }

  moveDown(i: any) {
    this.carrito_detalles.map((d: any) => d.movido = false);
    let index = this.carrito_detalles.indexOf(i);
    if (index !== this.carrito_detalles.length - 1) {
      let temp = this.carrito_detalles[index];
      this.carrito_detalles[index] = this.carrito_detalles[index + 1];
      this.carrito_detalles[index + 1] = temp;
      this.carrito_detalles[index + 1].movido = true;
    }
    this.detalleLocal();
  }

  moveTop(i: any) {
    this.carrito_detalles.map((d: any) => d.movido = false);
    let index = this.carrito_detalles.indexOf(i);
    if (index !== 0) {
      let temp = this.carrito_detalles[index];
      this.carrito_detalles.splice(index, 1);
      this.carrito_detalles.unshift(temp);
      this.carrito_detalles[0].movido = true;
    }
    this.detalleLocal();
  }

  moveBottom(i: any) {
    this.carrito_detalles.map((d: any) => d.movido = false);
    let index = this.carrito_detalles.indexOf(i);
    if (index !== this.carrito_detalles.length - 1) {
      let temp = this.carrito_detalles[index];
      this.carrito_detalles.splice(index, 1);
      this.carrito_detalles.push(temp);
      this.carrito_detalles[this.carrito_detalles.length - 1].movido = true;
    }
    this.detalleLocal();
  }

  getCosto(d: any) {
    if (this.moneda_id != 1) {
      return d.costo / this.tipo_cambio;
    }
    return d.costo;
  }

  getPrecio(p: any) {
    if (this.moneda_id != 1) {
      return p.precio / this.tipo_cambio;
    }
    return p.precio;
  }

  setDescuento(d: any) {
    if (this.documento.tipo_documento.costo) {
      d.descuento = (d.costo_unitario * (d.descuento_porc / 100)).toFixed(2);
    }
    if (this.documento.tipo_documento.precio) {
      d.descuento = (d.precio_unitario * (d.descuento_porc / 100)).toFixed(2);
    }
    this.calculo(d);
  }

  setDescuentoPorc(d: any) {
    if (this.documento.tipo_documento.costo) {
      d.descuento_porc = ((d.descuento * 100) / d.costo_unitario).toFixed(2);
    }
    if (this.documento.tipo_documento.precio) {
      d.descuento_porc = ((d.descuento * 100) / d.precio_unitario).toFixed(2);
    }
    this.calculo(d);
  }

  setDescuentoExt(d: any) {
    if (this.documento.tipo_documento.costo) {
      d.descuento_ext = (d.costo_unitario_ext * (d.descuento_porc_ext / 100)).toFixed(2);
    }
    if (this.documento.tipo_documento.precio) {
      d.descuento_ext = (d.precio_unitario_ext * (d.descuento_porc_ext / 100)).toFixed(2);
    }
    this.calculo(d);
  }

  setDescuentoPorcExt(d: any) {
    if (this.documento.tipo_documento.costo) {
      d.descuento_porc_ext = ((d.descuento_ext * 100) / d.costo_unitario_ext).toFixed(2);
    }
    if (this.documento.tipo_documento.precio) {
      d.descuento_porc_ext = ((d.descuento_ext * 100) / d.precio_unitario_ext).toFixed(2);
    }
    this.calculo(d);
  }

}
