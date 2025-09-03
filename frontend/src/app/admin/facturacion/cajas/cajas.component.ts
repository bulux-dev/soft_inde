import { Component } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CajasService } from '../../../services/cajas.service';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { AlertasService } from '../../../services/alertas.service';
import { VentasService } from '../../../services/ventas.service';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any

@Component({
  selector: 'app-cajas',
  standalone: false,
  templateUrl: './cajas.component.html',
  styleUrl: './cajas.component.css'
})
export class CajasComponent {

  rol_id: any = localStorage.getItem('rol_id');
  usuario_id: any = localStorage.getItem('usuario_id');

  caja: any;
  cajas: any = [];
  ventas_contado: any = [];
  ventas_credito: any = [];
  monto_apertura: number = 0;
  totales: any = {
    efectivo: 0,
    tarjeta: 0,
    transferencia: 0,
    deposito: 0,
    cheque: 0,
    vale: 0
  };
  total: number = 0;

  token = localStorage.getItem('token');
  apiUrl: any = environment.api;
  url: any;

  fecha_inicio: any = moment().startOf('day').format('YYYY-MM-DD 00:00');
  fecha_fin: any = moment().endOf('day').format('YYYY-MM-DD 23:59');

  filtros: FormGroup = new FormGroup({
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
  })
  cajaForm: FormGroup = new FormGroup({
    fecha_apertura: new FormControl(moment().format('YYYY-MM-DD HH:mm')),
    monto_apertura: new FormControl(null),
    fecha_cierre: new FormControl(null),
    monto_cierre: new FormControl(null),
    total: new FormControl(null),
    m1 : new FormControl(null),
    m5: new FormControl(null),
    m10: new FormControl(null),
    m25: new FormControl(null),
    m50: new FormControl(null),
    m100: new FormControl(null),
    b1: new FormControl(null),
    b5: new FormControl(null),
    b10: new FormControl(null),
    b20: new FormControl(null),
    b50: new FormControl(null),
    b100: new FormControl(null),
    b200: new FormControl(null),
    visa: new FormControl(null),
    credomatic: new FormControl(null),
    efectivo: new FormControl(null),
    tarjeta: new FormControl(null),
    transferencia: new FormControl(null),
    cheque: new FormControl(null),
    deposito: new FormControl(null),
    vale: new FormControl(null),
    estado: new FormControl('ABIERTA'),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
  })

  constructor(
    private ngxService: NgxUiLoaderService,
    private alertas_service: AlertasService,
    private cajas_service: CajasService,
    private ventas_service: VentasService,
    private sanitizer: DomSanitizer,
  ) {}

  async ngOnInit() {
    await this.getCajas();
  }

  async getCajas() {
    if (this.rol_id == '1') {
      this.filtros.controls['usuario_id'].setValue(null);
    }
    let cajas = await this.cajas_service.getCajas(this.fecha_inicio, this.fecha_fin, this.filtros.value);
    this.cajas = cajas.data;
    this.ngxService.start();
    this.ngxService.stop();
  }

  async deleteCaja(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.deleteCaja(c);
        return;
      }
      if (result.isConfirmed && result.value) {
        this.ngxService.start();
        let caja = await this.cajas_service.deleteCaja(c.id);
        if (caja.code) {
          await this.getCajas();
          this.alertas_service.success(caja.mensaje);
        }
        this.ngxService.stop();
      }
    });
  }

  async getVentas() {
    let ventas = await this.ventas_service.getVentas(this.cajaForm.value.fecha_apertura, this.cajaForm.value.fecha_cierre, {
      estado: 'VIGENTE',
      usuario_id: this.cajaForm.value.usuario_id
    });
    this.ventas_contado = ventas.data.filter((v: any) => v.tipo_pago == 'CONTADO');
    this.ventas_credito = ventas.data.filter((v: any) => v.tipo_pago == 'CREDITO');
  }

  async aperturarCaja() {
    this.ngxService.start();
    if (parseFloat(this.cajaForm.value.monto_apertura) < 0) {
      this.ngxService.stop();
      return this.alertas_service.warning('El monto apertura debe ser mayor a 0');
    }
    await this.cajas_service.postCaja(this.cajaForm.value);
    await this.getCajas();
    $('#aperturar-caja').offcanvas('hide');
    this.ngxService.stop();
  }

  async setCaja(c: any) {
    this.ngxService.start();
    let caja = await this.cajas_service.getCaja(c.id);
    this.caja = caja.data;    
    this.cajaForm.patchValue(caja.data);
    let fecha_cierre = this.cajaForm.value.fecha_cierre ? moment(this.cajaForm.value.fecha_cierre).format('YYYY-MM-DD HH:mm') : moment().format('YYYY-MM-DD HH:mm');
    this.cajaForm.controls['fecha_cierre'].setValue(fecha_cierre);
    this.monto_apertura = this.cajaForm.value.monto_apertura ? parseFloat(this.cajaForm.value.monto_apertura) : 0;
    await this.getVentas();
    this.calculo();
    this.ngxService.stop();
  }

  getTotalContado() {
    let total = 0;
    this.ventas_contado.forEach((i: any) => {
      if (i.estado != 'ANULADO') {
        total += parseFloat(i.total);
      }
    })
    return total;
  }

  getTotalCredito() {
    let total = 0;
    this.ventas_credito.forEach((i: any) => {
      if (i.estado != 'ANULADO') {
        total += parseFloat(i.total);
      }
    })
    return total;
  }

  getMetodo(campo: any = '') {
    let total = 0;
    this.ventas_contado.forEach((i: any) => {
      i.pagos.forEach((p: any) => {
        if (p.metodo == campo) {
          total += parseFloat(p.monto);
        }
        if (campo == 'Cambio') {
          total += parseFloat(p.cambio ? p.cambio : 0);
        }
        if (campo == 'Efectivo Total' && p.metodo == 'Efectivo') {          
          total += parseFloat(p.monto) - parseFloat(p.cambio ? p.cambio : 0);
        }
      })
    })
    return total;
  }

  add() {
    this.cajaForm.reset();
    this.cajaForm.controls['fecha_apertura'].setValue(moment().format('YYYY-MM-DD HH:mm'));
    this.cajaForm.controls['estado'].setValue('ABIERTA');
    this.cajaForm.controls['usuario_id'].setValue(localStorage.getItem('usuario_id'));
  }

  calculo() {
    this.totales.efectivo = 0;
    this.totales.tarjeta = 0;
    this.totales.transferencia = 0;
    this.totales.cheque = 0;
    this.totales.deposito = 0;
    this.totales.vale = 0;
    
    this.totales.efectivo += this.cajaForm.value.m1 ? parseFloat(this.cajaForm.value.m1) * 0.01 : 0;
    this.totales.efectivo += this.cajaForm.value.m5 ? parseFloat(this.cajaForm.value.m5) * 0.05 : 0;
    this.totales.efectivo += this.cajaForm.value.m10 ? parseFloat(this.cajaForm.value.m10) * 0.1 : 0;
    this.totales.efectivo += this.cajaForm.value.m25 ? parseFloat(this.cajaForm.value.m25) * 0.25 : 0;
    this.totales.efectivo += this.cajaForm.value.m50 ? parseFloat(this.cajaForm.value.m50) * 0.5 : 0;
    this.totales.efectivo += this.cajaForm.value.m100 ? parseFloat(this.cajaForm.value.m100) * 1 : 0;
    this.totales.efectivo += this.cajaForm.value.b1 ? parseFloat(this.cajaForm.value.b1) * 1 : 0;
    this.totales.efectivo += this.cajaForm.value.b5 ? parseFloat(this.cajaForm.value.b5) * 5 : 0;
    this.totales.efectivo += this.cajaForm.value.b10 ? parseFloat(this.cajaForm.value.b10) * 10 : 0;
    this.totales.efectivo += this.cajaForm.value.b20 ? parseFloat(this.cajaForm.value.b20) * 20 : 0;
    this.totales.efectivo += this.cajaForm.value.b50 ? parseFloat(this.cajaForm.value.b50) * 50 : 0;
    this.totales.efectivo += this.cajaForm.value.b100 ? parseFloat(this.cajaForm.value.b100) * 100 : 0;
    this.totales.efectivo += this.cajaForm.value.b200 ? parseFloat(this.cajaForm.value.b200) * 200 : 0;
    
    this.totales.tarjeta += parseFloat(this.cajaForm.value.visa ? this.cajaForm.value.visa : 0);
    this.totales.tarjeta += parseFloat(this.cajaForm.value.credomatic ? this.cajaForm.value.credomatic : 0);

    this.totales.transferencia += parseFloat(this.cajaForm.value.transferencia ? this.cajaForm.value.transferencia : 0);
    this.totales.cheque += parseFloat(this.cajaForm.value.cheque ? this.cajaForm.value.cheque : 0);
    this.totales.deposito += parseFloat(this.cajaForm.value.deposito ? this.cajaForm.value.deposito : 0);
    this.totales.vale += parseFloat(this.cajaForm.value.vale ? this.cajaForm.value.vale : 0);

    let total = 0;
    total += this.totales.efectivo;
    total += this.totales.tarjeta;
    total += this.totales.transferencia;
    total += this.totales.cheque;
    total += this.totales.deposito;
    total += this.totales.vale;
    this.cajaForm.controls['monto_cierre'].setValue(total);
    this.cajaForm.controls['total'].setValue(total - this.monto_apertura);
    this.cajaForm.controls['efectivo'].setValue(this.totales.efectivo);
    this.cajaForm.controls['tarjeta'].setValue(this.totales.tarjeta);
  }

  validarMetodo(metodo: any) {
    if (metodo == 'Efectivo') {
      if ((this.totales.efectivo) == (this.getMetodo('Efectivo Total') + this.monto_apertura)) {
        return true;
      }
    }
    if (metodo == 'Tarjeta') {
      if (this.totales.tarjeta == this.getMetodo('Tarjeta')) {
        return true;
      }
    }
    if (metodo == 'Transferencia') {
      if (this.totales.transferencia == this.getMetodo('Transferencia')) {
        return true;
      }
    }
    if (metodo == 'Cheque') {
      if (this.totales.cheque == this.getMetodo('Cheque')) {
        return true;
      }
    }
    if (metodo == 'Deposito') {
      if (this.totales.deposito == this.getMetodo('Deposito')) {
        return true;
      }
    }
    if (metodo == 'Vale') {
      if (this.totales.vale == this.getMetodo('Vale')) {
        return true;
      }
    }
    return false;
  }

  async corteCaja() {
    this.alertas_service.cerrar().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.corteCaja();
        return;
      }
      if (result.isConfirmed && result.value) {
        this.ngxService.start();
        this.cajaForm.controls['fecha_apertura'].setValue(moment(this.cajaForm.value.fecha_apertura).format('YYYY-MM-DD HH:mm'));
        this.cajaForm.controls['fecha_cierre'].setValue(moment(this.cajaForm.value.fecha_cierre).format('YYYY-MM-DD HH:mm'));
        this.cajaForm.controls['estado'].setValue('CERRADA');
        let caja = await this.cajas_service.putCaja(this.caja.id, this.cajaForm.value);
        if (caja.code) {
          await this.getCajas();
          this.alertas_service.success(caja.mensaje);
          $('#corte-caja').offcanvas('hide');
        }
        this.ngxService.stop();
      }
    });
  }

  openDoc(v: any) {
    this.ngxService.start();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiUrl}/cajas/doc/${v.id}?tipo=pdf&token=${this.token}`);
    $('#doc').offcanvas('show');
    this.ngxService.stop();
  }
  
}
