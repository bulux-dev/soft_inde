import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { CategoriasService } from '../../../../services/categorias.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { SucursalesService } from '../../../../services/sucursales.service';
import { AppComponent } from '../../../../app.component';

declare var $: any

@Component({
  selector: 'app-agregar-categoria',
  standalone: false,
  templateUrl: './agregar-categoria.component.html',
  styleUrl: './agregar-categoria.component.css'
})
export class AgregarCategoriaComponent {

  get selectM() {
    return AppComponent.selectM;
  }

  get selectS() {
    return AppComponent.selectS;
  }

  @Input() categoria_id: any;
  @Input() oc: any;
  @Output() newItemEvent = new EventEmitter<string>();
  loading: boolean = false;

  sucursales: any = [];
  categorias: any = [];

  categoriaForm: FormGroup = new FormGroup({
    logo: new FormControl(null),
    nombre: new FormControl(null, [Validators.required]),
    color: new FormControl(null),
    categoria_id: new FormControl(null),
    categorias_sucursales: new FormControl([])
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private categorias_service: CategoriasService,
    private sucursales_service: SucursalesService
  ) {
  }

  async ngOnInit() {
    await this.getSucursales();
    await this.getCategorias();
    if (this.categoria_id) {            
      this.categoriaForm.controls['categoria_id'].setValue([this.categorias.find((c: any) => c.id == parseInt(this.categoria_id))]);
    }
  }

  async getSucursales($event: any = null) {
    let sucursales = await this.sucursales_service.getSucursales();
    if (sucursales.code) {
      this.sucursales = sucursales.data;
      this.categoriaForm.controls['categorias_sucursales'].setValue([this.sucursales[0]]);
      if ($event) {
        this.sucursales.push($event);
        let categorias_sucursales = this.categoriaForm.controls['categorias_sucursales'].value;
        categorias_sucursales.push($event);
        this.categoriaForm.controls['categorias_sucursales'].setValue(categorias_sucursales);
      }
    }
  }

  async getCategorias() {
    let categorias = await this.categorias_service.getCategorias();
    if (categorias.code) {
      this.categorias = categorias.data;
    }
  }

  async postCategoria() {
    this.loading = true;
    if (this.categoriaForm.value.categoria_id) {
      this.categoriaForm.controls['categoria_id'].setValue(this.categoriaForm.controls['categoria_id'].value[0].id);      
    }
    let categoria = await this.categorias_service.postCategoria(this.categoriaForm.value);
    if (categoria.code) {
      this.alertas_service.success(categoria.mensaje);
      this.oc ? this.categoriaForm.reset() : this.location.back();
      $('.offcanvas').offcanvas('hide');            
      this.newItemEvent.emit(categoria.data);
    }
    this.loading = false;
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.categoriaForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

  removeImage(imagen: any) {
    this.categoriaForm.controls[`${imagen}`].setValue(null);
  }

}

