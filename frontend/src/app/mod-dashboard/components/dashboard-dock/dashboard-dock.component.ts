import { Component } from '@angular/core';
import { BackendRoutingService } from '../../../mod-commons/mod-commons.module';
import { SessionService } from '../../../mod-session/session.module';

export interface IDockButton {
  title: string,
  icon: string,
  link: string
}

@Component({
  selector: 'app-dashboard-dock',
  templateUrl: './dashboard-dock.component.html',
  styleUrls: ['./dashboard-dock.component.css'],
  standalone: false
})
export class DashboardDockComponent {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ["getIcon", "icons/{1}.svg"]
    ]
  );

  dockButtons: IDockButton[];

  constructor(
    private backendRouterSvc: BackendRoutingService,
    private sessionSvc: SessionService) {

    this.dockButtons =

      [
        {
          title: 'Dateien',
          icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardDockComponent.routes, "folder"),
          link: '/files/main'
        },
        {
          title: 'Kalender',
          icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardDockComponent.routes, "calendar"),
          link: '/calendar/show'
        },
        {
          title: 'Mail',
          icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardDockComponent.routes, "mail"),
          link: ''
        },
        {
          title: 'Chat',
          icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardDockComponent.routes, "chat"),
          link: ''
        },
        {
          title: 'Pin-Wand',
          icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardDockComponent.routes, "pinwall"),
          link: ''
        }
      ];

    if (this.sessionSvc.isAdmin) {

      this.dockButtons.push({
        title: 'Benutzer-Verwaltung',
        icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardDockComponent.routes, "user"),
        link: '/user/users'
      });

      this.dockButtons.push({
        title: 'Gruppen-Verwaltung',
        icon: this.backendRouterSvc.getRouteForName("getIcon", DashboardDockComponent.routes, "group"),
        link: '/user/groups'
      });
    }
  }
}
