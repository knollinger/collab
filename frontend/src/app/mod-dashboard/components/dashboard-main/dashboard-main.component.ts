import { Component, OnInit } from '@angular/core';

import {  TitlebarService } from '../../../mod-commons/mod-commons.module';

export interface IDashButton {
  title: string,
  icon: string,
  link: string
}

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css'],
  standalone: false
})
export class DashboardMainComponent implements OnInit {

  /**
   * 
   * @param titleBarSvc 
   */
  constructor(
    private titleBarSvc: TitlebarService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
    this.titleBarSvc.subTitle = 'Dashboard';
  }
}
