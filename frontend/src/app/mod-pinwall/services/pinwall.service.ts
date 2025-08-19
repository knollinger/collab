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
            ['getAll', 'v1/pinwall/all'],
            ['get', 'v1/pinwall/get/{1}']
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

    /**
     * 
     * @param uuid 
     * @returns 
     */
    public get(uuid: string): Observable<PostIt> {

        const url = this.backendRouter.getRouteForName('get', PinwallService.routes, uuid);
        return this.http.get<IPostIt>(url)
            .pipe(
                map(postIt => {
                    return PostIt.fromJSON(postIt);
                })
            );
    }
}