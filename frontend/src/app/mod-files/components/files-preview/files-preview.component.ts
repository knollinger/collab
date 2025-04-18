import { Component, DestroyRef, EventEmitter, inject, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { INode } from '../../models/inode';
import { INodeService } from '../../services/inode.service';
import { WopiService } from '../../services/wopi.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-files-preview',
  templateUrl: './files-preview.component.html',
  styleUrls: ['./files-preview.component.css']
})
export class FilesPreviewComponent implements OnInit {

  private patternsToType: Map<RegExp, string> = new Map<RegExp, string>();

  @Input()
  inode: INode = INode.empty();

  @Output()
  close: EventEmitter<void> = new EventEmitter<void>();

  private destroyRef = inject(DestroyRef);

  /**
   * 
   * @param inodeSvc 
   * @param contentTypeSvc 
   * @param dialogRef 
   * @param data 
   */
  constructor(
    private inodeSvc: INodeService,
    private wopiSvc: WopiService) {
  }

  /**
   * 
   */
  ngOnInit(): void {

    this.patternsToType = new Map<RegExp, string>();
    this.patternsToType.set(/image\/.*/, 'image');
    this.patternsToType.set(/video\/.*/, 'video');
    this.patternsToType.set(/audio\/.*/, 'audio');
    this.patternsToType.set(/text\/.*/, 'text');
    
    this.wopiSvc.getWOPIMimeTypes()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(mimeTypes => {
      
      mimeTypes.map(type => {
        
        const masked = type.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(masked, 'g');
        this.patternsToType.set(regex, 'office');
      })

    });
  }

  /**
   * 
   * @returns 
   */
  public get detectType(): string {

    for (const [regExp, val] of this.patternsToType.entries()) {
      const res = this.inode.type.match(regExp);

      if (res) {
        return val;
      }
    }
    return '';
  }

  /**
   * 
   */
  public get srcUrl(): string {
    return this.inodeSvc.getContentUrl(this.inode.uuid);
  }

  onClosePreview() {
    this.close.emit();
  }
}
