import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { IINode, INode } from '../../mod-files-data/models/inode';
import { RenameINodeRequest } from '../models/rename-inode-request';
import { MoveINodeRequest } from '../models/move-inode-request';
import { SessionService } from '../../mod-session/session.module';

/**
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class INodeService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getINode', 'v1/filesys/{1}'],
      ['getAllFiles', 'v1/filesys/childs/{1}?foldersOnly={2}'],
      ['getPath', 'v1/filesys/path/{1}'],
      ['renameINode', 'v1/filesys/rename'],
      ['deleteINode', 'v1/filesys/delete'],
      ['copyINode', 'v1/filesys/copy'],
      ['moveINode', 'v1/filesys/move'],
      ['linkINode', 'v1/filesys/link'],
      ['createFolder', 'v1/filesys/mkdir/{1}/{2}'],
      ['createDocument', 'v1/filesys/createDocument/{1}/{2}/{3}'],
      ['updateINode', 'v1/filesys/update'],
      ['getContent', 'v1/filecontent/{1}'],
      ['sendToDashboard', 'v1/dashboard/links?refId={1}&refType=INODES']
    ]
  );

  /**
   * 
   */
  constructor(
    private backendRouter: BackendRoutingService,
    private httpClient: HttpClient,
    private sessionSvc: SessionService) {

  }

  /**
   * Liefere die INode des HimeDirectories des aktuellen Benutzers
   * 
   * @returns 
   */
  getHomeDir(): Observable<INode> {

    const uuid = this.sessionSvc.currentUser.userId;
    return this.getINode(uuid);
  }

  /**
   * 
   * @param uuid 
   * @returns 
   */
  getINode(uuid: string): Observable<INode> {

    const url = this.backendRouter.getRouteForName('getINode', INodeService.routes, uuid);
    return this.httpClient.get<IINode>(url).pipe(
      map(inode => {
        return INode.fromJSON(inode);
      })
    );
  }

  /**
   * 
   * @param parent 
   * @returns 
   */
  public getAllChilds(parent: string, foldersOnly: boolean = false): Observable<INode[]> {

    const url = this.backendRouter.getRouteForName('getAllFiles', INodeService.routes, parent, foldersOnly);
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
   */
  public getPath(uuid: string): Observable<INode[]> {

    const url = this.backendRouter.getRouteForName('getPath', INodeService.routes, uuid);
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
   * @param uuid 
   * @param newName 
   */
  public rename(uuid: string, newName: string): Observable<void> {

    const req = new RenameINodeRequest(uuid, newName);
    const url = this.backendRouter.getRouteForName('renameINode', INodeService.routes);
    return this.httpClient.post<void>(url, req.toJSON());
  }

  /**
   * 
   * @param uuid 
   */
  public delete(uuid: string[]): Observable<void> {

    const url = this.backendRouter.getRouteForName('deleteINode', INodeService.routes);
    return this.httpClient.delete<void>(url, { body: uuid });
  }

  /**
   * 
   * @param src 
   * @param parent 
   * @returns 
   */
  copy(src: INode | INode[], parent: INode): Observable<void> {

    const url = this.backendRouter.getRouteForName('copyINode', INodeService.routes);

    const toMove = Array.isArray(src) ? src : Array.of(src);
    const req = new MoveINodeRequest(toMove, parent);
    return this.httpClient.post<void>(url, req.toJSON());
  }

  /**
   * 
   * @param src 
   * @param parent 
   * @returns 
   */
  move(src: INode | INode[], parent: INode): Observable<void> {

    const url = this.backendRouter.getRouteForName('moveINode', INodeService.routes);

    const toMove = Array.isArray(src) ? src : Array.of(src);
    const req = new MoveINodeRequest(toMove, parent);
    return this.httpClient.post<void>(url, req.toJSON());
  }

  /**
   * 
   * @param src 
   * @param parent 
   * @returns 
   */
  link(src: INode | INode[], parent: INode): Observable<void> {

    const url = this.backendRouter.getRouteForName('linkINode', INodeService.routes);

    const toMove = Array.isArray(src) ? src : Array.of(src);
    const req = new MoveINodeRequest(toMove, parent);
    return this.httpClient.post<void>(url, req.toJSON());
  }

  /**
   * 
   * @param inode 
   * @returns 
   */
  update(inode: INode): Observable<INode> {

    const url = this.backendRouter.getRouteForName('updateINode', INodeService.routes);
    return this.httpClient.post<IINode>(url, inode.toJSON()).pipe(
      map(json => {
        return INode.fromJSON(json);
      })
    );
  }

  /**
   * 
   * @param uuid 
   * @param name 
   * @returns 
   */
  public createFolder(uuid: string, name: string): Observable<INode> {

    const url = this.backendRouter.getRouteForName('createFolder', INodeService.routes, uuid, name);
    return this.httpClient.put<IINode>(url, null).pipe(
      map(json => {
        return INode.fromJSON(json);
      })
    );
  }

  /**
   * Erzeugt ein neues Dokument mit dem angegebenen Namen und ContentType
   * im angegebenen ParentFolder.
   * 
   * @param parentFolder 
   * @param name 
   * @returns 
   */
  public createDocument(parentFolder: string, name: string, contentType: string): Observable<INode> {

    const url = this.backendRouter.getRouteForName('createDocument', INodeService.routes, parentFolder, name, contentType);
    return this.httpClient.put<IINode>(url, null).pipe(
      map(json => {
        return INode.fromJSON(json);
      })
    );
  }

  /**
   * 
   * @param uuid 
   * @returns 
   */
  public getContentUrl(uuid: string): string {

    return this.backendRouter.getRouteForName('getContent', INodeService.routes, uuid);
  }

  /**
   * 
   * @param inode 
   * @returns 
   */
  public sendToDashboard(inode: INode): Observable<void> {
    const url = this.backendRouter.getRouteForName('sendToDashboard', INodeService.routes, inode.uuid);
    return this.httpClient.put<void>(url, null);
  }
}
