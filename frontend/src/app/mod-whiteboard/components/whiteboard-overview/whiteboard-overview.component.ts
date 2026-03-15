import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { INodeService } from '../../../mod-files/mod-files.module';
import { SessionService } from '../../../mod-session/session.module';

/**
 * 
 */
@Component({
  selector: 'app-whiteboard-overview',
  templateUrl: './whiteboard-overview.component.html',
  styleUrls: ['./whiteboard-overview.component.css']
})
export class WhiteboardOverviewComponent implements OnInit {

  /**
   * 
   * @param router 
   * @param sessSvc 
   * @param fileSvc 
   */
  constructor(
    private router: Router,
    private sessSvc: SessionService,
    private fileSvc: INodeService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    const userId = this.sessSvc.currentUser.userId;
    this.fileSvc.getOrCreateFolder(userId, 'Whiteboards')
      .pipe()
      .subscribe(whiteboardFldr => {

        const route = `/files/main/${whiteboardFldr.uuid}`;
        this.router.navigateByUrl(route);
      })
  }
}
