import { Component } from '@angular/core';
import { ImpresorasService } from '../../../services/impresoras.service';
import { AlertasService } from '../../../services/alertas.service';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-impresoras',
  standalone: false,
  templateUrl: './impresoras.component.html',
  styleUrl: './impresoras.component.css'
})
export class ImpresorasComponent {

  impresoras: any = [];
  impresoras_lista: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null),
    ip: new FormControl(null),
  })
  busqueda: any = null;

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private impresoras_service: ImpresorasService
  ) {

  }

  async ngOnInit() {
    await this.getImpresoras();
    this.scripts_service.datatable();
  }

  async getImpresoras() {
    let impresoras = await this.impresoras_service.getImpresoras(this.filtros.value);
    this.impresoras = impresoras.data;
    this.impresoras_lista = impresoras.data;
  }

  async deleteImpresora(e: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let impresora = await this.impresoras_service.deleteImpresora(e.id);
        if (impresora.code) {
          this.impresoras.splice(this.impresoras.indexOf(e), 1);
          this.alertas_service.success(impresora.mensaje);
        }
      }
    });
  }

  search() {
    let data = this.impresoras_lista.filter((v: any) => {
      return v.nombre.toUpperCase().includes(this.busqueda.toUpperCase())
    })
    this.impresoras = data;
  }

  printTest(e: any) {
    let url = `http://${e.ip}/prt_test.htm?content=${e.nombre}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

}
