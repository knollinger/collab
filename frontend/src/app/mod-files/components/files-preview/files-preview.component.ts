import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Observable, map } from 'rxjs';

import { INode } from '../../models/inode';
import { INodeService } from '../../services/inode.service';
import { WopiService } from '../../services/wopi.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-files-preview',
  templateUrl: './files-preview.component.html',
  styleUrls: ['./files-preview.component.css'],
  standalone: false
})
export class FilesPreviewComponent implements OnInit {

  private patternsToType: Map<RegExp, string> = new Map<RegExp, string>();

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
    private route: ActivatedRoute,
    private inodeSvc: INodeService,
    private titleBarSvc: TitlebarService,
    private wopiSvc: WopiService) {
  }

  /**
   * 
   */
  ngOnInit(): void {

    // UUID aus der Route lesen und inode laden
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        // INode laden
        this.inodeSvc.getINode(params.get('uuid') || '')
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(inode => {

            this.inode = inode;
            this.titleBarSvc.subTitle = inode.name;

            this.loadContentTypePatterns()
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe(patterns => {

                this.patternsToType = patterns;

              })
          })
      })
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
   * @returns 
   */
  private loadContentTypePatterns(): Observable<Map<RegExp, string>> {


    return this.wopiSvc.getWOPIMimeTypes()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(mimeTypes => {

          const patternsToType = new Map<RegExp, string>();

          mimeTypes.map(type => {

            const masked = type.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(masked, 'g');
            patternsToType.set(regex, 'collabara');
          })

          // standard-patterns

          patternsToType.set(/image\/.*/, 'image');
          patternsToType.set(/video\/.*/, 'video');
          patternsToType.set(/audio\/.*/, 'audio');
          patternsToType.set(/text\/.*/, 'quill');
          patternsToType.set(/application\/json/, 'quill');

          return patternsToType;
        }));
  }

  private getQuillPatterns(): RegExp[] {

    return [
      /text\/.*/,
      /application\/json/
    ];
  }

  /**
   * 
   */
  public get srcUrl(): string {
    return this.inodeSvc.getContentUrl(this.inode.uuid);
  }
}

