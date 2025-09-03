import { Component } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { DocumentosService } from '../../../../services/documentos.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { SucursalesService } from '../../../../services/sucursales.service';
import { UsuariosService } from '../../../../services/usuarios.service';
import { TiposDocumentosService } from '../../../../services/tipos_documentos.service';
import { BodegasService } from '../../../../services/bodegas.service';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-agregar-documento',
  standalone: false,
  templateUrl: './agregar-documento.component.html',
  styleUrl: './agregar-documento.component.css'
})
export class AgregarDocumentoComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  loading: boolean = false;

  tipos_documentos: any = [];
  sucursales: any = [];
  bodegas: any = [];
  usuarios: any = [];

  documentoForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    slug: new FormControl(null, [Validators.required]),
    serie: new FormControl(null, [Validators.required]),
    correlativo: new FormControl(null, [Validators.required]),
    color: new FormControl(null),
    cambiaria: new FormControl(null),
    inventario: new FormControl(null),
    certificacion: new FormControl(null),
    sucursal_id: new FormControl(null),
    bodega_id: new FormControl(null),
    usuario_id: new FormControl(null, [Validators.required]),
    tipo_documento_id: new FormControl(null, [Validators.required]),
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private usuarios_service: UsuariosService,
    private tipos_documentos_service: TiposDocumentosService
  ) {
  }

  async ngOnInit() {
    await this.getTiposDocumentos();
    await this.getSucursales();
    await this.getUsuarios();
  }

  async getTiposDocumentos() {
    let tipos_documentos = await this.tipos_documentos_service.getTiposDocumentos();
    if (tipos_documentos.code) {
      this.tipos_documentos = tipos_documentos.data;
    }
  }

  async getSucursales() {
    let sucursales = await this.sucursales_service.getSucursales();
    if (sucursales.code) {
      this.sucursales = sucursales.data;
      this.documentoForm.patchValue({ sucursal_id: [sucursales.data[0]] });
      this.getBodegasBySucursal(sucursales.data[0].id);
    }
  }

  async getBodegas() {
    let bodegas = await this.bodegas_service.getBodegasBySucursal(this.documentoForm.controls['sucursal_id'].value[0].id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
    }
  }

  async getUsuarios() {
    let usuarios = await this.usuarios_service.getUsuarios();
    if (usuarios.code) {
      this.usuarios = usuarios.data;
    }
  }

  async getBodegasBySucursal(id: any) {
    let bodegas = await this.bodegas_service.getBodegasBySucursal(id);
    if (bodegas.code) {
      this.bodegas = bodegas.data;
      this.documentoForm.patchValue({ bodega_id: [bodegas.data[0]] });
    }
  }

  async setTipoDocumento($event: any) {
    let tipo_documento = await this.tipos_documentos_service.getTipoDocumento($event.id);
    this.documentoForm.controls['slug'].setValue(tipo_documento.data.slug);
  }

  async postDocumento() {
    this.loading = true;
    this.documentoForm.controls['tipo_documento_id'].setValue(this.documentoForm.controls['tipo_documento_id'].value[0].id);
    if (this.documentoForm.controls['sucursal_id'].value && this.documentoForm.controls['sucursal_id'].value.length) {
      this.documentoForm.controls['sucursal_id'].setValue(this.documentoForm.controls['sucursal_id'].value[0].id);
    } else {
      this.documentoForm.controls['sucursal_id'].setValue(null);
    }
    if (this.documentoForm.controls['bodega_id'].value && this.documentoForm.controls['bodega_id'].value.length) {
      this.documentoForm.controls['bodega_id'].setValue(this.documentoForm.controls['bodega_id'].value[0].id);
    } else {
      this.documentoForm.controls['bodega_id'].setValue(null);
    }
    this.documentoForm.controls['usuario_id'].setValue(this.documentoForm.controls['usuario_id'].value[0].id);
    let documento = await this.documentos_service.postDocumento(this.documentoForm.value);
    if (documento.code) {
      this.alertas_service.success(documento.mensaje);
      this.location.back();
    }
    this.loading = false
  }

  validCertificacion() {
    const validNames = ['Venta']
    const tipoDocumento = this.documentoForm.get('tipo_documento_id')?.value?.[0]?.nombre;
    return validNames.includes(tipoDocumento);
  }

  validInventario() {
    const validNames = ['Cotizacion', 'Pedido', 'Orden Compra', 'Compra', 'Venta', 'Traslado', 'Carga', 'Descarga', 'Envio', 'Importacion', 'Exportacion'];
    const tipoDocumento = this.documentoForm.get('tipo_documento_id')?.value?.[0]?.nombre;
    return validNames.includes(tipoDocumento);
  }

}
