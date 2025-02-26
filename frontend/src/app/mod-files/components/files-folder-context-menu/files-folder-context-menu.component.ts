import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { INode } from '../../models/inode';
import { ClipboardService } from '../../services/clipboard.service';

@Component({
  selector: 'app-files-folder-context-menu',
  templateUrl: './files-folder-context-menu.component.html',
  styleUrls: ['./files-folder-context-menu.component.css']
})
export class FilesFolderContextMenuComponent implements OnInit {

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger | undefined;

  @Input()
  inode: INode = INode.empty();

  @Output()
  paste: EventEmitter<void> = new EventEmitter();

  @Output()
  download: EventEmitter<INode> = new EventEmitter();

  @Output()
  showProps: EventEmitter<INode> = new EventEmitter();

  triggerPosX: string = '';
  triggerPosY: string = '';

  /**
   * 
   */
  constructor(
    private clipboardSvc: ClipboardService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
  }

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

  /**
   * Soll die Paste-Option angezeigt werden?  
  */
  get isShowPasteEntry(): boolean {
    return !this.clipboardSvc.isEmpty;
  }

  /**
   * liefere die Anzahl von pastable Elementen  
  */
  get nrPasteElements(): number {
    return this.clipboardSvc.inodes.length
  }

  /**
   * Propagiere ein Paste-Event
   */
  onPaste() {
    this.paste.emit();
  }


  onDownload() {
    this.download.emit(this.inode);
  }

  onShowProperties() {
    console.log(this.inode);
    this.showProps.emit(this.inode);
  }
}
