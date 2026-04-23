import { Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import Quill from 'quill';
import { Delta } from 'quill';

import { INode } from '../../../mod-files-data/mod-files-data.module';
import { INodeService } from '../../../mod-files/mod-files.module';
import { ActivatedRoute } from '@angular/router';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';

/**
 * 
 */
@Component({
  selector: 'app-viewer-quill',
  templateUrl: './viewer-quill.component.html',
  styleUrls: ['./viewer-quill.component.css'],
  standalone: false
})
export class ViewerQuillComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private inode: INode = INode.empty();
  private quill: Quill | null = null;
  textChanged: boolean = false;

  private acceptableContentTypes: RegExp[] = [
    new RegExp('text/.*', 'i'),
    new RegExp('allication/json.*', 'i')
  ]

  /**
   * 
   * @param inodeSvc 
   */
  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private inodeSvc: INodeService,
    private titleBarSvc: TitlebarService) {
  }

  /**
   * 
   */
  ngOnInit() {

    this.setupEditor();

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const uuid = params.get('uuid') || '';
        this.inodeSvc.getINode(uuid)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(inode => {
            this.inode = inode;
            this.titleBarSvc.subTitle = inode.name;
            this.loadDocument();
          })
      })
  }

  /**
   * 
   */
  private setupEditor() {

    this.quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: '#toolbar',
        addClasses: { // aktiviere das CCS-only Line-Numbering
          classes: ['ql-lineNumber']
        }
      }
    });

    this.quill.on('text-change', (newContent: Delta, oldContent: Delta, source: string) => {

      if (source === 'user') {
        this.textChanged = true;
      }
    })
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about the editor                                                    */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Lade das Dokument
   * @returns 
   */
  private loadDocument() {

    this.inodeSvc.loadContent(this.inode.uuid, this.acceptableContentTypes)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(blob => {

        blob.arrayBuffer().then(buffer => {

          const text = new TextDecoder().decode(buffer);
          const delta = new Delta().insert(text);
          this.quill?.setContents(delta);
          this.textChanged = false;
        });
      })
  }

  /**
   * 
   */
  public onSave() {

  }
}
