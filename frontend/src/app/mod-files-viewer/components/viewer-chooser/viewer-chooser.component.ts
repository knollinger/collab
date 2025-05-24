import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-viewer-chooser',
  templateUrl: './viewer-chooser.component.html',
  styleUrls: ['./viewer-chooser.component.css'],
  standalone: false
})
export class ViewerChooserComponent {

  @Input()
  aliases: string[] = new Array<string>();

  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();

  /**
   * 
   */
  constructor() {

  }

  /**
   * 
   * @param alias 
   */
  onSelection(alias: string) {
    this.change.next(alias);
  }
}
