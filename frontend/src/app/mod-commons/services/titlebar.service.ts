import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Die Schnittstelle, über welche die tiefer liegenden Komponenten den
 * Titel in der WebPage und den WindowTitle setzen können.
 * 
 * Der erste Teil des Titels ist konstant. Wenn über den Property-
 * Setter *subTitle* gesetzt wird, so wird dieser Wert durch ein ' - '
 * an den BasisTitel angehängt.
 * 
 * Die Root-Komponente lauscht auf das Subject *title* und sorgt für die 
 * Darstellung. 
 */
@Injectable({
  providedIn: 'root'
})
export class TitlebarService {

  private static BASE_TITLE: string = 'Colab';

  public title: BehaviorSubject<string> = new BehaviorSubject<string>(TitlebarService.BASE_TITLE);

  /**
   * 
   */
  public set subTitle(value: string | undefined) {

    let title = TitlebarService.BASE_TITLE;
    if (value) {
      title += ` - ${value}`;
    }
    this.title.next(title);
    document.title = title;
  }
}
