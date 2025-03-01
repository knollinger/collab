import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SessionRequiredGuard } from './mod-session/session.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [SessionRequiredGuard],
  },
  {
    path: 'files',
    loadChildren: () => import('./mod-files/mod-files.module').then(mod => mod.ModFilesModule)
  },
  {
    path: 'pinboard',
    loadChildren: () => import('./mod-pinboard/mod-pinboard.module').then(mod => mod.ModPinboardModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./mod-user/mod-user.module').then(mod => mod.ModUserModule)
  },
  {
    path: 'session',
    loadChildren: () => import('./mod-session/session.module').then(mod => mod.ModSessionModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
