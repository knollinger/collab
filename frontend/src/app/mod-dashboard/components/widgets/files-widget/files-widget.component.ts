import { Component } from '@angular/core';
import { IWidget } from '../../dashboard-widget/iwidget';

@Component({
  selector: 'app-files-widget',
  templateUrl: './files-widget.component.html',
  styleUrls: ['./files-widget.component.css'],
  standalone: false
})
export class FilesWidgetComponent implements IWidget  {

}
