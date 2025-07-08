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
      ['unlinkINode', 'v1/dashboard/files/{1}'],
      ['getIcon', 'v1/contenttype/{1}/{2}']
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
      })
    );
  }

  /**
   * 
   * @returns 
   */
  public unlinkINode(inodeId: string): Observable<void> {

    const url = this.backendRouter.getRouteForName('unlinkINode', DashboardFilesService.routes, inodeId);
    return this.http.delete<void>(url);
  }

  getMimetypeIcon(inode: INode): string {

    const parts = inode.type.split("/");
    return this.backendRouter.getRouteForName('getIcon', DashboardFilesService.routes, parts[0], parts[1]);
  }
}
