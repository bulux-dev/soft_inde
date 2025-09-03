import { Component } from '@angular/core';
import { DocumentosService } from '../../../services/documentos.service';
import { AlertasService } from '../../../services/alertas.service';
import { ScriptsService } from '../../../services/scripts.service';
import { FormControl, FormGroup } from '@angular/forms';
import { TiposDocumentosService } from '../../../services/tipos_documentos.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { SucursalesService } from '../../../services/sucursales.service';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-documentos',
  standalone: false,
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css'
})
export class DocumentosComponent {

  get selectS() {
    return AppComponent.selectS;
  }

  tipos_documentos: any = [];
  sucursales: any = [];
  usuarios: any = [];

  documentos: any = [];
  filtros: FormGroup = new FormGroup({
    nombre: new FormControl(null),
    serie: new FormControl(null),
    correlativo: new FormControl(null),
    sucursal_id: new FormControl(null),
    usuario_id: new FormControl(null),
    tipo_documento_id: new FormControl(null),
  })

  constructor(
    private scripts_service: ScriptsService,
    private alertas_service: AlertasService,
    private documentos_service: DocumentosService,
    private tipos_documentos_service: TiposDocumentosService,
    private sucursales_service: SucursalesService,
    private usuarios_service: UsuariosService
  ) {

  }

  async ngOnInit() {
    await this.getDocumentos();
    await this.getTiposDocumentos();
    await this.getSucursales();
    await this.getUsuarios();
    this.scripts_service.datatable();
  }

  async getTiposDocumentos() {
    let tipos_documentos = await this.tipos_documentos_service.getTiposDocumentos();
    this.tipos_documentos = tipos_documentos.data;
  }

  async getSucursales() {
    let sucursales = await this.sucursales_service.getSucursales();
    this.sucursales = sucursales.data;
  }

  async getUsuarios() {
    let usuarios = await this.usuarios_service.getUsuarios();
    this.usuarios = usuarios.data;
  }

  async getDocumentos() {
    let documentos = await this.documentos_service.getDocumentos(this.filtros.value);
    this.documentos = documentos.data;
  }

  async deleteDocumento(c: any) {
    this.alertas_service.eliminar().then(async (result: any) => {
      if (result.isConfirmed) {
        let documento = await this.documentos_service.deleteDocumento(c.id);
        if (documento.code) {
          this.documentos.splice(this.documentos.indexOf(c), 1);
          this.alertas_service.success(documento.mensaje);
        }
      }
    });
  }

}

