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
            ['getAllAttachments', 'v1/calattachments/{1}']
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
     * Liefere alle Attachments für ein Kalender-Event
     * 
     * @param eventId 
     * @returns 
     */
    public getAllAttachments(eventId: string): Observable<INode[]> {

        const url = this.backendRouter.getRouteForName('getAllAttachments', CalendarAttachmentsService.routes, eventId);
        return this.http.get<IINode[]>(url)
            .pipe(map(inodes => {
                return inodes.map(inode => {
                    return INode.fromJSON(inode);
                })
            }))
    }
}