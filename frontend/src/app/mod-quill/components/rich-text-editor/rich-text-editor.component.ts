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
export class RichTextEditorComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator {

  private quill: Quill | null = null;

  /**
   * 
   */
  ngOnInit(): void {
  }

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
        // this.contentChange.emit(newContent.)
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

  private _onChange = (content: string) => { }
  registerOnChange(callBack: any): void {

    this._onChange = callBack;
  }

  private _onTouched = () => { }
  registerOnTouched(callBack: any): void {
    this._onTouched = callBack;
  }

  setDisabledState?(isDisabled: boolean): void {
    //  throw new Error('Method not implemented.');
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
