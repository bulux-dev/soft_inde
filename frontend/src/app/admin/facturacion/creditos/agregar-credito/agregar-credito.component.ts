import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertasService } from '../../../../services/alertas.service';
import { VentasService } from '../../../../services/ventas.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import moment from 'moment';
import { AppComponent } from '../../../../app.component';
import { CreditosService } from '../../../../services/creditos.service';
import { CreditosDetallesService } from '../../../../services/creditos_detalles.service';
import { CategoriasService } from '../../../../services/categorias.service';
import { ProductosService } from '../../../../services/productos.service';
import { EmpleadosService } from '../../../../services/empleados.service';
import { DataService } from '../../../../services/data.service';

declare var $: any;

@Component({
  selector: 'app-agregar-credito',
  standalone: false,
  templateUrl: './agregar-credito.component.html',
  styleUrl: './agregar-credito.component.css'
})
export class AgregarCreditoComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  tipos_cuotas: any = ['NIVELADA', 'SOBRE SALDOS', 'FLAT'];
  cuotas: any = [];
  departamentos: any = [];
  municipios: any = [];
  categorias: any = [];
  productos: any = [];
  empleados: any = [];
  ventas: any = [];
  venta: any;

  creditoForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [Validators.required]),
    fecha_inicio: new FormControl(null, [Validators.required]),
    fecha_fin: new FormControl(null, [Validators.required]),
    dias: new FormControl(null, [Validators.required]),
    interes_anual: new FormControl(null, [Validators.required]),
    interes_mensual: new FormControl(null, [Validators.required]),
    plazo_anos: new FormControl(null, [Validators.required]),
    plazo_meses: new FormControl(null, [Validators.required]),
    tipo_cuota: new FormControl(null, [Validators.required]),
    total: new FormControl(null, [Validators.required]),
    descuento: new FormControl(0),
    enganche: new FormControl(null),
    reserva: new FormControl(0),
    capital: new FormControl(null, [Validators.required]),
    interes: new FormControl(null, [Validators.required]),
    cuota: new FormControl(null, [Validators.required]),
    estado: new FormControl('PENDIENTE'),
    venta_id: new FormControl(null),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    cuotas: new FormControl([]),
  });
  creditoDetalleForm: FormGroup = new FormGroup({ 
    fecha: new FormControl(moment().format('YYYY-MM-DD')),
    departamento: new FormControl(),
    municipio: new FormControl(),
    proyecto_direccion: new FormControl('Calle 30 de junio 2-75 Canton Santa Cristina, Mazatenango Suchitepequez'),
    proyecto_celular: new FormControl('3631-4180'),
    coordinador: new FormControl(),
    coordinador_celular: new FormControl(),
    compr_nombre: new FormControl(),
    compr_nit: new FormControl(),
    compr_profesion: new FormControl(),
    compr_estado_civil: new FormControl(),
    compr_direccion: new FormControl(),
    compr_celular: new FormControl(),
    compr_edad: new FormControl(),
    compr_dpi: new FormControl(),
    compr_nacionalidad: new FormControl(),
    compr_institucion: new FormControl(),
    compr_inst_direccion: new FormControl(),
    compr_inst_celular: new FormControl(),
    compr_inst_puesto: new FormControl(),
    otros_ingresos: new FormControl(),
    ref1_nombre: new FormControl(),
    ref1_parentesco: new FormControl(),
    ref1_celular: new FormControl(),
    ref2_nombre: new FormControl(),
    ref2_parentesco: new FormControl(),
    ref2_celular: new FormControl(),
    sector: new FormControl(),
    metros2: new FormControl(),
    valor_metros2: new FormControl(),
    finca_no: new FormControl(),
    folio_no: new FormControl(),
    libro_no: new FormControl(),
    lote_direccion: new FormControl(),
    reserva_fecha: new FormControl(),
    reserva_monto: new FormControl(),
    reserva_recibo: new FormControl(),
    enganche_fecha: new FormControl(),
    enganche_monto: new FormControl(),
    enganche_recibo: new FormControl(),
    categoria_id: new FormControl(null, [Validators.required]),
    producto_id: new FormControl(null, [Validators.required]),
    empleado_id: new FormControl(null, [Validators.required]),
    credito_id: new FormControl()
  });

  constructor(
    private ngxService: NgxUiLoaderService,
    private location: Location,
    private alertas_service: AlertasService,
    private ventas_service: VentasService,
    private categorias_service: CategoriasService,
    private productos_service: ProductosService,
    private empleados_service: EmpleadosService,
    private creditos_service: CreditosService,
    private creditos_detalles_service: CreditosDetallesService,
    private data_service: DataService
  ) {
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDepartamentos();
    await this.getCategorias();
    await this.getEmpleados();
    this.ngxService.stop();
  }

  async postCredito() {

    let total = parseFloat(this.creditoForm.controls['total'].value);
    let descuento = parseFloat(this.creditoForm.controls['descuento'].value);
    let enganche = parseFloat(this.creditoForm.controls['enganche'].value);
    let reserva = parseFloat(this.creditoForm.controls['reserva'].value);
    let capital = parseFloat(this.creditoForm.controls['capital'].value);
    
    if (capital == (total - descuento - (enganche + reserva))) {
      this.ngxService.start();
      this.creditoForm.controls['cuotas'].setValue(this.cuotas);
      this.creditoForm.controls['tipo_cuota'].setValue(this.creditoForm.value.tipo_cuota[0]);
      this.creditoForm.controls['estado'].setValue('PENDIENTE');
  
      let credito = await this.creditos_service.postCredito(this.creditoForm.value);
      if (credito) {
  
        this.creditoDetalleForm.controls['credito_id'].setValue(credito.data.id);

        this.creditoDetalleForm.controls['categoria_id'].setValue(this.creditoDetalleForm.value.categoria_id[0].id);
        this.creditoDetalleForm.controls['departamento'].setValue(this.creditoDetalleForm.value.departamento[0].nombre);
        this.creditoDetalleForm.controls['municipio'].setValue(this.creditoDetalleForm.value.municipio[0].nombre);
        this.creditoDetalleForm.controls['producto_id'].setValue(this.creditoDetalleForm.value.producto_id[0].id);
        this.creditoDetalleForm.controls['empleado_id'].setValue(this.creditoDetalleForm.value.empleado_id[0].id);

        let credito_detalle = await this.creditos_detalles_service.postCreditoDetalle(this.creditoDetalleForm.value);
        if (credito_detalle) {
          this.alertas_service.success(credito.mensaje);
          this.ngxService.stop();
          this.location.back(); 
        }
      }
      this.ngxService.stop(); 
    } else {
      this.alertas_service.error('Los montos no coinciden', true);
    }
  }

  async getDepartamentos() {
    let departamentos = await this.data_service.getDepartamentos();
    this.departamentos = departamentos;
  }

  async getMunicipios(departamento: any) {
    this.creditoDetalleForm.controls['municipio'].setValue(null);
    let municipios = await this.data_service.getMunicipios(departamento.id);
    this.municipios = municipios;
  }

  async getCategorias() {
    let categorias = await this.categorias_service.getCategorias();
    this.categorias = categorias.data;
  }

  async getProductosByCategoria(categoria: any) {
    this.creditoDetalleForm.controls['producto_id'].setValue(null);
    let productos = await this.productos_service.getProductosByCategoria({
      categoria_id: categoria.id
    });
    this.productos = productos.data;
  }

  async setProducto(producto: any) {
    let prod = await this.productos_service.getProducto(producto.id);
    this.creditoForm.controls['total'].setValue(prod.data.precio);
  }

  async getEmpleados() {
    let empleados = await this.empleados_service.getEmpleados({
      vendedor: true
    });
    this.empleados = empleados.data;
  }

  calcularCapital() {
    let total = this.creditoForm.controls['total'].value;
    let descuento = this.creditoForm.controls['descuento'].value;
    let enganche = this.creditoForm.controls['enganche'].value;

    this.creditoForm.controls['capital'].setValue((total - descuento - enganche));
  }
  
  calcularEnganche() {
    let reserva = this.creditoForm.controls['reserva'].value;
    let enganche = this.creditoForm.controls['enganche'].value;

    this.creditoForm.controls['enganche'].setValue((enganche - reserva));
  }

  calcularInteres(tipo: any) {
    let interes_anual = this.creditoForm.controls['interes_anual'].value;
    let interes_mensual = this.creditoForm.controls['interes_mensual'].value;

    if (tipo == 'anual') {
      this.creditoForm.controls['interes_anual'].setValue((interes_mensual * 12).toFixed(2));
    }
    if (tipo == 'mensual') {
      this.creditoForm.controls['interes_mensual'].setValue((interes_anual / 12).toFixed(2));
    }
  }

  calcularPlazo(tipo: any) {
    let plazo_meses = this.creditoForm.controls['plazo_meses'].value;
    let plazo_anos = this.creditoForm.controls['plazo_anos'].value;

    if (tipo == 'meses') {
      this.creditoForm.controls['plazo_meses'].setValue((plazo_anos * 12).toFixed(2));
    }
    if (tipo == 'anos') {
      this.creditoForm.controls['plazo_anos'].setValue((plazo_meses / 12).toFixed(2));
    }

    let fecha_inicio = this.creditoForm.controls['fecha_inicio'].value;
    let fecha_fin = moment(fecha_inicio).add(plazo_meses - 1, 'months').endOf('month').format('YYYY-MM-DD');
    let dias = moment(fecha_fin).diff(fecha_inicio, 'days') + 1;

    this.creditoForm.controls['fecha_fin'].setValue(fecha_fin);
    this.creditoForm.controls['dias'].setValue(dias);
  }

  async calcularCuota() {
    let cuotas = await this.creditos_service.getProyeccion(this.creditoForm.value);
    this.cuotas = cuotas;

    let dias = 0;
    let interes = 0;
    let cuota = 0;
    this.cuotas.forEach((c: any) => { 
      dias += parseFloat(c.dias);
      interes += parseFloat(c.interes);
      cuota += parseFloat(c.cuota);
    });
    this.creditoForm.controls['dias'].setValue(dias);
    this.creditoForm.controls['interes'].setValue(interes);
    this.creditoForm.controls['cuota'].setValue(cuota);
  }

}
