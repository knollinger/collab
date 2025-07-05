import { Component, Injectable, Type } from '@angular/core';

import { FilesWidgetComponent } from '../components/widgets/files-widget/files-widget.component';
import { CalendarWidgetComponent } from '../components/widgets/calendar-widget/calendar-widget.component';
import { ClockWidgetComponent } from '../components/widgets/clock-widget/clock-widget.component';


@Injectable({
  providedIn: 'root'
})
export class WidgetTypeRegistryService {

  /**
   * 
   */
  private nameToType = new Map<string, Type<unknown>>(
    [
      ['files', FilesWidgetComponent],
      ['calendar', CalendarWidgetComponent],
      ['clock', ClockWidgetComponent]
    ]
  );

  private typeToName: Map<Type<unknown>, string>;

  /**
   * Der ctor befüllt die typeToName-Map, indem er einfach die
   * nameToType-Map reverted.
   */
  constructor() {
      
    this.typeToName = new Map<Type<unknown>, string>;
    this.nameToType.forEach((type, name) => {
      this.typeToName.set(type, name);
    })
  }

  public getTypeByName(name: string): Type<unknown> | null {
    return this.nameToType.get(name) || null;
  }

  public getNameByType(type: Type<unknown>): string | null {
    return this.typeToName.get(type) || null;
  }
}
