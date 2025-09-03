import { Component, Input, ViewChild } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { AppComponent } from '../../../app.component';
import moment from 'moment';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};


@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  @Input() oc: any;

  @ViewChild("chart") g_operaciones: any;
  @ViewChild("chart") g_operacion_mes: any;
  @ViewChild("chart") g_operacion_mes2: any;
  @ViewChild("chart") chart: any;

  seguridad: any;
  personal: any;
  operaciones: any;
  ops: any = [];
  operaciones_mes: any = [];

  fecha_inicio: any = moment().startOf('month').format('YYYY-MM-DD HH:mm');
  fecha_fin: any = moment().endOf('month').format('YYYY-MM-DD HH:mm');
  pie_type: string = 'pie';
  serie_type: string = 'cantidad';
  op_type: any = '';
  primary_color: string = AppComponent.ajustes.color;

  constructor(
    private ngxService: NgxUiLoaderService,
    private dashboard_service: DashboardService
  ) { }

  async ngOnInit() {
    this.ngxService.start();
    await this.getSeguridad();
    await this.getPersonal();
    await this.getOperaciones();
    this.ngxService.stop();
  }

  async getSeguridad() {
    let seguridad = await this.dashboard_service.seguridad();
    this.seguridad = seguridad.data;
  }

  async getPersonal() {
    let personal = await this.dashboard_service.personal();
    this.personal = personal.data;
  }

  async getOperaciones() {
    let operaciones = await this.dashboard_service.operaciones(this.fecha_inicio, this.fecha_fin);
    this.operaciones = operaciones.data;

    let montos = [
      this.serie_type == 'monto' ? this.operaciones.compras.total : this.operaciones.compras.count,
      this.serie_type == 'monto' ? this.operaciones.ventas.total : this.operaciones.ventas.count,
      this.serie_type == 'monto' ? this.operaciones.cotizaciones.total : this.operaciones.cotizaciones.count,
      this.serie_type == 'monto' ? this.operaciones.pedidos.total : this.operaciones.pedidos.count,
      this.serie_type == 'monto' ? this.operaciones.ordenes_compras.total : this.operaciones.ordenes_compras.count,
      this.serie_type == 'monto' ? this.operaciones.cargas.total : this.operaciones.cargas.count,
      this.serie_type == 'monto' ? this.operaciones.descargas.total : this.operaciones.descargas.count,
      this.serie_type == 'monto' ? this.operaciones.traslados.total : this.operaciones.traslados.count
    ]

    this.g_operaciones = {
      series: montos,
      chart: {
        width: 500,
        type: this.pie_type,
      },
      dataLabels: {
        enabled: true
      },
      legend: {
        show: false
      },
      colors: [
        `${this.primary_color}`,
        `${this.primary_color}E6`,
        `${this.primary_color}CC`,
        `${this.primary_color}B3`,
        `${this.primary_color}99`,
        `${this.primary_color}80`,
        `${this.primary_color}66`,
        `${this.primary_color}4D`,
      ],
      labels: [
        `Compras (${montos[0]})`,
        `Ventas (${montos[1]})`,
        `Cotizaciones (${montos[2]})`,
        `Pedidos (${montos[3]})`,
        `Ordenes Compras (${montos[4]})`,
        `Cargas (${montos[5]})`,
        `Descargas (${montos[6]})`,
        `Traslados (${montos[7]})`
      ],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 500
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  }

  async getOperacionMes() {        
    let operaciones;
    if (this.op_type == 0) {
      operaciones = await this.dashboard_service.compras(this.fecha_inicio, this.fecha_fin);      
    }
    if (this.op_type == 1) {
      operaciones = await this.dashboard_service.ventas(this.fecha_inicio, this.fecha_fin);
    }
    if (this.op_type == 2) {
      operaciones = await this.dashboard_service.cotizaciones(this.fecha_inicio, this.fecha_fin);
    }
    if (this.op_type == 3) {
      operaciones = await this.dashboard_service.pedidos(this.fecha_inicio, this.fecha_fin);
    }
    if (this.op_type == 4) {
      operaciones = await this.dashboard_service.ordenes_compras(this.fecha_inicio, this.fecha_fin);
    }
    if (this.op_type == 5) {
      operaciones = await this.dashboard_service.cargas(this.fecha_inicio, this.fecha_fin);
    }
    if (this.op_type == 6) {
      operaciones = await this.dashboard_service.descargas(this.fecha_inicio, this.fecha_fin);
    }
    if (this.op_type == 7) {
      operaciones = await this.dashboard_service.traslados(this.fecha_inicio, this.fecha_fin);
    }

    this.ops = operaciones.data;
    let series = this.ops.map((item: any) => this.serie_type == 'monto' ? [item.fecha, item.total] : [item.fecha, item.count]);
  
    this.g_operacion_mes = {
      series: [
        {
          name: this.serie_type == 'monto' ? 'Monto' : 'Cantidad',
          data: series
        }
      ],
      chart: {
        id: "chart2",
        type: "area",
        height: 230,
        toolbar: {
          autoSelected: "pan",
          show: false
        }
      },
      colors: [this.primary_color],
      stroke: {
        width: 3
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: 1
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: "datetime"
      }
    };

    this.g_operacion_mes2 = {
      series: [
        {
          name: "series1",
          data: series
        }
      ],
      chart: {
        id: "chart1",
        height: 130,
        type: "area",
        brush: {
          target: "chart2",
          enabled: true
        },
        selection: {
          enabled: true,
          xaxis: {
            min: new Date(this.fecha_inicio).getTime(),
            max: new Date(this.fecha_fin).getTime()
          }
        }
      },
      colors: [this.primary_color],
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.91,
          opacityTo: 0.1
        }
      },
      xaxis: {
        type: "datetime",
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        tickAmount: 2
      }
    }

  }

  getHexColor(hex: string, opacity: number): string {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b}, ${opacity})`;
  }

  public generateDayWiseTimeSeries(baseval: any, count: any, yrange: any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = baseval;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

}
