import { Component, OnInit } from '@angular/core';

import { BackendRoutingService, TitlebarService } from '../mod-commons/mod-commons.module';
import { HttpClient } from '@angular/common/http';

interface ILicenceDesc {
  name: string,
  creator: string,
  licence: string,
  url: string
}

@Component({
  selector: 'app-licences',
  templateUrl: './licences.component.html',
  styleUrls: ['./licences.component.css'],
  standalone: false
})
export class LicencesComponent implements OnInit {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getLicences', '/licences.json']
    ]
  );

  licences: ILicenceDesc[] = new Array<ILicenceDesc>();

  displayedColumns: string[] = ['name', 'creator', 'licence', 'repository'];

  /**
   * 
   * @param titleBarSvc 
   */
  constructor(
    private http: HttpClient,
    private backendRouter: BackendRoutingService,
    private titleBarSvc: TitlebarService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.titleBarSvc.subTitle = "Opensource Lizenzen";

    const url = this.backendRouter.getRouteForName('getLicences', LicencesComponent.routes);
    console.log(url);
    this.http.get<ILicenceDesc[]>(url).subscribe(licences => {
      this.licences = licences;

    })
  }
}
