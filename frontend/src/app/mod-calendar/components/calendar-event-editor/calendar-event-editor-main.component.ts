import { AfterViewInit, Component, DestroyRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import * as moment from 'moment';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import Quill, { Delta } from 'quill';

import { CalendarEventCore } from '../../models/calendar-event-core';
import { CalendarCategoriesService } from '../../services/calendar-categories.service';
import { CalendarEventCategory } from '../../models/calendat-event-category';

@Component({
  selector: 'app-calendar-event-editor-main',
  templateUrl: './calendar-event-editor-main.component.html',
  styleUrls: ['./calendar-event-editor-main.component.css'],
  standalone: false
})
export class CalendarEventEditorMainComponent implements AfterViewInit {

  private destroyRef = inject(DestroyRef);
  private _event: CalendarEventCore = CalendarEventCore.empty();
  private quill: Quill | null = null;

  eventForm: FormGroup;

  @Output()
  valid: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  categories: CalendarEventCategory[] = new Array<CalendarEventCategory>();

  /**
   * 
   * @param formBuilder 
   */
  constructor(formBuilder: FormBuilder,
    catSvc: CalendarCategoriesService) {

    catSvc.getAllCategories().subscribe(cats => this.categories = cats);

    this.eventForm = formBuilder.group({
      title: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      fullDay: new FormControl(false),
      private: new FormControl(false),
      startDate: new FormControl('', Validators.required),
      startTime: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      endTime: new FormControl('', Validators.required),

    });
    this.fillForm();
    this.eventForm.markAllAsTouched();
  }

  /**
   * 
   */
  @Input()
  set event(event: CalendarEventCore) {
    this._event = event;
    this.fillForm();
  }

  /**
   * 
   */
  get event(): CalendarEventCore {
    return this._event;
  }

  /**
   * 
   */
  private fillForm() {

    const val = {
      title: this.event.title,
      category: this.event.category,
      fullDay: this.event.fullDay,
      private: false,
      startDate: this.event.start,
      startTime: this.getTimeString(this.event.start),
      endDate: this.event.end,
      endTime: this.getTimeString(this.event.end)
    };
    this.eventForm.setValue(val);
  }

  /**
   * Den Quill-Editor können wir erst initialisieren, wenn die View
   * gerendert ist. Anderenfalls findet er seine Host-Div nicht und
   * wirft eine unschöne Exception.
   */
  ngAfterViewInit() {

    this.setupQuillEditor();

    this.eventForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(val => {
        this.onFormChange();
      })
    this.valid.emit(this.eventForm.valid);
  }

  /**
   * 
   * wir wollen die Description als HTML setzen. Dazu brazúchen wir
   * ein Quill.Delta, welches die HTML-Styles beinhaltet.
   * Komischerweise gibt es keinen Delta-Konstruktor "fromHTML"
   * 
   * Es gibt aber den Umweg über das Quill-Clipboard. Dabei wird nichts 
   * wirklich in das Clipboard kopiert, hier gibts halt die passende
   * convert-Methode. Das Delta muss die Hölle sein...
   *
   */
  private setupQuillEditor() {

    this.quill = new Quill('#quillHost', {
      theme: 'snow',
      placeholder: 'ausführliche Beschreibung...',
      modules: {
        toolbar: '#quillToolbar'
      }
    });

    const delta = this.quill.clipboard.convert({ html: this.event.desc })
    this.quill.setContents(delta);

    this.quill.on('text-change', (newContent: Delta, oldContent: Delta, source: string) => {

      if (source === 'user') {
        this.onFormChange();
      }
    })
  }

  /**
   * 
   */
  get isFullDay(): boolean {
    return this.eventForm.get('fullDay')?.value;
  }

  /**
   * 
   * @param evt 
   */
  onFullDateChange(evt: MatSlideToggleChange) {

    const validator = evt.checked ? null : Validators.required;
    this.setValidatorFor('startTime', validator);
    this.setValidatorFor('endTime', validator);
  }

  /**
   * 
   * @param elemName 
   * @param fn 
   */
  private setValidatorFor(elemName: string, fn: ValidatorFn | ValidatorFn[] | null) {

    const ctrl = this.eventForm.get(elemName);
    if (ctrl) {
      ctrl.setValidators(fn);
      ctrl.updateValueAndValidity();
      this.eventForm.updateValueAndValidity();
      this.eventForm.markAllAsTouched();
    }
  }

  /**
   * 
   */
  onFormChange() {

    const val = this.eventForm.value;
    this.event.title = val.title;

    this.event.start = this.composeDatetime(val.startDate, val.startTime);
    this.event.end = this.composeDatetime(val.endDate, val.endTime);
    this.event.category = val.category;
    this.event.fullDay = val.fullDay;
    this.event.desc = this.quill?.getSemanticHTML() || '';
    this.valid.emit(this.eventForm.valid);
  }

  /**
   * 
   * @param date 
   * @param timeStr 
   * @returns 
   */
  private composeDatetime(date: Date | string, timeStr: string): Date {

    const result = new Date(date);
    const time = this.parseTimeString(timeStr);

    result.setHours(time.getHours());
    result.setMinutes(time.getMinutes());
    result.setSeconds(0);
    return result;
  }

  /**
   * 
   * @param date 
   * @returns 
   */
  private getTimeString(date: Date): string {
    return moment(date).format('HH:mm');
  }

  /**
   * 
   * @param time 
   * @returns 
   */
  private parseTimeString(time: string): Date {

    let result: Date | null = null;

    const parts = time.split(':');
    if (parts.length === 2) {

      const hours = Number.parseInt(parts[0]);
      const minutes = Number.parseInt(parts[1]);
      result = new Date(0, 0, 0, hours, minutes, 0, 0);
    }
    else {
      result = new Date(0, 0, 0, 0, 0, 0, 0);
    }
    return result;
  }


  /**
   * 
   * @param elemName 
   * @param errName 
   * @returns 
   */
  hasError(elemName: string, errName: string): boolean {

    let result = false;

    const elem = this.eventForm.get(elemName);
    if (elem) {
      result = elem.hasError(errName);
    }
    return result;
  }
}
