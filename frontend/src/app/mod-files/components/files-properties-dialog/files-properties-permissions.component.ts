import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { INode } from "../../../mod-files-data/mod-files-data.module";

import { GroupService } from "../../../mod-user/mod-user.module";
import { SessionService } from "../../../mod-session/session.module";
import { Group } from "../../../mod-userdata/mod-userdata.module";

/**
 * 
 */
@Component({
    selector: 'app-files-properties-permissions',
    templateUrl: './files-properties-permissions.component.html',
    styleUrls: ['./files-properties-permissions.component.css'],
    standalone: false
})
export class FilesPropertiesPermissionsComponent {

    @Input()
    inode: INode = INode.empty();

    @Output()
    inodeChange: EventEmitter<INode> = new EventEmitter<INode>();

    /**
     * 
     */
    onACLChanged() {
        this.inodeChange.emit(this.inode);
    }
}
