import { Injectable } from '@angular/core';

/**
 * Löst die Routen zum Backend auf. F
 */
@Injectable({
  providedIn: 'root'
})
export class BackendRoutingService {

  private baseAddress: string = '';

  /**
   *
   */
  constructor() {
    const loc = new URL(window.location.href);
    const port = (loc.hostname === 'localhost') ? 8080 : loc.port;
    const base = loc.protocol + '//' + loc.hostname + ':' + port + '/';
    this.baseAddress = base;
  }

  /**
   * Nimmt anhand des Routen-Namens einen EIntrag aus der Routes-Map und
   * löst alle darin gegebenen Parameter-Placeholder durch die entsprechenden
   * URL-encodierten Werte aus der args-Liste auf.
   * 
   * Die Placeholder sind in der Form {index-in-das-arg-array} zu annotieren, 
   * der Index ist hierbei 1-basierend! 
   * 
   * {1} meinst also den ersten Parameter im args-array, {2} den 
   * zweiten...
   * 
   * Die Basis-URL des Requests wird von der aktuellen Lokation der AngularUI
   * abgeleitet. Es wird also davon aus gegangen, das Backend und Frontend vom
   * selben Host aus bedient werden.
   * 
   * In einer Entwicklungs-Umgebung läuft der Angular-DevServer auf localhost:4200,
   * das Backend auf localhost:8080
   * 
   * In Prod laufen wahrscheinlich beide auf <irgend-ein-host>:443. Der ctor 
   * sollte hat die entsprechenden Werte bereits ermittelt.
   * 
   * Über diese Design-Entscheidung kann und sollte noch einmal auf das 
   * heftigste gestritten werden! :-)
   *  
   * @param name
   * @param routes
   * @param args
   * @returns
   */
  public getRouteForName(
    name: string,
    routes: Map<string, string>,
    ...args: any[]): string {

    let path = routes.get(name);
    if (!path) {
      throw new Error(`no route for ${name} found`);
    }

    for (let i = 0; i < args.length; ++i) {
      const match = `{${i + 1}}`;
      path = path.replace(match, encodeURIComponent(args[i].toString()));
    }
    return this.baseAddress + encodeURI(path);
  }
}
