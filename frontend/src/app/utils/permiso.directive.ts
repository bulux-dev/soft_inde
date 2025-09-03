import { Directive, ElementRef, Input } from '@angular/core';
import { AdminComponent } from '../admin/admin.component';

@Directive({
  selector: '[permiso]',
  standalone: true
})
export class PermisoDirective {

  @Input('permiso') permiso!: any;
  rol_id: any = localStorage.getItem('rol_id');
  usuario_id: any = localStorage.getItem('usuario_id');

  constructor(
    private elementRef: ElementRef
  ) { }

  async ngOnInit() {
    if (this.rol_id != 1) {

      let permisos_rol = AdminComponent.permisos_rol.filter((p: any) => p.accion_id > 0);;
      let permisos_usuario = AdminComponent.permisos_usuario.filter((p: any) => p.accion_id > 0);
      
      let pr = permisos_rol.find((p: any) => p.accion.slug == this.permiso);
      if (pr && pr.id) {
        
      } else {
        let pu = permisos_usuario.find((p: any) => p.accion.slug == this.permiso);
        if (pu && pu.id) {

        } else {
          this.elementRef.nativeElement.style.display = 'none';
        }
      }

    }
  }

}
