import { Injectable } from '@angular/core';
import { Observable, map, tap, last } from 'rxjs';

import { BackendRoutingService, SpinnerService } from '../../mod-commons/mod-commons.module';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';

import { IUploadFilesResponse, UploadFilesResponse } from '../models/upload-files-response';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['upload', 'v1/filesys/upload']
    ]
  );
  constructor(
    private httpClient: HttpClient,
    private backendRouter: BackendRoutingService,
    private spinnerSvc: SpinnerService) {
  }

  /**
   * 
   * @param files 
   * @returns 
   */
  public uploadFiles(parentId: string, files: File[]): Observable<UploadFilesResponse> {

    const url = this.backendRouter.getRouteForName('upload', UploadService.routes);

    const form = new FormData();
    files.forEach(file => {
      form.append('file', file);
    });
    form.append('parent', parentId);

    const options = {
      reportProgress: true
    };

    const req = new HttpRequest('PUT', url, form, options);
    const res = this.httpClient.request(req).pipe(
      tap(event => this.handleHttpEvents(event as HttpEvent<any>)),
      last());

    return (res as Observable<HttpResponse<any>>).pipe(map(val => {

      const json = val.body as IUploadFilesResponse;
      return UploadFilesResponse.fromJSON(json);
    }));
  }

  /**
  * 
  * @param event handleHttpUploadEvent
  * @param file
  * @returns
  */
  private handleHttpEvents(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent:
        this.spinnerSvc.setMessage(`Beginne Upload`);
        break;

      case HttpEventType.UploadProgress:
        const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
        this.spinnerSvc.setMessage(`Upload zu  ${percentDone}% erledigt.`);
        if (percentDone >= 100) {
          this.spinnerSvc.setMessage(`Speichern...`);
        }
        break;

      case HttpEventType.ResponseHeader:
        console.log(`Upload response: ${JSON.stringify(event)}`);
        break;

      case HttpEventType.Response:
        this.spinnerSvc.setMessage(`Upload abgeschlossen. ${JSON.stringify(event)}`);
        break;

      case HttpEventType.DownloadProgress:
        console.log(`${JSON.stringify(event)} bytes uploaded`);
        break;

      default:
        console.log(`unexpected upload event: ${JSON.stringify(event)}.`);
        break;
    }
  }
}
