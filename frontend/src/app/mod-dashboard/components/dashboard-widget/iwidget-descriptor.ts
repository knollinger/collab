import { Component, Type } from "@angular/core";

export interface IWidgetDescriptor {
  id: number,
  width: number,
  height: number,
  widgetType: Type<Component>
}
