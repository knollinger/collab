import { Injectable, Type } from '@angular/core';
import { INode } from '../../mod-files-data/mod-files-data.module';
import { DefaultThumbnailComponent } from '../components/thumbnails/default-thumbnail/default-thumbnail.component';
import { IThumbNail } from '../components/thumbnails/ithumbnail';
import { ImageThumbnailComponent } from '../components/thumbnails/image-thumbnail/image-thumbnail.component';
import { VideoThumbnailComponent } from '../components/thumbnails/video-thumbnail/video-thumbnail.component';

class RegEntry {

  constructor(
    public readonly regexp: RegExp,
    public readonly type: Type<IThumbNail>) {

  }
}

/**
 * Liefert den Typescript-Type für einen durch eine INode definierten Type.
 * 
 * Die Idee ist, innerhalb eines FolderViews Preview-Images für die verschiedenen
 * Dateitypen anzeigen zu können. Die Factory liefert nur Typ-Referenzen, diese 
 * können aber problemlos via <ng-container [ngComponentOutlet]="type"></ng-container>
 * eingebettet werden.
 * 
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class ThumbnailFactoryService {

  private registry: RegEntry[] = [
    new RegEntry(new RegExp('image/.*', 'i'), ImageThumbnailComponent),
    new RegEntry(new RegExp('video/.*', 'i'), VideoThumbnailComponent)
  ]

  constructor() { }

  getThumbnailFor(inode: INode): Type<IThumbNail> {

    let result: Type<IThumbNail> = DefaultThumbnailComponent;

    for(let entry of this.registry) {
      if(entry.regexp.test(inode.type)) {
        result = entry.type;
        break;
      }
    }
    return result;
  }
}
