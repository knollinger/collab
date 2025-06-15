import { Component, OnInit } from '@angular/core';

import { BackendRoutingService, TitlebarService } from '../../../mod-commons/mod-commons.module';

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

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ["getIcon", "icons/{1}.svg"]
    ]
  );

  dashButtons: IDashButton[];

  /**
   * 
   * @param titleBarSvc 
   */
  constructor(
    private backendRouterSvc: BackendRoutingService,
    private titleBarSvc: TitlebarService) {

    this.dashButtons = [

      {
        title: 'Dateien',
        icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardMainComponent.routes, "folder"),
        link: '/files/main'
      },
      {
        title: 'Kalender',
        icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardMainComponent.routes, "calendar"),
        link: '/calendar/show'
      },
      {
        title: 'Mail',
        icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardMainComponent.routes, "mail"),
        link: ''
      },
      {
        title: 'Chat',
        icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardMainComponent.routes, "chat"),
        link: ''
      },
      {
        title: 'Pin-Wand',
        icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardMainComponent.routes, "pinwall"),
        link: ''
      },
      {
        title: 'Benutzer-Verwaltung',
        icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardMainComponent.routes, "user"),
        link: '/user'
      },
    ]
  }

  /**
   * 
   */
  ngOnInit(): void {
    this.titleBarSvc.subTitle = 'Dashboard';
  }
}
