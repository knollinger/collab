import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search-result-item',
  templateUrl: './search-result-item.component.html',
  styleUrls: ['./search-result-item.component.css'],
  standalone: false
})
export class SearchResultItemComponent {

  @Input()
  icon: string = '';
  
  @Input()
  name: string = '';
}
