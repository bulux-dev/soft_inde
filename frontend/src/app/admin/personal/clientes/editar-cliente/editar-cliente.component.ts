import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { ClientesService } from '../../../../services/clientes.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScriptsService } from '../../../../services/scripts.service';
import { SaldosService } from '../../../../services/saldos.service';

@Component({
  selector: 'app-editar-cliente',
  standalone: false,
  templateUrl: './editar-cliente.component.html',
  styleUrl: './editar-cliente.component.css'
})
export class EditarClienteComponent {

  @Input() cliente_id: any;
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
    private alertas_service: AlertasService,
    private clientes_service: ClientesService,
    private scripts_service: ScriptsService
  ) {
    this.scripts_service.inputfile();
  }

  async ngOnInit() {
    let cliente = await this.clientes_service.getCliente(this.cliente_id);
    if (cliente.code) {
      this.clienteForm.patchValue(cliente.data);
      this.scripts_service.mask();
    }
  }
  
  async putCliente() {
    this.loading = true;
    let cliente = await this.clientes_service.putCliente(this.cliente_id, this.clienteForm.value);
    if (cliente.code) {
      this.alertas_service.success(cliente.mensaje);      
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

