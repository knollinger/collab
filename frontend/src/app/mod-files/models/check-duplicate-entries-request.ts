import { IINode, INode } from "../../mod-files-data/mod-files-data.module"

/**
 * 
 */
export interface ICheckDuplicateEntriesRequest {

    targetFolderId: string,
    inodes: IINode[]
}

/**
 * 
 */
export class CheckDuplicateEntriesRequest {

    /**
     * 
     * @param targetFolderId 
     * @param inodes 
     */
    constructor(
        public readonly targetFolderId: string,
        public readonly inodes: INode[]) {

    }

    /**
     * 
     * @returns 
     */
    public toJSON(): ICheckDuplicateEntriesRequest {
        return {
            targetFolderId: this.targetFolderId,
            inodes: this.inodes.map(inode => {
                return inode.toJSON();
            })
        }
    }
}
