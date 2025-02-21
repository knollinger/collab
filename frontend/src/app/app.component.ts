import { Component, OnInit } from '@angular/core';

import { CryptoService, SaveBlobService, TitlebarService } from './mod-commons/mod-commons.module';
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
    private cryptoSvc: CryptoService,
    private saveBlobSvc: SaveBlobService) {

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
   */
  onSearchResult(search: ISearchResultItem) {

    switch (search.type) {
      case 'inode':
        const inode = search as INodeSearchResultItem;
        this.router.navigateByUrl(`files/${inode.parent}#${inode.uuid}`);
        break;

      default:
        console.log(`unexpected search result type ${search.type}`);
        break;
    }
  }

  onTest() {

    this.cryptoSvc.createKeystore('Sun12shine')
      .then(keystore => {
        this.saveBlobSvc.saveBlob(keystore, 'MyKeystore.jwk')
        console.log(keystore);
      })
  }

  onTest1(evt: Event) {

    if(evt.target) {
      const input = evt.target as HTMLInputElement;
      if(input.files && input.files.length) {
        console.log(input.files[0]);

        const store = this.cryptoSvc.openKeystore(input.files[0], 'Sun12shine');
        console.log(store);
      }
    }
  }
}
