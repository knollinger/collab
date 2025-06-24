import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PlacesService } from '../../services/places.service';
import { INodeService } from '../../services/inode.service';
import { INode } from '../../../mod-files-data/mod-files-data.module';
import { INodeDroppedEvent } from '../../directives/drop-target.directive';
import { CommonDialogsService } from '../../../mod-commons/mod-commons.module';

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

  places: INode[] = new Array<INode>();
  pseudoNode: INode = INode.emptyDir();
  private tooltips: Map<string, string> = new Map<string, string>();

  /**
   * 
   * @param placesSvc 
   * @param inodeSvc 
   */
  constructor(private placesSvc: PlacesService,
    private inodeSvc: INodeService,
    private commonDlgSvc: CommonDialogsService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
    this.reload();
  }

  /**
   * 
   */
  private reload() {

    this.placesSvc.getPlaces()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(places => {

        this.places = this.sortPlaces(places);
        this.makeTooltips(places);
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
   * Als Tooltip soll der komplette Pfad zu einer INode angezeigt 
   * werden. Um das jetzt nicht permanent berechnen zu müssen, werden
   * die Pfade einmalig nach dem Einlesen der INodes generiert und
   * in einer Map mit der INode-UUID als Key gespeichert. 
   * 
   * @param places 
   */
  private makeTooltips(places: INode[]) {

    this.tooltips.clear();
    places.forEach(place => {

      this.inodeSvc.getPath(place.uuid).subscribe(path => {

        const entries = path.map(pathEntry => {
          return pathEntry.name;
        });
        this.tooltips.set(place.uuid, entries.join('/'));
      })
    });
  }

  /**
   * 
   * @param inode 
   * @returns 
   */
  public getTooltip(inode: INode): string {
    return this.tooltips.get(inode.uuid) || '';
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

          this.placesSvc.deletePlace(inode.uuid)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(_ => {
              this.places = this.places.filter(place => {
                return place.uuid !== inode.uuid;
              })
              this.tooltips.delete(inode.uuid);
            });
        }
      });
  }

  /**
   * 
   * @param evt 
   */
  onINodesDropped(evt: INodeDroppedEvent) {

    this.placesSvc.addPlaces(evt.sources)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(_ => {
        this.reload();
      })
  }
}
