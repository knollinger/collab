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
            ['getPersonsFor', 'v1/calpersons/{1}'],
            ['savePersonsFor', 'v1/calpersons/{1}']
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

    /**
     * 
     * @param evtId 
     * @param persons 
     * @returns 
     */
    public savePersonsFor(evtId: string, persons: CalendarEventPerson[]): Observable<void> {

        const url = this.backendRouter.getRouteForName('savePersonsFor', CalendarPersonsService.routes, evtId);
        const body = persons.map(person => person.toJSON())
        return this.http.post<void>(url, body);
    }
}
