import { Component, OnInit } from '@angular/core';
import { BackendRoutingService, TitlebarService } from '../mod-commons/mod-commons.module';

export interface IAppDesc {
  name: string,
  icon: string,
  url: string,
  disabled: boolean
}

/**
 * 
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
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
        url: '/files/main',
        disabled: false
      },
      {
        name: 'Kalender',
        icon: this.backendRouterSvc.getRouteForName("getIcon", HomeComponent.routes, "calendar"),
        url: '/calendar/show',
        disabled: false
      },
      {
        name: 'Mail',
        icon: this.backendRouterSvc.getRouteForName("getIcon", HomeComponent.routes, "mail"),
        url: '',
        disabled: true
      },
      {
        name: 'Chat',
        icon: this.backendRouterSvc.getRouteForName("getIcon", HomeComponent.routes, "chat"),
        url: '',
        disabled: true
      },
      {
        name: 'Pin-Wand',
        icon: this.backendRouterSvc.getRouteForName("getIcon", HomeComponent.routes, "pinwall"),
        url: '',
        disabled: true
      },
      {
        name: 'Benutzer-Verwaltung',
        icon: this.backendRouterSvc.getRouteForName("getIcon", HomeComponent.routes, "user"),
        url: '/user',
        disabled: false
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
