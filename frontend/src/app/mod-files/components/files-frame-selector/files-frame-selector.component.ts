import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-files-frame-selector',
  templateUrl: './files-frame-selector.component.html',
  styleUrls: ['./files-frame-selector.component.css'],
  standalone: false
})
export class FilesFrameSelectorComponent {

  @ViewChild('frame')
  frame?: ElementRef<HTMLElement>;

  @Output()
  selRectChange: EventEmitter<DOMRect> = new EventEmitter<DOMRect>();

  @Output()
  close: EventEmitter<void> = new EventEmitter<void>();

  public showFrame: boolean = false;

  private btnDownX: number = 0;
  private btnDownY: number = 0;

  constructor() {

  }

  public onMouseBtnDown(evt: MouseEvent) {

    if (evt.button === 0) {

      this.showFrame = true;
      this.btnDownX = evt.offsetX;
      this.btnDownY = evt.offsetY;
    }
  }

  public onMouseBtnUp(evt: MouseEvent) {

    this.showFrame = false;
    this.close.emit();
  }


  public onMouseMove(evt: MouseEvent) {

    if (this.showFrame && this.frame) {
      const frame = this.frame?.nativeElement;
      const x = Math.min(evt.offsetX, this.btnDownX);
      const y = Math.min(evt.offsetY, this.btnDownY);
      const w = Math.abs(evt.offsetX - this.btnDownX);
      const h = Math.abs(evt.offsetY - this.btnDownY);
      frame.style.left = `${x}px`;
      frame.style.top = `${y}px`;
      frame.style.width = `${w}px`;
      frame.style.height = `${h}px`;

      this.selRectChange.emit(new DOMRect(x, y, w, h));
    }

  }
}
