import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs';

import { TitlebarService } from './mod-commons/mod-commons.module';
import { SessionService } from './mod-session/session.module';
import { INodeSearchResultItem, ISearchResultItem } from './mod-search/models/search-result';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {

  public title: string = '';
  private _showGoBack: boolean = false;
  private _showGoHome: boolean = false;
  private _showSearch: boolean = false;

  /**
   * 
   * @param titlebarSvc 
   */
  constructor(
    private router: Router,
    private location: Location,
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

  get isShowGoBack(): boolean {
    return this.isLoggedOn && this._showGoBack;
  }

  get isShowGoHome(): boolean {
    return this.isLoggedOn && this._showGoHome;
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
        //        console.log(`unexpected search result type ${search.type}`);
        break;
    }
  }

  onGoBack() {
    this.location.back();
  }

  private establishRouterGuard() {

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd))
      .subscribe(event => {
        const url = (event as NavigationEnd).url;
        this._showSearch = (url !== '/search');
        this._showGoBack = url !== '/home';
        this._showGoHome = url !== '/home';
      });
  }
}
