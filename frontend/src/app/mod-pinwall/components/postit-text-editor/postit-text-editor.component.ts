import { AfterViewInit, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TitlebarService } from '../../../mod-commons/mod-commons.module';
import { PinwallService } from '../../services/pinwall.service';
import { PostIt } from '../../models/postit';

@Component({
  selector: 'app-postit-text-editor',
  templateUrl: './postit-text-editor.component.html',
  styleUrls: ['./postit-text-editor.component.css']
})
export class PostitTextEditorComponent implements OnInit, AfterViewInit {

  private destroyRef = inject(DestroyRef);
  postIt: PostIt = PostIt.empty();

  /**
   * 
   * @param route 
   * @param titlebarSvc 
   */
  constructor(
    private route: ActivatedRoute,
    private pinwallSvc: PinwallService,
    private titlebarSvc: TitlebarService) {
  }

  ngAfterViewInit(): void {
  }

  /**
   * 
   */
  ngOnInit(): void {

    this.titlebarSvc.subTitle = 'neuer PostIt';
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const uuid = params['uuid'] || '';
        if (uuid) {
          this.loadEntry(uuid);
        }
        this.postIt.type = 'TEXT';

      })
  }

  /**
   * 
   * @param uuid 
   */
  loadEntry(uuid: any) {

    this.pinwallSvc.get(uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(postIt => {

        this.postIt = postIt;
        this.titlebarSvc.subTitle = postIt.title;
      })
  }

  /**
   * 
   */
  onSave() {

    const subscr = this.postIt.isEmpty() ? this.pinwallSvc.create(this.postIt) : this.pinwallSvc.save(this.postIt);
    subscr.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(_ => {

      });
  }
}
