import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { ACL, IACL } from '../models/acl';
import { BackendRoutingService } from '../../mod-commons/mod-commons.module';

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {


    private static routes: Map<string, string> = new Map<string, string>(
        [
            ['update', 'v1/acl/update/{1}']
        ]
    );

    constructor(
        private http: HttpClient,
        private backendRouter: BackendRoutingService) {

    }

    /**
     * 
     * @param resourceId 
     * @param acl 
     */
    public updateACL(resourceId: string, acl: ACL): Observable<ACL> {

        const url = this.backendRouter.getRouteForName('update', PermissionsService.routes, resourceId);
        return this.http.post<IACL>(url, acl.toJSON())
            .pipe(
                map(body => { 
                    return ACL.fromJSON(body) 
                })
            );
    }
}