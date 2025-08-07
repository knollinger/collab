import { Component, OnInit } from '@angular/core';

import { TitlebarService } from '../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-pinwall-main',
  templateUrl: './pinwall-main.component.html',
  styleUrls: ['./pinwall-main.component.css'],
  standalone: false
})
export class PinwallMainComponent implements OnInit {

  aa = ['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'];

  viewMode: string = 'list';

  /**
   * 
   * @param titlebarSvc 
   */
  constructor(private titlebarSvc: TitlebarService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
    this.titlebarSvc.subTitle = 'Pinwand';
  }
}
