import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BackendRoutingService } from "../../mod-commons/mod-commons.module";

import { INode, IINode } from '../../mod-files-data/mod-files-data.module';
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashboardFilesService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['loadINodes', 'v1/dashboard/files'],
      ['unlinkINode', 'v1/dashboard/links?refId={1}'],
    ]
  );

  /**
   * 
   * @param http 
   * @param backendRouter 
   */
  constructor(
    private http: HttpClient,
    private backendRouter: BackendRoutingService) {
  }

  /**
   * 
   * @returns 
   */
  public loadINodes(): Observable<INode[]> {

    const url = this.backendRouter.getRouteForName('loadINodes', DashboardFilesService.routes);
    return this.http.get<IINode[]>(url).pipe(
      map(inodes => {
        return inodes.map(inode => {
          return INode.fromJSON(inode);
        })
          .sort(this.sortINodes)
      })
    );
  }

  /**
   * 
   * @returns 
   */
  public unlinkINode(inode: INode): Observable<void> {

    const url = this.backendRouter.getRouteForName('unlinkINode', DashboardFilesService.routes, inode.uuid);
    return this.http.delete<void>(url);
  }

  /**
   * Sortiere die INode so, das zuerst alle Directories kommen 
   * (wiederum nach Namen sortiert) und danach alle "normalen"
   * Files (auch nach Namen sortiert)
   * 
   * @param inode1 
   * @param inode2 
   * @returns 
   */
  private sortINodes(inode1: INode, inode2: INode): number {

    if (inode1.isDirectory() && inode2.isDirectory()) {
      return inode1.name.localeCompare(inode2.name);
    }
    else {
      if (inode1.isDirectory()) {
        return -1;
      }
      else {
        if (inode2.isDirectory()) {
          return 1;
        }
        else {
          return inode1.name.localeCompare(inode2.name);
        }
      }
    }
  }
}
