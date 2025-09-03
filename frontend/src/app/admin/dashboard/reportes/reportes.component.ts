import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-reportes',
  standalone: false,
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {

  url: string = '';
  token: string = localStorage.getItem('token') || '';
  busqueda: string = '';

  reportes: any = [
    {
      nombre: "Facturacion",
      data: [
        { nombre: "Reporte de Ventas", reporte: "facturacion/ventas.rdlx-json", description: "Reporte de Ventas" },
        { nombre: "Reporte de Compras", reporte: "facturacion/compras.rdlx-json", descripcion: "Reporte de Compras" }
      ]
    },
    {
      nombre: "Contabilidad",
      data: [
        { nombre: "Libro Diario", reporte: "contabilidad/libro_diario.rdlx-json" }
      ]
    }
  ];
  reportes_lista: any = [];

  constructor(
    private sanitizer: DomSanitizer
  ) {
    document.body.classList.add('mini-sidebar');
    document.body.classList.remove('expand-menu');
    this.reportes_lista = this.reportes;
  }

  setReporte(r: any) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://kpi.kairosgt.com/?reporte=' + r.reporte + '&token=' + this.token) as string;
  }

  searchReporte() {
    let data = this.reportes_lista.map((r: any) => {
      let filteredData = r.data.filter((d: any) => {
        return d.nombre.toUpperCase().includes(this.busqueda.toUpperCase());
      });
      return { ...r, data: filteredData };
    }).filter((r: any) => r.data.length > 0);
    this.reportes = data;
  }

}
