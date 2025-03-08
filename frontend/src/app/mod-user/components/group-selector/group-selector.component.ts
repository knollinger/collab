import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Group } from '../../../mod-userdata/mod-userdata.module';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-group-selector',
  templateUrl: './group-selector.component.html',
  styleUrls: ['./group-selector.component.css']
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
  constructor() {
  }

  /**
   * 
   */
  ngOnInit(): void {

  }

  @Input()
  set multiple(val: string | boolean) {

    this._multiple = false;
  }

  get multiple(): boolean {
    return this._multiple;
  }

  /**
   * 
   * @param user 
   * @returns 
   */
  isSelected(group: Group): boolean {
    return true;
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
    }
  }
}
