import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { DocumentosService } from '../../../../services/documentos.service';
import { SucursalesService } from '../../../../services/sucursales.service';
import { UsuariosService } from '../../../../services/usuarios.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ScriptsService } from '../../../../services/scripts.service';
import { TiposDocumentosService } from '../../../../services/tipos_documentos.service';
import { BodegasService } from '../../../../services/bodegas.service';
import { AppComponent } from '../../../../app.component';

declare var $: any

@Component({
  selector: 'app-editar-documento',
  standalone: false,
  templateUrl: './editar-documento.component.html',
  styleUrl: './editar-documento.component.css'
})
export class EditarDocumentoComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  @Input() documento_id: any;
  loading: boolean = false;

  tipos_documentos: any = [];
  sucursales: any = [];
  bodegas: any = [];
  usuarios: any = [];
  atributos: any = [];
  documentos_fotos: any = [];

  documentoForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
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
    private alertas_service: AlertasService,
    private scripts_service: ScriptsService,
    private documentos_service: DocumentosService,
    private sucursales_service: SucursalesService,
    private bodegas_service: BodegasService,
    private usuarios_service: UsuariosService,
    private tipos_documentos_service: TiposDocumentosService,
  ) {
    this.scripts_service.inputfile();
  }

  async ngOnInit() {
    await this.getUsuarios();
    await this.getDocumento();
    await this.getTiposDocumentos();
    await this.getSucursales();
    this.scripts_service.lightbox();
  }

  async getDocumento() {
    let documento = await this.documentos_service.getDocumento(this.documento_id);
    if (documento.code) {
      this.documentoForm.patchValue(documento.data);
      if (documento.data.sucursal) {
        this.documentoForm.controls['sucursal_id'].setValue([documento.data.sucursal]);
      }
      if (documento.data.bodega) {
        this.documentoForm.controls['bodega_id'].setValue([documento.data.bodega]);
      }
      if (documento.data.usuario) {
        this.documentoForm.controls['usuario_id'].setValue([documento.data.usuario]);
      }
      if (documento.data.tipo_documento) {
        this.documentoForm.controls['tipo_documento_id'].setValue([documento.data.tipo_documento]);
      }
    }
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

  async putDocumento(alert: any = true) {
    this.loading = true;
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

    this.documentoForm.controls['tipo_documento_id'].setValue(this.documentoForm.controls['tipo_documento_id'].value[0].id);
    this.documentoForm.controls['usuario_id'].setValue(this.documentoForm.controls['usuario_id'].value[0].id);

    let documento = await this.documentos_service.putDocumento(this.documento_id, this.documentoForm.value);
    if (documento.code) {
      alert ? this.alertas_service.success(documento.mensaje) : null;
      await this.getDocumento();
    }
    this.loading = false;
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

