import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-widget-list-item',
  templateUrl: './widget-list-item.component.html',
  styleUrls: ['./widget-list-item.component.css']
})
export class WidgetListItemComponent {

  @Input()
  icon: string = '';

  @Input()
  name: string = '';

  @Output()
  open: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  remove: EventEmitter<Event> = new EventEmitter<Event>();

  public onOpen() {
    this.open.emit();
  }

  public onRemove(evt: Event) {
    evt.stopPropagation();
    this.remove.emit(evt);
  }
}
