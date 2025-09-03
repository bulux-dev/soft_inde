import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoPresupuestoService {
  private estadoSubject = new BehaviorSubject('Pendiente');
  estado$ = this.estadoSubject.asObservable();

  setEstado(estado: string): void{
    this.estadoSubject.next(estado);
  }

}
