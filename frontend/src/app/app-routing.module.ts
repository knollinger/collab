import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'session',
    loadChildren: () => import('./mod-session/session.module').then(mod => mod.ModSessionModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./mod-user/mod-user.module').then(mod => mod.ModUserModule)
  },
  {
    path: 'files',
    loadChildren: () => import('./mod-files/mod-files.module').then(mod => mod.ModFilesModule)
  },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
