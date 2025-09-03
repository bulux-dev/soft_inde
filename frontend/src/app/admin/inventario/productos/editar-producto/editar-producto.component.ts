import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { ProductosService } from '../../../../services/productos.service';
import { CategoriasService } from '../../../../services/categorias.service';
import { MarcasService } from '../../../../services/marcas.service';
import { MedidasService } from '../../../../services/medidas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ScriptsService } from '../../../../services/scripts.service';
import { ProductosFotosService } from '../../../../services/productos_fotos.service';
import { TiposProductosService } from '../../../../services/tipos_productos.service';
import { AtributosService } from '../../../../services/atributos.service';
import { TerminosService } from '../../../../services/terminos.service';
import { ProductosAtributosService } from '../../../../services/productos_atributos.service';
import { VariacionesService } from '../../../../services/variaciones.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RecetasService } from '../../../../services/recetas.service';
import { AppComponent } from '../../../../app.component';
import { EquivalenciasService } from '../../../../services/equivalencias.service';
import { ProductosCostosService } from '../../../../services/productos_costos.service';
import { LotesService } from '../../../../services/lotes.service';
import moment from 'moment';

declare var $: any

@Component({
  selector: 'app-editar-producto',
  standalone: false,
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css'
})
export class EditarProductoComponent {

  get selectM() {
    return AppComponent.selectM;
  }

  get selectM2() {
    return AppComponent.selectM2;
  }

  get selectS() {
    return AppComponent.selectS;
  }

  @Input() producto_id: any;
  atributo_id: any;
  producto_atributo_id: any;
  variacion_id: any;
  factor: any;

  tipos_productos: any = [];
  productos: any = [];
  categorias: any = [];
  marcas: any = [];
  medidas: any = [];
  atributos: any = [];
  productos_fotos: any = [];
  productos_costos: any = [];
  variaciones: any = [];
  lotes: any = [];
  recetas: any = [];
  equivalencias_entrada: any = [];
  equivalencias_salida: any = [];

  productoForm: FormGroup = new FormGroup({
    logo: new FormControl(null),
    sku: new FormControl(null, [Validators.required]),
    nombre: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null),
    costo: new FormControl(0),
    precio: new FormControl(0),
    arancel: new FormControl(0),
    stock: new FormControl(true),
    lote: new FormControl(null),
    produccion: new FormControl(null),
    combo: new FormControl(null),
    equivalencia: new FormControl(null),
    porciones: new FormControl(null),
    productos_categorias: new FormControl([]),
    productos_marcas: new FormControl([]),
    productos_medidas: new FormControl([]),
    productos_atributos: new FormControl([]),
    tipo_producto_id: new FormControl(null, [Validators.required]),
    medida_id: new FormControl(null),
    terminos: new FormControl([])
  });

  variacionForm: FormGroup = new FormGroup({
    logo: new FormControl(null),
    sku: new FormControl(null, [Validators.required]),
    nombre: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null),
    costo: new FormControl(null),
    precio: new FormControl(null)
  });

  constructor(
    private ngxService: NgxUiLoaderService,
    private alertas_service: AlertasService,
    private scripts_service: ScriptsService,
    private productos_service: ProductosService,
    private productos_fotos_service: ProductosFotosService,
    private categorias_service: CategoriasService,
    private marcas_service: MarcasService,
    private medidas_service: MedidasService,
    private tipos_productos_service: TiposProductosService,
    private atributos_service: AtributosService,
    private produtos_atributos_service: ProductosAtributosService,
    private terminos_service: TerminosService,
    private variaciones_service: VariacionesService,
    private recetas_service: RecetasService,
    private equivalencias_service: EquivalenciasService,
    private productos_costos_service: ProductosCostosService,
    private lotes_service: LotesService,
  ) {
    this.scripts_service.inputfile();
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getTiposProductos();
    await this.getCategorias();
    await this.getMarcas();
    await this.getMedidas();
    await this.getAtributos();
    await this.getVariaciones();
    await this.getLotes();
    await this.getProducto();
    this.scripts_service.lightbox();
    this.ngxService.stop();
  }

  async getProducto() {
    this.ngxService.start();

    let producto = await this.productos_service.getProducto(this.producto_id);
    if (producto.code) {
      this.productoForm.patchValue(producto.data);

      producto.data.productos_categorias.map((pc: any) => { pc.nombre = pc.categoria.nombre, pc.id = pc.categoria.id; });
      this.productoForm.controls['productos_categorias'].setValue(producto.data.productos_categorias);
      producto.data.productos_marcas.map((pm: any) => { pm.nombre = pm.marca.nombre, pm.id = pm.marca.id; });
      this.productoForm.controls['productos_marcas'].setValue(producto.data.productos_marcas);
      producto.data.productos_medidas.map((pm: any) => { pm.nombre = pm.medida.nombre, pm.id = pm.medida.id; });
      this.productoForm.controls['productos_medidas'].setValue(producto.data.productos_medidas);

      if (producto.data.tipo_producto.id) {
        this.productoForm.controls['tipo_producto_id'].setValue([producto.data.tipo_producto]);
      }
      if (producto.data.medida_id) {
        producto.data.medida.nombre = `${producto.data.medida.nombre} (${producto.data.medida.simbolo})`;
        this.productoForm.controls['medida_id'].setValue([producto.data.medida]);
      }

      this.productos_fotos = producto.data.productos_fotos;

      for (let pa = 0; pa < producto.data.productos_atributos.length; pa++) {
        producto.data.productos_atributos[pa].termino_id = null;
      }
      this.productoForm.controls['productos_atributos'].setValue(producto.data.productos_atributos);

      for (let pa = 0; pa < producto.data.productos_atributos.length; pa++) {

        let terminos = await this.terminos_service.getTerminos({
          producto_atributo_id: producto.data.productos_atributos[pa].id
        });
        terminos = terminos.data;
        producto.data.productos_atributos[pa].terminos = terminos;

        for (let a = 0; a < this.atributos.length; a++) {
          if (this.atributos[a].id == producto.data.productos_atributos[pa].atributo_id) {
            this.atributos[a].checked = true;
            this.atributos[a].producto_atributo_id = producto.data.productos_atributos[pa].id;
          }

          for (let v = 0; v < this.atributos[a].valores.length; v++) {
            for (let t = 0; t < terminos.length; t++) {
              if (this.atributos[a].valores[v].id == terminos[t].valor_id) {
                this.atributos[a].valores[v].checked = true;
                this.atributos[a].valores[v].terminos = terminos;
                terminos[t].checked = true;
              }
            }
          }

        }
      }

      this.equivalencias_entrada = producto.data.equivalencias.filter((e: any) => e.tipo == 'entrada');
      this.equivalencias_entrada.map((e: any) => { e.medida.nombre = `${e.medida.nombre} (${e.medida.simbolo})`, e.medida_id = [e.medida] });

      this.equivalencias_salida = producto.data.equivalencias.filter((e: any) => e.tipo == 'salida');
      this.equivalencias_salida.map((e: any) => { e.medida.nombre = `${e.medida.nombre} (${e.medida.simbolo})`, e.medida_id = [e.medida] });

      // Recetas
      if (producto.data.combo || producto.data.produccion) {
        let recetas = await this.recetas_service.getRecetas({
          producto_id: this.producto_id
        });
        this.recetas = recetas.data;

        this.factor = parseFloat(this.productoForm.value.equivalencia) / this.getTotalCantidad();

        for (let r = 0; r < this.recetas.length; r++) {
          this.recetas[r].costo_total = this.recetas[r].cantidad * this.recetas[r].producto_receta.costo;
          this.recetas[r].equivalente = this.factor * this.recetas[r].cantidad;
          this.recetas[r].porcentaje = this.recetas[r].equivalente / this.productoForm.value.equivalencia * 100;
        }
      }

    }

    this.ngxService.stop();
  }

  async getTiposProductos() {
    let tipos_productos = await this.tipos_productos_service.getTiposProductos();
    this.tipos_productos = tipos_productos.data;
  }

  async getCategorias($event: any = null) {
    let categorias = await this.categorias_service.getCategorias();
    if (categorias.code) {
      this.categorias = categorias.data;
      if ($event) {
        this.categorias.push($event);
        let productos_categorias = this.productoForm.controls['productos_categorias'].value;
        productos_categorias.push($event);
        this.productoForm.controls['productos_categorias'].setValue(productos_categorias);
        await this.putProducto()
      }
    }
  }

  async getMarcas($event: any = null) {
    let marcas = await this.marcas_service.getMarcas();
    if (marcas.code) {
      this.marcas = marcas.data;
      if ($event) {
        this.marcas.push($event);
        let productos_marcas = this.productoForm.controls['productos_marcas'].value;
        productos_marcas.push($event);
        this.productoForm.controls['productos_marcas'].setValue(productos_marcas);
        await this.putProducto()
      }
    }
  }

  async getMedidas($event: any = null) {
    let medidas = await this.medidas_service.getMedidas();
    if (medidas.code) {
      this.medidas = medidas.data;
      this.medidas = this.medidas.map((m: any) => ({ ...m, nombre: `${m.nombre} (${m.simbolo})` }));
      if ($event) {
        this.medidas.push($event);
        let productos_medidas = this.productoForm.controls['productos_medidas'].value;
        productos_medidas.push($event);
        this.productoForm.controls['productos_medidas'].setValue(productos_medidas);
        await this.putProducto()
      }
    }
  }

  async getAtributos() {
    let atributos = await this.atributos_service.getAtributos();
    if (atributos.code) {
      this.atributos = atributos.data;
    }
  }

  async getVariaciones() {
    let variaciones = await this.variaciones_service.getVariaciones({
      producto_id: this.producto_id
    });
    if (variaciones.code) {
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
    }
  }

  async getLotes() {
    let lotes = await this.lotes_service.getLotesExistentes({
      producto_id: this.producto_id
    });
    if (lotes.code) {
      this.lotes = lotes.data;
      this.lotes = this.lotes.map((l: any) => ({
        ...l,
        fecha_alta: moment(l.fecha_alta).format('YYYY-MM-DD'),
        fecha_caducidad: moment(l.fecha_caducidad).format('YYYY-MM-DD'),
      }));
    }
  }

  async searchByNombre($event: any = null) {
    this.ngxService.start();
    let productos = await this.productos_service.searchProductoByNombre($event.target.value, null);
    this.productos = productos.data;
    this.ngxService.stop();
  }

  async setReceta(r: any) {
    let prod = this.recetas.find((x: any) => x.producto_receta.id == r.id);
    if (prod) {
      this.alertas_service.error('Producto ya agregado');
      return
    }
    this.ngxService.start();
    let cantidad: any = r.produccion ? (1 / r.porciones).toFixed(6) : 1;
    let costo = (cantidad * r.costo).toFixed(2);
    
    let receta = await this.recetas_service.postReceta({
      cantidad: cantidad,
      costo: costo,
      producto_id: this.producto_id,
      medida_id: r.medida_id,
      producto_receta_id: r.id
    })
    if (receta.code) {
      receta.data.producto_receta = r
      this.recetas.push(receta.data)
      this.alertas_service.success(receta.mensaje, true);
      this.productoForm.controls['costo'].setValue(this.getTotalCosto().toFixed(2));
      await this.putProducto();
    }
    this.ngxService.stop();
  }

  async putReceta(r: any) {
    this.ngxService.start();
    r.costo = (r.cantidad * r.producto_receta.costo).toFixed(2);
    let receta = await this.recetas_service.putReceta(r.id, {
      cantidad: r.cantidad,
      costo: r.costo
    })
    if (receta.code) {
      this.alertas_service.success(receta.mensaje, true);
      this.productoForm.controls['costo'].setValue(this.getTotalCosto().toFixed(2));
      await this.putProducto();
    }
    this.ngxService.stop();
  }

  async deleteReceta(r: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        this.ngxService.start();
        let receta = await this.recetas_service.deleteReceta(r.id);
        if (receta.code) {
          this.recetas.splice(this.recetas.indexOf(r), 1);
          this.alertas_service.success(receta.mensaje, true);
          this.productoForm.controls['costo'].setValue(this.getTotalCosto().toFixed(2));
          await this.putProducto();
        }
        this.ngxService.stop();
      }
    })
  }

  async setEquivalencia(tipo: string) {
    this.ngxService.start();

    let equivalencia = await this.equivalencias_service.postEquivalencia({
      equivalencia: 1,
      tipo: tipo,
      producto_id: this.producto_id,
      medida_id: this.medidas[0].id
    })
    if (equivalencia.code) {
      if (tipo == 'entrada') {
        equivalencia.data.medida_id = [this.medidas[0]];
        this.equivalencias_entrada.push(equivalencia.data)
      }
      if (tipo == 'salida') {
        equivalencia.data.medida_id = [this.medidas[0]];
        this.equivalencias_salida.push(equivalencia.data)
      }
      this.alertas_service.success(equivalencia.mensaje, true);
    }

    this.ngxService.stop();
  }

  async putEquivalencia(e: any) {
    this.ngxService.start();
    let equivalencia = await this.equivalencias_service.putEquivalencia(e.id, {
      equivalencia: e.equivalencia,
      medida_id: e.medida_id[0].id
    })
    if (equivalencia.code) {
      this.alertas_service.success(equivalencia.mensaje, true);
    }
    this.ngxService.stop();
  }

  async deleteEquivalencia(e: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        this.ngxService.start();
        let equivalencia = await this.equivalencias_service.deleteEquivalencia(e.id);
        if (equivalencia.code) {
          if (e.tipo == 'entrada') {
            this.equivalencias_entrada.splice(this.equivalencias_entrada.indexOf(e), 1);
          }
          if (e.tipo == 'salida') {
            this.equivalencias_salida.splice(this.equivalencias_salida.indexOf(e), 1);
          }
          this.alertas_service.success(equivalencia.mensaje, true);
        }
        this.ngxService.stop();
      }
    })
  }

  async addAtributo($event: any = null) {
    await this.produtos_atributos_service.postProductoAtributo({
      atributo_id: $event.id,
      producto_id: this.producto_id
    });
    await this.getAtributos();
    await this.getProducto();
  }

  async addValor($event: any = null) {
    await this.terminos_service.postTermino({
      producto_atributo_id: this.producto_atributo_id,
      valor_id: $event.id
    });
    await this.getAtributos();
    await this.getProducto();
  }

  async putProducto(alert: any = true) {
    this.ngxService.start();
    this.productoForm.controls['tipo_producto_id'].setValue(this.productoForm.controls['tipo_producto_id'].value[0].id);
    this.productoForm.controls['medida_id'].setValue(this.productoForm.controls['medida_id'].value[0].id);
    let producto = await this.productos_service.putProducto(this.producto_id, this.productoForm.value);
    if (producto.code) {
      alert ? this.alertas_service.success(producto.mensaje) : null;
      await this.getProducto();
    }
    this.ngxService.stop();
  }

  async addOrRemoveAtributo($event: any, r: any) {
    let productos_atributos = this.productoForm.controls['productos_atributos'].value;

    if ($event.target.checked) {
      let producto_atributo = await this.produtos_atributos_service.postProductoAtributo({
        atributo_id: r.id,
        producto_id: this.producto_id
      });
      if (producto_atributo.code) {
        for (let a = 0; a < this.atributos.length; a++) {
          if (this.atributos[a].id == r.id) {
            this.atributos[a].producto_atributo_id = producto_atributo.data.id;
          }
        }
        productos_atributos.push(producto_atributo.data);
        this.alertas_service.success(producto_atributo.mensaje, true);
      }
    } else {
      let producto_atributo = await this.produtos_atributos_service.deleteProductoAtributo(r.producto_atributo_id);
      if (producto_atributo.code) {
        productos_atributos.splice(productos_atributos.indexOf(r), 1);
        this.alertas_service.success(producto_atributo.mensaje, true);
      } else {
        await this.getAtributos();
        await this.getProducto();
      }
    }
  }

  async addOrRemoveTermino($event: any, r: any, v: any) {
    let terminos = this.productoForm.controls['terminos'].value;

    if ($event.target.checked) {
      let termino = await this.terminos_service.postTermino({
        producto_atributo_id: r.producto_atributo_id,
        valor_id: v.id
      });
      if (termino.code) {
        terminos.push(termino.data);
        this.alertas_service.success(termino.mensaje, true);
      }
    } else {
      let termino = await this.terminos_service.deleteTermino(v.terminos[0].id);
      if (termino.code) {
        terminos.splice(terminos.indexOf(v), 1);
        this.alertas_service.success(termino.mensaje, true);
      } else {
        await this.getAtributos();
        await this.getProducto();
      }
    }

    this.productoForm.controls['terminos'].setValue(terminos);
  }

  async postCombinaciones() {
    this.alertas_service.combinar().then(async (result: any) => {
      if (result.isConfirmed) {
        this.ngxService.start();

        let variacion = await this.variaciones_service.postVariacionCombinaciones({
          producto_id: this.producto_id
        });
        if (variacion.code) {
          this.alertas_service.success(variacion.mensaje, true);
          await this.getVariaciones();
          $('#agregar-variacion').offcanvas('hide');
          $('#editar-variacion').offcanvas('hide');
        }

        this.ngxService.stop();

      }
    });
  }

  async postVariacion() {
    let variaciones_detalles = [];
    let productos_atributos = this.productoForm.controls['productos_atributos'].value;

    for (let pa = 0; pa < productos_atributos.length; pa++) {
      variaciones_detalles.push({
        atributo_id: productos_atributos[pa].atributo_id,
        termino_id: productos_atributos[pa].termino_id,
      })
    }
    let variacion = await this.variaciones_service.postVariacion({
      producto_id: this.producto_id,
      variaciones_detalles: variaciones_detalles
    });
    if (variacion.code) {
      this.alertas_service.success(variacion.mensaje, true);
      this.variaciones.push(variacion.data);
    }
    $('#agregar-variacion').offcanvas('hide');
    await this.getVariaciones();
  }

  async putVariacion() {
    let variacion = await this.variaciones_service.putVariacion(this.variacion_id, this.variacionForm.value);
    if (variacion.code) {
      this.alertas_service.success(variacion.mensaje, true);
      await this.getVariaciones();
      this.setVariacion(this.variacion_id)
    }
  }

  async putLote(l: any) {
    let lote = await this.lotes_service.putLote(l.id, l);
    if (lote.code) {
      this.alertas_service.success(lote.mensaje, true);
    }
  }

  async deleteVariacion() {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let variacion = await this.variaciones_service.deleteVariacion(this.variacion_id);
        if (variacion.code) {
          this.alertas_service.success(variacion.mensaje);
          this.variaciones.splice(this.variaciones.indexOf(this.variaciones.find((v: any) => v.id == this.variacion_id)), 1);
        }
      }
    });
  }

  async getProductosCostos() {
    let productos_costos = await this.productos_costos_service.getProductosCostos({
      producto_id: this.producto_id
    });
    if (productos_costos.code) {
      this.productos_costos = productos_costos.data;
    }
  }

  getTotalPrecio() {
    let total = 0;
    for (let i = 0; i < this.recetas.length; i++) {
      total += parseFloat(this.recetas[i].producto_receta.precio) * parseFloat(this.recetas[i].cantidad);
    }
    return total;
  }

  getTotalCostoU() {
    let total = 0;
    for (let i = 0; i < this.recetas.length; i++) {
      total += parseFloat(this.recetas[i].producto_receta.costo);
    }
    return total;
  }

  getTotalCosto() {
    let total = 0;
    for (let i = 0; i < this.recetas.length; i++) {
      total += parseFloat(this.recetas[i].costo);
    }
    return total;
  }

  getTotalCantidad() {
    let total = 0;
    for (let i = 0; i < this.recetas.length; i++) {
      total += parseFloat(this.recetas[i].cantidad);
    }
    return total;
  }

  getTotalEquivalente() {
    let total = 0;
    for (let i = 0; i < this.recetas.length; i++) {
      total += parseFloat(this.recetas[i].equivalente);
    }
    return total;
  }

  getTotalPorcentaje() {
    let total = 0;
    for (let i = 0; i < this.recetas.length; i++) {
      total += parseFloat(this.recetas[i].porcentaje);
    }
    return total;
  }

  setVariacion(id: any) {
    this.variacion_id = id;
    let variacion = this.variaciones.find((v: any) => v.id == this.variacion_id);
    this.variacionForm.patchValue(variacion);
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.productoForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

  removeImage(imagen: any) {
    this.productoForm.controls[`${imagen}`].setValue(null);
  }

  setImageV(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.variacionForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

  removeImageV(imagen: any) {
    this.variacionForm.controls[`${imagen}`].setValue(null);
  }

  setFoto(event: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = async () => {
      let producto_foto = await this.productos_fotos_service.postProductoFoto({
        foto: reader.result,
        producto_id: this.producto_id
      })
      if (producto_foto) {
        this.productos_fotos.push(producto_foto.data);
        this.alertas_service.success(producto_foto.mensaje);
      }
    };
    reader.readAsDataURL(file);
  }

  async deleteFoto(f: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let producto_foto = await this.productos_fotos_service.deleteProductoFoto(f.id);
        if (producto_foto) {
          this.productos_fotos.splice(this.productos_fotos.indexOf(f), 1);
          this.alertas_service.success(producto_foto.mensaje);
        }
      }
    });
  }

  openOffCanvas(r: any) {
    this.atributo_id = r.id;
    this.producto_atributo_id = r.producto_atributo_id;
    var myOffcanvas: any = document.getElementById('valores')
    myOffcanvas.addEventListener('hidden.bs.offcanvas', () => {
      this.atributo_id = null;
    });
  }

  iniciales(nombre: any) {
    nombre = nombre.split(' ');
    if (nombre.length > 1) {
      return nombre[0][0] + nombre[1][0];
    }
    return nombre[0][0] + nombre[0][1];
  }

}

