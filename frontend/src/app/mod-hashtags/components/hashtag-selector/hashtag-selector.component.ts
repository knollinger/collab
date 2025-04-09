import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';

import { HashTagService } from '../../services/hash-tag.service';

import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-hashtag-selector',
  templateUrl: './hashtag-selector.component.html',
  styleUrls: ['./hashtag-selector.component.css']
})
export class HashTagSelectorComponent implements OnInit {

  @Input()
  resourceId: string = '';

  @Output()
  hashTagsChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  private destroyRef = inject(DestroyRef);

  separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  allHashTags: string[] = new Array<string>();
  hashTags: Set<string> = new Set<string>();
  filteredHashTags: Observable<string[]>;

  hashTagCtrl = new FormControl('');

  /**
   * 
   */
  constructor(private hashTagSvc: HashTagService) {

    this.filteredHashTags = this.hashTagCtrl.valueChanges.pipe(
      startWith(null),
      map((hashTag: string | null) => (hashTag ? this._filter(hashTag) : this.allHashTags.slice())),
    );
  }

  /**
   * 
   */
  ngOnInit() {

    this.hashTagSvc.getAllHashTags()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(allTags => {
        this.allHashTags = allTags;

        this.hashTagSvc.getHashTagsByResourceId(this.resourceId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(tags => {

            this.hashTags = new Set<string>(tags);
          })
      })
  }

  /**
   * Ein neues HashTag wird per Eingabe ins InputField hinzu gefügt
   * 
   * @param event 
   */
  onAdd(event: MatChipInputEvent): void {

    let value = event.value.toLowerCase();
    while (value.startsWith('#')) {
      value = value.substring(1);
    }

    if (value) {
      this.hashTags.add(value);
      this.notifyObservers();
    }

    event.chipInput.clear();
    this.hashTagCtrl.setValue(null);
  }

  /**
   * Ein bestehendes HashTag wird entfernt
   * 
   * @param hashTag 
   */
  onRemove(hashTag: string): void {
    this.hashTags.delete(hashTag.toLowerCase());
    this.notifyObservers();
  }

  /**
   * Aus dem AutoSelect wurde ein Element ausgewählt
   * @param event 
   */
  onAutoCompleteSelected(event: MatAutocompleteSelectedEvent): void {
    this.hashTags.add(event.option.viewValue);
    this.hashTagCtrl.setValue(null);
    this.notifyObservers();
  }

  /**
   * 
   */
  private notifyObservers() {

    const result = new Array<string>();
    this.hashTags.forEach(tag => {
      result.push(tag);
    })
    this.hashTagsChanged.emit(result);
  }

  private _filter(value: string): string[] {

    const filterValue = value.toLowerCase();

    return this.allHashTags.filter(hashtag => hashtag.toLowerCase().includes(filterValue));
  }
}
