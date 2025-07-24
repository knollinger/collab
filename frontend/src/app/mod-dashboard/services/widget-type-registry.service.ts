import { Injectable, Type } from '@angular/core';

import { FilesWidgetComponent } from '../components/widgets/files-widget/files-widget.component';
import { CalendarWidgetComponent } from '../components/widgets/calendar-widget/calendar-widget.component';

interface IWidgets {
  desc: string,
  typeName: string,
  type: Type<unknown>
}

export interface IWidgetTypeAndDesc {
  typeName: string,
  desc: string
}

@Injectable({
  providedIn: 'root'
})
export class WidgetTypeRegistryService {

  private widgets: IWidgets[] = [
    {
      desc: 'Dateien',
      typeName: 'files',
      type: FilesWidgetComponent
    },
    {
      desc: 'Kalender',
      typeName: 'calendar',
      type: CalendarWidgetComponent
    },
  ]

  private nameToType: Map<string, Type<unknown>>;
  private typeToName: Map<Type<unknown>, string>;
  private typeToDesc: Array<IWidgetTypeAndDesc>;

  /**
   * 
   */
  constructor() {

    this.typeToDesc = new Array<IWidgetTypeAndDesc>();
    this.typeToName = new Map<Type<unknown>, string>();
    this.nameToType = new Map<string, Type<unknown>>();
    this.widgets.forEach(w => {
      this.typeToDesc.push({typeName: w.typeName, desc: w.desc});
      this.typeToName.set(w.type, w.typeName);
      this.nameToType.set(w.typeName, w.type);
    })
  }

  /**
   * 
   * @param name 
   * @returns 
   */
  public getTypeByName(name: string): Type<unknown> | null {
    return this.nameToType.get(name) || null;
  }

  /**
   * 
   * @param type 
   * @returns 
   */
  public getNameByType(type: Type<unknown>): string | null {
    return this.typeToName.get(type) || null;
  }

  /**
   * 
   * @returns 
   */
  public getWidgetDescs(): IWidgetTypeAndDesc[] {
    return this.typeToDesc;
  }
}
