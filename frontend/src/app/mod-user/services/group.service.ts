import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { IGroup, Group } from '../../mod-userdata/models/group';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['listGroups', 'v1/groups/list?deepScan={1}']
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
    deepScan: boolean = false): Observable<Group[]> {

    const url = this.backendRouter.getRouteForName('listGroups', GroupService.routes, deepScan);
    return this.http.get<IGroup[]>(url).pipe(
      map(groups => {
        return groups.map(group => {
          return Group.fromJSON(group);
        })
      })
    );
  }
}
