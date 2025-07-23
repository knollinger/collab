import { AfterViewInit, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { Frequency, RRule, RRuleSet, Weekday, ALL_WEEKDAYS } from 'rrule';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CalendarEvent } from '../../models/calendar-event';

/**
 * ValidatorFn welche sicher stellt das wenigstens eine der 
 * multi-options ausgewählt ist
 * 
 * @param control 
 * @returns 
 */
function checkMultiSelectNotEmpty(control: AbstractControl) {

  let errors = {};
  if (!control.value || !control.value.length) {

    const errors = {
      required: true
    }
    control.setErrors(errors);
    return errors;
  }
  return null;
}

@Component({
  selector: 'app-calendar-event-editor-recurring',
  templateUrl: './calendar-event-editor-recurring.component.html',
  styleUrls: ['./calendar-event-editor-recurring.component.css'],
  standalone: false
})
export class CalendarEventEditorRecurringComponent implements AfterViewInit {

  private static FREQ_TO_RRULE_FREQ: Map<string, Frequency> = new Map<string, Frequency>(
    [
      ['DAILY', RRule.DAILY],
      ['WEEKLY', RRule.WEEKLY],
      ['MONTHLY', RRule.MONTHLY],
      ['YEARLY', RRule.YEARLY],
    ]
  );

  private static WEEKDAYS_TO_RRULE_WEEKDAYS: Map<string, Weekday> = new Map<string, Weekday>(
    [
      ['MON', RRule.MO],
      ['THU', RRule.TU],
      ['WED', RRule.WE],
      ['THU', RRule.TH],
      ['FRI', RRule.FR],
      ['SAT', RRule.SA],
      ['SON', RRule.SU]
    ]
  );

  daysOfWeek = [
    { value: RRule.MO.weekday, label: 'Montag' },
    { value: RRule.TU.weekday, label: 'Dienstag' },
    { value: RRule.WE.weekday, label: 'Mittwoch' },
    { value: RRule.TH.weekday, label: 'Donnerstag' },
    { value: RRule.FR.weekday, label: 'Freitag' },
    { value: RRule.SA.weekday, label: 'Samstag' },
    { value: RRule.SU.weekday, label: 'Sonntag' },
  ];

  private destroyRef = inject(DestroyRef);

  recurringForm: FormGroup;
  daysOfMonth: number[];
  isRecurring: boolean = false;

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /*  all about the CalendarEvent                                            */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * 
   */
  @Input()
  set event(evt: CalendarEvent) {

    this._event = evt;
    this.formDataFromRRuleSet();

    this.event.startChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        this.rruleSetFromFormData();
      });

  }

  /**
   * 
   */
  get event(): CalendarEvent {
    return this._event;
  }
  private _event: CalendarEvent = CalendarEvent.empty();


  @Output()
  valid: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  all: Date[] = new Array<Date>();

  /**
   * 
   * @param formBuilder 
   */
  constructor(
    formBuilder: FormBuilder) {

    this.daysOfMonth = this.initializeDaysOfMonth();

    this.recurringForm = formBuilder.group({
      interval: new FormControl(1, Validators.required),
      repeatFreq: new FormControl('', Validators.required),
      weekDays: new FormControl(''),
      monthDays: new FormControl(''),
      repMode: new FormControl('', Validators.required),
      repUntil: new FormControl(''),
      repCount: new FormControl(2, [Validators.required, Validators.min(2)])
    });

    this.recurringForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(val => {
        this.onFormChange();
      })
  }

  /**
   * 
   * @returns 
   */
  private initializeDaysOfMonth(): number[] {

    const result = new Array<number>(31);
    for (let i = 1; i < 32; ++i) {
      result[i - 1] = i;
    }
    return result;
  }

  /**
   * 
   */
  ngAfterViewInit() {

    this.isRecurring = this.event.rruleSet !== null;
    this.formDataFromRRuleSet();
    console.log(this.event);
  }

  /**
   * 
   * @param evt 
   */
  onChangeRecurring(evt: MatSlideToggleChange) {

    this.isRecurring = evt.checked;
    this.onFormChange();
  }

  /**
   * Änderungen am Formular sind aufgetretem. Wenn das Formular valide ist,
   * so generiere das RRuleSet neu.
   */
  onFormChange() {

    let valid: boolean = true;
    if (this.isRecurring) {

      valid = this.recurringForm.valid;
      this.recurringForm.markAllAsTouched();
      if (valid) {
        this.rruleSetFromFormData();
      }
      else {
        this.all = [];
      }
    }
    this.valid.emit(valid);
  }

  onFrequenceChange(val: string) {

    switch (val) {
      case 'DAILY':
      case 'YEARLY':
        this.setValidatorFor('weekDays', null);
        this.setValidatorFor('monthDays', null);
        break;

      case 'WEEKLY':
        this.setValidatorFor('weekDays', checkMultiSelectNotEmpty);
        this.setValidatorFor('monthDays', null);
        break;

      case 'MONTHLY':
        this.setValidatorFor('monthDays', checkMultiSelectNotEmpty);
        this.setValidatorFor('weekDays', null);
        break;
    }
  }

  /**
   * 
   * @param val 
   */
  onRepeatModeChange(val: string) {

    switch (val) {

      case 'REPEAT_INFINITE':
        this.setValidatorFor('repUntil', null);
        this.setValidatorFor('repCount', null);
        break;

      case 'REPEAT_UNTIL':
        this.setValidatorFor('repUntil', Validators.required);
        this.setValidatorFor('repCount', null);
        break;

      case 'REPEAT_N_TIMES':
        this.setValidatorFor('repUntil', null);
        this.setValidatorFor('repCount', [Validators.required, Validators.min(2)]);
        break;
    }
  }

  /**
   * 
   * @param elemName 
   * @param fn 
   */
  private setValidatorFor(elemName: string, fn: ValidatorFn | ValidatorFn[] | null) {

    const ctrl = this.recurringForm.get(elemName);
    if (ctrl) {
      ctrl.setValidators(fn);
      ctrl.updateValueAndValidity();
      this.recurringForm.updateValueAndValidity();
      this.recurringForm.markAllAsTouched();
    }
  }

  /**
   * 
   */
  formDataFromRRuleSet() {

    let valid = true;
    const ruleSet = this.event.rruleSet;
    if (!ruleSet || ruleSet.rrules().length === 0) {
      this.isRecurring = false;
    }
    else {

      const rule = (ruleSet.rrules() as RRule[])[0];
      const ruleOpts = rule!.options;

      const val: any = {
        weekDays: null,
        monthDays: null
      };
      val.interval = ruleOpts.interval;

      switch (ruleOpts.freq) {
        case RRule.DAILY:
          val.repeatFreq = 'DAILY';
          break;

        case RRule.WEEKLY:
          val.repeatFreq = 'WEEKLY';
          val.weekDays = ruleOpts.byweekday;
          break;

        case RRule.MONTHLY:
          val.repeatFreq = 'MONTHLY';
          val.monthDays = ruleOpts.bymonthday;
          break;

        case RRule.YEARLY:
          val.repeatFreq = 'YEARLY';
          break;
      }

      val.repMode = this.extractRepeatMode(ruleOpts);
      val.repCount = ruleOpts.count;
      val.repUntil = ruleOpts.until;

      this.recurringForm.setValue(val);
      this.recurringForm.updateValueAndValidity();
      valid = this.recurringForm.valid;
      this.isRecurring = true;
    }
    this.valid.emit(valid);
  }

  /**
   * 
   * @param ruleOpts 
   * @returns 
   */
  private extractRepeatMode(ruleOpts: any): string {

    let mode = 'REPEAT_INFINITE';

    if (ruleOpts.until) {
      mode = 'REPEAT_UNTIL';
    }
    else {
      if (ruleOpts.count) {
        mode = 'REPEAT_N_TIMES';
      }
    }

    return mode;

  }

  /**
   * 
   */
  rruleSetFromFormData() {


    if (this.recurringForm.valid) {

      const formValue = this.recurringForm.value;
      let options: any = {};
      options.dtstart = new Date(this.event.start);

      options.freq = CalendarEventEditorRecurringComponent.FREQ_TO_RRULE_FREQ.get(formValue.repeatFreq);
      options.interval = formValue.interval;

      switch (options.freq) {
        case RRule.WEEKLY:
          options.byweekday = formValue.weekDays;
          break;

        case RRule.MONTHLY:
          options.bymonthday = formValue.monthDays;
          break;
      }

      switch (formValue.repMode) {
        case 'REPEAT_INFINITE':
          break;

        case 'REPEAT_UNTIL':
          options.until = Date.parse(formValue.repUntil);
          break;

        case 'REPEAT_N_TIMES':
          options.count = formValue.repCount;
          break;
      }

      const rule = new RRule(options, true);
      const ruleSet = new RRuleSet(true);
      ruleSet.rrule(rule);
      this.event.rruleSet = ruleSet;
      this.all = ruleSet.all((date: Date, nr: number) => {
        return (nr > 100) ? false : true;
      });
    }
  }

  /**
   * 
   * @param date 
   */
  addExcludeRule(date: Date) {

    const ruleSet = this.event.rruleSet;
    if (ruleSet) {
      ruleSet.exdate(date);
      this.event.rruleSet = ruleSet;
      this.all = ruleSet.all((date: Date, nr: number) => {
        return (nr > 100) ? false : true;
      });
    }
  }

  /**
   * 
   * @param elemName 
   * @param errName 
   * @returns 
   */
  hasError(elemName: string, errName: string): boolean {

    let result = false;

    const elem = this.recurringForm.get(elemName);
    if (elem) {
      result = elem.hasError(errName);
    }
    return result;
  }
}
