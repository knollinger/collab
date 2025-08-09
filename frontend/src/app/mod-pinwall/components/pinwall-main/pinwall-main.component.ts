import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { TitlebarService } from '../../../mod-commons/mod-commons.module';
import { SettingsService } from '../../../mod-settings/services/settings.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PinwallService } from '../../services/pinwall.service';
import { PostIt } from '../../models/postit';

@Component({
  selector: 'app-pinwall-main',
  templateUrl: './pinwall-main.component.html',
  styleUrls: ['./pinwall-main.component.css'],
  standalone: false
})
export class PinwallMainComponent implements OnInit {

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

  public onReload() {

    this.pinwallSvc.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(postIts => {
        this.postIts = postIts;
      })

  }

  public set viewMode(val: string) {

    this.settings['viewMode'] = val;
    this.settingsSvc.setDomainSettings('pinwall', this.settings);
  }

  public get viewMode(): string {

    return this.settings['viewMode'] || 'grid';
  }
}
