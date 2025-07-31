import { Injectable } from '@angular/core';

import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';

/**
 * Der Service stellt Methoden zum lesen und schreiben von Settings bereit.
 * 
 * Das ganze orientiert sich an Fach-Domänen, es können also lediglich
 * die Settings einer bestimmten Domäne gelesen und geschrieben werden.
 * 
 * Intern wird ein Settings-LOB verwaltet, das geht aber die Aufrufer 
 * nichts an.
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getSettings', 'v1/settings'],
      ['saveSettings', 'v1/settings']
    ]
  );

  private settings: any = {};
  private hasLoaded: boolean = false;

  /**
   * 
   * @param http 
   * @param backendRouter 
   */
  constructor(
    private http: HttpClient,
    private backendRouter: BackendRoutingService) {

    this.clear();
  }

  /**
   * Liefere die Settings für die angegebene Domäne.
   * 
   * Das Ergebnis ist ein Observable, da ggf die aktuellen 
   * Settings erst geladen werden müssen.
   * 
   * @returns 
   */
  public getDomainSettings(domain: string): Observable<Object> {

    if (this.hasLoaded) {
      return of(this.getOrCreateDomainObject(domain));
    }
    else {

      return this.loadSettingsLob()
        .pipe(map(_ => {
          return this.getOrCreateDomainObject(domain);
        }));
    }
  }

  /**
   * Speichere asynchron die Settings für die angegebene Domäne
   * 
   * @param domain 
   * @param settings 
   */
  public setDomainSettings(domain: string, settings: Object) {

    if (this.hasLoaded) {
      this.settings[domain] = settings;
      this.saveCurrentSettings();
    }
    else {

      this.loadSettingsLob()
        .pipe(map(_ => {
          this.settings[domain] = settings;
          this.saveCurrentSettings();
        }));
    }
  }

  /**
   * Lade das LargeObject der Settings und parse dieses in ein JSON-Object
   * @returns 
   */
  private loadSettingsLob(): Observable<Object> {

    const url = this.backendRouter.getRouteForName('getSettings', SettingsService.routes);
    return this.http.get<string>(url)
      .pipe(map(body => {
        this.hasLoaded = true;
        this.settings = body;
        return this.settings;
      }))
  }

  /**
   * Speichert asynchron die aktuellen Settings
   * 
   * @param settings 
   * @returns 
   */
  private saveCurrentSettings() {

    if (this.hasLoaded) {

      const url = this.backendRouter.getRouteForName('saveSettings', SettingsService.routes);
      this.http.post<void>(url, this.settings).subscribe(_ => {
        console.log('Einstellungen gespeichert');
      })
    }
  }

  /**
   * 
   * @param domain 
   */
  private getOrCreateDomainObject(domain: string) {

    if (!this.settings.hasOwnProperty(domain)) {
      this.settings[domain] = {};
    }
    return this.settings[domain];
  }


  /**
   * 
   */
  public clear(): void {
    this.settings = {};
    this.hasLoaded = false;
  }
}
