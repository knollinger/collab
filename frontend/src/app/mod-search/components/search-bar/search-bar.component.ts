import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { debounceTime, Subject } from 'rxjs';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { ISearchResultItem, SearchResult } from '../../models/search-result';

import { SearchService } from '../../services/search.service';

/**
 * Das ganze ist ein wenig komplizierter.
 * 
 * Bei einem input-Event auf dem Suchfeld wird der neue Wert auf einen
 * privaten Event-Emitter gesendet. AUf diesen wird mittels einer debounceTime
 * gelauscht. 
 * 
 * Dadurch wird nicht bei jedem Tasten-Anschlag ein Aufruf des SearchServices 
 * ausgelöst. Wenn wärend der Eingabe im Suchfeld eine Pause von 500ms passiert,
 * so wird der searchservice ausgelöst.
 */
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  @Input()
  placeholder: string = '';

  @Output()
  found: EventEmitter<ISearchResultItem> = new EventEmitter<ISearchResultItem>();

  private search: Subject<string> = new Subject<string>();
  results: SearchResult = SearchResult.empty();

  showClearBtn: boolean = false;

  /**
   * 
   * @param searchSvc 
   */
  constructor(private searchSvc: SearchService) {
  }

  /**
   * 
   */
  ngOnInit(): void {

    this.search.pipe(debounceTime(500)).subscribe(query => {

      if (!query) {
        this.results = SearchResult.empty();
      }
      else {
        this.searchSvc.search(query).subscribe(results => {
          this.results = results;
        })
      }
    })
  }

  /**
     * 
     * @param event 
    */
  public onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.showClearBtn = value !== '';
    this.search.next(value);
  }


  /**
   * 
   * @param evt 
   */
  onOptionSelected(evt: MatAutocompleteSelectedEvent, input: HTMLInputElement) {
    this.found.emit(evt.option.value);
    input.value = '';
    this.results = SearchResult.empty();
  }
}
