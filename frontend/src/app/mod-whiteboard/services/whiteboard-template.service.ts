import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class WhiteboardTemplateService {

  /**
   * 
   * @param inodeSvc 
   */
  constructor() {

  }

  public loadSVGTemplate(): Observable<Document> {

    const result = new Subject<Document>();

    fetch('/assets/mod-whiteboard/svg-template.svg').then(rsp => {
      rsp.text().then(xml => {
        const dom = new DOMParser().parseFromString(xml, 'image/svg+xml');
        result.next(dom);
      })
    })

    return result;
  }
}
