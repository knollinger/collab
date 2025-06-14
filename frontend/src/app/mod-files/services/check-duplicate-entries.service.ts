import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

import { MatDialog } from "@angular/material/dialog";
import { BackendRoutingService } from "../../mod-commons/mod-commons.module";

import { CheckDuplicateEntriesRequest } from '../models/check-duplicate-entries-request';
import { INode } from "../../mod-files-data/mod-files-data.module";
import { FilesShowDuplicatesComponent, IDuplicateNamesResponseItem } from "../components/files-show-duplicates/files-show-duplicates.component";

export interface INamedFile {
    file: File,
    name: string
}

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

    /**
     * 
     * @param targetFolderId 
     * @param files 
     * @returns 
     */
    public handleDuplicateFiles(targetFolderId: string, files: File[]): Observable<INamedFile[]> {

        const namedFiles = files.map(file => {
            return {
                file: file,
                name: file.name
            }
        });
        const result = new EventEmitter<INamedFile[]>();
        this.handleDuplicateFilesInternal(targetFolderId, namedFiles, result);
        return result;
    }

    /**
     * 
     * @param targetFolderId 
     * @param namedFiles 
     * @param emitter 
     */
    private handleDuplicateFilesInternal(targetFolderId: string, namedFiles: INamedFile[], emitter: EventEmitter<INamedFile[]>) {

        this.checkDuplicates(targetFolderId, namedFiles.map(file => file.name)).subscribe(duplNames => {

            if (duplNames.length === 0) {
                emitter.next(namedFiles);
            }
            else {
                this.showDuplicateFilesDlg(duplNames, namedFiles).subscribe(filteredNames => {

                    if (filteredNames && filteredNames.length) {
                        this.handleDuplicateFilesInternal(targetFolderId, filteredNames, emitter);
                    }
                })
            }
        });
    }

    /**
 * 
 * @param inodes 
 * @returns 
 */
    private showDuplicateFilesDlg(duplNames: string[], namedFiles: INamedFile[]): Observable<INamedFile[]> {

        const dialogRef = this.dialog.open(FilesShowDuplicatesComponent, {
            width: '80%',
            maxWidth: '600px',
            data: {
                names: duplNames
            }
        });

        return dialogRef.afterClosed().pipe(map(dupItemActions => {

            let result = new Array<INamedFile>();
            if (dupItemActions && dupItemActions.length > 0) {
                result = this.mergeFiles(namedFiles, dupItemActions);
            }
            return result;
        }));
    }


    /**
     * 
     * @param inodes 
     * @param actions 
     */
    private mergeFiles(namedFiles: INamedFile[], actions: IDuplicateNamesResponseItem[]): INamedFile[] {

        for (let action of actions) {
            switch (action.action) {
                case 'SKIP':
                    namedFiles = this.removeFileByOldName(namedFiles, action.oldName);
                    break;

                case 'RENAME':
                    namedFiles = this.renameFileByOldName(namedFiles, action.oldName, action.newName);
                    break;

                default:
                    break;
            }
        }
        return namedFiles;
    }

    /**
     * 
     * @param inodes 
     * @param uuid 
     * @returns 
     */
    private removeFileByOldName(namedFiles: INamedFile[], oldName: string): INamedFile[] {
        return namedFiles.filter((file) => {
            return file.name !== oldName;
        })
    }

    /**
     * 
     * @param inodes 
     * @param uuid 
     * @param newName 
     * @returns 
     */
    private renameFileByOldName(namedFiles: INamedFile[], oldName: string, newName: string): INamedFile[] {

        const result = new Array<INamedFile>();
        for (let file of namedFiles) {
            if (file.name === oldName) {

                file.name = newName;
            }
            result.push(file);
        }
        return result;
    }


    /** 
     * 
     */
    public handleDuplicateINodes(targetFolderId: string, inodes: INode[]): Observable<INode[]> {

        const result = new EventEmitter<INode[]>();
        this.handleDuplicateINodesInternal(targetFolderId, inodes, result);
        return result;
    }

    /**
     * 
     * @param targetFolderId 
     * @param inodes 
     * @returns 
     */
    private handleDuplicateINodesInternal(targetFolderId: string, inodes: INode[], emitter: EventEmitter<INode[]>) {

        this.checkDuplicates(targetFolderId, inodes.map(node => node.name)).subscribe(duplNames => {

            if (duplNames.length === 0) {
                emitter.next(inodes);
            }
            else {
                this.showDuplicateINodesDlg(duplNames, inodes).subscribe(filteredNames => {

                    if (filteredNames && filteredNames.length) {
                        this.handleDuplicateINodesInternal(targetFolderId, filteredNames, emitter);
                    }
                })
            }
        });
    }

    /**
     * 
     * @param inodes 
     * @returns 
     */
    private showDuplicateINodesDlg(duplNames: string[], inodes: INode[]): Observable<INode[]> {

        const dialogRef = this.dialog.open(FilesShowDuplicatesComponent, {
            width: '80%',
            maxWidth: '600px',
            data: {
                names: duplNames
            }
        });

        return dialogRef.afterClosed().pipe(map(dupItemActions => {

            let result = new Array<INode>();
            if (dupItemActions && dupItemActions.length > 0) {
                result = this.mergeINodes(inodes, dupItemActions);
            }
            return result;
        }));
    }

    /**
     * 
     * @param inodes 
     * @param actions 
     */
    private mergeINodes(inodes: INode[], actions: IDuplicateNamesResponseItem[]): INode[] {

        for (let action of actions) {
            switch (action.action) {
                case 'SKIP':
                    inodes = this.removeINodeByOldName(inodes, action.oldName);
                    break;

                case 'RENAME':
                    inodes = this.renameINodeByOldName(inodes, action.oldName, action.newName);
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
    private removeINodeByOldName(inodes: INode[], oldName: string): INode[] {
        return inodes.filter((currNode) => {
            return currNode.name !== oldName;
        })
    }

    /**
     * 
     * @param inodes 
     * @param uuid 
     * @param newName 
     * @returns 
     */
    private renameINodeByOldName(inodes: INode[], oldName: string, newName: string): INode[] {

        const result = new Array<INode>();
        for (let inode of inodes) {
            if (inode.name === oldName) {

                const json = inode.toJSON();
                json.name = newName;
                inode = INode.fromJSON(json);
            }
            result.push(inode);
        }
        return result;
    }

    /**
     * 
     * @param targetFolderId 
     * @param inodes 
     * @returns 
     */
    private checkDuplicates(targetFolderId: string, names: string[]): Observable<string[]> {

        const url = this.backendRouterSvc.getRouteForName('checkDuplicates', CheckDuplicateEntriesService.routes);
        const req = new CheckDuplicateEntriesRequest(targetFolderId, names);
        return this.httpClient.post<string[]>(url, req.toJSON());
    }
}