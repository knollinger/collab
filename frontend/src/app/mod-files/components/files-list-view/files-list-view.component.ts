import { Component, Input, OnInit } from '@angular/core';
import { ContentTypeService } from '../../services/content-type.service';

import { INode } from '../../models/inode';

@Component({
  selector: 'app-files-list-view',
  templateUrl: './files-list-view.component.html',
  styleUrls: ['./files-list-view.component.css']
})
export class FilesListViewComponent implements OnInit {

  @Input()
  inodes: INode[] = new Array<INode>();

  displayedColumns = ['checkbox', 'icon', 'name', 'size', 'created', 'modified', 'menu'];
  
  constructor(private contentTypeSvc: ContentTypeService) { }

  ngOnInit(): void {
  }

  getIcon(inode: INode): string {

    return this.contentTypeSvc.getTypeIconUrl(inode.type);
  }
}
