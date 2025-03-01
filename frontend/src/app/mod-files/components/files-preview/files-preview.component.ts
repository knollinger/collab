import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { INode } from '../../models/inode';
import { INodeService } from '../../services/inode.service';
import { SpinnerService } from '../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-files-preview',
  templateUrl: './files-preview.component.html',
  styleUrls: ['./files-preview.component.css']
})
export class FilesPreviewComponent implements OnInit, OnDestroy {

  src: string = '';

  @Output()
  close: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  set file(inode: INode) {

    this.spinnerSvc.addPendingRequest();
    this.spinnerSvc.setMessage(`Lade ${inode.name}`);
    this._file = inode;
    this.src = this.inodeSvc.getContentUrl(inode.uuid);
  }

  /**
   * 
   */
  get file(): INode {
    return this._file;
  }
  private _file: INode = INode.empty();

  /**
   * 
   */
  onLoaded() {

    this.spinnerSvc.removePendingRequest();
  }

  /**
   * 
   * @param inodeSvc 
   */
  constructor(
    private route: ActivatedRoute,
    private spinnerSvc: SpinnerService,
    private inodeSvc: INodeService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

  }

  /**
   * 
   */
  ngOnDestroy(): void {

  }

  /**
   * 
   */
  public get mainType(): string {

    return this.file.type.split('/')[0];
  }

  /**
   * 
   */
  public get srcUrl(): string {
    return this.inodeSvc.getContentUrl(this.file.uuid);
  }

  /**
   * 
   */
  public onClosePreview() {
    this.close.emit();
  }
}
