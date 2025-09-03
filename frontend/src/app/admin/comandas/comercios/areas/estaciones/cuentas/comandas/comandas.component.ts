import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../../../../services/alertas.service';
import { CuentasService } from '../../../../../../../services/cuentas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../../../../../../../app.component';
import { ComandasService } from '../../../../../../../services/comandas.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DocumentosService } from '../../../../../../../services/documentos.service';
import moment from 'moment';
import { ComerciosService } from '../../../../../../../services/comercios.service';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../../../../../services/usuarios.service';
import { ScriptsService } from '../../../../../../../services/scripts.service';
import { AdminComponent } from '../../../../../../admin.component';
import { ImpresorasService } from '../../../../../../../services/impresoras.service';
import { ComandasDetallesService } from '../../../../../../../services/comandas_detalles.service';

declare var $: any
// declare function quickPrint(data: any): any;
declare function printer(receipt_data: any, ip: string): any;
declare function checkStatus(): any;

@Component({
  selector: 'app-comandas',
  standalone: false,
  templateUrl: './comandas.component.html',
  styleUrl: './comandas.component.css'
})
export class ComandasComponent {

  @Input() cuenta_id: any;
  comanda_id: any;
  documento_id: any;

  loading: boolean = true;
  cuenta: any = null;
  documento: any = null;

  comandas_detalles: any = [];
  documentos: any = [];
  comercios: any = [];
  impresoras: any = [];

  get selectS() {
    return AppComponent.selectS;
  }

  comentario: any;
  lines: number = 48;
  nombre_usuario: any;
  rol_id: any = localStorage.getItem('rol_id');
  usuario_id: any = localStorage.getItem('usuario_id');

  comandaForm: FormGroup = new FormGroup({
    fecha: new FormControl(moment().format('YYYY-MM-DD HH:mm'), [Validators.required]),
    observaciones: new FormControl(null),
    cuenta_id: new FormControl(null, [Validators.required]),
    documento_id: new FormControl(null),
    sucursal_id: new FormControl(null, [Validators.required]),
    bodega_id: new FormControl(null),
    usuario_id: new FormControl(localStorage.getItem('usuario_id')),
    comandas_detalles: new FormControl(null)
  });

  constructor(
    private alertas_service: AlertasService,
    private ngxService: NgxUiLoaderService,
    private cuentas_service: CuentasService,
    private comandas_service: ComandasService,
    private comandas_detalles_service: ComandasDetallesService,
    private documentos_service: DocumentosService,
    private comercios_service: ComerciosService,
    private usuarios_service: UsuariosService,
    private scripts_service: ScriptsService,
    private impresoras_service: ImpresorasService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    await this.getCuenta();
    await this.getImpresoras();
    this.scripts_service.networkPrint();

    let usuario = await this.usuarios_service.getUsuario(this.usuario_id);
    if (usuario.code) {
      this.nombre_usuario = usuario.data.nombre + ' ' + usuario.data.apellido;
    }
  }

  async getCuenta(id: any = this.cuenta_id) {
    this.loading = true;
    let cuenta = await this.cuentas_service.getCuenta(id);
    if (cuenta.code) {
      this.cuenta = cuenta.data;
      this.comandaForm.patchValue({ cuenta_id: cuenta.data.id });
    }
    this.loading = false;
  }

  async getDocumentos(slug: any) {
    if (this.rol_id == '1') {
      let documentos = await this.documentos_service.getDocumentos({
        slug: slug
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    } else {
      let documentos = await this.documentos_service.getDocumentos({
        slug: slug,
        usuario_id: this.usuario_id
      });
      if (documentos.code) {
        this.documentos = documentos.data;
      }
    }

    // let d: any = localStorage.getItem(`carrito${this.documento_id}`);
    // this.comandas_detalles = JSON.parse(d) || [];

    if (this.documentos.length == 1) {
      this.documento_id = this.documentos[0].id;
      this.documento = this.documentos[0];
      $('#carrito').offcanvas('show');
    } else {
      $('#documentos').offcanvas('show');
    }
  }

  async getImpresoras() {
    let impresoras = await this.impresoras_service.getImpresoras();
    if (impresoras.code) {
      this.impresoras = impresoras.data;
    }
  }

  async setDocumento(d: any) {
    this.documento_id = d.id;
    this.documento = d;
    $('#documentos').offcanvas('hide');

    if (d.slug == 'comanda') {
      $('#carrito').offcanvas('show');
    }

    if (d.slug == 'venta') {
      let detalles = this.cuenta.comandas.flatMap((c: any) => c.comandas_detalles);

      let detalles_agrupados = detalles.reduce((map: any, obj: any) => {
        const key = obj.producto_id;
        map[key] = map[key] || { ...obj, cantidad: 0, impuesto: 0, subtotal: 0 };
        map[key].logo = obj.producto.logo;
        map[key].cantidad += parseFloat(obj.cantidad);
        map[key].precio = parseFloat(obj.precio_unitario) * parseFloat(map[key].cantidad);
        map[key].total = parseFloat(obj.precio_unitario) * parseFloat(map[key].cantidad);
        map[key].impuesto += parseFloat(obj.impuesto);
        map[key].subtotal += parseFloat(obj.subtotal);
        map[key].equivalencias = [];
        map[key].equivalencia = 1;
        map[key].producto = obj.producto;
        map[key].medida = obj.medida;
        map[key].lote_id = null;
        map[key].lote = obj.producto.lote ? obj.producto.lote : null;
        map[key].variacion_id = null;
        map[key].producto_stock = Infinity;
        map[key].stock = Infinity;
        return map;
      }, {});
      detalles = Object.values(detalles_agrupados);

      localStorage.setItem(`carrito${this.documento_id}`, JSON.stringify(detalles));
      this.router.navigate(['/admin/facturacion/ventas/agregar', this.documento_id, 'cuenta', this.cuenta_id]);
    }

  }

  closeDocumento() {
    this.documento = null;
    this.documento_id = null;
  }

  async setComanda(a: any) {
    this.comanda_id = a.id;
    this.comandaForm.patchValue(a);
  }

  async postComanda() {
    this.ngxService.start();
    let numero = this.cuenta.comandas.length + 1;
    this.comandaForm.controls['fecha'].setValue(moment().format('YYYY-MM-DD HH:mm'));
    this.comandaForm.controls['documento_id'].setValue(this.documento_id);
    this.comandaForm.controls['sucursal_id'].setValue(this.documento.sucursal_id);
    this.comandaForm.controls['bodega_id'].setValue(this.documento.bodega_id);

    this.comandas_detalles.map((d: any) => { d.usuario_id = this.usuario_id; })
    this.comandaForm.controls['comandas_detalles'].setValue(this.comandas_detalles);

    let comanda = await this.comandas_service.postComanda(this.comandaForm.value);
    if (comanda.code) {

      // Separacion de comandas por impresora/categoria
      for (let i = 0; i < this.impresoras.length; i++) {
        this.impresoras[i].comandas_detalles = [];
        for (let d = 0; d < this.comandas_detalles.length; d++) {
          if (this.comandas_detalles[d].producto.productos_categorias.length > 0) {
            if (this.comandas_detalles[d].producto.productos_categorias[0].categoria.impresora_id == this.impresoras[i].id) {
              this.impresoras[i].comandas_detalles.push(this.comandas_detalles[d]);
            }
          }
        }
      }

      // Impresion de comandas
      for (let i = 0; i < this.impresoras.length; i++) {
        if (this.impresoras[i].comandas_detalles.length > 0) {

          let detalles = this.impresoras[i].comandas_detalles;

          let items = '';
          for (let i = 0; i < detalles.length; i++) {
            items += `${AdminComponent.itemsTicket2(this.impresoras[i], parseInt(detalles[i].cantidad), detalles[i].descripcion, '')}\n`;
          }

          let imp = `
      
${AdminComponent.centerTicket(this.impresoras[i], `COMANDA ${comanda.data.serie}-${comanda.data.correlativo}`)}
  
${AdminComponent.infoTicket(this.impresoras[i], `COMERCIO:`, this.cuenta?.estacion?.area?.comercio?.nombre)}
${AdminComponent.infoTicket(this.impresoras[i], `AREA:`, this.cuenta.estacion.area.nombre)}
${AdminComponent.infoTicket(this.impresoras[i], `ESTACION:`, this.cuenta.estacion.nombre)}
${AdminComponent.infoTicket(this.impresoras[i], `CUENTA:`, this.cuenta.nombre)}
  
${AdminComponent.headerTicket(this.impresoras[i])}
${AdminComponent.linesTicket(this.impresoras[i])}
  
${items}      
  
${AdminComponent.infoTicket(this.impresoras[i], `${this.cuenta.estacion.area.comercio.operador.toUpperCase()}:`, this.nombre_usuario)}
${AdminComponent.infoTicket(this.impresoras[i], 'FECHA:', moment().format('DD/MM/yyyy HH:mm'))}
`;

          AdminComponent.print(this.impresoras[i], imp);

        }
      }

      this.alertas_service.success(comanda.mensaje);
      $('.offcanvas').offcanvas('hide');
      localStorage.removeItem(`carrito${this.documento_id}`);
      this.closeDocumento();
      await this.getCuenta();
    }
    this.ngxService.stop();
  }

  async putComanda() {
    this.ngxService.start();
    let comanda = await this.comandas_service.putComanda(this.comanda_id, this.comandaForm.value);
    if (comanda.code) {
      this.alertas_service.success(comanda.mensaje);
      await this.getCuenta();
      $('.offcanvas').offcanvas('hide');
    }
    this.ngxService.stop();
  }

  async putComentario() {
    // this.ngxService.start();
    // let comanda = await this.comandas_detalles_service.putComandaDetalle(this._id, { observaciones: this.comentario });
    // if (comanda.code) {
    //   this.alertas_service.success(comanda.mensaje);
    //   await this.getCuenta();
    //   $('.offcanvas').offcanvas('hide');
    // }
    // this.ngxService.stop();
  }

  async deleteComanda(a: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let comanda = await this.comandas_service.deleteComanda(a.id);
        if (comanda.code) {
          this.cuenta.comandas.splice(this.cuenta.comandas.indexOf(a), 1);
          this.alertas_service.success(comanda.mensaje);
        }
      }
    });
  }

  async deleteComandaDetalle(d: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let comanda_detalle = await this.comandas_detalles_service.deleteComandaDetalle(d.id);
        if (comanda_detalle.code) {
          this.comandas_detalles.splice(this.comandas_detalles.indexOf(d), 1);
          this.alertas_service.success(comanda_detalle.mensaje);
        }
      }
    });
  }

  async getAllComerciosArbol() {
    let comercios = await this.comercios_service.getComerciosArbol();
    if (comercios.code) {
      this.comercios = comercios.data;
    }
  }

  get productos_seleccionados() {
    return this.cuenta.comandas.flatMap((c: any) => c.comandas_detalles.filter((d: any) => d.selected));
  }

  async moverCuenta(e: any, a: any, c: any) {
    this.alertas_service.continuar().then(async (result: any) => {
      if (result.isConfirmed) {
        if (this.productos_seleccionados.length == 0) {
          let nombre = `Cuenta ${e.cuentas.length + 1}`;
          let cuenta = await this.cuentas_service.putCuenta(this.cuenta_id, { estacion_id: e.id, nombre: nombre });
          if (cuenta.code) {
            this.alertas_service.success(cuenta.mensaje);
            $('.offcanvas').offcanvas('hide');
            this.router.navigate([`/admin/comandas/comercios/${c.id}/area/${a.id}/estacion/${e.id}/cuenta/${this.cuenta_id}`]);
            await this.getCuenta();
          }
        } else {

          await this.getDocumentos('comanda');
          // Validacion de documento
          if (this.documentos.length == 0) {
            this.alertas_service.error('No tienes documentos asignados');
          } else {
            this.documento_id = this.documentos[0].id;
            this.documento = this.documentos[0];

            // Creacion de cuenta
            let nombre = `Cuenta ${e.cuentas.length + 1}`;
            let cuenta = await this.cuentas_service.postCuenta({
              nombre: nombre,
              estado: 'ABIERTA',
              estacion_id: e.id
            });
            if (cuenta.code) {

              // Creacion de comanda
              let comanda = await this.comandas_service.postComanda({
                fecha: moment().format('YYYY-MM-DD HH:mm'),
                observaciones: `Comanda de movimiento de cuenta #${this.cuenta.id}`,
                estado: 'VIGENTE',
                cuenta_id: cuenta.data.id,
                documento_id: this.documento_id,
                sucursal_id: this.documento.sucursal_id,
                bodega_id: this.documento.bodega_id,
                usuario_id: this.usuario_id,
                comandas_detalles: []
              });

              // Movimimento de productos
              for (let i = 0; i < this.productos_seleccionados.length; i++) {
                await this.comandas_detalles_service.putComandaDetalle(this.productos_seleccionados[i].id, {
                  comanda_id: comanda.data.id
                });
              }

              this.alertas_service.success('Movimiento de productos exitoso');
              $('.offcanvas').offcanvas('hide');
              this.router.navigate([`/admin/comandas/comercios/${c.id}/area/${a.id}/estacion/${e.id}/cuenta/${cuenta.data.id}`]);
              await this.getCuenta(cuenta.data.id);

            }
          }
        }
      }
    });
  }

  async moverProductos(cu: any, e: any, a: any, c: any) {
    this.alertas_service.continuar().then(async (result: any) => {
      if (result.isConfirmed) {

        if (this.productos_seleccionados.length == 0) {
          for (let c = 0; c < this.cuenta.comandas.length; c++) {
            await this.comandas_service.putComanda(this.cuenta.comandas[c].id, {
              cuenta_id: cu.id
            });
          }
          
          this.alertas_service.success('Movimiento de productos exitoso');
          $('.offcanvas').offcanvas('hide');
          this.router.navigate([`/admin/comandas/comercios/${c.id}/area/${a.id}/estacion/${e.id}/cuenta/${cu.id}`]);
          await this.getCuenta(cu.id);

        } else {
          await this.getDocumentos('comanda');
          // Validacion de documento
          if (this.documentos.length == 0) {
            this.alertas_service.error('No tienes documentos asignados');
          } else {
            this.documento_id = this.documentos[0].id;
            this.documento = this.documentos[0];

            // Movimiento de comandas
            let comanda = await this.comandas_service.postComanda({
              fecha: moment().format('YYYY-MM-DD HH:mm'),
              observaciones: `Comanda de movimiento de cuenta #${this.cuenta.id}`,
              estado: 'VIGENTE',
              cuenta_id: cu.id,
              documento_id: this.documento_id,
              sucursal_id: this.documento.sucursal_id,
              bodega_id: this.documento.bodega_id,
              usuario_id: this.usuario_id,
              comandas_detalles: []
            });

            // Movimimento de productos
            for (let i = 0; i < this.productos_seleccionados.length; i++) {
              await this.comandas_detalles_service.putComandaDetalle(this.productos_seleccionados[i].id, {
                comanda_id: comanda.data.id
              });
            }

            this.alertas_service.success('Movimiento de productos exitoso');
            $('.offcanvas').offcanvas('hide');
            this.router.navigate([`/admin/comandas/comercios/${c.id}/area/${a.id}/estacion/${e.id}/cuenta/${cu.id}`]);
            await this.getCuenta(cu.id);
          }
        }

      }
    });
  }

  async deleteCuenta() {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        for (let c = 0; c < this.cuenta.comandas.length; c++) {
          await this.comandas_service.deleteComanda(this.cuenta.comandas[c].id);
        }
        let cuenta = await this.cuentas_service.deleteCuenta(this.cuenta.id);
        if (cuenta.code) {
          this.router.navigate(['/admin/comandas/comercios', this.cuenta.estacion.area.comercio_id, 'area', this.cuenta.estacion.area_id, 'estacion', this.cuenta.estacion_id]);
          this.alertas_service.success(cuenta.mensaje);
        }
      }
    });
  }

  getTotal() {
    let total = 0;
    this.comandas_detalles.forEach((d: any) => {
      total += parseFloat(d.total);
    });
    return total;
  }

  getTotalComanda(comandas_detalles: any) {
    let total = 0;
    comandas_detalles.forEach((d: any) => {
      total += parseFloat(d.total);
    });
    return total;
  }

  getTotalCuenta() {
    let total = 0;
    this.cuenta?.comandas.forEach((c: any) => {
      c.comandas_detalles.forEach((d: any) => {
        total += parseFloat(d.total);
      })
    });
    return total;
  }

  closeOC() {
    $('.offcanvas').offcanvas('hide');
  }

  updateCarrito() {
    this.comandas_detalles = JSON.parse(localStorage.getItem(`carrito${this.documento_id}`) || '[]');
  }

  async printPrecuenta(i: any) {

    let detalles = this.cuenta.comandas.flatMap((c: any) => c.comandas_detalles);
    let items = '';
    for (let n = 0; n < detalles.length; n++) {
      items += `${AdminComponent.itemsTicket(i, parseInt(detalles[n].cantidad), detalles[n].descripcion, detalles[n].total)}\n`;
    }

    let ticket = `

${AdminComponent.centerTicket(i, 'PRECUENTA')}

${AdminComponent.infoTicket(i, `COMERCIO:`, this.cuenta?.estacion?.area?.comercio?.nombre)}
${AdminComponent.infoTicket(i, `AREA:`, this.cuenta.estacion.area.nombre)}
${AdminComponent.infoTicket(i, `ESTACION:`, this.cuenta.estacion.nombre)}
${AdminComponent.infoTicket(i, `CUENTA:`, this.cuenta.nombre)}

${AdminComponent.headerTicket(i)}
${AdminComponent.linesTicket(i)}

${items}      
${AdminComponent.linesTicket(i)}
${AdminComponent.infoTicket(i, 'TOTAL:', `Q. ${this.getTotalCuenta().toFixed(2)}`)}
${AdminComponent.linesTicket(i)}

${AdminComponent.centerTicket(i, 'NOMBRE:  _______________________')}

${AdminComponent.centerTicket(i, 'NIT: ___________________________')}

${AdminComponent.linesTicket(i)}

${AdminComponent.infoTicket(i, `${this.cuenta.estacion.area.comercio.operador.toUpperCase()}:`, this.nombre_usuario)}
${AdminComponent.infoTicket(i, 'FECHA:', moment().format('DD/MM/yyyy HH:mm'))}
  `;

    AdminComponent.print(i, ticket);
    $('#impresoras').offcanvas('hide');

  }

}

