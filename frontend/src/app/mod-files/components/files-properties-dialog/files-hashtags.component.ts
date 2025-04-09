import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INode } from '../../models/inode';

@Component({
  selector: 'app-files-hashtags',
  templateUrl: './files-hashtags.component.html',
  styleUrls: ['./files-hashtags.component.css']
})
export class FilesHashtagsComponent {

  @Input()
  inode: INode = INode.empty();

  @Output()
  inodeChange: EventEmitter<INode> = new EventEmitter<INode>();

  @Output()
  hashTagsChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  onHashTagChanged(tags: string[]) {
    this.hashTagsChanged.emit(tags);  
  }
}
