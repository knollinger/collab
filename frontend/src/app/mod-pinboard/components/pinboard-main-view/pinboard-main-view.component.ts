import { Component, OnInit } from '@angular/core';

import { TitlebarService } from '../../../mod-commons/mod-commons.module';
import { UserService } from '../../../mod-user/mod-user.module';

import { PinBoard } from '../../models/pinboard';
import { PinboardService } from '../../services/pinboard.service';

@Component({
  selector: 'app-pinboard-main-view',
  templateUrl: './pinboard-main-view.component.html',
  styleUrls: ['./pinboard-main-view.component.css']
})
export class PinboardMainViewComponent implements OnInit {

  pinboards: PinBoard[] = new Array<PinBoard>();

  /**
   * 
   * @param titleBarSvc 
   */
  constructor(
    private pinBoardSvc: PinboardService,
    private userSvc: UserService,
    private titleBarSvc: TitlebarService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
    this.titleBarSvc.subTitle = "Pin-Wand";

    this.pinBoardSvc.getAllPinBoards().subscribe(pinboards => {
      this.pinboards = pinboards;
    })
  }


  getAvatarUrl(board: PinBoard) {
    return this.userSvc.getAvatarUrl(board.owner);
  }
}
