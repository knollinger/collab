import { Component, OnInit } from '@angular/core';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-user-main-view',
  templateUrl: './user-main-view.component.html',
  styleUrls: ['./user-main-view.component.css']
})
export class UserMainViewComponent implements OnInit {

  constructor(
    private titlebarSvc: TitlebarService) { }

  /**
   * 
   */
  ngOnInit(): void {
    this.titlebarSvc.subTitle = 'Benutzer-Verwaltung';
  }
}
