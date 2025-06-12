import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable, of } from "rxjs";

import { MatDialog } from "@angular/material/dialog";
import { BackendRoutingService } from "../../mod-commons/mod-commons.module";

import { CheckDuplicateEntriesRequest } from '../models/check-duplicate-entries-request';
import { IINode, INode } from "../../mod-files-data/mod-files-data.module";
import { FilesShowDuplicatesComponent, IDuplicateINodesResponseItem } from "../components/files-show-duplicates/files-show-duplicates.component";

@Injectable({
    providedIn: 'root'
})
export class CheckDuplicateEntriesService {

    private static routes: Map<string, string> = new Map<string, string>(
        [
            ['checkDuplicates', 'v1/duplicates']
        ]
    );

    /**
     * 
     * @param backendRouterSvc 
     */
    constructor(
        private httpClient: HttpClient,
        private dialog: MatDialog,
        private backendRouterSvc: BackendRoutingService) {
    }

    public handleDuplicates(targetFolderId: string, inodes: INode[]): Observable<INode[]> {

        const result = new EventEmitter<INode[]>();
        this.handleDuplicatesInternal(targetFolderId, inodes, result);
        return result;
    }

    /**
     * 
     * @param targetFolderId 
     * @param inodes 
     * @returns 
     */
    private handleDuplicatesInternal(targetFolderId: string, inodes: INode[], emitter: EventEmitter<INode[]>) {

        this.checkDuplicates(targetFolderId, inodes).subscribe(duplicates => {

            if (duplicates.length === 0) {
                emitter.next(inodes);
            }
            else {
                this.showDuplicatesDlg(duplicates).subscribe(filteredNodes => {

                    if (filteredNodes && filteredNodes.length) {
                        this.handleDuplicatesInternal(targetFolderId, filteredNodes, emitter);
                    }
                })
            }
        });
    }

    /**
     * 
     * @param targetFolderId 
     * @param inodes 
     * @returns 
     */
    private checkDuplicates(targetFolderId: string, inodes: INode[]): Observable<INode[]> {

        const url = this.backendRouterSvc.getRouteForName('checkDuplicates', CheckDuplicateEntriesService.routes);
        const req = new CheckDuplicateEntriesRequest(targetFolderId, inodes);
        return this.httpClient.post<IINode[]>(url, req.toJSON()).pipe(
            map(entries => {
                return entries.map(entry => {
                    return INode.fromJSON(entry);
                })
            })
        );
    }

    /**
     * 
     * @param inodes 
     * @returns 
     */
    private showDuplicatesDlg(inodes: INode[]): Observable<INode[]> {

        const dialogRef = this.dialog.open(FilesShowDuplicatesComponent, {
            width: '80%',
            maxWidth: '600px',
            data: {
                inodes: inodes
            }
        });

        return dialogRef.afterClosed().pipe(map(dupItemActions => {

            console.dir(dupItemActions);
            const result = new Array<INode>();
            return (result.length !== 0) ? new Array<INode>() : this.merge(inodes, dupItemActions);
        }));
    }

    /**
     * 
     * @param inodes 
     * @param actions 
     */
    private merge(inodes: INode[], actions: IDuplicateINodesResponseItem[]): INode[] {

        for (let action of actions) {
            switch (action.action) {
                case 'SKIP':
                    inodes = this.removeByUUID(inodes, action.uuid);
                    break;

                case 'RENAME':
                    inodes = this.renameByUUID(inodes, action.uuid, action.name);
                    break;

                default:
                    break;
            }
        }
        return inodes;
    }

    /**
     * 
     * @param inodes 
     * @param uuid 
     * @returns 
     */
    private removeByUUID(inodes: INode[], uuid: string): INode[] {
        return inodes.filter((currNode) => {
            return currNode.uuid !== uuid;
        })
    }

    /**
     * 
     * @param inodes 
     * @param uuid 
     * @param newName 
     * @returns 
     */
    private renameByUUID(inodes: INode[], uuid: string, newName: string): INode[] {

        const result = new Array<INode>();
        for (let inode of inodes) {
            if (inode.uuid === uuid) {

                const json = inode.toJSON();
                json.name = newName;
                inode = INode.fromJSON(json);
            }
            result.push(inode);
        }
        return result;
    }
}