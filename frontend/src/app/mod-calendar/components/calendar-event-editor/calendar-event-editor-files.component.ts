import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FilesPickerService } from '../../../mod-files/mod-files.module';
import { INode } from '../../../mod-files-data/mod-files-data.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilesDroppedEvent } from '../../../mod-files/directives/drop-target.directive';
import { ContentTypeService } from '../../../mod-files/services/content-type.service';
import { SessionService } from '../../../mod-session/session.module';
import { BehaviorSubject } from 'rxjs';

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

  private files: File[] = new Array<File>();

  @Input()
  set attachments(inodes: INode[]) {
    this.attachmentsChange.next(inodes);
    this.createRenderNodes();
  }

  @Output()
  attachmentsChange: BehaviorSubject<INode[]> = new BehaviorSubject<INode[]>(new Array<INode>());

  get attachments(): INode[] {
    return this.attachmentsChange.value;
  }

  inodesToRender: INode[] = new Array<INode>();
  selectedNodes: Set<INode> = new Set<INode>();

  @Output()
  filesChange: EventEmitter<File[]> = new EventEmitter<File[]>();

  /**
   * 
   * @param calAttachmentsSvc 
   * @param filePicker 
   */
  constructor(
    private currUserSvc: SessionService,
    private mimetypeSvc: ContentTypeService,
    private filePicker: FilesPickerService) {
  }

  /**
   * Wir legen einen vurtuellen Folder an, welcher als Basis des
   * files-grid-view dient. Sinn und Zweck sind eigentlich nur das
   * die EffetivePerms Modifikationen (Drop, Delete, ...) erlauben.
   */
  ngOnInit() {

    const user = this.currUserSvc.currentUser.userId;
    this.attachmentsFolder = new INode('', '', '', 'inode/directory', 0, new Date(), new Date(), user, user, 0o777, 0o777);

  }

  /**
   * Zeige den INode-Picker an
   */
  onPickINodes() {
    this.filePicker.showFilePicker(true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(inodes => {
        if (inodes) {

          const newAttachments = this.attachments;
          newAttachments.push(...inodes);
          this.attachments = newAttachments;
          this.createRenderNodes();
        }
      });
  }

  /**
   * Lokale Files wurden via DnD hinzu gefügt
   * 
   * @param evt 
   */
  onFilesDropped(evt: FilesDroppedEvent) {

    this.files.push(...evt.files);
    this.createRenderNodes();
    this.filesChange.emit(this.files);
  }

  /**
   * lokale Files wurden per UploadBtn ausgewählt
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
      this.filesChange.emit(this.files);
    }
  }

  /**
   * Erzeuge das Array der zu rendernden INodes. Dieses Array beinhaltet alle
   * "normalen" INodes, für hochzuladende Files werden temporäre INodes mit
   * einer leeren UUID erzeugt.
   * 
   * Das Array wird nach Namen sortiert.
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
   * Selektiere alle INodes
   */
  onSelectAll() {

    const newSelection: Set<INode> = new Set<INode>();
    this.inodesToRender.forEach(inode => {
      newSelection.add(inode);
    })
    this.selectedNodes = newSelection;
  }

  /**
   * Lösche die Auswahl
   */
  onDeselectAll() {

    this.selectedNodes.clear();
  }

  /**
   * Aus dem INode-View wurde die Auswahl geändert.
   * 
   * @param selected 
   */
  onSelectionChange(selected: Set<INode>) {
    this.selectedNodes = selected;
  }

  /**
   * Liegt eine Selection vor?
   */
  get hasSelection(): boolean {
    return this.selectedNodes.size > 0;
  }

  /**
   * Lösche INodes. Entweder wird delete direkt auf einer INode ausgeführt,
   * in diesem Fall ist der Parameter `inode` gesetzt. Anderenfalls wurde der 
   * delete via Toolbar ausgelöst, es werden alle selektierten INodes gelöscht.
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
        this.files = this.files.filter(file => { return file.name !== node.name }); // TODO: Das ist doch scheiße! Zwei gleichnamige Files können aus unterschiedlichen Verzeichnissen stammen!
        this.filesChange.emit(this.files);
      }
    });
    this.selectedNodes.clear();
    this.createRenderNodes();
  }

  /**
   * Liefere das Mimetype-Icon für eine INode.
   * 
   * @param inode 
   * @returns 
   */
  getIcon(inode: INode): string {
    return this.mimetypeSvc.getTypeIconUrl(inode.type);
  }
}
