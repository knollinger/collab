/**
 * 
 */
export interface ICheckDuplicateEntriesRequest {

    targetFolderId: string,
    names: string[]
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
        public readonly names: string[]) {

    }

    /**
     * 
     * @returns 
     */
    public toJSON(): ICheckDuplicateEntriesRequest {
        return {
            targetFolderId: this.targetFolderId,
            names: this.names
        }
    }
}
