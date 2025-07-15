import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { BackendRoutingService } from "../../mod-commons/mod-commons.module";
import { HttpClient } from "@angular/common/http";
import { CalendarEventPerson, ICalendarEventPerson } from "../models/calendar-event-person";

/**
 * 
 */
@Injectable({
    providedIn: 'root'
})
export class CalendarPersonsService {

    private static routes: Map<string, string> = new Map<string, string>(
        [
            ['getPersonsFor', 'v1/calpersons/{1}']
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
     * @param evtId 
     * @param required 
     * @returns 
     */
    public getUsersFor(evtId: string): Observable<CalendarEventPerson[]> {

        const url = this.backendRouter.getRouteForName('getPersonsFor', CalendarPersonsService.routes, evtId);
        return this.http.get<ICalendarEventPerson[]>(url)
            .pipe(
                map(users => {
                    return users.map(user => {
                        return CalendarEventPerson.fromJSON(user);
                    })
                })
            );

    }
}
