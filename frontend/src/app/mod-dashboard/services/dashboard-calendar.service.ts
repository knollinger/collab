import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BackendRoutingService } from "../../mod-commons/mod-commons.module";

import { map, Observable } from "rxjs";
import { CalendarEventCore, ICalendarEventCore } from "../../mod-calendar/models/calendar-event-core";

@Injectable({
  providedIn: 'root'
})
export class DashboardCalendarService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['loadEvents', 'v1/calendar/all?start={1}&end={2}'],
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
   * 
   * @returns 
   */
  public loadEvents(): Observable<CalendarEventCore[]> {

    const now = new Date();
    const until = new Date();
    until.setDate(until.getDate() + 7);
    const url = this.backendRouter.getRouteForName('loadEvents', DashboardCalendarService.routes, now.toISOString(), until.toISOString());
    return this.http.get<ICalendarEventCore[]>(url).pipe(
      map(events => {
        return events.map(event => {
          return CalendarEventCore.fromJSON(event);
        })
      })
    );
  }
}
