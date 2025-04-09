/**
 * 
 */
export interface IINode {
    name: string,
    uuid: string,
    parent: string,
    type: string,
    size: number,
    created: Date,
    modified: Date,
    owner: string,
    group: string,
    perms: number,
    effectivePerms: number
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
     * @param owner 
     * @param group 
     * @param perms 
     * @param effectivePerms
     */
    constructor(
        public readonly name: string,
        public readonly uuid: string,
        public readonly parent: string,
        public readonly type: string,
        public readonly size: number,
        public readonly created: Date,
        public readonly modified: Date,
        public readonly owner: string,
        public readonly group: string,
        public readonly perms: number,
        public readonly effectivePerms: number) {
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
            json.type,
            json.size,
            json.created,
            json.modified,
            json.owner,
            json.group,
            json.perms,
            json.effectivePerms);
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
            type: this.type,
            size: this.size,
            created: this.created,
            modified: this.modified,
            owner: this.owner,
            group: this.group,
            perms: this.perms,
            effectivePerms: this.effectivePerms
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
            'inode/directory',
            0,
            now,
            now,
            '',
            '',
            0,
            0);
    }

    /**
     * Liefere die Reperesentation einer leeren INode
     * 
     * @returns 
     */
    public static empty(): INode {
        
        const now = new Date();
        return new INode('', EINodeUUIDs.INODE_NONE, EINodeUUIDs.INODE_NONE, '', 0, now, now, '', '', 0, 0);
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
}