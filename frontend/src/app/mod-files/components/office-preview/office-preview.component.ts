import { Component, Input } from '@angular/core';
import { INode } from '../../models/inode';
import { WopiService } from '../../services/wopi.service';

@Component({
  selector: 'app-office-preview',
  templateUrl: './office-preview.component.html',
  styleUrls: ['./office-preview.component.css']
})
export class OfficePreviewComponent {

  @Input()
  inode: INode = INode.empty();

  /**
   * 
   * @param wopiSvc 
   */
  constructor(private wopiSvc: WopiService) {

  }
  
  /**
   * 
   */
  public get launcherFormUrl(): string {
    return this.wopiSvc.getLauncherFormUrl(this.inode);
  }
}
