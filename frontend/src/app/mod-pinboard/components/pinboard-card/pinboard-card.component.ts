import { Component, Input, OnInit } from '@angular/core';
import { AvatarService } from '../../../mod-userdata/mod-userdata.module';
import { PinCard } from '../../models/pincard';

@Component({
  selector: 'app-pinboard-card',
  templateUrl: './pinboard-card.component.html',
  styleUrls: ['./pinboard-card.component.css']
})
export class PinboardCardComponent implements OnInit {

  @Input()
  card: PinCard = PinCard.empty();

  constructor(
    private avatarSvc: AvatarService) {

  }

  ngOnInit(): void {
  }

  getOwnerAvatar(card: PinCard): string {

    return this.avatarSvc.getAvatarUrl(card.owner);
  }

  onDeleteCard(card: PinCard) {
    alert(`delete ${JSON.stringify(card.toJSON())}`);
  }
}
