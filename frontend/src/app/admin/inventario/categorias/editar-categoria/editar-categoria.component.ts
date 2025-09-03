import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { CategoriasService } from '../../../../services/categorias.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SucursalesService } from '../../../../services/sucursales.service';
import { AppComponent } from '../../../../app.component';
import { ImpresorasService } from '../../../../services/impresoras.service';

@Component({
  selector: 'app-editar-categoria',
  standalone: false,
  templateUrl: './editar-categoria.component.html',
  styleUrl: './editar-categoria.component.css'
})
export class EditarCategoriaComponent {

  get selectM() {
    return AppComponent.selectM;
  }

  get selectS() {
    return AppComponent.selectS;
  }

  @Input() categoria_id: any;
  loading: boolean = false;

  sucursales: any = [];
  categorias: any = [];
  impresoras: any = [];

  categoriaForm: FormGroup = new FormGroup({
    logo: new FormControl(null),
    nombre: new FormControl(null, [Validators.required]),
    color: new FormControl(null),
    impresora_id: new FormControl(null),
    categoria_id: new FormControl(null),
    categorias_sucursales: new FormControl([])
  });

  constructor(
    private alertas_service: AlertasService,
    private categorias_service: CategoriasService,
    private sucursales_service: SucursalesService,
    private impresoras_service: ImpresorasService
  ) {
  }

  async ngOnInit() {
    await this.getCategoria();
    await this.getSucursales();
    await this.getCategorias();
    await this.getImpresoras();
  }

  async getCategoria() {
    let categoria = await this.categorias_service.getCategoria(this.categoria_id);
    if (categoria.code) {
      this.categoriaForm.patchValue(categoria.data);

      categoria.data.categorias_sucursales.map((cs: any) => { cs.nombre = cs.sucursal.nombre, cs.id = cs.sucursal.id; });
      this.categoriaForm.controls['categorias_sucursales'].setValue(categoria.data.categorias_sucursales);
      if (categoria.data.categoria_padre) {
        this.categoriaForm.controls['categoria_id'].setValue([categoria.data.categoria_padre]);        
      }
      if (categoria.data.impresora) {
        this.categoriaForm.controls['impresora_id'].setValue([categoria.data.impresora]);
      }
    }
  }

  async getSucursales() {
    let sucursales = await this.sucursales_service.getSucursales();
    if (sucursales.code) {
      this.sucursales = sucursales.data;
    }
  }
  
  async getCategorias() {
    let categorias = await this.categorias_service.getCategorias();
    if (categorias.code) {
      this.categorias = categorias.data;
    }
  }

  async getImpresoras() {
    let impresoras = await this.impresoras_service.getImpresoras();
    if (impresoras.code) {
      this.impresoras = impresoras.data;
    }
  }

  async putCategoria() {
    this.loading = true;    
    if (this.categoriaForm.value.categoria_id) {
      this.categoriaForm.controls['categoria_id'].setValue(this.categoriaForm.controls['categoria_id'].value[0] ? this.categoriaForm.controls['categoria_id'].value[0].id : null);      
    }
    if (this.categoriaForm.value.impresora_id) {
      this.categoriaForm.controls['impresora_id'].setValue(this.categoriaForm.controls['impresora_id'].value[0] ? this.categoriaForm.controls['impresora_id'].value[0].id : null);      
    }
    let categoria = await this.categorias_service.putCategoria(this.categoria_id, this.categoriaForm.value);
    if (categoria.code) {
      this.alertas_service.success(categoria.mensaje);
      await this.getCategoria();
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

