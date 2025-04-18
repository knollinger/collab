import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map} from 'rxjs';

import { BackendRoutingService } from '../../mod-commons/mod-commons.module';
import { CreateMenuItemGroup, ICreateMenuItemGroup } from '../models/create-menu-item';

/**
 * Liefert die Struktur-Beschreibung für das "Create new"-Menu.
 */
@Injectable({
    providedIn: 'root'
})
export class CreateMenuService {

    private static routes: Map<string, string> = new Map<string, string>(
        [
            ['getMenuGroups', 'v1/templates']
        ]
    );

    /**
     * 
     * @param http 
     * @param backendRoutes 
     */
    constructor(
        private http: HttpClient,
        private backendRoutes: BackendRoutingService) {

    }

    /**
     * 
     * @returns 
     */
    public getMenuGroups(): Observable<CreateMenuItemGroup[]> {

        const url = this.backendRoutes.getRouteForName('getMenuGroups', CreateMenuService.routes);
        return this.http.get<ICreateMenuItemGroup[]>(url).pipe(
            map(groups => {
                return groups.map(group => {
                    return CreateMenuItemGroup.fromJSON(group);
                })
            })
        );
    }
}