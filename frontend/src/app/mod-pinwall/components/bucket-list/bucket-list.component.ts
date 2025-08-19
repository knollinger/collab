import { Component, Input } from '@angular/core';

import { BucketListItem, IBucketListItem } from '../../models/bucket-list-item';

@Component({
  selector: 'app-bucket-list',
  templateUrl: './bucket-list.component.html',
  styleUrls: ['./bucket-list.component.css'],
  standalone: false
})
export class BucketListComponent {

  private rootBucket: BucketListItem = BucketListItem.empty();

  @Input()
  readonly: boolean = false;
  
  @Input()
  set content(rawJSON: string) {

    this.rootBucket = new BucketListItem(false, '', null, []);

    const rawItems = JSON.parse(rawJSON) as IBucketListItem[];
    const childs = rawItems.map(item => {
      return BucketListItem.fromJSON(item, this.rootBucket);
    })
    this.rootBucket.childs = childs;
  }

  /**
   * 
   */
  get rootItems(): BucketListItem[] {
    return this.rootBucket.childs;
  }
}
