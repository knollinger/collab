import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { INode } from "../../../mod-files-data/mod-files-data.module";

import { AvatarService, Group } from "../../../mod-userdata/mod-userdata.module";
import { GroupService } from "../../../mod-user/mod-user.module";
import { SessionService } from "../../../mod-session/session.module";
import { PermissionListComponent } from "../../../mod-permissions/components/permission-list/permission-list.component";

/**
 * 
 */
@Component({
    selector: 'app-files-properties-permissions',
    templateUrl: './files-properties-permissions.component.html',
    styleUrls: ['./files-properties-permissions.component.css'],
    standalone: false
})
export class FilesPropertiesPermissionsComponent implements OnInit {

    private destroyRef = inject(DestroyRef);

    @ViewChild(PermissionListComponent)
    private permsList!: PermissionListComponent;

    possibleGroups: Group[] = new Array<Group>();
    userGroups: Group[] = new Array<Group>();

    @Input()
    inode: INode = INode.empty();

    @Output()
    inodeChange: EventEmitter<INode> = new EventEmitter<INode>();

    /**
     * 
     * @param data 
     */
    constructor(
        private avatarSvc: AvatarService, //
        private sessionSvc: SessionService, //
        private groupSvc: GroupService) {
    }

    /**
     * Wir laden einfach alle Gruppen, die Benutzer brauchen wir nicht,
     * da für jeden Benutzer eine PrimärGruppe mit dem selben Namen und
     * der selben UUID wie der Benutzer vor liegt.
     * 
     * Wenn die INode dem aktuell angemeldeten Benutzer gehört, so wird
     * das Gruppen-DropDown mit den Gruppen des Benutzers gefüllt. Nur in
     * eine solche darf er die INode verschieben! ANderenfalls werden alle 
     * Gruppen eingefüllt, das Dropdown wird dann disabled.
     * 
     * Desweiteren werden alle PrimärGruppen in das User-Dropdown gefüllt.
     */
    ngOnInit(): void {

        this.groupSvc.listGroups()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(groups => {

                this.userGroups = groups.filter(group => group.primary);

                const currUser = this.sessionSvc.currentUser.userId;
                this.possibleGroups = groups.filter(group => {
                    return !group.primary || group.uuid === currUser;
                });
            })
    }

    /**
     * 
     * @param group 
     * @returns 
     */
    getAvatarUrl(group: Group): string {
        return this.avatarSvc.getAvatarUrl(group.uuid);
    }

    /**
     * 
     * @returns 
     */
    hasOwnership(): boolean {
        return this.sessionSvc.currentUser.userId === this.inode.owner;
    }

    /**
     * 
     * @param ownerId 
     */
    public onOwnerChange(evt: MatSelectChange) {

        this.inode = new INode( //
            this.inode.name, //
            this.inode.uuid, //
            this.inode.parent, //
            this.inode.linkTo, //
            this.inode.type, //
            this.inode.size, //
            this.inode.created, //
            this.inode.modified, //
            evt.value, //
            this.inode.group, //
            this.inode.perms, //
            this.inode.effectivePerms);
        this.inodeChange.emit(this.inode);
    }

    /**
     * 
     * @param groupId 
     */
    public onGroupChange(evt: MatSelectChange) {

        this.inode = new INode( //
            this.inode.name, //
            this.inode.uuid, //
            this.inode.parent, //
            this.inode.linkTo, //
            this.inode.type, //
            this.inode.size, //
            this.inode.created, //
            this.inode.modified, //
            this.inode.owner, //
            evt.value, //
            this.inode.perms, //
            this.inode.effectivePerms);
        this.inodeChange.emit(this.inode);
    }

    /**
     * 
     * @param perms 
     */
    public onPermissionChange(perms: number) {

        this.inode = new INode( //
            this.inode.name, //
            this.inode.uuid, //
            this.inode.parent, //
            this.inode.linkTo,
            this.inode.type, //
            this.inode.size, //
            this.inode.created, //
            this.inode.modified, //
            this.inode.owner, //
            this.inode.group, //
            perms,
            this.inode.effectivePerms); // TODO: wrong!!!
        this.inodeChange.emit(this.inode);
    }

    public onAddPermission() {
        this.permsList.addLine();
    }
}
