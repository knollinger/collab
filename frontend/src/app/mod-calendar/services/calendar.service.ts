import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { BackendRoutingService } from '../../mod-commons/mod-commons.module';

import { CalendarEvent, ICalendarEvent } from '../models/calendar-event';
import { IINode, INode } from '../../mod-files-data/mod-files-data.module';

/**
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getAllEvents', 'v1/calevents/all?start={1}&end={2}'],
      ['getEvent', 'v1/calevents/calevent/{1}'],
      ['createEvent', 'v1/calevents/calevent'],
      ['saveEvent', 'v1/calevents/calevent'],
      ['upload', 'v1/calattachments/attachments']
    ]
  );

  /**
   * 
   * @param http 
   * @param backendRouter 
   */
  constructor(
    private http: HttpClient,
    private backendRouter: BackendRoutingService) {

  }

  /**
   * Liefere die Liste aller Events im angegebenen Zeitraum
   * 
   * @param start 
   * @param end 
   * @returns 
   */
  public getAllEvents(start: Date, end: Date): Observable<CalendarEvent[]> {

    const url = this.backendRouter.getRouteForName('getAllEvents', CalendarService.routes, start.toISOString(), end.toISOString());
    return this.http.get<ICalendarEvent[]>(url).pipe(
      map(events => {
        return events.map(event => {
          return CalendarEvent.fromJSON(event);
        })
      })
    );
  }

  /**
   * 
   * @param uuid 
   * @returns 
   */
  public getEvent(uuid: string): Observable<CalendarEvent> {

    const url = this.backendRouter.getRouteForName('getEvent', CalendarService.routes, uuid);
    return this.http.get<ICalendarEvent>(url).pipe(
      map(event => {
        return CalendarEvent.fromJSON(event);
      })
    );
  }

  /**
   * 
   * @param event 
   */
  createEvent(event: CalendarEvent): Observable<CalendarEvent> {

    const url = this.backendRouter.getRouteForName('createEvent', CalendarService.routes);
    return this.http.put<ICalendarEvent>(url, event.toJSON())
      .pipe(map(json => {
        return CalendarEvent.fromJSON(json);
      }))
  }

  /**
   * 
   * @param event 
   */
  saveEvent(event: CalendarEvent): Observable<CalendarEvent> {

    const url = this.backendRouter.getRouteForName('saveEvent', CalendarService.routes);
    return this.http.post<ICalendarEvent>(url, event.toJSON())
      .pipe(map(json => {
        return CalendarEvent.fromJSON(json);
      }))
  }

  /**
   * Lade lokale dateien als Attachments für das Event hoch 
   * 
   * @param eventId 
   * @param files 
   * @returns 
   */
  uploadFiles(eventId: string, files: File[]): Observable<INode[]> {

    const url = this.backendRouter.getRouteForName('upload', CalendarService.routes);

    const form = new FormData();
    form.append('eventId', eventId);
    files.forEach(file => {
      form.append('file', file);
    })

    return this.http.put<INode[]>(url, form)
      .pipe(map(inodes => {
        return inodes.map(inode => {
          return INode.fromJSON(inode)
        })
      }))
  }
}
