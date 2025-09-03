import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MonedaPipe } from '../utils/moneda.pipe';
import { FechaPipe } from '../utils/fecha.pipe';
import { HacePipe } from '../utils/hace.pipe';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

import { HomeComponent } from './home.component';
import { InicioComponent } from './inicio/inicio.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { TiendaComponent } from './tienda/tienda.component';
import { BlogComponent } from './blog/blog.component';
import { ContactoComponent } from './contacto/contacto.component';

let routes: Routes = [
  {
    path: '', title: 'Home', component: HomeComponent,
    children: [
      {
        path: '', title: 'Inicio', component: InicioComponent
      },
      {
        path: 'nosotros', title: 'Nosotros', component: NosotrosComponent
      },
      {
        path: 'tienda', title: 'Tienda', component: TiendaComponent
      },
      {
        path: 'blog', title: 'Blog', component: BlogComponent
      },
      {
        path: 'contacto', title: 'Contacto', component: ContactoComponent
      },
      {
        path: '**', redirectTo: 'perfil', pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  declarations: [
    HomeComponent,
    InicioComponent,
    NosotrosComponent,
    TiendaComponent,
    BlogComponent,
    ContactoComponent
  ],
  imports: [
    CommonModule,
    MonedaPipe,
    FechaPipe,
    HacePipe,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgMultiSelectDropDownModule,
    NgxUiLoaderModule
  ]
})
export class HomeModule { }
