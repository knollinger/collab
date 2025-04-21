import { Component, OnInit } from '@angular/core';

import { TitlebarService } from '../mod-commons/mod-commons.module';

@Component({
  selector: 'app-licences',
  templateUrl: './licences.component.html',
  styleUrls: ['./licences.component.css']
})
export class LicencesComponent implements OnInit {

  /**
   * 
   * @param titleBarSvc 
   */
  constructor(private titleBarSvc: TitlebarService) {

  }

  /**
   * 
   */
  ngOnInit(): void {
    this.titleBarSvc.subTitle = "Opensource Lizenzen";
  }
}
