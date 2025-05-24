import { Component, Input, OnInit } from '@angular/core';
import { INode } from '../../../mod-files-data/mod-files-data.module';

import { WopiService } from '../../../mod-files/mod-files.module';

@Component({
  selector: 'app-viewer-collabara',
  templateUrl: './viewer-collabara.component.html',
  styleUrls: ['./viewer-collabara.component.css'],
  standalone: false
})
export class ViewerCollabaraComponent implements OnInit {

  @Input()
  inode: INode = INode.empty();

  launcherFormUrl: string = '';

  /**
   * 
   * @param wopiSvc 
   */
  constructor(private wopiSvc: WopiService) {

  }

  /**
   * 
  */
  ngOnInit(): void {

    this.launcherFormUrl = this.wopiSvc.getLauncherFormUrl(this.inode);
  }
}
