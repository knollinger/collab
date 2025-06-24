import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { IINode, INode } from '../../mod-files-data/models/inode';

/**
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getPlaces', 'v1/places'],
      ['deletePlace', 'v1/places/{1}'],
      ['addPlaces', 'v1/places']
    ]
  );

  /**
   * 
   */
  constructor(
    private backendRouter: BackendRoutingService,
    private httpClient: HttpClient) {

  }

  /**
   * 
   * @param uuid 
   * @returns 
   */
  public getPlaces(): Observable<INode[]> {

    const url = this.backendRouter.getRouteForName('getPlaces', PlacesService.routes);
    return this.httpClient.get<IINode[]>(url).pipe(
      map(inodes => {
        return inodes.map(inode => {
          return INode.fromJSON(inode);
        })
      })
    );
  }

  /**
   * 
   * @param uuids 
   */
  public addPlaces(nodes: INode[]): Observable<void> {

    const url = this.backendRouter.getRouteForName('addPlaces', PlacesService.routes);
    const req = nodes.map(node => node.toJSON());
    return this.httpClient.put<void>(url, nodes);
  }

  /**
   * 
   * @param uuid 
   * @returns 
   */
  public deletePlace(uuid: string): Observable<void> {
    const url = this.backendRouter.getRouteForName('deletePlace', PlacesService.routes, uuid);
    return this.httpClient.delete<void>(url);
  }
}
