import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from "@angular/core";
import { AbstractFillEffect } from '../../../../fill-effects/abstract-fill-effect';
import { FilesPickerService, INodeService } from "../../../../../mod-files/mod-files.module";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ImageFillEffect } from "../../../../fill-effects/image-fill-effect";
import { ColorFillEffect } from "../../../../fill-effects/color-fill-effect";

@Component({
  selector: 'app-whiteboard-fill-effect-image',
  templateUrl: './whiteboard-fill-effect-image.component.html',
  styleUrls: ['./whiteboard-fill-effect-image.component.css'],
  standalone: false
})
export class WhiteboardFillEffectImageComponent implements OnInit {

  @Output()
  public effectChanged: EventEmitter<AbstractFillEffect> = new EventEmitter<AbstractFillEffect>();

  private destroyRef: DestroyRef = inject(DestroyRef);

  /**
   * 
   * @param inodeSvc 
   * @param fileChooserSvc 
   */
  constructor(private inodeSvc: INodeService,
    private fileChooserSvc: FilesPickerService) {
  }

  ngOnInit() {

    this.effectChanged.next(new ColorFillEffect('color', 'transparent'));
  }

  /**
   * 
   */
  onShowImageChooser() {

    this.fileChooserSvc.showFilePicker(false, new RegExp('image/.*', 'i'))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(files => {

        if (files) {

          const inode = [...files][0];
          const uuid = inode.uuid;
          const url = this.inodeSvc.getContentUrl(uuid)
          this.effectChanged.next(new ImageFillEffect('image', uuid, url));
        }
      })
  }
}
