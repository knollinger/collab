import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { INodeService } from '../../../mod-files/services/inode.service';

/**
 * Die Component dient nur dazu, eine Route für den EntryPoint der WHiteboards setzen zu können.
 * 
 * Während Ihrer Initialisierung ermittelt sie die UUID des 'Whiteboards'-Folders des
 * Benutzers oder legt diesen ggf an. Anschließend wird auf den FileSysView dieses
 * Ordners geroutet. 
 */
@Component({
  selector: 'app-whiteboard-main',
  templateUrl: './whiteboard-main.component.html',
  styleUrls: ['./whiteboard-main.component.css'],
  standalone: false
})
export class WhiteboardMainComponent implements OnInit {

  constructor(
    private router: Router,
    private inodeSvc: INodeService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.inodeSvc.getHomeDir().subscribe(homeDir => {
      this.inodeSvc.getOrCreateFolder(homeDir.uuid, "Whiteboards").subscribe(baseDir => {

        const url = `files/main/${baseDir.uuid}`;
        this.router.navigateByUrl(url);
      })
    })
  }
}
