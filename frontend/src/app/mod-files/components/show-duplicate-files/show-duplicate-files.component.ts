import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { INode } from '../../models/inode';
import { ContentTypeService } from '../../services/content-type.service';

@Component({
  selector: 'app-show-duplicate-files',
  templateUrl: './show-duplicate-files.component.html',
  styleUrls: ['./show-duplicate-files.component.css'],
  standalone: false
})
export class ShowDuplicateFilesComponent implements OnInit {

  public readonly ACTION_CANCEL: number = 0;
  public readonly ACTION_OVERWRITE: number  = 1;
  public readonly ACTION_AUTORENAME: number = 2;
  

  /**
   * 
   * @param dialogRef 
   * @param data 
   */
  constructor(
    private contentTypeSvc: ContentTypeService,
    public dialogRef: MatDialogRef<ShowDuplicateFilesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public inodes: INode[]) {

  }

  /**
   * 
   */
  ngOnInit(): void {
  }

  /**
   * 
   * @param inode 
   * @returns 
   */
  getIcon(inode: INode): string {
    return this.contentTypeSvc.getTypeIconUrl(inode.type);
  }
}
