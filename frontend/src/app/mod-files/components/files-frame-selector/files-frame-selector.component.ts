import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { INode } from '../../../mod-files-data/mod-files-data.module';

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

/**
 * 
 * @param parent 
 * @param rect 
 * @param tagName 
 * @param inodes 
 * @returns 
 */
export function extractSelectedINodes(parent: HTMLElement, rect: DOMRect, tagName: string, inodes: INode[]): INode[] {

  const inodesByUUID = new Map<string, INode>();
  inodes.forEach(node => {
    inodesByUUID.set(node.uuid, node);
  });

  const selectedINodes = new Array<INode>();
  const items = parent.querySelectorAll(tagName);
  items.forEach(elem => {

    const item = elem as HTMLElement;
    const itemRect = new DOMRect(item.offsetLeft, item.offsetTop, item.offsetWidth, item.offsetHeight);

    if (itemRect.left >= rect.left && itemRect.left <= rect.right &&
      itemRect.right >= rect.left && itemRect.x <= rect.right &&
      itemRect.top >= rect.top && itemRect.top <= rect.bottom &&
      itemRect.bottom >= rect.top && itemRect.bottom <= rect.bottom) {

      const node = inodesByUUID.get(item.id);
      if (node) {
        selectedINodes.push(node);
      }
    }
  })
  return selectedINodes;
}
