import { Injectable } from '@angular/core';
import { RRule, RRuleSet } from 'rrule';

/**
 * Delta-Objekte werden beim verschieben/resizen eines events benötigt
 */
export interface IDelta {
  days: number,
  months: number,
  years: number,
  milliseconds: number
}

@Injectable({
  providedIn: 'root'
})
export class RecurringRulsesetService {

  /**
   * 
   * @param rruleSet 
   * @param delta 
   * @returns 
   */
  public adjustRRuleSet(rruleSet: RRuleSet, delta: IDelta): RRuleSet {

    if (rruleSet) {

      const result = new RRuleSet(true);
      
      const rrules = rruleSet.rrules().map(rule => this.adjustRRule(rule, delta));
      rrules.forEach(rule => {
        result.rrule(rule);
      })
      
      const rdates = rruleSet.rdates().map(date => this.applyDateDelta(date, delta));
      rdates.forEach(date => {
        result.rdate(date);
      })
      
      const exrules = rruleSet.exrules().map(rule => this.adjustRRule(rule, delta));
      exrules.forEach(rule => {
        result.exrule(rule);
      })  
      
      const exdates = rruleSet.exdates().map(date => this.applyDateDelta(date, delta));
      exdates.forEach(date => {
        result.exdate(date);
      })

      rruleSet = result;
    }
    return rruleSet;
  }

  /**
   * 
   * @param rule 
   * @param delta 
   */
  public adjustRRule(rule: RRule, delta: IDelta): any {

    const ruleOpts = rule.options;
    
    const resultOpts: any = {};
    resultOpts.dtstart = this.applyDateDelta(ruleOpts.dtstart, delta);
    resultOpts.interval = ruleOpts.interval;

    resultOpts.freq = ruleOpts.freq;
    switch (ruleOpts.freq) {
      case RRule.WEEKLY:
        resultOpts.byweekday = ruleOpts.byweekday.map(day => this.adjustReference(day, delta.days, 0, 6))
        break;

      case RRule.MONTHLY:
        resultOpts.bymonthday = ruleOpts.bymonthday.map(day => this.adjustReference(day, delta.days, 1, 31));
        break;
    }

    if (ruleOpts.until) {
      resultOpts.until = this.applyDateDelta(ruleOpts.until, delta);
    }

    if (ruleOpts.count) {
      resultOpts.count = ruleOpts.count;
    }

    return new RRule(resultOpts, true);
  }

  /**
   * Passe ein Date-Object an einen durch das Delta definierten Offset an
   * 
   * @param date 
   * @param delta 
   * @returns 
   */
  public applyDateDelta(date: Date, delta: IDelta): Date {

    const result = new Date(date);
    result.setFullYear(result.getFullYear() + delta.years);
    result.setDate(result.getDate() + delta.days);
    result.setMonth(result.getMonth() + delta.months);
    result.setMilliseconds(result.getMilliseconds() + delta.milliseconds);
    return result;
  }

  /**
   * 
   * @param val 
   * @param delta 
   * @param rangeStart 
   * @param rangeEnd 
   * @returns 
   */
  private adjustReference(val: number, delta: number, rangeStart: number, rangeEnd: number): number {

    let result = val;
    if (delta) {

      result += delta;
      // noch in den Range [start,end] verschieben
      const rangeLen = (rangeEnd - rangeStart) + 1;
      if (delta > 0) {
        result = rangeStart + (result % rangeLen);
      }
      else {
        while(result < rangeStart) { result += rangeLen}
      }
    }
    return result;
  }
}
