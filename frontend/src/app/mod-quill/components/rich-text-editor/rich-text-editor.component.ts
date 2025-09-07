import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

import Quill, { Delta } from 'quill';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: RichTextEditorComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: RichTextEditorComponent
    }
  ]
})
export class RichTextEditorComponent implements AfterViewInit, ControlValueAccessor, Validator {

  private quill: Quill | null = null;

  /**
   * 
   */
  ngAfterViewInit(): void {
    this.setupQuillEditor();
  }

  /**
   * 
   */
  private setupQuillEditor() {

    this.quill = new Quill('#quillHost', {
      theme: 'snow',
      placeholder: 'Beschreibung...',
      modules: {
        toolbar: '#quillToolbar'
      }
    });

    this.quill.on('text-change', (newContent: Delta, oldContent: Delta, source: string) => {

      if (source === 'user') {
        this.onChange(this.quill!.getSemanticHTML().replaceAll('&nbsp;', ' '));
      }
    })
  }

  /**
   * Setze den Content des Editors.
   * 
   * Wir brauchen dafür ein Delta und das lässt sich am einfachsten
   * über den clipboard-callback des QuillEditors erzeugen. Klingt
   * komisch, ist aber so.
   * 
   * @param val 
   */
  private setEditorContent(val: string) {

    if (this.quill) {
      const delta = this.quill.clipboard.convert({ html: val });
      this.quill.setContents(delta);
    }
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* ControlValueAccessor (Forms-Integration)                                */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  writeValue(content: string): void {

    this.setEditorContent(content);
  }

  /**
   * Default-Impl von onChange. Sie wird überschrieben, wenn registerOnChange
   * aufgerufen wird. Die DefaultImpl sorgt aber dafür, dass wir nicht ständig
   * prüfen müssen ob ein onChange-Listener gesetzt ist
   * 
   * @param content 
   */
  private onChange = (content: string) => { 

  }

  /**
   * Implementiert das ControlValueAccessor-Interface zur Registrierung von 
   * onChange-Callbacks
   * 
   * @param callBack 
   */
  registerOnChange(callBack: any): void {

    this.onChange = callBack;
  }

  /**
   * Default-Impl von onTouched. Sie wird überschrieben, wenn registerOnTouched
   * aufgerufen wird. Die DefaultImpl sorgt aber dafür, dass wir nicht ständig
   * prüfen müssen ob ein onTouched-Listener gesetzt ist
   * 
   * @param content 
   */
  private onTouched = () => { 

  }

  /**
   * Implementiert das ControlValueAccessor-Interface zur Registrierung von 
   * onTouched-Callbacks
   * 
   * @param callBack 
   */
  registerOnTouched(callBack: any): void {
    this.onTouched = callBack;
  }

  setDisabledState?(isDisabled: boolean): void {
 
    if(this.quill) {
      this.quill.enable(!isDisabled);
    }
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* Validator (Forms-Integration)                                           */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Wir haben keine eigenen Validatoren, die Standard-Validatoren (required)
   * sollten reichen
   * 
   * @param control 
   * @returns 
   */
  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  private _validatorChangeCallback = () => { };
  registerOnValidatorChange?(callBack: () => void): void {
    this._validatorChangeCallback = callBack;
  }

}
