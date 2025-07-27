import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { BackendRoutingService } from '../../mod-commons/mod-commons.module';


import { CalendarEventCore, ICalendarEventCore } from '../models/calendar-event-core';
import { CalendarEventFull, ICalendarEventFull } from '../models/calendar-event-full';
import { INode } from '../../mod-files-data/mod-files-data.module';

/**
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getAllEvents', 'v1/calendar/all?start={1}&end={2}'],
      ['getEvent', 'v1/calendar/calevent/{1}'],
      ['createEvent', 'v1/calendar/calevent'],
      ['saveEvent', 'v1/calendar/calevent'],
      ['updateEventTime', 'v1/calendar/update'],
      ['upload', 'v1/calendar/upload']
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
  public getAllEvents(start: Date, end: Date): Observable<CalendarEventCore[]> {

    const url = this.backendRouter.getRouteForName('getAllEvents', CalendarService.routes, start.toISOString(), end.toISOString());
    return this.http.get<ICalendarEventCore[]>(url).pipe(
      map(events => {
        return events.map(event => {
          return CalendarEventCore.fromJSON(event);
        })
      })
    );
  }

  /**
   * 
   * @param uuid 
   * @returns 
   */
  public getEvent(uuid: string): Observable<CalendarEventFull> {

    const url = this.backendRouter.getRouteForName('getEvent', CalendarService.routes, uuid);
    return this.http.get<ICalendarEventFull>(url).pipe(
      map(event => {
        return CalendarEventFull.fromJSON(event);
      })
    );
  }

  /**
   * 
   * @param event 
   */
  createEvent(event: CalendarEventFull): Observable<CalendarEventFull> {

    const url = this.backendRouter.getRouteForName('createEvent', CalendarService.routes);
    return this.http.put<ICalendarEventFull>(url, event.toJSON())
      .pipe(map(json => {
        return CalendarEventFull.fromJSON(json);
      }))
  }

  /**
   * 
   * @param event 
   */
  saveEvent(event: CalendarEventFull): Observable<CalendarEventFull> {

    const url = this.backendRouter.getRouteForName('saveEvent', CalendarService.routes);
    return this.http.post<ICalendarEventFull>(url, event.toJSON())
      .pipe(map(json => {
        return CalendarEventFull.fromJSON(json);
      }))
  }

  updateEventTime(event: CalendarEventCore): Observable<CalendarEventCore> {

    const url = this.backendRouter.getRouteForName('updateEventTime', CalendarService.routes);
    return this.http.post<ICalendarEventCore>(url, event.toJSON())
      .pipe(map(json => {
        return CalendarEventCore.fromJSON(json);
      }))
  }

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
