import { Injectable } from '@angular/core';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { INode } from '../../mod-files-data/mod-files-data.module';

@Injectable({
  providedIn: 'root'
})
export class ImageThumnailService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getThumb', 'v1/filesys/thumbs/{1}']
    ]);

  constructor(private backendRouter: BackendRoutingService) { 

  }

  public getImageThumbnailUrl(inode: INode): string {
    return this.backendRouter.getRouteForName('getThumb', ImageThumnailService.routes, inode.uuid);
  }
}
