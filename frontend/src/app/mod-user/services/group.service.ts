import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { IGroup, Group } from '../../mod-userdata/models/group';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';

import { SaveGroupMembersRequest } from '../models/save-groupmembers-request';
import { CreateGroupRequest } from '../models/create-group-request';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['listGroups', 'v1/groups/list?deepScan={1}'],
      ['groupsByUser', 'v1/groups/byUser/{1}'],
      ['getMembers', 'v1/groups/members'],
      ['createGroup', 'v1/groups']

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

  /**
   * @param [skipPrimary=true] Liefere keine PrimärGruppen
   * @param [deepScan=false]  liefere rekursiv alle Mitglieder der Gruppe
   * 
   * @returns 
   */
  groupsByUser(userId: string): Observable<Group[]> {

    const url = this.backendRouter.getRouteForName('groupsByUser', GroupService.routes, userId);
    return this.http.get<IGroup[]>(url).pipe(
      map(groups => {
        return groups.map(group => {
          return Group.fromJSON(group);
        })
      })
    );
  }

  /**
   * 
   * @param parentGroup 
   * @param childs 
   */
  saveGroupMembers(parentGroup: Group, childs: Group[]) {

    const url = this.backendRouter.getRouteForName('getMembers', GroupService.routes);
    const req = new SaveGroupMembersRequest(parentGroup, childs);
    return this.http.post(url, req.toJSON());
  }

  /**
   * 
   * @param name 
   * @param isPrimary 
   */
  createGroup(name: string, isPrimary: boolean): Observable<Group> {

    const url = this.backendRouter.getRouteForName('createGroup', GroupService.routes);
    const req = new CreateGroupRequest(name, isPrimary);
    return this.http.put<IGroup>(url, req.toJSON())
      .pipe(
        map(group => {
          return Group.fromJSON(group);
        })
      );
  }
}
