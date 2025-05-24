import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BackendRoutingService } from '../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-viewer-chooser',
  templateUrl: './viewer-chooser.component.html',
  styleUrls: ['./viewer-chooser.component.css'],
  standalone: false
})
export class ViewerChooserComponent {

  private static viewerDescs : Map<string, string> = new Map<string, string>(
    [
      ['image', 'Bild-Betrachter'],
      ['movie', 'Film-Betrachter'],
      ['sound', 'Musik-Spieler'],
      ['collabara', 'Libre Office online'],
      ['quill', 'Text-Editor'],
    ]
  );

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getImage', '/icons/{1}.svg']
    ]
  );

  @Input()
  aliases: string[] = new Array<string>();

  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();

  /**
   * 
   */
  constructor(
    private backendRoutingSvc: BackendRoutingService) {

  }

  viewerImage(alias: string): string {
    return this.backendRoutingSvc.getRouteForName('getImage', ViewerChooserComponent.routes, alias);

  }

  viewerDesc(alias: string): string {
    return ViewerChooserComponent.viewerDescs.get(alias) || 'unbekannter Viewer';

  }
  /**
   * 
   * @param alias 
   */
  onSelection(alias: string) {
    this.change.next(alias);
  }
}
