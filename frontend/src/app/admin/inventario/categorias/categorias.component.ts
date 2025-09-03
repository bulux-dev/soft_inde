import { Component } from '@angular/core';
import { CategoriasService } from '../../../services/categorias.service';
import { AlertasService } from '../../../services/alertas.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-categorias',
  standalone: false,
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {

  categorias: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null),
    categoria_id: new FormControl(null),
    padres: new FormControl(true),
  })

  constructor(
    private ngxService: NgxUiLoaderService,
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private categorias_service: CategoriasService
  ) {

  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getCategorias();
    this.scripts_service.datatable();
    this.ngxService.stop();
  }

  async getCategorias() {
    let categorias = await this.categorias_service.getCategorias(this.filtros.value);
    this.categorias = categorias.data;
  }

  async deleteCategoria(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let categoria = await this.categorias_service.deleteCategoria(c.id);
        if (categoria.code) {
          this.categorias.splice(this.categorias.indexOf(c), 1);
          this.alertas_service.success(categoria.mensaje);
        }
      }
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

