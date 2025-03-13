import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModMaterialImportModule } from '../mod-material-import/mod-material-import.module';

import { TitlebarService } from './services/titlebar.service';
export { TitlebarService };

import { BackendRoutingService } from './services/backend-routing.service';
export { BackendRoutingService }

import { SpinnerService } from './services/spinner.service';
export { SpinnerService }

import { InputBoxService } from './services/input-box.service';
export { InputBoxService }

import { MessageBoxService } from './services/message-box.service';
export { MessageBoxService }

import { CryptoService } from './services/crypto.service';
export { CryptoService }

import { SaveBlobService } from './services/save-blob.service';
export { SaveBlobService }

import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
export { SpinnerInterceptor }

import { ErrorInterceptor } from './interceptors/error.interceptor';
export { ErrorInterceptor }

import { EnsureCookiesInterceptor } from './interceptors/ensure-cookies.interceptor';
export { EnsureCookiesInterceptor }

import { ToolbarComponent, ToolbarSeparatorComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SafePipe } from './pipes/safe.pipe';
import { FileSizePipe } from './pipes/file-size.pipe';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MessageBoxComponent } from './components/message-box/message-box.component';
import { InputBoxComponent } from './components/input-box/input-box.component';
import { FormsModule } from '@angular/forms';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { HintComponent } from './components/hint/hint.component';

@NgModule({
  declarations: [
    ToolbarComponent,
    ToolbarSeparatorComponent,
    FooterComponent,
    FileSizePipe,
    SafePipe,
    SpinnerComponent,
    MessageBoxComponent,
    InputBoxComponent,
    AutoFocusDirective,
    HintComponent,
  ],
  imports: [
    CommonModule,
    ModMaterialImportModule,
    FormsModule
  ],
  exports: [
    ToolbarComponent,
    ToolbarSeparatorComponent,
    FooterComponent,
    SpinnerComponent,
    HintComponent,
    FileSizePipe,
    SafePipe,
    AutoFocusDirective,
  ]
})
export class ModCommonsModule { }
