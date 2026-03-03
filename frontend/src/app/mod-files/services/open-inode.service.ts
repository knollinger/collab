import { Injectable } from '@angular/core';

import { INodeService } from './inode.service';
import { INode } from '../../mod-files-data/models/inode';
import { HttpClient } from '@angular/common/http';
import { BackendRoutingService, CommonDialogsService } from '../../mod-commons/mod-commons.module';
import { WopiService } from './wopi.service';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

interface IRegistryEntry {
  regexp: string,
  route: string,
  appName: string
}

class MimeTypeRegistryEntry {
  constructor(
    public readonly regexp: RegExp,
    public readonly route: string,
    public readonly app: string) { }

  public static empty(): MimeTypeRegistryEntry {
    return new MimeTypeRegistryEntry(new RegExp(''), '', '');
  }
}

/**
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class OpenInodeService {

  private static backendRoutes: Map<string, string> = new Map<string, string>(
    [
      ['getRegistry', '/mimetype-registry/registry.json']
    ]
  );

  private mappings: MimeTypeRegistryEntry[] = new Array<MimeTypeRegistryEntry>();

  /**
   * 
   * @param inodeSvc 
   */
  constructor(
    private router: Router,
    private http: HttpClient,
    private backendRoutesSvc: BackendRoutingService,
    private wopiSvc: WopiService,
    private inodeSvc: INodeService,
    private commonsDlgSvc: CommonDialogsService) {

    const url = this.backendRoutesSvc.getRouteForName('getRegistry', OpenInodeService.backendRoutes);

    this.loadStaticBindings().subscribe(entries => {
      this.mappings.push(...entries);
      this.loadWopiBindings().subscribe(entries => {
        this.mappings.push(...entries);
      })
    });

  }

  /**
   * 
   */
  public openByUUID(uuid: string) {

    this.inodeSvc.getINode(uuid).subscribe(inode => {
      this.openINode(inode);
    })
  }

  /**
   * 
   * @param inode 
   */
  public openINode(inode: INode) {

    const regEntriesFound: Array<MimeTypeRegistryEntry> = new Array<MimeTypeRegistryEntry>();

    for (let mapping of this.mappings) {

      console.log('check regexp')
      if (mapping.regexp.test(inode.type)) {
        regEntriesFound.push(mapping);
      }
    }

    switch (regEntriesFound.length) {
      case 0:
        alert(`Kein Viewer für '${inode.type}' gefunden`);
        break;

      case 1:
        this.openWithViewer(inode, regEntriesFound[0].route);
        break;

      default:
        this.chooseViewer(inode, regEntriesFound);
        break;
    }
  }

  /**
   * 
   * @param inode 
   * @param baseUrl 
   */
  private openWithViewer(inode: INode, baseUrl: string) {

    const url = `${baseUrl}/${inode.uuid}`;
    this.router.navigateByUrl(url);
  }

  /**
   * 
   * @param inode 
   * @param apps 
   */
  private chooseViewer(inode: INode, apps: MimeTypeRegistryEntry[]) {

    const selectionEntries = apps.map(app => {
      return {
        text: app.app,
        key: app.route
      };
    })
    const title = 'Öffnen mit';
    const messg = `Mit welchem Anzeige-Modul soll die Datei "${inode.name}" geöffnet werden?`;
    this.commonsDlgSvc.showSelectionBox(title, messg, selectionEntries)
      .subscribe(baseUrl => {
        
        if(baseUrl) {

          const url = `${baseUrl}/${inode.uuid}`;
          this.router.navigateByUrl(url);
        }
      })
  }

  /**
   * 
   * @returns 
   */
  private loadStaticBindings(): Observable<MimeTypeRegistryEntry[]> {

    const url = this.backendRoutesSvc.getRouteForName('getRegistry', OpenInodeService.backendRoutes);
    return this.http.get<IRegistryEntry[]>(url)
      .pipe(map(entries => {

        return entries.map(entry => {
          return new MimeTypeRegistryEntry(new RegExp(entry.regexp, 'i'), entry.route, entry.appName);
        })
      }))
  }

  private loadWopiBindings(): Observable<MimeTypeRegistryEntry[]> {

    return this.wopiSvc.getWOPIMimeTypes()
      .pipe(map(types => {
        return types.map(type => {
          return new MimeTypeRegistryEntry(new RegExp(type, 'i'), 'viewer/collabora', 'Collabora Office');
        })
      }))
  }

}
