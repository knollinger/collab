import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { INodeService } from '../../services/inode.service';
import { INode } from '../../../mod-files-data/mod-files-data.module';
import { INodeDroppedEvent } from '../../directives/drop-target.directive';
import { CommonDialogsService } from '../../../mod-commons/mod-commons.module';
import { SessionService } from '../../../mod-session/session.module';

/**
 * Die Places-Komponente zeigt die vom Benutzer gespeicherten "Lese-Zeichen" auf
 * Ordner und Dateien dar.
 * 
 * Bei der Neuanlage eines Benutzers werden seine Standard-Ordner als "Places"
 * gespeichert, der Benutzer kann dies aber beliebig erweitern oder auch 
 * Einträge entfernen.
 * 
 */
@Component({
  selector: 'app-files-places',
  templateUrl: './files-places.component.html',
  styleUrls: ['./files-places.component.css'],
  standalone: false
})
export class FilesPlacesComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  @Output()
  open: EventEmitter<INode> = new EventEmitter<INode>();

  baseFldr: INode = INode.empty();

  places: INode[] = new Array<INode>();

  /**
   * 
   * @param placesSvc 
   * @param inodeSvc 
   */
  constructor(
    private currUserSvc: SessionService,
    private inodeSvc: INodeService,
    private commonDlgSvc: CommonDialogsService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.inodeSvc.getOrCreateFolder(this.currUserSvc.currentUser.userId, '.places')
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(folder => {

      console.log('placesFldr:');
      console.dir(folder);
      this.baseFldr = folder;
      this.reload();
    })
  }

  /**
   * 
   */
  private reload() {

    this.inodeSvc.getAllChilds(this.baseFldr.uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(places => {

        this.places = this.sortPlaces(places);
      })
  }

  /**
   * 
   * @param places 
   * @returns 
   */
  private sortPlaces(places: INode[]): INode[] {

    const sorted = places.sort((p1: INode, p2: INode) => { return p1.name.localeCompare(p2.name) });
    const dirs = sorted.filter(p => p.isDirectory());
    const files = sorted.filter(p => !p.isDirectory());
    const newPlaces = new Array<INode>();
    newPlaces.push(...dirs);
    newPlaces.push(...files);
    return newPlaces;
  }

  /**
   * 
   * @param inode 
   */
  onOpen(inode: INode) {
    this.open.emit(inode);
  }

  /**
   * 
   * @param evt 
   * @param inode 
   */
  onDelete(evt: MouseEvent, inode: INode) {

    evt.stopPropagation();

    const msg = `Möchstest Du das Element '${inode.name}' wirklich aus Deinen Orten entfernen?`;
    this.commonDlgSvc.showQueryBox('Bist Du sicher?', msg)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(rsp => {

        if (rsp) {

          this.inodeSvc.delete([inode.uuid])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(_ => {
              this.places = this.places.filter(place => {
                return place.uuid !== inode.uuid;
              })
            });
        }
      });
  }

  /**
   * 
   * @param evt 
   */
  onINodesDropped(evt: INodeDroppedEvent) {

    this.inodeSvc.link(evt.sources, this.baseFldr)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(_ => {
        this.reload();
      })
  }
}
