import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs';

import { TitlebarService } from './mod-commons/mod-commons.module';
import { SessionService } from './mod-session/session.module';
import { INodeSearchResultItem, ISearchResultItem } from './mod-search/models/search-result';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

export interface IMenuItem {
  icon: string,
  title: string,
  route: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {

  public title: string = '';
  private _showSearch: boolean = false;
  private _showDashboard: boolean = false;

  menuItems: IMenuItem[] = [

    {
      icon: 'dashboard',
      title: 'Dashboard',
      route: '/dashboard'
    },
    {
      icon: 'folder',
      title: 'Dateien',
      route: '/files/main'
    },
    {
      icon: 'calendar_month',
      title: 'Kalender',
      route: '/calendar/show'
    },
    {
      icon: 'mail',
      title: 'Mail',
      route: '/mail'
    },
    {
      icon: 'chat',
      title: 'Chat',
      route: '/chat'
    },
    {
      icon: 'note_alt',
      title: 'Pinwand',
      route: '/pinwall/main'
    },
    {
      icon: 'person',
      title: 'Benutzer',
      route: '/user/users'
    },
    {
      icon: 'group',
      title: 'Benutzer-Gruppen',
      route: '/user/groups'
    }
  ]

  /**
   * 
   * @param titlebarSvc 
   */
  constructor(
    private router: Router,
    private titlebarSvc: TitlebarService,
    private sessSvc: SessionService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.establishRouterGuard();

    this.titlebarSvc.title.subscribe(newTitle => {

      window.setTimeout(() => {

        this.title = newTitle;
        document.title = newTitle;
      }, 10);
    });

  }


  /**
   * 
   * @returns 
   */
  get isLoggedOn(): boolean {
    return !this.sessSvc.currentUser.isEmpty();
  }

  get isShowSearch(): boolean {
    return this.isLoggedOn && this._showSearch;
  }

  get isShowDashboard(): boolean {
    return this.isLoggedOn && this._showDashboard;
  }

  /** 
   * 
   */
  onSearchResult(search: ISearchResultItem) {

    switch (search.type) {
      case 'inode':
        const inode = search as INodeSearchResultItem;
        this.router.navigateByUrl(`files/${inode.parent}#${inode.uuid}`);
        break;

      default:
        break;
    }
  }

  /**
   * 
   */
  private establishRouterGuard() {

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd))
      .subscribe(event => {
        const url = (event as NavigationEnd).url;
        this._showSearch = (url !== '/search');
        this._showDashboard = (url !== '/dashboard');
        
      });
  }
}
