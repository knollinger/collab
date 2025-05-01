import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CreateMenuItemDesc, CreateMenuItemGroup } from '../../models/create-menu-item';

@Component({
  selector: 'app-files-create-menu',
  templateUrl: './files-create-menu.component.html',
  styleUrls: ['./files-create-menu.component.css'],
  standalone: false
})
export class FilesCreateMenuComponent {

  @Input()
  group: CreateMenuItemGroup = CreateMenuItemGroup.empty();

  @Output()
  click: EventEmitter<CreateMenuItemDesc> = new EventEmitter<CreateMenuItemDesc>();

  onClick(desc: CreateMenuItemDesc) {
    this.click.emit(desc);
  }
}
