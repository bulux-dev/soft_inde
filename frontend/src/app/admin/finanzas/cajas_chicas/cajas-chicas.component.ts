import { Component } from '@angular/core';
import { CajasChicasService } from '../../../services/cajas_chicas.service';
import { AlertasService } from '../../../services/alertas.service';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cajas-chicas',
  standalone: false,
  templateUrl: './cajas-chicas.component.html',
  styleUrl: './cajas-chicas.component.css'
})
export class CajasChicasComponent {

  cajas_chicas: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    siglas: new FormControl(null, [Validators.required])
  })

  caja_chica: any;

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private cajas_chicas_service: CajasChicasService
  ) {

  }

  async ngOnInit() {
    await this.getCajasChicas();
    this.scripts_service.datatable();
  }

  async getCajasChicas() {
    let cajas_chicas = await this.cajas_chicas_service.getCajasChicas(this.filtros.value);
    this.cajas_chicas = cajas_chicas.data;
  }

  async deleteCajaChica(e: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let caja_chica = await this.cajas_chicas_service.deleteCajaChica(e.id);
        if (caja_chica.code) {
          this.cajas_chicas.splice(this.cajas_chicas.indexOf(e), 1);
          this.alertas_service.success(caja_chica.mensaje);
        }
      }
    });
  }

  async getCajaChica(c: any) {
    let caja_chica = await this.cajas_chicas_service.getCajaChica(c.id);
    if (caja_chica.code) {
      this.caja_chica = caja_chica.data;
      let documentos = [...this.caja_chica.cheques, ...this.caja_chica.notas_debitos, ...this.caja_chica.compras];
      documentos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      this.caja_chica.documentos = documentos;
      let saldo = 0;
      this.caja_chica.creditos = 0;
      this.caja_chica.debitos = 0;
      this.caja_chica.saldo = 0;

      this.caja_chica.documentos = documentos.map((doc: any) => {
        if (doc.documento.tipo_documento.slug === 'nota_debito' || doc.documento.tipo_documento.slug === 'cheque') {
          saldo += parseFloat(doc.total);
          this.caja_chica.creditos += parseFloat(doc.total);
        } else if (doc.documento.tipo_documento.slug === 'compra') {
          saldo -= parseFloat(doc.total);
          this.caja_chica.debitos += parseFloat(doc.total);
        }
        return { ...doc, saldo };
      });

      this.caja_chica.saldo = saldo;
    }
  }

  iniciales(nombre: any, apellido: any) {
    if (!apellido) {
      nombre = nombre.split(' ');
      if (nombre.length > 1) {
        return nombre[0][0] + nombre[1][0];
      }
      return nombre[0][0] + nombre[0][1];
    }
    return nombre[0] + apellido[0];
  }

}

