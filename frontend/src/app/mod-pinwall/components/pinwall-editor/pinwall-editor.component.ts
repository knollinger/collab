import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TitlebarService } from '../../../mod-commons/mod-commons.module';

import { PostIt } from '../../models/postit';

@Component({
  selector: 'app-pinwall-editor',
  templateUrl: './pinwall-editor.component.html',
  styleUrls: ['./pinwall-editor.component.css']
})
export class PinwallEditorComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  public postIt: PostIt = PostIt.empty();

  /**
   * 
   * @param titlebarSvc 
   */
  constructor(
    private route: ActivatedRoute,
    private titlebarSvc: TitlebarService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const uuid = params['uuid'] || '';
        if (uuid) {

          this.loadEntry(uuid);
        }
        else {

          this.titlebarSvc.subTitle = 'neuer PostIt';
        }
      })
  }

  /**
   * 
   * @param uuid 
   */
  loadEntry(uuid: any) {
    throw new Error('Method not implemented.');
  }
}
