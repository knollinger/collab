import { Injectable } from '@angular/core';
import { WhiteboardModel } from '../models/whiteboard-model';

/**
 * Exportiere ein Whiteboard als PNG
 * 
 * Das ganze ist ein wenig komplex. Zuerst wird ein Image() generiert, dieses
 * Image bekommt das SVG als dataUrl als src gesetzt. Wenn das Image gerendert 
 * wurde (onload-callback), so wird das Image in einen OffscreenCanvas gezeichnet.
 * 
 * Der Inhalt des Canvas wird als Blob ermittelt und aus diesem Blob eine ObjectUrl.
 * Letztere wird nun einem Link-Element als href übergeben und schlussendlich ein
 * Klick auf selbigen simuliert. **schnauf**
 * 
 * Der Spaß geht aber noch weiter:
 * 
 * Das SVG kann Elemente beinhalten, welche externe Quellen via *href* referenzieren. 
 * Und diese werden **nicht** beim Canvas.getContent().drawImage() aufgelöst!
 * 
 * Also klonen wir das ganze SVG, suchen alle Elemente mit einer href-Referenz, laden 
 * diesen Content und ersetzen das href-Attribut durch die der Referenz entsprechenden 
 * data-URL. 
 * 
 * Die Klonerei des SVG erfolgt nur, damit das Objekt incl seiner riesigen dataUrls 
 * auch schnell wieder frei gegeben werden kann. Es wäre Speicher-mäßig der Irrsin, 
 * diese permanent am Leben zu erhalten.
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class WhiteboardExportService {

  private static FRAME_SIZE: number = 20;

  /**
   * Transformiere das Model in ein PNG und löse den Download aus.
   * 
   * Das Image bekommt einen Rahmen von 20 Pixeln
   */
  public async exportImage(name: string, model: WhiteboardModel) {

    const svg = model.svgRoot;

    const copiedSVG = svg.cloneNode(true) as SVGSVGElement;
    await this.resolveExternalReferences(copiedSVG);

    const image = new Image();
    image.onload = function () {

      const exportRect = model.enclosingImageRect;
      const width = WhiteboardExportService.FRAME_SIZE * 2 + exportRect.width;
      const height = WhiteboardExportService.FRAME_SIZE * 2 + exportRect.height;
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext('2d');
      if (context) {

        context.drawImage(image, exportRect.x, exportRect.y, exportRect.width, exportRect.height, WhiteboardExportService.FRAME_SIZE, WhiteboardExportService.FRAME_SIZE, exportRect.width, exportRect.height);
        canvas.convertToBlob().then((blob) => {

          const objUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = objUrl;
          link.download = name;
          link.click();
          link.remove();
          URL.revokeObjectURL(objUrl);
        });
      };
    }
    image.src = `data:image/svg+xml;base64,${btoa(copiedSVG.outerHTML)}`;
  }

  /**
   * Löse die externen hrefs aller SubElemete auf und ersetze diese durch 
   * data: urls
   * 
   * Glücklicherweise gibt es Attribut-Selectoren. Das Ergebnis eines 
   * Attribute-Selectors ist jedoch keine LiveList, das ist aber in diesem 
   * Kontext ziemlich egal.
   * 
   * @param svgRoot 
   */
  private async resolveExternalReferences(svgRoot: SVGSVGElement) {

    const hrefElems = svgRoot.querySelectorAll('*[href]');
    for (let i = 0; i < hrefElems.length; ++i) {
      await this.resolveOneExternalReference(hrefElems.item(i)!);
    }
  }

  /**
   * Löse die href-referenz eines Elements in die entsprechende dataUrl auf.
   * 
   * @param elem 
   */
  private async resolveOneExternalReference(elem: Element) {

    const href = elem.getAttribute('href')!;
    if (!href.startsWith('data:')) {

      // start downloading url content and ensure our cookies are send inside 
      // the request
      const resolved = await fetch(href, {
        credentials: 'include',
      });

      // if ok...
      if (resolved.ok) {

        // get as blob. this is neccesary to get the data AND the contentType
        const blob = await resolved.blob();
        const blobType = blob.type;

        // aus dem binär-Lob eine Base64-Darstellung bauen. Das scheint mit reduce 
        // ganz gut zu funktionieren....auch wenn ichs grade nicht ganz kapiere.  
        const buf = await blob.arrayBuffer();

        const ui8 = new Uint8Array(buf);
        const base64 = btoa(
          ui8.reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        elem.setAttribute('href', `data:${blobType};base64,${base64}`);
      }
      else {
        console.dir(resolved);
        // TODO: not yet implemented
      }
    }
  }
}
