import { Injectable } from '@angular/core';
import { Observable, map, last } from 'rxjs';

import { IGroup, Group } from '../../mod-userdata/models/group';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['listGroups', 'v1/groups/list?skipPrimary={1}&deepScan={2}']
    ]
  );

  /**
   * 
   * @param backendRouter 
   */
  constructor(
    private http: HttpClient,
    private backendRouter: BackendRoutingService) {

  }

  /**
   * @param [skipPrimary=true] Liefere keine PrimärGruppen
   * @param [deepScan=false]  liefere rekursiv alle Mitglieder der Gruppe
   * 
   * @returns 
   */
  listGroups(//
    skipPrimary: boolean = true, //
    deepScan: boolean = false): Observable<Group[]> {

    const url = this.backendRouter.getRouteForName('listGroups', GroupService.routes, skipPrimary, deepScan);
    return this.http.get<IGroup[]>(url).pipe(
      map(groups => {
        return groups.map(group => {
          return Group.fromJSON(group);
        })
      })
    );
  }
}
