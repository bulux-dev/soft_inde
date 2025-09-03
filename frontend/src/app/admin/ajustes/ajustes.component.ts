import { Component, ElementRef, Inject } from '@angular/core';
import { AlertasService } from '../../services/alertas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { ScriptsService } from '../../services/scripts.service';
import { AjustesService } from '../../services/panel/ajustes.service';
import { Meta } from '@angular/platform-browser';
import { AppComponent } from '../../app.component';
import { VariablesService } from '../../services/variables.service';
import { AdminComponent } from '../admin.component';
import { WebService } from '../../services/web.service';
import { WebMenusService } from '../../services/web_menus.service';
import { WebSlidersService } from '../../services/web_sliders.service';
import { WebSeccionesService } from '../../services/web_secciones.service';

@Component({
  selector: 'app-ajustes',
  standalone: false,
  templateUrl: './ajustes.component.html',
  styleUrl: './ajustes.component.css'
})
export class AjustesComponent {

  empresa_id: any = localStorage.getItem('empresa_id');
  loading: boolean = false;
  mensaje: any;

  modulos: any = [];
  permisos: any = [];
  variables: any = [];
  webs: any = [];
  web_menus: any = [];
  web_secciones: any = [];
  web_sliders: any = [];

  empresaForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    razon_social: new FormControl(null, [Validators.required]),
    slug: new FormControl(null, [Validators.required]),
    color: new FormControl(null),
    logo: new FormControl(null),
    portada: new FormControl(null),
    nit: new FormControl(null),
    contacto: new FormControl(null),
    correo: new FormControl(null),
    direccion: new FormControl(null),
    telefono: new FormControl(null),
    sitio_web: new FormControl(null),
    puerto: new FormControl(null),
    acceso: new FormControl(true),
    facebook: new FormControl(null),
    instagram: new FormControl(null),
    twitter: new FormControl(null),
    linkedin: new FormControl(null),
  });

  constructor(
    private router: Router,
    private host: ElementRef<HTMLInputElement>,
    private alertas_service: AlertasService,
    private scripts_service: ScriptsService,
    private ajustes_service: AjustesService,
    private variables_service: VariablesService,
    private web_service: WebService,
    private webMenus_service: WebMenusService,
    private webSecciones_service: WebSeccionesService,
    private webSliders_service: WebSlidersService,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.scripts_service.loadScript('assets/js/input-file.js');
  }

  async ngOnInit() {
    await this.getVariables();
    await this.getWebs();
    await this.getWebMenus();
    await this.getWebSecciones();
    await this.getWebSliders();
    await this.getEmpresa();
  }

  get selectS() {
    return AppComponent.selectS;
  }

  async getEmpresa() {
    let empresa = await this.ajustes_service.getEmpresa(this.empresa_id);
    if (empresa.code) {
      this.empresaForm.patchValue(empresa.data);
      this.changeColor();
      await this.getModulos();
      await this.getPermisos();
    }
  }

  async getVariables() {
    let variables = await this.variables_service.getVariables();
    if (variables.code) {
      this.variables = variables.data;
      this.variables.forEach((v: any) => {
        if (v.opciones) {
          v.valor = [v.valor];
        }
      })
    }
  }

  async getWebs() {
    let webs = await this.web_service.getWebs();
    if (webs.code) {
      this.webs = webs.data;
    }
  }

  async getWebMenus() {
    let web_menus = await this.webMenus_service.getWebMenus();
    if (web_menus.code) {
      this.web_menus = web_menus.data;
    }
  }

  async getWebSecciones() {
    let web_secciones = await this.webSecciones_service.getWebSecciones();
    if (web_secciones.code) {
      this.web_secciones = web_secciones.data;
    }
  }

  async getWebSliders() {
    let web_sliders = await this.webSliders_service.getWebSliders();
    if (web_sliders.code) {
      this.web_sliders = web_sliders.data;
    }
  }

  async putWeb(s: any) {
    for (let i = 0; i < s.webs.length; i++) {
      await this.web_service.putWeb(s.webs[i].id, { valor: s.webs[i].valor });
    }
    this.alertas_service.success('Información actualizada');

  }

  async putVariable(v: any) {
    if (v.opciones) {
      v.valor = v.valor[0]
    }
    let variable = await this.variables_service.putVariable(v.slug, { slug: v.slug, valor: v.valor });
    if (variable.code) {
      this.alertas_service.success(variable.mensaje);
      await this.getVariables();
    }
  }

  async getModulos() {
    let modulos = await this.ajustes_service.getModulos();
    if (modulos.code) {
      this.modulos = modulos.data;
    }
  }

  async getPermisos() {
    let permisos = await this.ajustes_service.getPermisoByEmpresa(this.empresa_id);
    if (permisos.code) {
      this.permisos = permisos.data;
    }
  }

  async putEmpresa() {
    this.loading = true;
    let empresa = await this.ajustes_service.putEmpresa(this.empresa_id, this.empresaForm.value);
    if (empresa.code) {
      this.document.documentElement.style.setProperty('--primary-color', this.empresaForm.value.color);
      this.document.documentElement.style.setProperty('--secondary-color', this.getHexColor(this.empresaForm.value.color));
      this.meta.updateTag({ content: this.empresaForm.value.color }, 'name=theme-color');
      this.alertas_service.success(empresa.mensaje);
      await this.getEmpresa();
      this.loading = false;
    }
  }

  getPermiso(m: any, me: any = null) {
    let permiso = this.permisos.find((p: any) => p.modulo_id == m.id && (me ? (p.menu_id == me.id) : true));
    if (permiso) {
      return permiso;
    }
    return null;
  }

  async setPermiso(m: any, me: any = null) {
    if (me) {
      let permiso = await this.ajustes_service.getPermisoByEmpresa(this.empresa_id, m.id, me.id);
      if (permiso.data.length > 0) {
        await this.ajustes_service.deletePermiso(permiso.data[0].id);
        await this.getPermisos();
      } else {
        await this.ajustes_service.postPermiso({
          empresa_id: this.empresa_id,
          modulo_id: m.id,
          menu_id: me.id,
        });
        await this.getPermisos();
      }
    } else {
      let permiso = await this.ajustes_service.getPermisoByEmpresa(this.empresa_id, m.id, null);
      if (permiso.data.length > 0) {
        await this.ajustes_service.deletePermiso(permiso.data[0].id);
        await this.getPermisos();
      } else {
        await this.ajustes_service.postPermiso({
          empresa_id: this.empresa_id,
          modulo_id: m.id,
          inscripcion: m.inscripcion,
          membresia: m.membresia
        });
        await this.getPermisos();
      }
    }
  }

  async setPermisos() {
    this.mensaje = 'Habilitando permisos';
    for (let m = 0; m < this.modulos.length; m++) {
      await this.setPermiso(this.modulos[m]);
    }
    await this.getPermisos();
    this.mensaje = null;
  }

  totalInscripcion() {
    let total = 0;
    for (let p = 0; p < this.permisos.length; p++) {
      total += parseFloat(this.permisos[p].inscripcion);
    }
    return total;
  }

  totalMembresia() {
    let total = 0;
    for (let p = 0; p < this.permisos.length; p++) {
      total += parseFloat(this.permisos[p].membresia ? this.permisos[p].membresia : 0);
    }
    return total;
  }

  totalModulos() {
    let total = 0;
    for (let p = 0; p < this.permisos.length; p++) {
      if (this.permisos[p].membresia) {
        total += 1;
      }
    }
    return total;
  }

  async changeColor() {
    this.host.nativeElement.style.setProperty(`--empresa-color`, this.empresaForm.value.color);
  }

  changeSlug(nombre: boolean = false) {
    if (nombre) {
      this.empresaForm.controls['slug'].setValue(this.slugify(this.empresaForm.controls['nombre'].value));
    }
    this.empresaForm.controls['slug'].setValue(this.slugify(this.empresaForm.controls['slug'].value));

  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.empresaForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

  slugify(text: any) {
    text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return text.toString().toLowerCase()
      .replace('ñ', 'n')              // Replace spaces ñ with n
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
    // .replace(/-+$/, '');            // Trim - from end of text
  }

  getHexColor(hex: string): string {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b}, 0.7)`;
  }

}
