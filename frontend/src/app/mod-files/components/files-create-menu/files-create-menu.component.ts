import { Component, EventEmitter, Input, Output } from '@angular/core';

import { INode } from '../../../mod-files-data/mod-files-data.module';

export class CreateMenuEvent {

  constructor(
    public readonly type: string,
    public readonly ext: string,
    public readonly parent: INode) {

  }
}

/**
 * 
 */
@Component({
  selector: 'app-files-create-menu',
  templateUrl: './files-create-menu.component.html',
  styleUrls: ['./files-create-menu.component.css'],
  standalone: false
})
export class FilesCreateMenuComponent {

  @Input()
  parent: INode = INode.empty();

  @Output()
  create: EventEmitter<CreateMenuEvent> = new EventEmitter<CreateMenuEvent>();

  /**
   * 
   * @param mimeType 
   * @param extension 
   */
  onMenuClick(mimeType: string, extension: string = '') {

    this.create.emit(new CreateMenuEvent(mimeType, extension, this.parent));
  }
}
