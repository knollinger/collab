import { Component, OnInit } from '@angular/core';
import { BackendRoutingService, TitlebarService } from '../mod-commons/mod-commons.module';

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

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ["getIcon", "icons/{1}.svg"]
    ]
  );
  applications: IAppDesc[];

  /**
   * 
   * @param titlebarSvc 
   */
  constructor(
    private titlebarSvc: TitlebarService,
    private backendRouterSvc: BackendRoutingService) {

    this.applications = [
      {
        name: 'Dateien',
        icon: this.backendRouterSvc.getRouteForName("getIcon", HomeComponent.routes, "folder"),
        url: '/files'
      },
      {
        name: 'Kalender',
        icon: this.backendRouterSvc.getRouteForName("getIcon", HomeComponent.routes, "calendar"),
        url: ''

      },
      {
        name: 'Mail',
        icon: this.backendRouterSvc.getRouteForName("getIcon", HomeComponent.routes, "mail"),
        url: ''
      },
      {
        name: 'Chat',
        icon: this.backendRouterSvc.getRouteForName("getIcon", HomeComponent.routes, "chat"),
        url: ''
      },
      {
        name: 'Pin-Wand',
        icon: this.backendRouterSvc.getRouteForName("getIcon", HomeComponent.routes, "pinwall"),
        url: ''
      },
      {
        name: 'Benutzer-Verwaltung',
        icon: this.backendRouterSvc.getRouteForName("getIcon", HomeComponent.routes, "user"),
        url: '/user'
      }
    ]
  }

  /**
   * 
   */
  ngOnInit(): void {
    this.titlebarSvc.subTitle = 'Home';
  }
}
