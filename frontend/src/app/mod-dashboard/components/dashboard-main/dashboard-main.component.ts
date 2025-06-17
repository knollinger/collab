import { Component, OnInit } from '@angular/core';

import { BackendRoutingService, TitlebarService } from '../../../mod-commons/mod-commons.module';
import { SessionService } from '../../../mod-session/session.module';

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
    private sessionSvc: SessionService,
    private titleBarSvc: TitlebarService) {

    this.dashButtons =

      [
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
        }
      ];

    if (this.sessionSvc.isAdmin) {

      this.dashButtons.push({
        title: 'Benutzer-Verwaltung',
        icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardMainComponent.routes, "user"),
        link: '/user/users'
      });

      this.dashButtons.push({
        title: 'Gruppen-Verwaltung',
        icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardMainComponent.routes, "group"),
        link: '/user/groups'
      });
    }
  }

  /**
   * 
   */
  ngOnInit(): void {
    this.titleBarSvc.subTitle = 'Dashboard';
  }
}
