import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { RecuperarComponent } from './recuperar/recuperar.component';

export const routes: Routes = [
  {
    path: '', title: 'Login', component: LoginComponent
  },
  {
    path: 'login', title: 'Login', component: LoginComponent
  },
  {
    path: 'registro', title: 'Registrarse', component: RegistroComponent
  },
  {
    path: 'recuperar', title: 'Recuperar Cuenta', component: RecuperarComponent
  },
  {
    path: 'admin', title: 'Admin', loadChildren: () => import(`./admin/admin.module`).then(m => m.AdminModule),
  },
  {
    path: '**', redirectTo: 'login', pathMatch: 'full'
  }
];
