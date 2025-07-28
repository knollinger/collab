import { AfterViewInit, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { Frequency, RRule, RRuleSet, Weekday, ALL_WEEKDAYS } from 'rrule';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CalendarEventCore } from '../../models/calendar-event-core';

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

  private static RRULE_FREQ_TO_FREQ: Map<Frequency, string> = new Map<Frequency, string>(
    [
      [RRule.DAILY, 'DAILY'],
      [RRule.WEEKLY, 'WEEKLY'],
      [RRule.MONTHLY, 'MONTHLY'],
      [RRule.YEARLY, 'YEARLY'],
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
  set event(evt: CalendarEventCore) {

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
  get event(): CalendarEventCore {
    return this._event;
  }
  private _event: CalendarEventCore = CalendarEventCore.empty();


  @Output()
  valid: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  all: Date[] = new Array<Date>();
  occurences: Set<number> = new Set<number>();
  exDates: Set<number> = new Set<number>();

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
    }
    
    this.calcOccurrences();
    this.valid.emit(valid);
  }

  /**
   * 
   * @param val 
   */
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
   * Parse das RuleSet und fülle die Properties des Formulars
   */
  private formDataFromRRuleSet() {

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
      val.repeatFreq = CalendarEventEditorRecurringComponent.RRULE_FREQ_TO_FREQ.get(ruleOpts.freq);
      val.weekDays = ruleOpts.byweekday;
      val.monthDays = ruleOpts.bymonthday;
      val.repMode = this.extractRepeatMode(ruleOpts);
      val.repCount = ruleOpts.count;
      val.repUntil = ruleOpts.until;
      this.calcOccurrences();

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
   * Erstelle ein neues Ruleset aus den Daten des Formulars
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

      const ruleSet = new RRuleSet(true);

      const rule = new RRule(options, true);
      ruleSet.rrule(rule);

      this.exDates.forEach(time => {
        ruleSet.exdate(new Date(time));
      })

      this.event.rruleSet = ruleSet;
    }
  }

  /**
   * 
   * @param date 
   */
  addExcludeDate(date: Date) {
    this.exDates.add(date.getTime());
    this.rruleSetFromFormData();
  }

  /**
   * 
   * @param date 
   */
  removeExcludeDate(date: Date) {
    this.exDates.delete(date.getTime());
    this.rruleSetFromFormData();
  }

  /**
   * 
   * @param date 
   * @returns 
   */
  isExcluded(date: Date) {
    return this.exDates.has(date.getTime())
  }

  /**
   * Berechne alle Occurences des RuleSets, jedoch max 100 Termine
   */
  private calcOccurrences() {

    const all: Array<Date> = new Array<Date>();
    this.occurences.clear();
    this.exDates.clear();
    
    if (this.event.rruleSet) {
      
      const occurences = this.event.rruleSet.all((date: Date, nr: number) => {
        return (nr > 100) ? false : true;
      });
      occurences.map(date => {
        all.push(date);
        this.occurences.add(date.getTime());
      })
      
      this.event.rruleSet.exdates().forEach(date => {
        all.push(date);
        this.exDates.add(date.getTime());
      });

      this.all = all.sort((d1, d2) => {
        return d1.getTime() - d2.getTime();
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
