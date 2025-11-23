import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { INode } from '../../../mod-files-data/mod-files-data.module';
import { ACLEntry, CheckPermissionsService } from '../../../mod-permissions/mod-permissions.module';

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
  text: string = '';
  
  @Input()
  parent: INode = INode.empty();

  @Output()
  create: EventEmitter<CreateMenuEvent> = new EventEmitter<CreateMenuEvent>();

  constructor(private checkPermsSvc: CheckPermissionsService) {

  }

  get enabled(): boolean {

    return this.checkPermsSvc.hasPermissions(this.parent.acl, ACLEntry.PERM_WRITE);
  }

  /**
   * 
   * @param mimeType 
   * @param extension 
   */
  onMenuClick(mimeType: string, extension: string = '') {

    this.create.emit(new CreateMenuEvent(mimeType, extension, this.parent));
  }
}
