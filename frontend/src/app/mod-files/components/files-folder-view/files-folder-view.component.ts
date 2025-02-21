import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { INode } from '../../models/inode';
import { FilesDroppedEvent, INodeDroppedEvent } from '../../directives/drop-target.directive';
import { INodeService } from '../../services/inode.service';
import { UploadService } from '../../services/upload.service';
import { InputBoxService, MessageBoxService } from '../../../mod-commons/mod-commons.module';
import { ContentTypeService } from '../../services/content-type.service';
import { FilesPropertiesService } from '../../services/files-properties.service';
import { ClipboardService } from '../../services/clipboard.service';

@Component({
  selector: 'app-folder-view',
  templateUrl: './files-folder-view.component.html',
  styleUrls: ['./files-folder-view.component.css']
})
export class FilesFolderViewComponent implements OnInit {

  public currentFolder: INode = INode.root();
  public inodes: INode[] = new Array<INode>();
  public path: INode[] = new Array<INode>();
  public selectedINodes: Set<INode> = new Set<INode>();
  public showPreview: boolean = false;
  public previewINode: INode = INode.empty();

  @Input()
  viewMode: string = 'grid';

  @Input()
  isActive: boolean = false;

  @Output()
  preview: EventEmitter<INode> = new EventEmitter<INode>();

  /**
   * 
   * @param inodeSvc 
   * @param uploadSvc 
   * @param messageBoxSvc 
   * @param inputBoxSvc 
   * @param contentTypeSvc 
   * @param propsSvc 
   */
  constructor(
    private inodeSvc: INodeService,
    private uploadSvc: UploadService,
    private messageBoxSvc: MessageBoxService,
    private inputBoxSvc: InputBoxService,
    private clipboardSvc: ClipboardService,
    private contentTypeSvc: ContentTypeService,
    private propsSvc: FilesPropertiesService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
    this.refresh();
  }

  /**
   * 
   */
  private refresh() {

    this.loadEntries();
    this.loadPathInfo();
  }

  /**
   * 
   */
  private loadEntries() {

    const sub = this.inodeSvc.getAllChilds(this.currentFolder.uuid).subscribe(inodes => {

      this.inodes = inodes;
      this.selectedINodes.clear();
      this.showPreview = false;
    });
  }

  public onCreateFolder() {

    this.inputBoxSvc.showInputBox('Einen neuen Ordner anlegen', 'Name').subscribe(name => {

      this.inodeSvc.createFolder(this.currentFolder.uuid, name).subscribe(() => {
        this.loadEntries();
      })
    })
  }
  /**
   * 
   */
  private loadPathInfo() {

    this.inodeSvc.getPath(this.currentFolder.uuid).subscribe(path => {
      this.path = path;
    });
  }

  public get showSelectAll(): boolean {

    return this.inodes.length !== this.selectedINodes.size;
  }

  public get hasSelection(): boolean {
    return this.selectedINodes.size !== 0;
  }

  /**
   * 
   */
  public onSelectAll() {

    const inodes: Set<INode> = new Set<INode>();
    this.inodes.forEach(inode => {
      inodes.add(inode);
    })
    this.selectedINodes = inodes;
  }

  public onDeselectAll() {
    this.selectedINodes = new Set<INode>();
  }

  onFileUpload(evt: Event) {

    const input = evt.target as HTMLInputElement;
    if (input.files && input.files.length) {

      const files: File[] = new Array<File>();
      for (let i = 0; i < input.files.length; ++i) {
        files.push(input.files[i]);
      }
      this.uploadFiles(this.currentFolder, files);
    }
  }

  /**
   * Auf eines der GridView-Items wurde ein FileDrop durchgeführt.
   * Das behandeln wir hier nicht sondern geben das einfach an den
   * Parent weiter.
   * 
   */
  onFilesDropped(event: FilesDroppedEvent) {

    this.uploadFiles(event.target, event.files);
  }


  private uploadFiles(parent: INode, files: File[]) {

    this.uploadSvc.uploadFiles(parent.uuid, files).subscribe(() => {

      if (parent.uuid === this.currentFolder.uuid) {
        this.loadEntries();
      }
    })
  }

  /**
   * Auf eines der GridView-Items wurde ein InodeDrop durchgeführt.
   * Das behandeln wir hier nicht sondern geben das einfach an den
   * Parent weiter.
   * 
   * @param files 
   */
  onINodesDropped(event: INodeDroppedEvent) {

    this.inodeSvc.move(event.source, event.target).subscribe(() => {
      if (event.target.uuid === this.currentFolder.uuid) {
        this.loadEntries();
      }
    })
  }

  /**
   * Ein Open-Request wurde auf einem Item ausgelöst
   * 
   * @param inode 
   */
  /**
   * 
   * @param inode 
   */
  onOpen(inode: INode) {

    if (inode.isDirectory()) {
      this.currentFolder = inode;
      this.loadEntries();
      this.loadPathInfo();
    }
    else {
      this.preview.emit(inode);
    }
  }

  /**
   * An einem GridViewItem wurde ein rename() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onRename(inode: INode) {

    this.inputBoxSvc.showInputBox('Umbenennen', 'Neuer Datei-Name', inode.name).subscribe(newName => {

      if (newName) {

        this.inodeSvc.rename(inode.uuid, newName).subscribe(() => {
          this.loadEntries();
        });
      }
    });
  }

  /**
   * An einem GridViewItem wurde ein delete() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onDelete(inode?: INode) {

    const toDelete = inode ? Array.of(inode) : Array.from(this.selectedINodes);
    if (toDelete.length) {

      const uuids = new Array<string>();
      let msg = '<p>Möchtest Du folgende Objekte wirklich löschen?</p>'
      toDelete.forEach(node => {
        msg += `<div class=\"disp-flex flex-row flex-alignitems-center\">`;
        msg += `<img class=\"flex-0 small-right-spacer\" src=\"${this.contentTypeSvc.getTypeIconUrl(node.type)}\" width="32px">`;
        msg += `<span class=\"flex-1\">${node.name}</span>`;
        msg += `</div>`;
        uuids.push(node.uuid);
      })
      msg += '<p class=\"small-top-spacer\">Diese Operation kann nicht rückgängig gemacht werden!</p>';
      this.messageBoxSvc.showQueryBox('Bist Du sicher?', msg).subscribe(rsp => {

        if (rsp) {
          this.inodeSvc.delete(uuids).subscribe(() => {
            this.loadEntries();
          })
        }
      })
    }
  }

  /**
   * 
   */
  public get isClipbordEmpty(): boolean {
    return this.clipboardSvc.isEmpty;
  }

  /**
   * An einem GridViewItem wurde ein cut() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onCut(inode?: INode) {

    this.clipboardSvc.cut(inode || this.selectedINodesAsArray);
  }

  /**
   * An einem GridViewItem wurde ein copy() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onCopy(inode?: INode) {

    this.clipboardSvc.copy(inode || this.selectedINodesAsArray);
  }

  /**
   * An einem GridViewItem wurde ein paste() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onPaste() {
    console.log('do paste');
    this.inodeSvc.move(this.clipboardSvc.inodes, this.currentFolder).subscribe(() => {
      this.loadEntries();
    })
  }

  private get selectedINodesAsArray(): INode[] {

    const inodes: INode[] = new Array<INode>();
    this.selectedINodes.forEach(inode => {
      inodes.push(inode);
    });
    return inodes;
  }

  /**
   * An einem GridViewItem wurde ein showProps() angefordert.
   * Wir behandeln das nicht selber sondern geben das 
   * einfach an den Parent weiter
   * 
   * @param inode 
   */
  onShowProps(inode: INode) {
    this.propsSvc.showPropDialog(inode);
  }

  public get selectedObjectSize(): number {

    let result = 0;

    this.selectedINodes.forEach(inode => {
      result += inode.size;
    })
    return result;
  }
}
