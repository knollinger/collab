import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AvatarService, Group } from '../../../mod-userdata/mod-userdata.module';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-group-selector',
  templateUrl: './group-selector.component.html',
  styleUrls: ['./group-selector.component.css'],
  standalone: false
})
export class GroupSelectorComponent implements OnInit {

  @Input()
  groups: Group[] = new Array<Group>();

  @Input()
  selection: Group[] = new Array<Group>();

  @Output()
  selectionChange: EventEmitter<Group[]> = new EventEmitter<Group[]>();

  private _multiple: boolean = false;

  /**
   * 
   */
  constructor(
    private avatarSvc: AvatarService) {
  }

  /**
   * 
   */
  ngOnInit(): void {

  }

  @Input()
  set multiple(val: boolean) {

    this._multiple = val;
  }

  get multiple(): boolean {
    return this._multiple;
  }

  /**
   * 
   * @param evt 
   */
  onGroupSelectionChange(evt: MatSelectionListChange) {

    const selected = evt.source.selectedOptions.selected;
    if (selected && selected.length) {

      const groups = new Array<Group>();
      for (let option of selected) {
        groups.push(option.value);
      }
      this.selectionChange.emit(groups);
      this.selection = groups;
    }
  }

  //
  isSelected(group: Group) {

    for (let selection of this.selection) {
      if(group.uuid == selection.uuid) {
        return true;
      }
    }
    return false;
  }

  getAvatar(group: Group): string {

    return this.avatarSvc.getAvatarUrl(group.uuid);
  }
}
