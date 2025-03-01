import { Component, OnInit } from '@angular/core';

import { TitlebarService } from './mod-commons/mod-commons.module';
import { SessionService } from './mod-session/session.module';
import { INodeSearchResultItem, ISearchResultItem } from './mod-search/models/search-result';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  public title: string = '';

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
}
