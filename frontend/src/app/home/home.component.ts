import { Component, OnInit } from '@angular/core';
import { TitlebarService } from '../mod-commons/mod-commons.module';

export interface IAppDesc {
  name: string,
  icon: string,
  url: string
}

/**
 * 
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  applications: IAppDesc[] = [
    {
      name: 'Dateien',
      icon: 'folder',
      url: '/files'
    },
    {
      name: 'Pin-Wand',
      icon: 'pinboard',
      url: ''
    },
    {
      name: 'Kalender',
      icon: 'calendar_month',
      url: ''

    },
    {
      name: 'Mail',
      icon: 'mail',
      url: ''
    },
    {
      name: 'Chat',
      icon: 'message',
      url: ''
    },
    {
      name: 'Benutzer-Verwaltung',
      icon: '/person',
      url: ''
    },
    
  ]
  /**
   * 
   * @param titlebarSvc 
   */
  constructor(
    private titlebarSvc: TitlebarService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
    this.titlebarSvc.subTitle = 'Home';
  }
}
