import { Component, Type } from "@angular/core";
import { IWidget } from "./iwidget";

export interface IWidgetDescriptor {
  id: number,
  width: number,
  height: number,
  widgetType: Type<IWidget>
}
