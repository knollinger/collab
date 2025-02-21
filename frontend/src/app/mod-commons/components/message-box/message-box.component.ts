import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export interface MessageBoxData {
  title: string;
  msg: string;
  type: string;
}

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit {

  /**
   *
   */
  constructor(
    // public dialogRef: MatDialogRef<MessageBoxComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: MessageBoxData) {

  }

  /**
   *
   */
  ngOnInit() {
  }
}
