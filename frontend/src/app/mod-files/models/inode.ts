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
    modified: Date
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
        public readonly type: string,
        public readonly size: number,
        public readonly created: Date,
        public readonly modified: Date) {
    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: IINode): INode {
        return new INode(json.name, json.uuid, json.parent, json.type, json.size, json.created, json.modified);
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
            modified: this.modified
        }
    }

    /**
     * Liefere die Reperesentation der root-Node
     * 
     * @returns 
     */
    public static root(): INode {

        const now = new Date();
        return new INode('root', EINodeUUIDs.INODE_ROOT, EINodeUUIDs.INODE_NONE, 'inode/directory', 0, now, now);
    }

    /**
     * Liefere die Reperesentation einer leeren INode
     * 
     * @returns 
     */
    public static empty(): INode {
        const now = new Date();
        return new INode('', EINodeUUIDs.INODE_NONE, EINodeUUIDs.INODE_NONE, '', 0, now, now);
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
        return this.type === 'inode/directory';
    }
}