import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';


export class IconSize {

  constructor(
    public readonly size: number,
    public readonly text: string) {

  }
}

@Component({
  selector: 'app-files-iconsize-menu',
  templateUrl: './files-iconsize-menu.component.html',
  styleUrls: ['./files-iconsize-menu.component.css'],
  standalone: false
})
export class FilesIconsizeMenuComponent {

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;

  @Output()
  iconSize: EventEmitter<number> = new EventEmitter<number>();

  iconSizes: IconSize[] = [
    new IconSize(64, "Klein"),
    new IconSize(128, "Mittel"),
    new IconSize(192, "Groß"),
    new IconSize(256, "Sehr groß")  ]

  currSize: number = 128;
  triggerPosX: string = '';
  triggerPosY: string = '';


  /**
   * 
   * @param evt 
   */
  show(evt: MouseEvent) {

    evt.stopPropagation();
    evt.preventDefault();

    if (this.trigger) {

      this.triggerPosX = `${evt.clientX}px`;
      this.triggerPosY = `${evt.clientY}px`;

      this.trigger.openMenu();
    }
  }

  onIconSize(size: IconSize) {

    this.currSize = size.size;
    this.iconSize.emit(size.size);
  }
}
