import { Component } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { ClientesService } from '../../../../services/clientes.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ScriptsService } from '../../../../services/scripts.service';

@Component({
  selector: 'app-agregar-cliente',
  standalone: false,
  templateUrl: './agregar-cliente.component.html',
  styleUrl: './agregar-cliente.component.css'
})
export class AgregarClienteComponent {

  loading: boolean = false;

  clienteForm: FormGroup = new FormGroup({
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
    private clientes_service: ClientesService,
    private scripts_service: ScriptsService
  ) {
  }

  async ngOnInit() {
    this.scripts_service.inputfile();
    this.scripts_service.mask();
  }

  async postCliente() {
    this.loading = true;
    let cliente = await this.clientes_service.postCliente(this.clienteForm.value);
    if (cliente.code) {
      this.alertas_service.success(cliente.mensaje);
      this.location.back();
    }
    this.loading = false;
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.clienteForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

  removeImage(imagen: any) {
    this.clienteForm.controls[`${imagen}`].setValue(null);
  }
  
}


