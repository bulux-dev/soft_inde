import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { ProveedoresService } from '../../../../services/proveedores.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ScriptsService } from '../../../../services/scripts.service';

@Component({
  selector: 'app-editar-proveedor',
  standalone: false,
  templateUrl: './editar-proveedor.component.html',
  styleUrl: './editar-proveedor.component.css'
})
export class EditarProveedorComponent {

  @Input() proveedor_id: any;
  loading: boolean = false;

  proveedorForm: FormGroup = new FormGroup({
    logo: new FormControl(null),
    nombre: new FormControl(null, [Validators.required]),
    nit: new FormControl(null),
    cui: new FormControl(null),
    direccion: new FormControl(null),
    contacto: new FormControl(null),
    telefono: new FormControl(null),
    correo: new FormControl(null),
    dias_credito: new FormControl(null),
    pequeno_contribuyente: new FormControl(null),
    tarjeta_credito: new FormControl(null),
  });

  constructor(
    private alertas_service: AlertasService,
    private proveedores_service: ProveedoresService,
    private scripts_service: ScriptsService
  ) {
    this.scripts_service.inputfile();
  }

  async ngOnInit() {
    let proveedor = await this.proveedores_service.getProveedor(this.proveedor_id);
    if (proveedor.code) {
      this.proveedorForm.patchValue(proveedor.data);
      this.scripts_service.mask();
    }
  }
  
  async putProveedor() {
    this.loading = true;
    let proveedor = await this.proveedores_service.putProveedor(this.proveedor_id, this.proveedorForm.value);
    if (proveedor.code) {
      this.alertas_service.success(proveedor.mensaje);
    }
    this.loading = false;
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.proveedorForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

  removeImage(imagen: any) {
    this.proveedorForm.controls[`${imagen}`].setValue(null);
  }

}

