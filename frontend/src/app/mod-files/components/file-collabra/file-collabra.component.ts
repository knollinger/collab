import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { INode } from '../../models/inode';
import { WopiService } from '../../services/wopi.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-file-collabra',
  templateUrl: './file-collabra.component.html',
  styleUrls: ['./file-collabra.component.css']
})
export class FileCollabraComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

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
