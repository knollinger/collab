import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INode } from '../../../mod-files-data/mod-files-data.module';

@Component({
  selector: 'app-files-main-view-tab-header',
  templateUrl: './files-main-view-tab-header.component.html',
  styleUrls: ['./files-main-view-tab-header.component.css']
})
export class FilesMainViewTabHeaderComponent {

  @Input()
  label: string = '';

  @Input()
  closeable: boolean = false;

  @Input()
  active: boolean = false;

  @Output()
  close: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  dragOver: EventEmitter<void> = new EventEmitter<void>();

  onDragOver(evt: DragEvent) {

    const dataTransfer = evt.dataTransfer;
    if (dataTransfer) {

      const types = dataTransfer.types;
      if (types.indexOf('Files') != -1 || types.indexOf(INode.DATA_TRANSFER_TYPE) != -1) {
        this.dragOver.next();
      }
    }
  }

  onClose() {
    this.close.next();
  }
}
