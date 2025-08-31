import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BucketListItem, IBucketListItem } from '../../models/bucket-list-item';

export class FlatBucketListItem {

  constructor(public done: boolean, public title: string, public level: number) {

  }
}

@Component({
  selector: 'app-bucket-list',
  templateUrl: './bucket-list.component.html',
  styleUrls: ['./bucket-list.component.css'],
  standalone: false
})
export class BucketListComponent {

  rootBucket: BucketListItem = BucketListItem.empty();
  private currBucket: BucketListItem | null = null;

  @Output()
  selected: EventEmitter<BucketListItem> = new EventEmitter<BucketListItem>();

  @Input()
  readonly: boolean = false;

  @Input()
  set content(rawJSON: string) {

    if(rawJSON) {

      const rawChilds: IBucketListItem[] = JSON.parse(rawJSON);
      this.rootBucket.childs = rawChilds.map(rawChild => {
        return BucketListItem.fromJSON(rawChild, this.rootBucket);
      })
    }
  }

  /**
   * 
   */
  get rootItems(): BucketListItem[] {
    return this.rootBucket.childs;
  }


  /**
   * Ein Item wurde selektiert
   * 
   * @param item 
   */
  onSelect(item: BucketListItem) {

    if (this.currBucket) {
      this.currBucket.selected = false;
    }

    this.currBucket = item;
    this.currBucket.selected = true;
    this.selected.emit(item);
  }



  private makeFlatModel(items: IBucketListItem[], level: number = 0): FlatBucketListItem[] {

    const result: FlatBucketListItem[] = new Array<FlatBucketListItem>();
    items.forEach(item => {

      const flat = new FlatBucketListItem(item.done, item.title, level);
      result.push(flat);
      result.push(...this.makeFlatModel(item.childs!, level + 1));
    });
    return result;
  }
}
