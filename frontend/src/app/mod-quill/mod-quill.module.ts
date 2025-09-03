import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuillAddClassModule } from './modules/add-class-module';
import { RichTextEditorComponent } from './components/rich-text-editor/rich-text-editor.component';
export { QuillAddClassModule };

@NgModule({
  declarations: [
    RichTextEditorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RichTextEditorComponent
  ]
})
export class ModQuillModule { }
