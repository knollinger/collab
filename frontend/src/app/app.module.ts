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
import { ModSearchModule } from './mod-search/mod-search.module';
import { EnsureCookiesInterceptor } from './mod-commons/mod-commons.module';

import { HomeComponent } from './home/home.component';
import { InitComponent } from './init/init.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InitComponent,
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
    ModSearchModule
  ],
  exports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ModCommonsModule,
    ModSearchModule
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
