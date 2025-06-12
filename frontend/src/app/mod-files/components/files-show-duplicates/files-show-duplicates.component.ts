import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { INode } from '../../../mod-files-data/mod-files-data.module';

/**
 * 
 */
export interface IShowDuplicatesDialogData {
  inodes: INode[]
}

/**
 *  
 */
export interface IDuplicateINodesResponseItem {

  uuid: string,
  action: string,
  name: string
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

  /**
   * 
   * @param formBuilder 
   */
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FilesShowDuplicatesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: IShowDuplicatesDialogData) {

    this.form = this.formBuilder.group({
      inodes: this.formBuilder.array([])
    });
    this.fillINodes(data.inodes);
  }

  /**
   * Erzeuge die Elemente des FormArray und fülle diese in den 
   * Dialog ein
   * 
   * @param inodes 
   */
  private fillINodes(inodes: INode[]) {

    for (let inode of inodes) {

      const group = this.formBuilder.group({
        uuid: new FormControl(inode.uuid),
        name: new FormControl(inode.name, [Validators.required]),
        action: new FormControl('SKIP')

      });
      this.inodeRows.push(group);
    }
  }

  /**
   * Liefere das FormArray mit den INodes
   */
  get inodeRows(): FormArray {
    return this.form.get('inodes') as FormArray;
  }

  getINodeRow(i: number): FormGroup {

    return this.inodeRows.at(i) as FormGroup;
  }

  onSubmit() {
    this.dialogRef.close(this.resultActions);
  }

  /**
   * 
   */
  private get resultActions(): IDuplicateINodesResponseItem[] {

    console.log('getResultItems')
    const result = new Array<IDuplicateINodesResponseItem>();

    const rows = this.inodeRows;
    for (let i = 0; i < rows.length; ++i) {

      const row = rows.at(i);
      const rowVal = row.value as IDuplicateINodesResponseItem;
      result.push(rowVal);
    }
    return result;
  }
}
