import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FilesPickerService } from '../../../mod-files/mod-files.module';
import { CalendarAttachmentsService } from '../../services/calendar-attachments.service';
import { INode } from '../../../mod-files-data/mod-files-data.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilesDroppedEvent } from '../../../mod-files/directives/drop-target.directive';
import { ContentTypeService } from '../../../mod-files/services/content-type.service';

/**
 * Zeigt die Attachments eines CalendarEvents an.
 * 
 * Das ganze ist ein wenig komplizierter. Wir wolle ja auch die Möglichkeit
 * lokale Files hoch zu laden. Dafür existiert im Benutzerprofil ein spezieller
 * versteckter Ordner welche diese INodes aufnimmt.
 * 
 * Die INode dieses Folders wird im ngOnInit ermittelt, ggf wird er angelegt.
 * 
 * Nun haben wir aber die dumme Situation, das in der Edit-Phase sowohl echte INodes
 * als auch zum Upload markierte Files angezeigt werden müssen. "Zum Upload markiert"
 * bedeutet, dass die Files selbst erst beim Speichern des Events hoch geladen werden
 * sollen.
 * 
 * Aus diesem Grund wird ein Array von "echten" INodes gehalten sowie ein Array von
 * File-Objekten. Letztere sind noch nicht hoch geladen und können auch sofort wieder
 * entfernt werden.
 * 
 * Um nun beide Typen von Dateien anzeigen zu können wird ein Array von zu renderenden
 * INodes gepflegt, dieses wird bei jeder modifizierenden Operation aktualisiert.
 */
@Component({
  selector: 'app-calendar-event-editor-files',
  templateUrl: './calendar-event-editor-files.component.html',
  styleUrls: ['./calendar-event-editor-files.component.css'],
  standalone: false
})
export class CalendarEventEditorFilesComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  attachmentsFolder: INode = INode.empty();

  attachments: INode[] = new Array<INode>();
  files: File[] = new Array<File>();
  inodesToRender: INode[] = new Array<INode>();
  selectedNodes: Set<INode> = new Set<INode>();

  /**
   * 
   * @param calAttachmentsSvc 
   * @param filePicker 
   */
  constructor(
    private calAttachmentsSvc: CalendarAttachmentsService,
    private mimetypeSvc: ContentTypeService,
    private filePicker: FilesPickerService) {

  }

  /**
   * 
   */
  ngOnInit() {

    this.calAttachmentsSvc.getAttachmentsFolder()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(folder => {
        this.attachmentsFolder = folder;
      })
  }

  /**
   * Der INode-Picker soll angezeigt werden
   */
  onPickINodes() {
    this.filePicker.showFilePicker(true);
  }

  /**
   * 
   * @param evt 
   */
  onFilesDropped(evt: FilesDroppedEvent) {

    this.files.push(...evt.files);
    this.createRenderNodes();
  }

  /**
   * 
   * @param evt 
   */
  onFileUploadBtn(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const files = input.files;
    if (files) {

      for (let i = 0; i < files.length; ++i) {
        this.files.push(files[i]);
      }
      this.createRenderNodes();
    }
  }

  /**
   * 
   * @param files 
   */
  private createRenderNodes() {

    const newNodes = new Array<INode>();
    this.files.forEach(file => {
      const tmpNode = new INode(file.name, '', '', file.type, file.size, new Date(), new Date(), 'owner', 'group', 0o777, 0o777);
      newNodes.push(tmpNode);

    });

    newNodes.push(...this.attachments);

    this.inodesToRender = newNodes.sort((first, second) => {
      return first.name.localeCompare(second.name);
    })
  }

  /**
   * 
   */
  onSelectAll() {

    const newSelection: Set<INode> = new Set<INode>();
    this.inodesToRender.forEach(inode => {
      newSelection.add(inode);
    })
    this.selectedNodes = newSelection;
  }

  /**
   * 
   */
  onDeselectAll() {

    this.selectedNodes.clear();
  }

  /**
   * 
   * @param selected 
   */
  onSelectionChange(selected: Set<INode>) {
    this.selectedNodes = selected;
  }

  /**
   * 
   */
  get hasSelection(): boolean {
    return this.selectedNodes.size > 0;
  }

  /**
   * 
   * @param inode 
   */
  onDelete(inode?: INode) {

    const toDelete: INode[] = inode ? [inode] : Array.of(...this.selectedNodes);
    toDelete.forEach(node => {
      if (node.uuid) {
        this.attachments = this.attachments.filter(attachment => { return attachment.uuid !== node.uuid });
      }
      else {
        this.files = this.files.filter(file => { return file.name !== node.name }); // Das ist doch scheiße! Zwei gleichnamige Files können aus unterschiedlichen Verzeichnissen stammen!
      }
    });
    this.selectedNodes.clear();
    this.createRenderNodes();
  }

  /**
   * 
   * @param inode 
   * @returns 
   */
  getIcon(inode: INode): string {
    return this.mimetypeSvc.getTypeIconUrl(inode.type);
  }
}
