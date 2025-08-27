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
    if (rawJSON) {

      const rawItems = JSON.parse(rawJSON) as IBucketListItem[];
      const items = rawItems.map(item => {
        return BucketListItem.fromJSON(item, this.rootBucket);
      })
      this.rootBucket.childs = items;
    }

  }

  get content(): string {

    const json = this.rootBucket.childs.map(child => { return child.toJSON() })
    return JSON.stringify(json);
  }

  /**
   * 
   */
  get rootItems(): BucketListItem[] {
    return this.rootBucket.childs;
  }


  onKeyDown(evt: KeyboardEvent) {

    if (evt.ctrlKey) {

      switch (evt.key) {
        case 'ArrowUp':
          console.log('moveUp');
          break;

        case 'ArrowDown':
          console.log('moveDown');
          break;
      }
    }
  }

  onSelect(item: BucketListItem) {
    console.log(`select: ${item.title}`);
  }
}
