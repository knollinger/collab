import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ShowBackendErrorService } from '../../services/show-backend-error.service';
import { TitlebarService } from '../../services/titlebar.service';
import { BackendErrorDesc } from '../../services/show-backend-error.service';


@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  private destroyRef: DestroyRef = inject(DestroyRef);
  private errorDesc: BackendErrorDesc = BackendErrorDesc.empty();
  
  statusCode: number = 0;
  statusText: string = '';
  path: string = '';
  message: string = '';
  stackTrace: string = '';

  showDetails: boolean = false;

  /**
   * 
   * @param showBackendErrorSvc 
   * @param titleBarSvc 
   * @param location 
   */
  constructor(
    private showBackendErrorSvc: ShowBackendErrorService,
    private titleBarSvc: TitlebarService,
    private location: Location) {

  }

  /**
   * 
   */
  ngOnInit() {
    this.titleBarSvc.subTitle = 'Fehler beim Zugriff auf den Server';

    this.statusCode = this.showBackendErrorSvc.errorDesc.httpStatusCode;
    this.statusText = this.showBackendErrorSvc.errorDesc.httpStatusText;
    this.path = this.showBackendErrorSvc.errorDesc.path;
    this.message = `<p>${this.showBackendErrorSvc.errorDesc.msg.replace('\n', '</p><p>')}</p>`;   
    this.stackTrace =  this.showBackendErrorSvc.errorDesc.stackTrace;
    this.showBackendErrorSvc.clear();
  }
  
  onCopy() {

  }
  
  /**
   * 
   */
  onGoBack() {
    this.location.back();
  }
}
