import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CommonDialogsService, TitlebarService } from '../../../mod-commons/mod-commons.module';
import { SettingsService } from '../../../mod-settings/services/settings.service';
import { AvatarService } from '../../../mod-userdata/mod-userdata.module';

import { PinwallService } from '../../services/pinwall.service';
import { PostIt } from '../../models/postit';
import { BucketListItem } from '../../models/bucket-list-item';

@Component({
  selector: 'app-pinwall-main',
  templateUrl: './pinwall-main.component.html',
  styleUrls: ['./pinwall-main.component.css'],
  standalone: false
})
export class PinwallMainComponent implements OnInit {

  private static editorRoutes: Map<string, string> = new Map<string, string>(
    [
      ['TEXT', '/pinwall/edit/text/{uuid}'],
      ['BUCKET_LIST', '/pinwall/edit/list/{uuid}'],
    ]
  );

  private destroyRef = inject(DestroyRef);
  private settings: any = {};

  postIts: PostIt[] = new Array<PostIt>();

  /**
   * 
   * @param titlebarSvc 
   */
  constructor(
    private titlebarSvc: TitlebarService,
    private pinwallSvc: PinwallService,
    private avatarSvc: AvatarService,
    private msgBoxSvc: CommonDialogsService,
    private settingsSvc: SettingsService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
    this.titlebarSvc.subTitle = 'Pinwand';
    this.loadSettings();
    this.onReload();
  }

  /**
     * 
     */
  private loadSettings() {

    this.settingsSvc.getDomainSettings('pinwall')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(settings => {
        this.settings = settings;
      })
  }

  /**
   * 
   */
  public onReload() {

    this.pinwallSvc.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(postIts => {
        this.postIts = postIts;
      })

  }

  public onDelete(evt: Event, postIt: PostIt) {

    evt.stopPropagation();

    this.msgBoxSvc.showQueryBox('Bist Du sicher?', 'Möchtest Du das PostIt wirklich löschen?')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(rsp => {

        if (rsp) {

          this.pinwallSvc.delete(postIt.uuid)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(_ => {
              this.onReload();
            })
        }
      })

  }

  /**
   * 
   */
  public set viewMode(val: string) {

    this.settings['viewMode'] = val;
    this.settingsSvc.setDomainSettings('pinwall', this.settings);
  }

  /**
   * 
   */
  public get viewMode(): string {

    return this.settings['viewMode'] || 'grid';
  }

  /**
   * 
   * @param postIt 
   * @returns 
   */
  public getEditorRoute(postIt: PostIt): string {

    let result = PinwallMainComponent.editorRoutes.get(postIt.type) || '';
    return result.replace('{uuid}', encodeURIComponent(postIt.uuid));
  }

  public getAvatarUrl(uuid: string): string {
    return this.avatarSvc.getAvatarUrl(uuid);
  }

  /**
   * 
   * @param postIt 
   * @returns 
   */
  rootBucket(postIt: PostIt): BucketListItem {
    return BucketListItem.parseRawJSON(postIt.content);
  }
}
