import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface IInputBoxData {
  title: string,
  placeholder: string,
  value: string,
}

/**
 * 
 */
@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.css'],
  standalone: false
})
export class InputBoxComponent implements OnInit {

  /**
   * 
   * @param dialogRef 
   * @param data 
   */
  constructor(
    public dialogRef: MatDialogRef<InputBoxComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: IInputBoxData) { }

  /**
   * 
   */
  ngOnInit(): void {
  }

}
