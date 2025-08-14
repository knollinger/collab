import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, Subject } from 'rxjs';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';
import { SearchResult } from '../../models/search-result';
import { SearchService } from '../../services/search.service';

/**
 * Die Such-Page
 * 
 */
@Component({
  selector: 'app-search-main',
  templateUrl: './search-main.component.html',
  styleUrls: ['./search-main.component.css']
})
export class SearchMainComponent implements OnInit {

  filterMenuEntries = [
    { name: 'Dateien', filter: 'INODES' },
    { name: 'Benutzer', filter: 'USERS' },
    { name: 'Gruppen', filter: 'GROUPS' },
  ]

  private destroyRef = inject(DestroyRef);
  private search: Subject<string> = new Subject<string>();
  private filters: Set<string> = new Set<string>();
  results: SearchResult = SearchResult.empty();

  /**
   * 
   * @param searchSvc 
   */
  constructor(
    private titlebarSvc: TitlebarService,
    private searchSvc: SearchService) {

  }

  /**
   * Input
   */
  ngOnInit(): void {

    this.titlebarSvc.subTitle = 'Suchen';
    this.establishDebouncedListener();
  }

  /**
   * Bei jedem Input in das Eingabefeld emittieren wir den 
   * neuen Feld-Inhalt über das search-Subject.
   * 
   * Auf diesem Subject lauscht ein DebouncedListener, welcher 
   * Änderungen erst nach 500ms verarbeitet.
   * 
   * @param evt 
   */
  onInput(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const value = input.value;
    this.search.next(value);
  }

  /**
   * 
   */
  private establishDebouncedListener() {

    this.search.pipe(
      debounceTime(500),
      takeUntilDestroyed(this.destroyRef))
      .subscribe(query => {

        if (!query) {
          this.results = SearchResult.empty();
        }
        else {

          this.searchSvc.search(query)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(results => {
              this.results = results;
            })
        }
      })
  }

  /**
   * Lösche die Suche. Dies ist der Callback für den Click auf das Clear-Icon
   * 
   * @param input
   */
  onClear(input: HTMLInputElement) {
    input.value = '';
    this.results = SearchResult.empty();
  }

  /**
   * Der KeyboardHandler.
   * 
   * Aktuell wird nur Escape behandelt, aber wer weis?
   * 
   * @param evt 
   */
  onKeyUp(evt: KeyboardEvent) {

    switch (evt.key) {
      case 'Escape':
        evt.stopPropagation();
        this.onClear(evt.target as HTMLInputElement);
        break;

      default:
        break;
    }
  }

  /**
   * 
   * @param evt 
   * @param filter 
   */
  onFilterSelection(evt: Event, filter: string) {
    evt.stopPropagation();

    if (this.filters.has(filter)) {
      this.filters.delete(filter);
    }
    else {
      this.filters.add(filter);
    }
  }

  /**
   * 
   * @param filter 
   * @returns 
   */
  isFilterSelected(filter: string): boolean {
    return this.filters.has(filter);
  }
}
