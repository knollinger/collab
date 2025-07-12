import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BackendRoutingService } from "../../mod-commons/mod-commons.module";
import { IINode, INode } from "../../mod-files-data/mod-files-data.module";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CalendarAttachmentsService {

    private static routes: Map<string, string> = new Map<string, string>(
        [
            ['getAttachmentsFolder', 'v1/calattachments/attachmentfolder']
        ]
    );
    /**
     * 
     * @param http 
     * @param backendRouter 
     */
    constructor( //
        private http: HttpClient, //
        private backendRouter: BackendRoutingService) {

    }

    /**
     * 
     * @returns 
     */
    public getAttachmentsFolder(): Observable<INode> {

        const url = this.backendRouter.getRouteForName('getAttachmentsFolder', CalendarAttachmentsService.routes);
        return this.http.get<IINode>(url)
            .pipe(map(json => {
                return INode.fromJSON(json);
            }));
    }
}
