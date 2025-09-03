import { Component } from '@angular/core';
import { ScriptsService } from '../../services/scripts.service';
import { WebService } from '../../services/web.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HomeComponent } from '../home.component';
import { AlertasService } from '../../services/alertas.service';

@Component({
  selector: 'app-tienda',
  standalone: false,
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent {

  productos: any = [];
  categorias: any = [];
  marcas: any = [];
  producto: any = null;

  constructor(
    private scripts_service: ScriptsService,
    private ngxService: NgxUiLoaderService,
    private alertas_service: AlertasService,
    private web_service: WebService
  ) {
    this.scripts_service.main();
  }

  async ngOnInit() {
    await this.getCategorias();
    await this.getMarcas();
    await this.getProductosByCategoria(this.categorias[0].id);
  }

  get empresa() {
    return HomeComponent.empresa;
  }

  async getCategorias() {
    let categorias = await this.web_service.getCategorias();
    this.categorias = categorias.data;
  }

  async getMarcas() {
    let marcas = await this.web_service.getMarcas();
    this.marcas = marcas.data;
  }

  async getProductosByCategoria(categoria_id: any) {
    this.ngxService.startBackground();
    let productos = await this.web_service.getProductosByCategoria(categoria_id);
    this.productos = productos.data;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.ngxService.stopBackground();
  }

  async getProductosByMarca(marca_id: any) {
    this.ngxService.startBackground();
    let productos = await this.web_service.getProductosByMarca(marca_id);
    this.productos = productos.data;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.ngxService.stopBackground();
  }

  async getProducto(id: any) {
    this.ngxService.startBackground();
    let producto = await this.web_service.getProducto(id);
    this.producto = producto.data;
    this.ngxService.stopBackground();
  }

  async setProducto(p: any) {
    await this.getProducto(p.id);
  }

  async addCarrito(p: any) {
    ;
    let existe = HomeComponent.carrito.find((element: any) => element.id == p.id);
    if (existe) {
      existe.cantidad++;
      this.alertas_service.success('Producto actualizado en carrito');
    } else {
      p.cantidad = 1;
      HomeComponent.carrito.push(p);
      localStorage.setItem('carrito', JSON.stringify(HomeComponent.carrito));
      this.alertas_service.success('Producto agregado al carrito');
    }
  }

}
