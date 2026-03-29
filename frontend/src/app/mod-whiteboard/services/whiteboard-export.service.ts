import { Injectable } from '@angular/core';

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
 * Das SVG kann Patterns beinhalten, welche externe BildQuellen via *href* referenzieren. 
 * Und diese werden **nicht** beim Canvas.getContent().drawImage() aufgelöst!
 * 
 * Also klonen wir das ganze SVG, suchen alle <image>-Elemente und ersetzen deren href
 * Attribut durch die der Referenz entsprechenden data-URL. Die Klonerei des SVG erfolgt 
 * nur, damit das Objekt incl seiner riesigen dataUrls auch schnell wieder frei gegeben 
 * werden kann. Es wäre Speicher-mäßig der Irrsin, diese permanent am Leben zu erhalten.
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class WhiteboardExportService {

  constructor() {

  }
  /**
   * Transformiere das SVG-Dokument in ein PNG und löse den Download aus.
   * 
   * Das Image bekommt einen Rahmen von 10 Pixeln
   */
  public async exportImage(name: string, svg: SVGSVGElement) {

    const copiedSVG = svg.cloneNode(true) as SVGSVGElement;
    await this.resolveExternalReferences(copiedSVG);

    const image = new Image();
    image.onload = function () {

      const width = 20 + (Number.parseInt(svg.getAttribute('width') || '256'));
      const height = 20 + (Number.parseInt(svg.getAttribute('height') || '256'));
      const canvas = new OffscreenCanvas(width, height); // an die echte Breite/Höhe des SVG anpassen!
      const context = canvas.getContext('2d');
      if (context) {

        context.drawImage(image, 10, 10);
        canvas.convertToBlob().then((blob) => {

          const objUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = objUrl;
          link.download = name;
          link.click();
          link.remove();
          URL.revokeObjectURL(objUrl);
        });
      }
    }
    image.src = `data:image/svg+xml;base64,${btoa(copiedSVG.outerHTML)}`;
  }

  /**
   * Löse die externen hrefs aller <image>-tags auf
   * 
   * @param svgRoot 
   */
  private async resolveExternalReferences(svgRoot: SVGSVGElement) {

    const imgs = svgRoot.getElementsByTagName('image');
    for (let i = 0; i < imgs.length; ++i) {
      await this.resolveOneExternalReference(imgs.item(i)!);
    }
  }

  /**
   * Löse die href-referenz eines Image-Tags in die entsprechende dataUrl auf.
   * 
   * @param img 
   */
  private async resolveOneExternalReference(img: SVGImageElement) {

    const href = img.getAttribute('href')!;
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
        const contentType = blob.type;

        // TODO: Die Transformation via reduce kapiere ich noch nicht in deep
        const buf = await blob.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buf)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        img.setAttribute('href', `data:${blob.type};base64,${base64}`);
      }
      else {
        // TODO: not yet implemented
      }
    }
  }
}
