import { Component } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { ProveedoresService } from '../../../../services/proveedores.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ScriptsService } from '../../../../services/scripts.service';

@Component({
  selector: 'app-agregar-proveedor',
  standalone: false,
  templateUrl: './agregar-proveedor.component.html',
  styleUrl: './agregar-proveedor.component.css'
})
export class AgregarProveedorComponent {

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
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private proveedores_service: ProveedoresService,
    private scripts_service: ScriptsService
  ) {
  }

  async ngOnInit() {
    this.scripts_service.inputfile();
    this.scripts_service.mask();
  }

  async postProveedor() {
    this.loading = true;
    let proveedor = await this.proveedores_service.postProveedor(this.proveedorForm.value);
    if (proveedor.code) {
      this.alertas_service.success(proveedor.mensaje);
      this.location.back();
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


