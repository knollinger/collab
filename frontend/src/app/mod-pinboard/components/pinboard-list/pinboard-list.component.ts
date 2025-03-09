import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PinboardService } from '../../services/pinboard.service';
import { PinCard } from '../../models/pincard';

@Component({
  selector: 'app-pinboard-list',
  templateUrl: './pinboard-list.component.html',
  styleUrls: ['./pinboard-list.component.css']
})
export class PinboardListComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  cards: PinCard[] = new Array<PinCard>();

  /**
   * 
   * @param pinBoardSvc 
   */
  constructor(private pinBoardSvc: PinboardService) {
  }


  /**
   * 
   */
  ngOnInit(): void {
  }

  /**
   * 
   */
  @Input()
  set uuid(uuid: string) {
    this._uuid = uuid;
    this.pinBoardSvc.getCardsFor(uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(cards => {
        this.cards = cards;
      })
  }
  get uuid(): string {
    return this._uuid;
  }
  private _uuid: string = '';

}
