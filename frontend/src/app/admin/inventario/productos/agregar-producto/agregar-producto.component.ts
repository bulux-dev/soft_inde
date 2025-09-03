import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { ProductosService } from '../../../../services/productos.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CategoriasService } from '../../../../services/categorias.service';
import { MarcasService } from '../../../../services/marcas.service';
import { MedidasService } from '../../../../services/medidas.service';
import { TiposProductosService } from '../../../../services/tipos_productos.service';
import { AppComponent } from '../../../../app.component';

declare var $: any

@Component({
  selector: 'app-agregar-producto',
  standalone: false,
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.css'
})
export class AgregarProductoComponent {

  @Input() oc: any;
  @Output() newItemEvent = new EventEmitter<string>();

  get selectM() {
    return AppComponent.selectM;
  }

  get selectS() {
    return AppComponent.selectS;
  }

  loading: boolean = false;
  tipos_productos: any = [];
  productos_fotos: any = [];
  categorias: any = [];
  marcas: any = [];
  medidas: any = [];

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
    productos_fotos: new FormControl([]),
    tipo_producto_id: new FormControl(null, [Validators.required]),
    medida_id: new FormControl(null, [Validators.required]),
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private productos_service: ProductosService,
    private categorias_service: CategoriasService,
    private marcas_service: MarcasService,
    private medidas_service: MedidasService,
    private tipos_productos_service: TiposProductosService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    await this.getTiposProductos();
    await this.getCategorias();
    await this.getMarcas();
    await this.getMedidas();
  }

  async getTiposProductos() {
    let tipos_productos = await this.tipos_productos_service.getTiposProductos();
    if (tipos_productos.code) {
      this.tipos_productos = tipos_productos.data;
    }
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
      }
    }
  }

  async getMedidas($event: any = null) {
    let medidas = await this.medidas_service.getMedidas();
    if (medidas.code) {
      this.medidas = medidas.data;
      if ($event) {
        this.medidas.push($event);
        let productos_medidas = this.productoForm.controls['productos_medidas'].value;
        productos_medidas.push($event);
        this.productoForm.controls['productos_medidas'].setValue(productos_medidas);
      }
    }
  }

  async postProducto() {
    this.loading = true;
    this.productoForm.controls['tipo_producto_id'].setValue(this.productoForm.controls['tipo_producto_id'].value[0].id);
    this.productoForm.controls['medida_id'].setValue(this.productoForm.controls['medida_id'].value[0].id);
    let producto = await this.productos_service.postProducto(this.productoForm.value);
    if (producto.code) {
      this.alertas_service.success(producto.mensaje);
      if (this.oc) {
        this.productoForm.reset()
        this.newItemEvent.emit(producto.data);
      } else {
        this.router.navigate(['/admin/inventario/productos/editar', producto.data.id]);
      }
      $('.offcanvas').offcanvas('hide');
      localStorage.setItem('nuevo', JSON.stringify(producto.data));
    }
    this.loading = false;
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

  setFoto(event: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = async () => {
      this.productos_fotos.push({
        foto: reader.result
      });
      this.productoForm.controls['productos_fotos'].setValue(this.productos_fotos);
    };
    reader.readAsDataURL(file);
  }

  async deleteFoto(f: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        this.productos_fotos.splice(this.productos_fotos.indexOf(f), 1);
        this.productoForm.controls['productos_fotos'].setValue(this.productos_fotos);
      }
    });
  }

}

