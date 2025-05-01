import { Component, Input } from '@angular/core';

/**
 * Zeigt einen Hinweis an.
 * 
 */
@Component({
  selector: 'app-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.css'],
  standalone: false
})
export class HintComponent {

  /**
   * Der HintText kann (muss aber nicht) HTML beinhalten
   */
  @Input()
  hint: string = '';
}
