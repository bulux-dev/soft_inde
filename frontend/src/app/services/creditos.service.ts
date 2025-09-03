import { Injectable } from '@angular/core';
import { RootService } from './root.service';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CreditosService {

  route: string = '/creditos';

  constructor(
    private rootService: RootService
  ) { }

  async getCreditos(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getCredito(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCredito(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCredito(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularCredito(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }

  async deleteCredito(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

  async getProyeccion(data: any) {
    let tipo_cuota = data.tipo_cuota && data.tipo_cuota[0] ? data.tipo_cuota[0] : '';
    let interes_mensual = data.interes_mensual;
    let plazo_meses = data.plazo_meses;
    let monto = data.capital;
    let fecha_inicio = data.fecha_inicio;
    let fecha_fin = moment(fecha_inicio).endOf('month').format('YYYY-MM-DD');
    let dias = moment(fecha_fin).diff(moment(fecha_inicio), 'days') + 1;

    let saldo_inicial = monto;
    let capital = 0;
    let interes = 0;
    let cuota = 0;

    let cuotas = [];

    switch (tipo_cuota) {
      case 'NIVELADA':
        cuota = (interes_mensual / 100) * monto / (1 - Math.pow(1 + interes_mensual / 100, -plazo_meses));
        interes = monto * (interes_mensual / 100);
        capital = cuota - interes;
        break;

      case 'SOBRE SALDOS':
        capital = monto / plazo_meses;
        interes = monto * (interes_mensual / 100);
        cuota = capital + interes;
        break;

      case 'FLAT':
        capital = monto / plazo_meses;
        interes = monto * (interes_mensual / 100);
        cuota = capital + interes;
        break;
    }

    let saldo_final = monto - capital;

    cuotas = [{
      numero: 1,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
      dias,
      saldo_inicial,
      capital,
      interes,
      cuota,
      saldo_final
    }];
    for (let x = 0; x < plazo_meses - 1; x++) {
      saldo_inicial = saldo_final;

      switch (tipo_cuota) {
        case 'NIVELADA':
          interes = saldo_final * (interes_mensual / 100);
          capital = cuota - interes;
          break;

        case 'SOBRE SALDOS':
          capital = monto / plazo_meses;
          interes = saldo_final * (interes_mensual / 100);
          cuota = capital + interes;
          break;

        case 'FLAT':
          capital = monto / plazo_meses;
          interes = monto * (interes_mensual / 100);
          cuota = capital + interes;
          break;
      }

      saldo_final -= capital;

      let f_inicio = moment(fecha_inicio).add(x + 1, 'months').startOf('month').format('YYYY-MM-DD');
      let f_fin = moment(fecha_fin).add(x + 1, 'months').endOf('month').format('YYYY-MM-DD');
      let dias = moment(f_fin).diff(moment(f_inicio), 'days') + 1;
      
      cuotas.push({
        numero: x + 2,
        fecha_inicio: f_inicio,
        fecha_fin: f_fin,
        dias,
        saldo_inicial,
        capital,
        interes,
        cuota,
        saldo_final
      });
    }

    return cuotas;
  }

  async getProyeccionAmortizacion(data: any, amortizaciones: any) {
    let tipo_cuota = data.tipo_cuota;
    let interes_mensual = data.interes_mensual;
    let plazo_meses = data.plazo_meses;
    let monto = data.capital;
    let fecha_inicio = data.fecha_inicio;
    let fecha_fin = moment(fecha_inicio).endOf('month').format('YYYY-MM-DD');
    let dias = moment(fecha_fin).diff(moment(fecha_inicio), 'days') + 1;

    let saldo_inicial = monto;
    let capital = 0;
    let interes = 0;
    let cuota = 0;

    let cuotas = [];

    switch (tipo_cuota) {
      case 'NIVELADA':
        cuota = (interes_mensual / 100) * monto / (1 - Math.pow(1 + interes_mensual / 100, -plazo_meses));
        interes = monto * (interes_mensual / 100);
        capital = cuota - interes;
        break;

      case 'SOBRE SALDOS':
        capital = monto / plazo_meses;
        interes = monto * (interes_mensual / 100);
        cuota = capital + interes;
        break;

      case 'FLAT':
        capital = monto / plazo_meses;
        interes = monto * (interes_mensual / 100);
        cuota = capital + interes;
        break;
    }

    let saldo_final = monto - capital;

    cuotas = [{
      numero: 1,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
      dias,
      saldo_inicial,
      capital,
      interes,
      cuota,
      saldo_final
    }];
    for (let x = 0; x < plazo_meses - 1; x++) {
      saldo_inicial = saldo_final;

      switch (tipo_cuota) {
        case 'NIVELADA':
          interes = saldo_final * (interes_mensual / 100);
          capital = cuota - interes;
          break;

        case 'SOBRE SALDOS':
          capital = monto / plazo_meses;
          interes = saldo_final * (interes_mensual / 100);
          cuota = capital + interes;
          break;

        case 'FLAT':
          capital = monto / plazo_meses;
          interes = monto * (interes_mensual / 100);
          cuota = capital + interes;
          break;
      }

      saldo_final -= capital;

      let f_inicio = moment(fecha_inicio).add(x + 1, 'months').startOf('month').format('YYYY-MM-DD');
      let f_fin = moment(fecha_fin).add(x + 1, 'months').endOf('month').format('YYYY-MM-DD');
      let dias = moment(f_fin).diff(moment(f_inicio), 'days') + 1;
      
      cuotas.push({
        numero: x + 2,
        fecha_inicio: f_inicio,
        fecha_fin: f_fin,
        dias,
        saldo_inicial,
        capital,
        interes,
        cuota,
        saldo_final
      });
    }

    return cuotas;
  }

}
