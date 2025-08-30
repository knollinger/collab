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

  private rootBucket: BucketListItem = BucketListItem.empty();
  private currBucket: BucketListItem | null = null;

  @Output()
  selected: EventEmitter<BucketListItem> = new EventEmitter<BucketListItem>();

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

      console.dir(this.makeFlatModel(items));
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
