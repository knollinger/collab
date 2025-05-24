import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-viewer-quill',
  templateUrl: './viewer-quill.component.html',
  styleUrls: ['./viewer-quill.component.css'],
  standalone: false
})
export class ViewerQuillComponent {

  @Input()
  uuid: string = '';
}
