import { Component, Input } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { BancosService } from '../../../../services/bancos.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScriptsService } from '../../../../services/scripts.service';

@Component({
  selector: 'app-editar-banco',
  standalone: false,
  templateUrl: './editar-banco.component.html',
  styleUrl: './editar-banco.component.css'
})
export class EditarBancoComponent {

  @Input() banco_id: any;
  loading: boolean = false;

  bancoForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    siglas: new FormControl(null, [Validators.required])
  });

  constructor(
    private alertas_service: AlertasService,
    private bancos_service: BancosService,
    private scripts_service: ScriptsService
  ) {
    this.scripts_service.inputfile();
  }

  async ngOnInit() {
    let banco = await this.bancos_service.getBanco(this.banco_id);
    if (banco.code) {
      this.bancoForm.patchValue(banco.data);
    }
    this.scripts_service.mask();
  }
  
  async putBanco() {
    this.loading = true;
    let banco = await this.bancos_service.putBanco(this.banco_id, this.bancoForm.value);
    if (banco.code) {
      this.alertas_service.success(banco.mensaje);
    }
    this.loading = false;
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.bancoForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

  removeImage(imagen: any) {
    this.bancoForm.controls[`${imagen}`].setValue(null);
  }

}

