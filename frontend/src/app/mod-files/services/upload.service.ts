import { EventEmitter, Injectable } from '@angular/core';
import { Observable, map, tap, last, catchError } from 'rxjs';

import { BackendRoutingService, SpinnerService } from '../../mod-commons/mod-commons.module';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';

import { IUploadFilesResponse, UploadFilesResponse } from '../models/upload-files-response';
import { CheckDuplicateEntriesService, INamedFile } from './check-duplicate-entries.service';

/**
 * 
 */
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
    private checkDuplEntriesSvc: CheckDuplicateEntriesService,
    private spinnerSvc: SpinnerService) {
  }

  /**
   * 
   * @param files 
   * @returns 
   */
  public uploadFiles(parentId: string, files: File[]): Observable<UploadFilesResponse> {

    const result = new EventEmitter<UploadFilesResponse>();
    this.checkDuplEntriesSvc.handleDuplicateFiles(parentId, files).subscribe(namedFiles => {

      this.uploadFilesInternal(parentId, namedFiles).subscribe(rsp => {
        result.emit(rsp);
      });
    });
    return result;
  }

  /**
   * 
   * @param parentId 
   * @param namedFiles 
   * @param emitter 
   * @returns 
   */
  private uploadFilesInternal(parentId: string, namedFiles: INamedFile[]): Observable<UploadFilesResponse> {

    const url = this.backendRouter.getRouteForName('upload', UploadService.routes);

    const form = new FormData();
    namedFiles.forEach(namedFile => {
      form.append('file', namedFile.file, namedFile.name);
    });
    form.append('parent', parentId);

    const options = {
      reportProgress: true
    };

    const req = new HttpRequest('PUT', url, form, options);
    return this.httpClient.request(req).pipe(
      tap(event => this.handleHttpEvents(event as HttpEvent<any>)),
      last(),
      map(rsp => {
        return UploadFilesResponse.fromJSON(rsp as IUploadFilesResponse);
      })
    );
  }

  /**
  * 
  * @param event handleHttpUploadEvent
  * @param file
  * @returns
  */
  private handleHttpEvents(event: any) {
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
