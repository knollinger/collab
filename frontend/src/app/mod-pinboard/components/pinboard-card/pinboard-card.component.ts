import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../mod-user/mod-user.module';
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
    private userSvc: UserService) {

  }

  ngOnInit(): void {
  }

  getOwnerAvatar(card: PinCard): string {

    return this.userSvc.getAvatarUrl(card.owner);
  }

  onDeleteCard(card: PinCard) {
    alert(`delete ${JSON.stringify(card.toJSON())}`);
  }
}
