import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', title: '', loadChildren: () => import(`./home/home.module`).then(m => m.HomeModule),
  },
  {
    path: '**', redirectTo: '', pathMatch: 'full'
  }
];
