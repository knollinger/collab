import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { WopiService } from './wopi.service';

interface IRegistryEntry {
  regexp: string,
  route: string
}

class RegistryEntry {
  constructor(public readonly regexp: RegExp, public readonly route: string) { }
}

@Injectable({
  providedIn: 'root'
})
export class FilesMimetypeRegistryService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getRegistry', '/mimetype-registry/registry.json']
    ]
  );

  private mappings: RegistryEntry[] = new Array<RegistryEntry>();

  /**
   * 
   * @param http 
   */
  constructor(private http: HttpClient,
    private backendRoutesSvc: BackendRoutingService,
    private wopiSvc: WopiService
  ) {

    console.log('load mimetype registry');
    const url = this.backendRoutesSvc.getRouteForName('getRegistry', FilesMimetypeRegistryService.routes);

    this.loadStaticBindings().subscribe(entries => {
      this.mappings.push(...entries);
      this.loadWopiBindings().subscribe(entries => {
        this.mappings.push(...entries);
      })
    });

  }



  /**
   * Liefere die ViewUrl für einen angegebenen MimeType
   * 
   * @param type der MimeType
   * @returns *null*, wenn keine Route gefunden werden konnte
   */
  public getRouteForType(type: string): string | null {

    for (let mapping of this.mappings) {
      if (mapping.regexp.test(type)) {
        return mapping.route;
      }
    }
    return null;
  }

  /**
   * 
   * @returns 
   */
  private loadStaticBindings(): Observable<RegistryEntry[]> {

    const url = this.backendRoutesSvc.getRouteForName('getRegistry', FilesMimetypeRegistryService.routes);
    return this.http.get<IRegistryEntry[]>(url)
      .pipe(map(entries => {

        return entries.map(entry => {
          return new RegistryEntry(new RegExp(entry.regexp, 'g'), entry.route);
        })
      }))
  }

  private loadWopiBindings(): Observable<RegistryEntry[]> {

    return this.wopiSvc.getWOPIMimeTypes()
      .pipe(map(types => {
        return types.map(type => {
          return new RegistryEntry(new RegExp(type, 'g'), 'viewer/collabora');
        })
      }))
  }
}
