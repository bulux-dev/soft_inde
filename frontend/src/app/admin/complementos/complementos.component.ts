import { Component } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../environments/environment';
import { ComplementosService } from '../../services/componentes.service';

@Component({
  selector: 'app-complementos',
  standalone: false,
  templateUrl: './complementos.component.html',
  styleUrl: './complementos.component.css'
})
export class ComplementosComponent {

  urlAPI: any = environment.domain;

  constructor(
    private ngxService: NgxUiLoaderService,
    private complementos_service: ComplementosService
  ) {

  }

  complementos: any = [];

  async ngOnInit() {
    await this.getComplementos();
  }

  async getComplementos() {
    this.ngxService.start();
    let complementos = await this.complementos_service.getComplementos();
    this.complementos = complementos.data;
    this.ngxService.stop();
  }

  descargarComplemento(c: any) {
    this.ngxService.start();
    var link = document.createElement('a');
    link.href = this.urlAPI + c.path;
    link.setAttribute('download', `${c.nombre}${c.ext}`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.ngxService.stop();
  }

}
