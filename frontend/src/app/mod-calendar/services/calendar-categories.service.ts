import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable, of } from "rxjs";

import { BackendRoutingService } from "../../mod-commons/mod-commons.module";

import { ICalendarEventCategory, CalendarEventCategory } from '../models/calendat-event-category';

@Injectable({
    providedIn: 'root'
})
export class CalendarCategoriesService {

    private static routes: Map<string, string> = new Map<string, string>(
        [
            ['getAllCategories', 'v1/calendar/categories/all'],
        ]
    );

    /**
     * 
     * @param http 
     * @param backendRouter 
     */
    constructor(
        private http: HttpClient, //
        private backendRouter: BackendRoutingService) {

    }

    /**
     * 
     * @returns 
     */
    public getAllCategories(): Observable<CalendarEventCategory[]> {

        const url = this.backendRouter.getRouteForName('getAllCategories', CalendarCategoriesService.routes);
        return this.http.get<ICalendarEventCategory[]>(url)
            .pipe(
                map(categories => {
                    return categories.map(cat => {
                        return CalendarEventCategory.fromJSON(cat);
                    })
                })
            )
    }
}