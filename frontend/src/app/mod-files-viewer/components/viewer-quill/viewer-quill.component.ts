import { Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';

import { INode } from '../../../mod-files-data/mod-files-data.module';
import { INodeService } from '../../../mod-files/mod-files.module';
import { HttpClient } from '@angular/common/http';
import Quill from 'quill';
import { Delta } from 'quill';
// import * as hljs from 'highlightjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-viewer-quill',
  templateUrl: './viewer-quill.component.html',
  styleUrls: ['./viewer-quill.component.css'],
  standalone: false
})
export class ViewerQuillComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private quill: Quill | null = null;
  textChanged: boolean = false;

  /**
   * 
   * @param inodeSvc 
   */
  constructor(
    private httpClient: HttpClient,
    private inodeSvc: INodeService) {
  }

  /**
   * 
   */
  ngOnInit() {
    this.setupEditor();
  }

  /**
   * 
   */
  private setupEditor() {

    this.quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: '#toolbar',
        // syntax: { hljs }
      }
    });

    this.quill.on('text-change', (delta: Delta, oldContent: Delta, source: string) => {

      if (source === 'user') {
        this.textChanged = true;
      }
    })
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* All about the current inode                                             */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/
  private _currINode: INode = INode.empty();

  /**
   * PropSetter löst auch das laden des Dokumentes aus
   */
  @Input()
  set inode(node: INode) {
    this._currINode = node;
    this.loadDocument();
  }

  /**
   * PropGetter
   */
  get inode(): INode {
    return this._currINode;
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

    const url = this.inodeSvc.getContentUrl(this.inode.uuid);
    this.httpClient.get(url, {
      responseType: 'text'
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(content => {

        const delta = new Delta()
          .insert(content);
          // .insert('\n', { 'code-block': 'javascript' });
        this.quill?.setContents(delta);
        this.textChanged = false;
      });
  }

  /**
   * 
   */
  public onSave() {

    console.log(this.quill?.getText());
  }
}
