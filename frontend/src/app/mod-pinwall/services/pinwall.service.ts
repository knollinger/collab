import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { BackendRoutingService } from '../../mod-commons/mod-commons.module';

import { PostIt, IPostIt } from '../models/postit';
import { HttpClient } from '@angular/common/http';
/**
 * 
 */
@Injectable({
    providedIn: 'root'
})
export class PinwallService {

    private static routes: Map<string, string> = new Map<string, string>(
        [
            ['getAll', 'v1/pinwall/all']
        ]
    );

    constructor(
        private http: HttpClient,
        private backendRouter: BackendRoutingService) {

    }

    /**
     * 
     * @returns 
     */
    public getAll(): Observable<PostIt[]> {

        const url = this.backendRouter.getRouteForName('getAll', PinwallService.routes);
        return this.http.get<IPostIt[]>(url)
            .pipe(
                map(postIts => {
                    return postIts.map(postIt => {
                        return PostIt.fromJSON(postIt);
                    })
                })
            );
    }
}