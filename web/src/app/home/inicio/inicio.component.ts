import { Component } from '@angular/core';
import { ScriptsService } from '../../services/scripts.service';
import { HomeComponent } from '../home.component';
import { WebService } from '../../services/web.service';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  webs: any = [];
  web: any;

  constructor(
    private scripts_service: ScriptsService,
    private web_service: WebService
  ) { 
    this.scripts_service.main();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async ngOnInit() {
    await this.getWebs();
  }

  get empresa() {
    return HomeComponent.empresa;
  }

  async getWebs() {
    let webs = await this.web_service.getWebs();
    this.webs = webs.data.filter((web: any) => web.link == 'inicio')[0].web_secciones;           
  }

  getValor(id: any) {
    for (let i = 0; i < this.webs.length; i++) {
      for (let w = 0; w < this.webs[i].webs.length; w++) {
        if (this.webs[i].webs[w].id == id) {
          return this.webs[i].webs[w].valor;
        }
      }
    }
    return '3';
  }

}
