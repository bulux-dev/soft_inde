import { Component } from '@angular/core';
import { ProductosService } from '../../../services/productos.service';
import { AlertasService } from '../../../services/alertas.service';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import readXlsxFile from 'read-excel-file'
import { CategoriasService } from '../../../services/categorias.service';
import { TiposProductosService } from '../../../services/tipos_productos.service';
import { AppComponent } from '../../../app.component';
import moment from 'moment';
import { MedidasService } from '../../../services/medidas.service';
import { ImportesProductosService } from '../../../services/importes_productos.service';
import { MarcasService } from '../../../services/marcas.service';
import { ExistenciasService } from '../../../services/existencias.service';
import { environment } from '../../../../environments/environment';
import { ProductosPreciosService } from '../../../services/productos_precios.service';

declare var $: any

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {

  productos: any = [];
  productos_lista: any = [];
  tipos_productos: any = [];
  productos_importes: any = [];
  medidas: any = [];
  categorias: any = [];
  marcas: any = [];
  importes_productos: any = null;
  filtros: FormGroup = new FormGroup({
    sku: new FormControl(null),
    nombre: new FormControl(null),
    descripcion: new FormControl(null),
    costo: new FormControl(null),
    precio: new FormControl(null),
    descuento: new FormControl(null)
  })
  productoPrecioForm: FormGroup = new FormGroup({
    nombre: new FormControl(null),
    tipo: new FormControl(null),
    valor: new FormControl(null)
  })
  busqueda: any = '';
  categoria: any = null;
  marca: any = null;
  excel: any = null;
  importacion: any = [];
  errores: any = [];
  importados: any = [];
  rechazados: any = [];

  importe_producto: any = null;
  productos_precios: any = [];

  rol_id = localStorage.getItem('rol_id');
  urlAPI: any = environment.domain;

  constructor(
    private ngxService: NgxUiLoaderService,
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private productos_service: ProductosService,
    private categorias_service: CategoriasService,
    private marcas_service: MarcasService,
    private medidas_service: MedidasService,
    private tipos_productos_service: TiposProductosService,
    private importes_productos_service: ImportesProductosService,
    private existencias_service: ExistenciasService,
    private productos_precios_service: ProductosPreciosService
  ) {

  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getTiposProductos();
    await this.getCategorias();
    await this.getMarcas();
    await this.getMedidas();
    this.scripts_service.datatable();
    this.ngxService.stop();
  }

  get selectS() {
    return AppComponent.selectS;
  }

  async getProductos() {
    let productos = await this.productos_service.getProductos(this.filtros.value);
    this.productos = productos.data;
    this.productos_lista = this.productos;
  }

  async getTiposProductos() {
    let tipos_productos = await this.tipos_productos_service.getTiposProductos();
    this.tipos_productos = tipos_productos.data;
  }

  async getMedidas() {
    let medidas = await this.medidas_service.getMedidas();
    this.medidas = medidas.data;
  }

  async getCategorias() {
    let categorias = await this.categorias_service.getCategorias();
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
      productos_precios.data.map((pc: any) => { pc.tipo = [pc.tipo] });
      this.productos_precios = productos_precios.data;
    }
  }

  async getImportesProductos() {
    this.ngxService.start();
    let importes_productos = await this.importes_productos_service.getImportesProductos();
    if (importes_productos.code) {
      this.importes_productos = importes_productos.data;
    }
    this.ngxService.stop();
  }

  async getProductosByCategoria(categoria_id: any) {
    this.filtros.patchValue({ productos: null });
    this.ngxService.start();
    let productos = await this.productos_service.getProductosByCategoria({
      categoria_id: categoria_id
    });
    if (productos.code) {
      this.productos = productos.data;
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
    }
    this.ngxService.stop();
  }

  async searchByNombre(tipo: any = null) {
    this.ngxService.start();
    let productos = await this.productos_service.searchProductoByNombre(this.busqueda, null);
    this.productos = productos.data;
    this.productos_lista = this.productos;
    this.ngxService.stop();
  }

  async deleteProducto(p: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let producto = await this.productos_service.deleteProducto(p.id);
        if (producto.code) {
          this.productos.splice(this.productos.indexOf(p), 1);
          this.alertas_service.success(producto.mensaje);
        }
      }
    });
  }

  async postProductoPrecio() {
    this.ngxService.start();
    this.productoPrecioForm.controls['tipo'].setValue(this.productoPrecioForm.value.tipo[0]);
    let producto_precio = await this.productos_precios_service.postProductoPrecio(this.productoPrecioForm.value);
    if (producto_precio.code) {
      await this.getProductosPrecios();
      this.productoPrecioForm.reset();
      this.alertas_service.success(producto_precio.mensaje);
      $('#agregar-producto-precio').offcanvas('hide');
      $('#productos-precios').offcanvas('show');
    }
    this.ngxService.stop();
  }

  async putProductoPrecio(pp: any) {
    this.ngxService.start();
    pp.tipo = pp.tipo[0];
    let producto_precio = await this.productos_precios_service.putProductoPrecio(pp.id, pp);
    if (producto_precio.code) {
      this.alertas_service.success(producto_precio.mensaje);
      await this.getProductosPrecios();
    }
    this.ngxService.stop();
  }

  async deleteProductoPrecio(pp: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let producto_precio = await this.productos_precios_service.deleteProductoPrecio(pp.id);
        if (producto_precio.code) {
          this.alertas_service.success(producto_precio.mensaje);
          await this.getProductosPrecios();
        }
      }
    });
  }

  async deleteImportacion(i: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let importacion = await this.importes_productos_service.deleteImporteProducto(i.id);
        if (importacion.code) {
          this.importes_productos.splice(this.importes_productos.indexOf(i), 1);
          this.alertas_service.success(importacion.mensaje);
        }
      }
    });
  }

  async importarProductos() {
    this.ngxService.start();

    let importe_producto_id = this.importe_producto && this.importe_producto.id ? this.importe_producto.id : null;

    if (!importe_producto_id) {
      let importe_producto = await this.importes_productos_service.postImporteProducto({
        fecha: moment().format('YYYY-MM-DD HH:mm'),
        categoria_id: this.categoria && this.categoria.length > 0 ? this.categoria[0].id : null,
        marca_id: this.marca && this.marca.length > 0 ? this.marca[0].id : null
      });
      if (importe_producto.code) {
        this.importe_producto = importe_producto.data;
        importe_producto_id = this.importe_producto.id;
      }
    }

    // Importacion
    this.rechazados = [];

    for (let i = 0; i < this.importacion.length; i++) {
      let producto = await this.productos_service.postProducto({
        sku: this.importacion[i][0],
        nombre: this.importacion[i][1],
        tipo_producto_id: this.importacion[i][2][0].id,
        medida_id: this.importacion[i][3][0].id,
        descripcion: this.importacion[i][4],
        costo: this.importacion[i][5],
        precio: this.importacion[i][6],
        stock: this.importacion[i][7],
        lote: this.importacion[i][8],
        productos_categorias: this.categoria && this.categoria.length > 0 ? [
          { id: this.categoria[0].id }
        ] : null,
        productos_marcas: this.marca && this.marca.length > 0 ? [
          { id: this.marca[0].id }
        ] : null,
        importe_producto_id: importe_producto_id
      });
      if (producto.code) {
        if (this.importacion[i][9] > 0) {
          await this.existencias_service.postExistencia({
            mes: moment().format('YYYY-MM'),
            stock_inicial: this.importacion[i][9],
            stock_final: this.importacion[i][9],
            producto_id: producto.data.id,
            lote_id: null,
            variacion_id: null,
            sucursal_id: 1,
            bodega_id: 1
          })
        }
        this.importados.push(this.importacion[i]);
        this.importacion.splice(i, 1);
        i--;
      } else {
        this.rechazados.push(this.importacion[i]);
        this.importacion[i][11] = producto.mensaje;
        // this.importacion.splice(i, 1);
      }
    }

    this.ngxService.stop();
  }

  onFileChange(evt: any) {
    this.importe_producto = null;
    this.importados = [];
    this.importacion = [];
    this.errores = [];
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    readXlsxFile(target.files[0]).then((rows: any) => {

      for (let i = 1; i < rows.length; i++) {

        if (rows[i][0] && rows[i][1]) {
          let err = false;

          rows[i][5] = parseFloat(rows[i][5]).toFixed(2);
          rows[i][6] = parseFloat(rows[i][6]).toFixed(2);
          rows[i][9] = parseFloat(rows[i][9]).toFixed(2);
          rows[i][10] = i;

          this.tipos_productos_service.getTiposProductos({
            nombre: rows[i][2]
          }).then(async (tipo_producto) => {
            if (tipo_producto.code) {
              rows[i][2] = tipo_producto.data;
            }

            this.medidas_service.getMedidas({
              simbolo: rows[i][3]
            }).then(async (medida) => {
              if (medida.code) {
                rows[i][3] = medida.data;
                if (medida.data.length == 0) {
                  err = true;
                }
              }

              if (!rows[i][0] || !rows[i][1] || !rows[i][3] || !rows[i][5] || !rows[i][6]) {
                err = true;
              }

              if (err) {
                this.errores.push(rows[i]);
              } else {
                this.importacion.push(rows[i]);
              }
            });

          });
        }

      }
    });
  }

  setProducto(p: any) {
    if (p[0] && p[1] && p[2] && p[2].length > 0 && p[3] && p[3].length > 0 && p[5] && p[6]) {
      this.importacion.push(p);
      this.importacion = this.importacion.reverse();
      this.errores.splice(this.errores.indexOf(p), 1);
      this.importacion.sort((a: any, b: any) => (a[10] > b[10]) ? 1 : -1);
    } else {
      this.alertas_service.error('Completa los campos', true);
    }
    this.ngxService.start();

    this.ngxService.stop();
  }

  downloadPlantilla() {
    this.ngxService.start();
    var link = document.createElement('a');
    link.href = `${this.urlAPI}/assets/complementos/productos/importar.xls`;
    link.setAttribute('download', `Importar Productos ${this.categoria[0].nombre} ${this.marca && this.marca.length > 0 ? this.marca[0].nombre : ''}.xls`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.ngxService.stop();
  }

  iniciales(nombre: any) {
    nombre = nombre.split(' ');
    if (nombre.length > 1) {
      return nombre[0][0] + nombre[1][0];
    }
    return nombre[0][0] + nombre[0][1];
  }

}

