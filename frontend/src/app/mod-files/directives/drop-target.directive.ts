import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { INode } from '../models/inode';

export class FilesDroppedEvent {

  constructor(
    public readonly target: INode,
    public readonly files: File[]) {
  }
}

export class INodeDroppedEvent {

  constructor(
    public readonly target: INode,
    public readonly source: INode,
    public readonly dropEvt: DragEvent) {
  }
}

/**
 * 
 */
@Directive({
  selector: '[appDropTarget]'
})
export class DropTargetDirective {

  // Die Visualisierung der DropArea
  @HostBinding('style.borderStyle') style = 'dashed';
  @HostBinding('style.borderWidth') size = '3px';
  @HostBinding('style.borderColor') color = 'transparent';

  /**
   * Nimmt die ZielINode auf. Bei der Annotation des Target wird 
   * diese einfach folgendermaßen angegeben:
   * 
   * [appDropTarget]="targetINode"
   */
  @Input()
  set appDropTarget(target: INode) {
    this.target = target;
  }
  private target: INode = INode.empty();

  /**
   * Wird emmitiert, wenn auf dem TargetElement 
   * ein oder mehrere Files gedropped werden
   */
  @Output()
  filesDropped: EventEmitter<FilesDroppedEvent> = new EventEmitter<FilesDroppedEvent>();

  /**
   * Wird emmitiert, wenn auf dem Target eine INode
   * gedropped wurde
   */
  @Output()
  inodesDropped: EventEmitter<INodeDroppedEvent> = new EventEmitter<INodeDroppedEvent>();

  /**
   * 
   * @param evt 
   */
  @HostListener('dragenter', ['$event'])
  onDragEnter(evt: DragEvent) {

    evt.stopPropagation();
    evt.preventDefault();

    if (this.isDropEnabled(evt)) {
      this.showDropAreaVisualisization();
    }
  }

  /**
   * 
   * @param evt 
   */
  @HostListener('dragleave', ['$event'])
  onDragLeave(evt: DragEvent) {

    evt.stopPropagation();
    evt.preventDefault();
    this.clearDropAreaVisualisization();
  }

  /**
   * 
   * @param evt 
   */
  @HostListener('dragover', ['$event'])
  onDragOver(evt: DragEvent) {

    evt.stopPropagation();
    evt.preventDefault();

    if (this.isDropEnabled(evt)) {
      this.showDropAreaVisualisization();
    }
  }

  /**
   * 
   * @param evt 
   */
  @HostListener('drop', ['$event'])
  onDrop(evt: DragEvent) {

    console.log('onDrop');
    evt.stopPropagation();
    evt.preventDefault();
    this.clearDropAreaVisualisization();

    if (this.isDropEnabled(evt)) {

      if (this.isFileTransfer(evt)) {
        this.handleFileTransfer(evt);
      }

      if (this.isINodeTransfer(evt)) {
        this.handleINodeTransfer(evt);
      }
    }
  }

  /**
   * 
   * @param evt 
   * @returns 
   */
  private isDropEnabled(evt: DragEvent): boolean {

    let result: boolean = false;
    const dataTransfer = evt.dataTransfer;
    if (dataTransfer) {

      result = this.target.isDirectory() && (this.isFileTransfer(evt) || this.isINodeTransfer(evt));
    }
    return result;
  }

  /**
   * 
   * @param evt 
   * @returns 
   */
  private isFileTransfer(evt: DragEvent): boolean {

    let result: boolean = false;
    const dataTransfer = evt.dataTransfer;
    if (dataTransfer) {
      result = (dataTransfer.types.indexOf('Files') >= 0);
    }
    return result;
  }

  /**
   * 
   * @param evt 
   */
  private handleFileTransfer(evt: DragEvent) {

    const dataTransfer = evt.dataTransfer;
    if (dataTransfer) {

      const files: File[] = new Array<File>();
      for (let i = 0; i < dataTransfer.items.length; i++) {

        if (dataTransfer.items[i].kind === 'file') {

          const file = dataTransfer.items[i].getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }

      this.filesDropped.emit(new FilesDroppedEvent(this.target, files));
      dataTransfer.items.clear();
    }
  }

  /**
   * 
   * @param evt 
   * @returns 
   */
  private isINodeTransfer(evt: DragEvent): boolean {

    let result: boolean = false;
    const dataTransfer = evt.dataTransfer;
    if (dataTransfer) {

      result = (dataTransfer.types.indexOf(INode.DATA_TRANSFER_TYPE) >= 0);
    }
    return result;
  }

  /**
   * 
   * @param evt 
   */
  private handleINodeTransfer(evt: DragEvent) {

    const dataTransfer = evt.dataTransfer;
    if (dataTransfer) {

      const json = dataTransfer.getData(INode.DATA_TRANSFER_TYPE);
      const inode: INode = INode.fromJSON(JSON.parse(json));
      if (this.target.uuid !== inode.uuid && this.target.uuid !== inode.parent) {

        this.inodesDropped.emit(new INodeDroppedEvent(this.target, inode, evt));
      }
    }
  }

  /**
   * Zeige die Visualisierung der DropArea an
   */
  private showDropAreaVisualisization() {

    this.color = "#d0d0d0";
  }

  /**
   * Entferne die Visualisierung der DropArea
   */
  private clearDropAreaVisualisization() {

    this.color = 'transparent';
  }
}
