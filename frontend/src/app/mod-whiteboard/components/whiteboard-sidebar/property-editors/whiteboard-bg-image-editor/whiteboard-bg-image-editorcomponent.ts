import { Component, DestroyRef, inject, Input } from '@angular/core';

import { FilesPickerService, INodeService } from '../../../../../mod-files/mod-files.module';
import { AbstractShape } from '../../../../drawables/shapes/abstractshape';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImageFillEffect } from '../../../../fill-effects/image-fill-effect';
import { WhiteboardModel } from '../../../../models/whiteboard-model';

@Component({
  selector: 'app-whiteboard-bg-image-editor',
  templateUrl: './whiteboard-bg-image-editor.component.html',
  styleUrls: ['./whiteboard-bg-image-editor.component.css']
})
export class WhiteboardBgImageEditorComponent {

  @Input()
  public shapes: Array<AbstractShape> | undefined = new Array<AbstractShape>();

  @Input()
  model: WhiteboardModel = WhiteboardModel.empty();

  private destroyRef: DestroyRef = inject(DestroyRef);
  private imageUUID: string = '';
  private imageUrl: string = '';
  public previewUrl: string = '';

  /**
   * 
   * @param inodeSvc 
   */
  constructor(
    private inodeSvc: INodeService,
    private fileChooserSvc: FilesPickerService
  ) {

  }

  /**
   * 
   */
  public onShowImageChooser() {

    if (this.shapes) {

      this.fileChooserSvc.showFilePicker(false, new RegExp('image/.*', 'i'))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(files => {

          if (files) {

            const inode = [...files][0];
            this.imageUUID = inode.uuid;
            this.imageUrl = this.inodeSvc.getContentUrl(inode.uuid);
            this.previewUrl = `url('${this.imageUrl}')`;

          }
        })
    }
  }

  onApply() {

    this.shapes!.forEach(shape => {
      shape.fillEffect = new ImageFillEffect('image', this.model, this.imageUUID, this.imageUrl);
    });
  }
}
