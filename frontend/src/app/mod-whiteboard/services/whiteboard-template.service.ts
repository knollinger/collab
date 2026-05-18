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

  /**
   * 
   * @returns 
   */
  public loadSVGTemplate(): Observable<Document> {

    return this.loadXMLDoc('/assets/mod-whiteboard/svg-template.xml');
  }

  /**
   * Lädt das SVG-Dokument mit den FillPatterns aus dem asset-Folder
   * und extrahiert alle SVGPatternElemente daraus.
   * 
   * @returns 
   */
  public loadSVGPatterns(): Observable<SVGPatternElement[]> {

    const result = new Subject<SVGPatternElement[]>();
    this.loadXMLDoc('/assets/mod-whiteboard/svg-fill-patterns.xml')
      .subscribe(document => {

        const patterns: Array<SVGPatternElement> = new Array<SVGPatternElement>();

        const patternDefs = document.querySelectorAll('defs pattern');
        for(let i = 0; i < patternDefs.length; ++i) {
          patterns.push(patternDefs.item(i) as SVGPatternElement);
        }
        result.next(patterns);
      })
    return result;
  }

  /**
   * 
   * @param path 
   * @returns 
   */
  private loadXMLDoc(path: string): Observable<Document> {

    const result = new Subject<Document>();

    fetch(path).then(rsp => {
      rsp.text().then(xml => {
        const dom = new DOMParser().parseFromString(xml, 'image/svg+xml');
        result.next(dom);
      })
    })

    return result;
  }
}
