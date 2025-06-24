import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModMaterialImportModule } from './mod-material-import/mod-material-import.module';
import { ModCommonsModule, SpinnerInterceptor, ErrorInterceptor } from './mod-commons/mod-commons.module';
import { ModSessionModule } from './mod-session/session.module';
import { EnsureCookiesInterceptor } from './mod-commons/mod-commons.module';

import { InitComponent } from './init/init.component';
import { LicencesComponent } from './licences/licences.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    InitComponent,
    LicencesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ModMaterialImportModule,
    ModCommonsModule,
    ModSessionModule,
  ],
  exports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ModCommonsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EnsureCookiesInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, 
      useValue: 'de-DE' 
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
