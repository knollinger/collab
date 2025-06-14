import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

/**
 * 
 */
export interface IShowDuplicatesDialogData {
  names: string[]
}

/**
 *  
 */
export interface IDuplicateNamesResponseItem {

  uuid: string,
  action: string,
  oldName: string,
  newName: string,
}

/**
 * 
 */
@Component({
  selector: 'app-files-show-duplicates',
  templateUrl: './files-show-duplicates.component.html',
  styleUrls: ['./files-show-duplicates.component.css'],
  standalone: false
})
export class FilesShowDuplicatesComponent {

  form: FormGroup;
  private names: string[];

  /**
   * 
   * @param formBuilder 
   */
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FilesShowDuplicatesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: IShowDuplicatesDialogData) {

    this.names = data.names;
    this.form = this.formBuilder.group({
      names: this.formBuilder.array([])
    });
    this.fillINodes();
  }

  /**
   * Erzeuge die Elemente des FormArray und fülle diese in den 
   * Dialog ein
   * 
   * @param inodes 
   */
  private fillINodes() {

    for (let name of this.names) {

      const group = this.formBuilder.group({
        oldName: new FormControl(name),
        newName: new FormControl(name, [Validators.required]),
        action: new FormControl('SKIP')

      });
      this.nameRows.push(group);
    }
  }

  /**
   * Liefere das FormArray mit den INodes
   */
  get nameRows(): FormArray {
    return this.form.get('names') as FormArray;
  }

  getNameRow(rowNr: number): FormGroup {

    return this.nameRows.at(rowNr) as FormGroup;
  }

  onSubmit() {
    this.dialogRef.close(this.resultActions);
  }

  /**
   * 
   */
  private get resultActions(): IDuplicateNamesResponseItem[] {

    const result = new Array<IDuplicateNamesResponseItem>();

    const rows = this.nameRows;
    for (let i = 0; i < rows.length; ++i) {

      const row = rows.at(i);
      const rowVal = row.value as IDuplicateNamesResponseItem;
      result.push(rowVal);
    }

    return result;
  }
}
