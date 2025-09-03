import { Component } from '@angular/core';
import { CuentasService } from '../../../services/cuentas.service';
import { AlertasService } from '../../../services/alertas.service';
import { ComandasService } from '../../../services/comandas.service';
import { ComandasDetallesService } from '../../../services/comandas_detalles.service';
import moment from 'moment';

@Component({
  selector: 'app-display',
  standalone: false,
  templateUrl: './display.component.html',
  styleUrl: './display.component.css'
})
export class DisplayComponent {

  view: string = 'comandas';
  comandas: any = [];
  cuentas: any = [];

  constructor(
    private alertas_service: AlertasService,
    private comandas_service: ComandasService,
    private comnadas_detalles_service: ComandasDetallesService,
    private cuentas_service: CuentasService
  ) { }

  async ngOnInit() {
    await this.getDisplay(null);
    setInterval(async () => {
      await this.getDisplay();
    }, 1000);
    setInterval(async () => {
      await this.getDisplay(null);
    }, 5000);
  }

  async getDisplay(last: any = this.comandas.length ? this.comandas[0].id : null) {
    if (this.view == 'comandas') {
      await this.getComandas(last);
    }
    if (this.view == 'cuentas') {
      await this.getCuentas(last);
    }
  }

  async getComandas(last: any = this.comandas.length ? this.comandas[0].id : null) {
    let comandas = await this.comandas_service.getComandasDisplay({last});
    last ? this.comandas.unshift(...comandas.data) : this.comandas = comandas.data;
  }

  async getCuentas(last: any = this.cuentas.length ? this.cuentas[0].id : null) {
    let cuentas = await this.cuentas_service.getCuentasDisplay({last});
    last ? this.cuentas.unshift(...cuentas.data) : this.cuentas = cuentas.data;
  }

  async setFinalizado(d: any) {
    this.alertas_service.continuar().then(async (result: any) => {
      if (result.isConfirmed) {
        let comanda_detalle = await this.comnadas_detalles_service.putComandaDetalle(d.id, {
          finalizado: true
        });
        if (comanda_detalle.code) {
          await this.getDisplay();
          this.alertas_service.success(d.mensaje);
        }
      }
    });
  }

  async deleteCuenta(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        for (let i = 0; i < c.comandas.length; i++) {
          await this.comandas_service.deleteComanda(c.comandas[i].id);
        }
        let cuenta = await this.cuentas_service.deleteCuenta(c.id);
        if (cuenta.code) {
          await this.getDisplay();
          this.alertas_service.success(cuenta.mensaje);
        }
      }
    });
  }

  getTotalCuenta(cuenta: any) {
    let total = 0;
    cuenta?.comandas.forEach((c: any) => {
      c.comandas_detalles.forEach((d: any) => {
        total += parseFloat(d.total);
      })
    });
    return total;
  }

  fromNow(fecha: any) {
      const duration = moment.duration(moment().diff(moment(fecha)));
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      return hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
  }

}
