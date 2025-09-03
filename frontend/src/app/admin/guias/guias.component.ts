import { Component } from '@angular/core';
import { GuiasService } from '../../services/guias.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-guias',
  standalone: false,
  templateUrl: './guias.component.html',
  styleUrl: './guias.component.css'
})
export class GuiasComponent {

  guias: any = [];
  guias_lista: any = [];

  constructor(
    private guias_service: GuiasService,
    private router: Router
  ) {

  }

  async ngOnInit() {
    await this.getGuias();
  }
  
  async getGuias() {
    let guias = await this.guias_service.getGuias();
    if (guias.code) {
      this.guias = guias.data;
      this.guias_lista = this.guias;
    }
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
        return g.descripcion.toUpperCase().includes(busqueda.toUpperCase()) ||
        g.nombre.toUpperCase().includes(busqueda.toUpperCase())
      })
      this.guias = guias;
    } else {
      this.guias = this.guias_lista;
    }
  }

}
