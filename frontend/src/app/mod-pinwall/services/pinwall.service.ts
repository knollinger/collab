import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

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
            ['get', 'v1/pinwall/get/{1}'],
            ['save', 'v1/pinwall/save'],
            ['create', 'v1/pinwall/create'],
            ['delete', 'v1/pinwall/delete/{1}'],
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

    /**
     * 
     * @param postIt 
     * @returns 
     */
    public save(postIt: PostIt): Observable<PostIt> {

        const url = this.backendRouter.getRouteForName('save', PinwallService.routes);
        return this.http.post<IPostIt>(url, postIt.toJSON())
            .pipe(
                map(postIt => {
                    return PostIt.fromJSON(postIt);
                })
            );
    }

    /**
     * 
     * @param postIt 
     * @returns 
     */
    public create(postIt: PostIt): Observable<PostIt> {

        const url = this.backendRouter.getRouteForName('create', PinwallService.routes);
        return this.http.put<IPostIt>(url, postIt.toJSON())
            .pipe(
                map(postIt => {
                    return PostIt.fromJSON(postIt);
                })
            );
    }

    /**
     * 
     * @param uuid 
     * @returns 
     */
    public delete(uuid: string): Observable<void> {

        const url = this.backendRouter.getRouteForName('delete', PinwallService.routes, uuid);
        return this.http.delete<void>(url);
    }
}