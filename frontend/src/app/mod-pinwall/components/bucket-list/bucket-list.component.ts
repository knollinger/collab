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

  @Input()
  rootBucket: BucketListItem = BucketListItem.empty();
  private currBucket: BucketListItem | null = null;

  @Input()
  readonly: boolean = false;
  
  @Output()
  selected: EventEmitter<BucketListItem> = new EventEmitter<BucketListItem>();

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
}
