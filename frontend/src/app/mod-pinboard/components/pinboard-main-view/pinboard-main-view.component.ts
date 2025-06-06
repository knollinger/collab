import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TitlebarService } from '../../../mod-commons/mod-commons.module';
import { AvatarService } from '../../../mod-userdata/mod-userdata.module';

import { PinBoard } from '../../models/pinboard';
import { PinboardService } from '../../services/pinboard.service';

@Component({
  selector: 'app-pinboard-main-view',
  templateUrl: './pinboard-main-view.component.html',
  styleUrls: ['./pinboard-main-view.component.css']
})
export class PinboardMainViewComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  pinboards: PinBoard[] = new Array<PinBoard>();

  /**
   * 
   * @param titleBarSvc 
   */
  constructor(
    private pinBoardSvc: PinboardService,
    private avatarSvc: AvatarService,
    private titleBarSvc: TitlebarService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
    this.titleBarSvc.subTitle = "Pin-Wand";

    this.pinBoardSvc.getAllPinBoards()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(pinboards => {
        this.pinboards = pinboards;
      })
  }


  getAvatarUrl(board: PinBoard) {
    return this.avatarSvc.getAvatarUrl(board.owner);
  }
}
