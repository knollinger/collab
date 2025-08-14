import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, Subject } from 'rxjs';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


interface RenderFunc {
  (option: any): string;
}


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private debouncer: Subject<string> = new Subject<string>();

  @Input()
  value: any | null = null;

  @Input()
  public optionsFound: any[] = new Array<any>();

  @Output()
  public searchChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  public selected: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Etabliere den Debouncing-Listener für das SuchFeld.
   */
  ngOnInit(): void {

    this.debouncer.pipe(
      debounceTime(500),
      takeUntilDestroyed(this.destroyRef))
      .subscribe(query => {
        this.searchChange.next(query);
      })
  }

  /**
   * 
   * @param input 
   */
  onClear(input: HTMLInputElement) {
    input.value = '';
    this.debouncer.next('');

  }

  /**
   * 
   * @param evt 
   */
  onKeyUp(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
      this.onClear(evt.target as HTMLInputElement);
    }
  }

  /**
   * Bei einem Input im SuchFeld wird das DebounceSubject mit dem neuen Wert bestückt.
   * 
   * @param evt 
   */
  onSearchInput(evt: any) {

    const input = evt.target as HTMLInputElement;
    const value = input.value;
    this.debouncer.next(value);
  }

  /**
   * 
   * @param evt 
   */
  onOptionSelected(evt: MatAutocompleteSelectedEvent) {

    this.selected.emit(evt.option.value);
  }
}
