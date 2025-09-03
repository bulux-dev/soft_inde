import { Injectable } from '@angular/core';

declare var Swal: any;
declare var toastr: any;

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor() { }

  success(mensaje: string, onlyToastr: boolean = false) {
    if (!onlyToastr) {
      Swal.fire({
        title: "Transaccion Exitosa",
        text: mensaje,
        type: 'success',
        icon: 'success',
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: !1,
      });
    }
    toastr.success(mensaje, 'Transaccion Exitosa.', {
      closeButton: !0,
      tapToDismiss: true,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }

  error(mensaje: string, onlyToastr: boolean = false) {
    if (!onlyToastr) {
      Swal.fire({
        title: "Transaccion Incorrecta",
        text: mensaje,
        type: 'error',
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: !1,
      });
    }
    toastr.error(mensaje, 'Transaccion Incorrecta.', {
      closeButton: !0,
      tapToDismiss: true,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }

  warning(mensaje: string, onlyToastr: boolean = false) {
    if (!onlyToastr) {
      Swal.fire({
        title: "Aviso",
        text: mensaje,
        type: 'warning',
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: !1,
      });
    }
    toastr.warning(mensaje, 'Aviso.', {
      closeButton: !0,
      tapToDismiss: true,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }

  eliminar() {
    return Swal.fire({
      title: 'Cuidado',
      text: '¿Seguro que deseas eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonClass: "btn btn-primary",
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      footer: '<a href="#">Esta accion no se puede deshacer</a>'
    })
  }

  anular() {
    return Swal.fire({
      title: 'Cuidado',
      text: '¿Seguro que deseas anular?',
      icon: 'warning',
      input: "textarea",
      inputPlaceholder: "Motivo de anulacion...",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, anular',
      cancelButtonText: 'Cancelar',
    });

    // return Swal.fire({
    //   title: 'Cuidado',
    //   text: '¿Seguro que deseas anular?',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Si, anular',
    //   cancelButtonText: 'Cancelar',
    //   footer: "<a href>Esta accion no se puede deshacer</a>",
    // })
  }

  limpiar() {
    return Swal.fire({
      title: 'Cuidado',
      text: '¿Seguro que deseas limpiar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, limpiar',
      cancelButtonText: 'Cancelar',
      footer: "<a href>Esta accion no se puede deshacer</a>",
    })
  }

  combinar() {
    return Swal.fire({
      title: 'Cuidado',
      html: 'Se generaran multiples combinaciones <br> ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'Cancelar',
      footer: "<a href>Esta accion no se puede deshacer</a>",
    })
  }

  aprobado() {
    return Swal.fire({
      title: 'Cuidado',
      text: '¿Seguro que deseas aprobar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'Cancelar',
      footer: "<a href>Esta accion no se puede deshacer</a>",
    })
  }

  cerrar() {
    return Swal.fire({
      title: 'Cuidado',
      text: '¿Seguro que deseas cerrar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'Cancelar',
      footer: "<a href>Esta accion no se puede deshacer</a>",
    })
  }

  continuar() {
    return Swal.fire({
      title: 'Cuidado',
      text: '¿Seguro que deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'Cancelar',
      footer: "<a href>Esta accion no se puede deshacer</a>",
    })
  }

  static error2(mensaje: string, onlyToastr: boolean = false) {
    if (!onlyToastr) {
      Swal.fire({
        title: "Transaccion Incorrecta",
        text: mensaje,
        type: 'error',
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: !1,
      });
    }
    toastr.error(mensaje, 'Transaccion Incorrecta.', {
      closeButton: !0,
      tapToDismiss: true,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }

}
