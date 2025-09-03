import { Component } from '@angular/core';
import { ExistenciasService } from '../../../services/existencias.service';
import { AlertasService } from '../../../services/alertas.service';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductosService } from '../../../services/productos.service';
import { AppComponent } from '../../../app.component';
import { CategoriasService } from '../../../services/categorias.service';
import { BodegasService } from '../../../services/bodegas.service';
import { SucursalesService } from '../../../services/sucursales.service';
import { LotesService } from '../../../services/lotes.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { VariacionesService } from '../../../services/variaciones.service';
import moment from 'moment';
import { InventariosService } from '../../../services/inventarios.service';
import { MarcasService } from '../../../services/marcas.service';
import { MedidasService } from '../../../services/medidas.service';
import { VariablesService } from '../../../services/variables.service';
import { MonedasService } from '../../../services/monedas.service';

@Component({
  selector: 'app-existencias',
  standalone: false,
  templateUrl: './existencias.component.html',
  styleUrl: './existencias.component.css'
})
export class ExistenciasComponent {

  get selectM() {
    return AppComponent.selectM;
  }

  get selectS() {
    return AppComponent.selectS;
  }

  producto_id: any = null;
  variacion_id: any = null;
  lote_id: any = null;
  categorias: any = [];
  marcas: any = [];
  medidas: any = [];
  productos: any = [];
  lotes: any = [];
  variaciones: any = [];
  sucursales: any = [];
  bodegas: any = [];
  monedas: any = [];
  existencias: any = [];
  inventarios: any = [];
  kardex: any = [];
  busqueda: any = null;
  busqueda_lote: any = null;
  tipo_cambio: any = null;

  filtros: FormGroup = new FormGroup({
    categoria_id: new FormControl(null),
    productos: new FormControl(null),
    variacion_id: new FormControl(null),
    lote_id: new FormControl(null),
    sucursal_id: new FormControl(null),
    bodega_id: new FormControl(null),
    moneda_id: new FormControl(null),
    fecha_inicio: new FormControl(moment().startOf('month').format('YYYY-MM-DD HH:mm')),
    fecha_fin: new FormControl(moment().endOf('month').format('YYYY-MM-DD HH:mm')),
  })

  producto: any;

  stock_inicial: any;
  stock_final: any;

  rol_id: any = localStorage.getItem('rol_id');

  constructor(
    private ngxService: NgxUiLoaderService,
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private existencias_service: ExistenciasService,
    private inventarios_service: InventariosService,
    private categorias_service: CategoriasService,
    private marcas_service: MarcasService,
    private medidas_service: MedidasService,
    private productos_service: ProductosService,
    private lotes_service: LotesService,
    private variaciones_service: VariacionesService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private variables_service: VariablesService,
    private monedas_service: MonedasService
  ) {

  }

  async ngOnInit() {
    await this.getCategorias();
    await this.getMarcas();
    await this.getMedidas();
    await this.getSucursales();
    await this.getMonedas();
    await this.getTipoCambio();
  }

  async getProducto(id: any, variacion_id: any = null, lote_id: any = null) {

    this.kardex = [];
    this.producto_id = id;
    this.variacion_id = variacion_id;
    this.lote_id = lote_id;

    let productos = await this.productos_service.getProducto(id);
    if (productos.code) {
      this.producto = productos.data
      if (variacion_id) {
        let variacion = await this.variaciones_service.getVariacion(variacion_id);
        if (variacion.code) {
          this.producto.logo = variacion.data.logo ? variacion.data.logo : this.producto.logo;
          this.producto.nombre = variacion.data.nombre ? variacion.data.nombre : this.producto.nombre;
          variacion.data.variaciones_detalles.forEach((vd: any) => {
            this.producto.nombre += ` (${vd.atributo.nombre}: ${vd.termino.valor.nombre})`
          })

        }
      }
      if (lote_id) {
        let lote = await this.lotes_service.getLote(lote_id);
        if (lote.code) {
          this.producto.lote = lote.data;
        }
      }
    }
  }

  async getExistencias() {
    let sucursal_id = this.filtros.value.sucursal_id ? this.filtros.value.sucursal_id.map((s: any) => s.id) : null;
    let bodega_id = this.filtros.value.bodega_id ? this.filtros.value.bodega_id.map((b: any) => b.id) : null;
    this.ngxService.start();
    this.existencias = [];
    this.kardex = [];
    let productos = this.productos;
    productos.sort((a: any, b: any) => {
      return b.nombre - a.nombre
    })

    for (let pr = 0; pr < productos.length; pr++) {
      let p = productos[pr];

      let existencias: any;
      if (p.variaciones.length > 0) {
        for (let i = 0; i < p.variaciones.length; i++) {
          let v = p.variaciones[i];

          existencias = await this.existencias_service.getAllExistenciaStock({
            mes: moment().format('YYYY-MM'),
            producto_id: v.producto_id,
            variacion_id: v.id,
            lote_id: v.lote_id,
            sucursal_id: sucursal_id,
            bodega_id: bodega_id
          });
          if (existencias.code && existencias.data) {
            this.existencias.push(existencias.data);
          } else {
            let variacion = await this.variaciones_service.getVariacion(v.id);
            if (variacion.code) {
              v = variacion.data
            }
            this.existencias.push({
              fecha: null,
              stock_final: 0,
              producto: p,
              variacion: v,
              variacion_id: v.id,
              lote_id: null,
              lote: null,
            });
          }
        }
      } else if (p.lote) {
        
        for (let l = 0; l < p.lotes.length; l++) {
          let lote = p.lotes[l];

          existencias = await this.existencias_service.getAllExistenciaStock({
            mes: moment().format('YYYY-MM'),
            producto_id: p.id,
            variacion_id: null,
            lote_id: lote.id,
            sucursal_id: sucursal_id,
            bodega_id: bodega_id
          });
          if (existencias.code && existencias.data) {
            this.existencias.push(existencias.data);
          } else {
            this.existencias.push({
              producto: p,
              variacion: null,
              variacion_id: null,
              lote_id: lote.id,
              lote: lote,
              producto_id: p.id,
              fecha: null,
              stock_final: 0,
            });
          }
        }

      } else {
        existencias = await this.existencias_service.getAllExistenciaStock({
          mes: moment().format('YYYY-MM'),
          producto_id: p.id,
          variacion_id: this.filtros.value.variacion_id ? this.filtros.value.variacion_id.map((v: any) => v.id) : null,
          lote_id: this.filtros.value.lote_id ? this.filtros.value.lote_id.map((l: any) => l.id) : null,
          sucursal_id: sucursal_id,
          bodega_id: bodega_id
        });
        if (existencias.code && existencias.data) {
          this.existencias.push(existencias.data);
        } else {
          this.existencias.push({
            producto: p,
            variacion: null,
            variacion_id: null,
            lote_id: null,
            lote: null,
            producto_id: p.id,
            fecha: null,
            stock_final: 0,
          })
        }
      }

    }

    this.ngxService.stop();
  }

  async getKardexMov() {
    this.ngxService.start();
    this.kardex = [];
    let kardex = await this.existencias_service.getExistenciaKardex(this.filtros.value.fecha_inicio, this.filtros.value.fecha_fin, {
      mes: moment().format('YYYY-MM'),
      producto_id: this.producto_id,
      variacion_id: this.variacion_id ? this.variacion_id : null,
      lote_id: this.lote_id ? this.lote_id : null,
      sucursal_id: this.filtros.value.sucursal_id ? this.filtros.value.sucursal_id.map((s: any) => s.id) : null,
      bodega_id: this.filtros.value.bodega_id ? this.filtros.value.bodega_id.map((b: any) => b.id) : null
    });
    if (kardex.code && kardex.data) {
      this.kardex = kardex.data.kardex;
      this.stock_inicial = kardex.data.stock_inicial;
      this.stock_final = kardex.data.stock_final;
    }
    this.ngxService.stop();
  }

  async getCategorias() {
    this.ngxService.start();
    let categorias = await this.categorias_service.getCategorias();
    if (categorias.code) {
      this.categorias = categorias.data;
    }
    this.ngxService.stop();
  }

  async getMarcas() {
    this.ngxService.start();
    let marcas = await this.marcas_service.getMarcas();
    if (marcas.code) {
      this.marcas = marcas.data;
    }
    this.ngxService.stop();
  }

  async getMedidas() {
    this.ngxService.start();
    let medidas = await this.medidas_service.getMedidas();
    if (medidas.code) {
      this.medidas = medidas.data;
    }
    this.ngxService.stop();
  }

  async getMonedas() {
    this.ngxService.start();
    let monedas = await this.monedas_service.getMonedas();
    if (monedas.code) {
      this.monedas = monedas.data;
      this.filtros.patchValue({ moneda_id: [monedas.data[0]] });
    }
    this.ngxService.stop();
  }

  async getLotes() {
    this.ngxService.start();
    let lotes = await this.lotes_service.getLotes();
    if (lotes.code) {
      this.lotes = lotes.data;
    }
    this.ngxService.stop();
  }

  async getTipoCambio() {
    let variable = await this.variables_service.getVariables({
      slug: 'tipo_cambio'
    });
    this.tipo_cambio = parseFloat(variable.data[0].valor);
  }

  async getProductosByCategoria(categoria_id: any) {
    this.filtros.patchValue({ productos: null });
    this.ngxService.start();
    let productos = await this.productos_service.getProductosByCategoria({
      categoria_id: categoria_id
    });
    if (productos.code) {
      this.productos = productos.data;
      await this.getExistencias();
    }
    this.ngxService.stop();
  }

  async getProductosByMarca(marca_id: any) {
    this.filtros.patchValue({ productos: null });
    this.ngxService.start();
    let productos = await this.productos_service.getProductosByMarca({
      marca_id: marca_id
    });
    if (productos.code) {
      this.productos = productos.data;
      await this.getExistencias();
    }
    this.ngxService.stop();
  }

  async getProductosByMedida(medida_id: any) {
    this.filtros.patchValue({ productos: null });
    this.ngxService.start();
    let productos = await this.productos_service.getProductosByMedida({
      medida_id: medida_id
    });
    if (productos.code) {
      this.productos = productos.data;
      await this.getExistencias();
    }
    this.ngxService.stop();
  }

  async getLotesByProducto(id: any) {
    this.filtros.patchValue({ lote_id: null });
    this.ngxService.start();
    let lotes = await this.lotes_service.getLotes({
      producto_id: id
    });
    if (lotes.code) {
      this.lotes = lotes.data;
    }
    await this.getVariacionesByProducto(id);
  }

  async getVariacionesByProducto(id: any) {
    this.filtros.patchValue({ variacion_id: null });
    let variaciones = await this.variaciones_service.getVariaciones({
      producto_id: id
    });
    if (variaciones.code) {
      this.variaciones = variaciones.data;
      for (let v = 0; v < this.variaciones.length; v++) {
        this.variaciones[v].nombre = this.variaciones[v].nombre ? this.variaciones[v].nombre : this.variaciones[v].producto.nombre;
      }
    }
    this.ngxService.stop();
  }

  async getSucursales() {
    let sucursales = await this.sucursales_service.getSucursales();
    if (sucursales.code) {
      this.sucursales = sucursales.data;
      this.filtros.patchValue({ sucursal_id: [sucursales.data[0]] });
      this.getBodegasBySucursal(sucursales.data[0].id);
    }
  }

  async getBodegasBySucursal(id: any) {
    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
      this.filtros.patchValue({ bodega_id: [bodegas.data[0]] });
    }
  }

  async searchByNombre(tipo: any = null) {
    this.ngxService.start();
    let productos = [];
    if (this.busqueda) {
      productos = await this.productos_service.searchProductoByNombre(this.busqueda, null);
    } else {
      productos = await this.productos_service.getProductos();
    }
    this.productos = productos.data;
    await this.getExistencias();

    this.ngxService.stop();
  }

  async searchByLote() {
    if (!this.busqueda_lote) {
      this.alertas_service.warning('Ingrese un lote');
      return;
    }
    this.ngxService.start();
    let productos = [];
    if (this.busqueda_lote.trim()) {
      productos = await this.productos_service.searchProductoByLote(this.busqueda_lote.trim(), null);
    } else {
      productos = await this.productos_service.getProductos();
    }
    this.productos = productos.data;
    await this.getExistencias();

    this.ngxService.stop();
  }

  async getInventarios() {
    this.ngxService.start();
    let inventarios = await this.inventarios_service.getInventarios();
    if (inventarios.code) {
      this.inventarios = inventarios.data;
    }
    this.ngxService.stop();
  }

  async cierreInventario(c: any) {
    this.alertas_service.cerrar().then(async (result: any) => {
      if (result.isConfirmed) {
        this.ngxService.start();
        let inventario = await this.inventarios_service.postCierreInventario({
          mes: moment(c.mes).format('YYYY-MM')
        });
        if (inventario.code) {
          this.alertas_service.success(inventario.mensaje);
          await this.getInventarios();
        }
        this.ngxService.stop();
      }
    })
  }

  async deleteInventario(id: number) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        this.ngxService.start();
        let inventario = await this.inventarios_service.deleteInventario(id);
        if (inventario.code) {
          this.alertas_service.success(inventario.mensaje);
        }
        await this.getInventarios();
        this.ngxService.stop();
      }
    })
  }

  getTotalCostoInv() {
    let total = 0;
    for (let i = 0; i < this.existencias.length; i++) {
      total += parseFloat(this.existencias[i].stock_final) * parseFloat(this.existencias[i].producto.costo);
    }
    return total.toFixed(2);
  }

  getTotalExistencias() {
    let total = 0;
    for (let i = 0; i < this.existencias.length; i++) {
      total += parseFloat(this.existencias[i].stock_final);
    }
    return total.toFixed(2);
  }

  iniciales(nombre: any) {
    nombre = nombre.split(' ');
    if (nombre.length > 1) {
      return nombre[0][0] + nombre[1][0];
    }
    return nombre[0][0] + nombre[0][1];
  }

}

