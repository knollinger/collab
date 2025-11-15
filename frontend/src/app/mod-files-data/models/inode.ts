import { ACL, IACL } from "../../mod-permissions/mod-permissions.module";

/**
 * 
 */
export interface IINode {
    name: string,
    uuid: string,
    linkTo: string | null,
    parent: string,
    type: string,
    size: number,
    created: Date,
    modified: Date,
    acl: IACL
}

/**
 * 
 */
export enum EINodeUUIDs {
    INODE_NONE = 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    INODE_ROOT = '00000000-0000-0000-0000-000000000000'
}

/** 
 * 
 */
export class INode {

    public static readonly DATA_TRANSFER_TYPE: string = 'app/inode';

    /**
     * 
     * @param name 
     * @param uuid 
     * @param parent 
     * @param type 
     * @param size 
     * @param created 
     * @param modified 
     */
    constructor(
        public readonly name: string,
        public readonly uuid: string,
        public readonly parent: string,
        public readonly linkTo: string | null,
        public readonly type: string,
        public readonly size: number,
        public readonly created: Date,
        public readonly modified: Date,
        public readonly acl: ACL) {
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: IINode): INode {

        return new INode(
            json.name,
            json.uuid,
            json.parent,
            json.linkTo,
            json.type,
            json.size,
            json.created,
            json.modified,
            ACL.fromJSON(json.acl));
    }

    /**
     * 
     * @returns 
     */
    public toJSON(): IINode {

        return {
            name: this.name,
            uuid: this.uuid,
            parent: this.parent,
            linkTo: this.linkTo,
            type: this.type,
            size: this.size,
            created: this.created,
            modified: this.modified,
            acl: this.acl.toJSON()
        }
    }

    /**
     * 
     * @returns das stringified JSON
     */
    public toString(): string {
        return JSON.stringify(this.toJSON());
    }

    /**
     * Liefere die Reperesentation der root-Node
     * 
     * @returns 
     */
    public static root(): INode {

        const now = new Date();
        return new INode(
            'root',
            EINodeUUIDs.INODE_ROOT,
            EINodeUUIDs.INODE_NONE,
            null,
            'inode/directory',
            0,
            now,
            now,
            ACL.empty());
    }

    /**
     * Liefere die Reperesentation einer leeren INode
     * 
     * @returns 
     */
    public static empty(): INode {

        const now = new Date();
        return new INode('',
            EINodeUUIDs.INODE_NONE,
            EINodeUUIDs.INODE_NONE,
            null,
            '',
            0,
            now,
            now,
            ACL.empty());
    }


    /**
     * Liefere die Reperesentation einer leeren INode
     * 
     * @returns 
     */
    public static emptyDir(): INode {

        const now = new Date();
        return new INode('',
            EINodeUUIDs.INODE_NONE,
            EINodeUUIDs.INODE_NONE,
            null,
            'inode/directory',
            0,
            now,
            now,
            ACL.empty());
    }

    /**
     * Handelt es sich um eine leere INode?
     * 
     * @returns 
     */
    public isEmpty(): boolean {
        return this.uuid === EINodeUUIDs.INODE_NONE;
    }

    /**
     * 
     * @returns 
     */
    public isDirectory(): boolean {
        return this.type.toLowerCase().startsWith('inode/directory');
    }

    /**
     * 
     * @returns 
     */
    public isLink(): boolean {
        return this.linkTo !== null;
    }

    /**
     * In bester Unix-Manier zeichnen sich HiddenFiles dadurch aus, das ihr Name
     * mit einem '.' beginnt
     *  
     * @returns 
     */
    public isHidden(): boolean {
        return this.name.startsWith('.');
    }
}