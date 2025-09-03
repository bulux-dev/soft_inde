import { Component, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AjustesService } from './services/panel/ajustes.service';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Meta } from '@angular/platform-browser';
import { GuiasService } from './services/guias.service';
import { ScriptsService } from './services/scripts.service';

declare var $: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxUiLoaderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  static ajustes: any;
  guias_lista: any = [];
  guias: any = [];
  static robots: any = [];

  get robs() {
    return AppComponent.robots;
  }

  constructor(
    private ajustes_service: AjustesService,
    private scripts_service: ScriptsService,
    private ngxService: NgxUiLoaderService,
    private meta: Meta,
    private router: Router,
    private guias_service: GuiasService,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.setConfig();
    this.getGuias();
    this.scripts_service.theme();
    this.ngxService.stop();
  }

  async getGuias() {
    let guias = await this.guias_service.getGuias();
    if (guias.code) {
      this.guias = guias.data;
      this.guias_lista = this.guias;
    }
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
      AppComponent.ajustes = empresa.data;
      this.document.documentElement.style.setProperty('--primary-color', empresa.data.color);
      this.document.documentElement.style.setProperty('--secondary-color', this.getHexColor(empresa.data.color));
      this.meta.updateTag({ content: empresa.data.color }, 'name=theme-color');
    } else {
      let ajustes = await this.ajustes_service.getAjustes();
      if (ajustes) {
        ajustes.data.color = ajustes.data.primary_color;
        this.document.documentElement.style.setProperty('--primary-color', ajustes.data.primary_color);
        this.document.documentElement.style.setProperty('--secondary-color', ajustes.data.secondary_color);
        this.meta.updateTag({ content: ajustes.data.primary_color }, 'name=theme-color');
        AppComponent.ajustes = ajustes.data;
      }
    }
  }

  get ajustes() {
    return AppComponent.ajustes;
  }

  getHexColor(hex: string): string {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b}, 0.7)`;
  }

  // Configurationes de select

  static selectS: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: `nombre`,
    searchPlaceholderText: 'Buscar...',
    noDataAvailablePlaceholderText: 'Sin resultados',
    allowSearchFilter: true
  }

  static selectM: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: `nombre`,
    selectAllText: 'Seleccionar Todo',
    unSelectAllText: 'Deseleccionar Todo',
    searchPlaceholderText: 'Buscar...',
    noDataAvailablePlaceholderText: 'Sin resultados',
    itemsShowLimit: 3,
    allowSearchFilter: true
  }

  static selectM2: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: `nombre`,
    selectAllText: 'Seleccionar Todo',
    unSelectAllText: 'Deseleccionar Todo',
    searchPlaceholderText: 'Buscar...',
    noDataAvailablePlaceholderText: 'No se encontraron registros',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: false
  }

  guia(guia: any) {
    $('#ayuda').offcanvas('hide');
    this.router.navigate([guia.path]);
    this.guias_service.guia(guia);
  }

  searchGuias($event: any) {
    let busqueda = $event.target.value;
    if ($event.target.value) {
      let guias = this.guias_lista.filter((g: any) => {
        return g.descripcion.toUpperCase().includes(busqueda.toUpperCase())
      })
      this.guias = guias;
    } else {
      this.guias = this.guias_lista;
    }
  }

}
