import { Component } from '@angular/core';
import { AlertasService } from '../../../../services/alertas.service';
import { BancosService } from '../../../../services/bancos.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ScriptsService } from '../../../../services/scripts.service';

@Component({
  selector: 'app-agregar-banco',
  standalone: false,
  templateUrl: './agregar-banco.component.html',
  styleUrl: './agregar-banco.component.css'
})
export class AgregarBancoComponent {

  loading: boolean = false;

  bancoForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    siglas: new FormControl(null, [Validators.required])
  });

  constructor(
    private location: Location,
    private alertas_service: AlertasService,
    private bancos_service: BancosService,
    private scripts_service: ScriptsService
  ) {
  }

  async ngOnInit() {
    this.scripts_service.inputfile();
    this.scripts_service.mask();
  }

  async postBanco() {
    this.loading = true;
    let banco = await this.bancos_service.postBanco(this.bancoForm.value);
    if (banco.code) {
      this.alertas_service.success(banco.mensaje);
      this.location.back();
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

