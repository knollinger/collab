import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitComponent } from './init/init.component';
import { LicencesComponent } from './licences/licences.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'init',
    component: InitComponent,
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./mod-dashboard/mod-dashboard.module').then(mod => mod.ModDashboardModule)
  },
  {
    path: 'licences',
    component: LicencesComponent,
  },
  {
    path: 'files',
    loadChildren: () => import('./mod-files/mod-files.module').then(mod => mod.ModFilesModule)
  },
  {
    path: 'viewer',
    loadChildren: () => import('./mod-files-viewer/mod-files-viewer.module').then(mod => mod.ModFilesViewerModule)
  },
  
  {
    path: 'calendar',
    loadChildren: () => import('./mod-calendar/mod-calendar.module').then(mod => mod.ModCalendarModule)
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
  },
  {
    path: 'search',
    loadChildren: () => import('./mod-search/mod-search.module').then(mod => mod.ModSearchModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
