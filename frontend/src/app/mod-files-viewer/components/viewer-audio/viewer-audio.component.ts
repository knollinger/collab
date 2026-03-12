import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { INode } from '../../../mod-files-data/mod-files-data.module';
import { INodeService } from '../../../mod-files/mod-files.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-viewer-audio',
  templateUrl: './viewer-audio.component.html',
  styleUrls: ['./viewer-audio.component.css'],
  standalone: false
})
export class ViewerAudioComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private imageINode: INode = INode.empty();
  private audioINode: INode = INode.empty();

  /**
   * 
   * 
   * @param inodeSvc 
   */
  constructor(
    private route: ActivatedRoute,
    private inodeSvc: INodeService,
    private titleBarSvc: TitlebarService) {
  }

  ngOnInit() {

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const uuid = params.get('uuid') || '';
        this.inodeSvc.getINode(uuid)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(inode => {

            this.audioINode = inode;
            this.titleBarSvc.subTitle = inode.name;
            this.tryToLoadImage(inode);
          })
      })
  }

  get hasINode(): boolean {
    return !this.audioINode.isEmpty();
  }
  get imageUrl(): string {

    let result = '';
    if (!this.imageINode.isEmpty()) {
      result = this.inodeSvc.getContentUrl(this.imageINode.uuid);
    }
    return result;
  }

  get sourceUrl(): string {

    const url = this.inodeSvc.getContentUrl(this.audioINode.uuid);
    return url;
  }

  get type(): string {
    return this.audioINode.type;
  }

  private tryToLoadImage(audioINode: INode) {

    this.inodeSvc.getAllChilds(audioINode.parent, false)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(childs => {

        for (let child of childs) {
          if (child.type.startsWith('image/')) {
            this.imageINode = child;
            break;
          }
        }
      })
  }
}
