import { Component, Inject } from '@angular/core';
import { AjustesService } from '../services/panel/ajustes.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { ScriptsService } from '../services/scripts.service';
import { AlertasService } from '../services/alertas.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  static empresa: any = null;
  static carrito: any = [];

  constructor(
    private ajustes_service: AjustesService,
    private ngxService: NgxUiLoaderService,
    private alertas_service: AlertasService,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) { 
    if (localStorage.getItem('carrito')) {
      HomeComponent.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    }
  }

  async ngOnInit() {
    this.ngxService.startBackground();
    await this.setConfig();
    this.ngxService.stopBackground();
  }

  get empresa() {
    return HomeComponent.empresa;
  }

  get carrito() {
    return HomeComponent.carrito;
  }

  get total_carrito() {
    let total = 0;
    HomeComponent.carrito.forEach((producto: any) => {
      total += parseFloat(producto.precio) * parseFloat(producto.cantidad);
    });
    return total;
  }

  async setConfig() {
    let slug
    let url: any = [];
    if (typeof window !== "undefined") {
      url = window.location.host.split('.');
    }

    // let url = this.location.ge().toString().split('.');
    url.length > 1 ? slug = url[0] : slug = 'demo';

    let empresa = await this.ajustes_service.getEmpresaSlug(slug);
    if (empresa && empresa.data) {
      HomeComponent.empresa = empresa.data;      
      this.document.documentElement.style.setProperty('--theme-color', HomeComponent.empresa.color);
      this.document.documentElement.style.setProperty('--theme-color2', '#cacaca');
      this.meta.updateTag({ content: HomeComponent.empresa.color }, 'name=theme-color');
    } else {
      let ajustes = await this.ajustes_service.getAjustes();
      if (ajustes) {
        ajustes.data.color = ajustes.data.primary_color;
        this.document.documentElement.style.setProperty('--theme-color', ajustes.data.primary_color);
        this.document.documentElement.style.setProperty('--theme-color2', '#cacaca');
        this.meta.updateTag({ content: ajustes.data.primary_color }, 'name=theme-color');
        HomeComponent.empresa = ajustes.data;
      }
    }
  }

  getHexColor(hex: string): string {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b}, 0.7)`;
  }

  removeCarrito(producto: any) {
    HomeComponent.carrito.splice(HomeComponent.carrito.indexOf(producto), 1);
    localStorage.setItem('carrito', JSON.stringify(HomeComponent.carrito));
    this.alertas_service.success('Producto removido de carrito');
  }
  
}
