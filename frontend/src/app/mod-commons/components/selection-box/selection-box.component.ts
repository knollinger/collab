import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';

export interface ISelectionBoxEntry {
  text: string,
  key: string
}

export interface ISelectionBoxData {
  title: string,
  message: string,
  entries: ISelectionBoxEntry[]
}

@Component({
  selector: 'app-selection-box',
  templateUrl: './selection-box.component.html',
  styleUrls: ['./selection-box.component.css'],
  standalone: false
})
export class SelectionBoxComponent {

  selected: string | undefined = undefined;

  /**
   * 
   * @param dialogRef 
   * @param data 
   */
  constructor(public dialogRef: MatDialogRef<SelectionBoxComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ISelectionBoxData) {

      this.selected = data.entries[0].key;
  }

  /**
   * 
   * @param evt 
   */
  onSelectionChange(evt: MatSelectionListChange) {

    const option = evt.options[0];
    this.selected = option.value;
  }

  /**
   * 
   * @param entry 
   */
  onDoubleClick(entry: ISelectionBoxEntry) {
    this.dialogRef.close(entry.key);
  }
}
