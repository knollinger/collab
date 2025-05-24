import { Component, Input } from '@angular/core';

import { INode } from '../../../mod-files-data/mod-files-data.module';

@Component({
  selector: 'app-viewer-quill',
  templateUrl: './viewer-quill.component.html',
  styleUrls: ['./viewer-quill.component.css'],
  standalone: false
})
export class ViewerQuillComponent {

  @Input()
  inode: INode = INode.empty()
}
